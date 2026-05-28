const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op, literal } = require('sequelize');
const {
    sequelize,
    Estado,
    Cidade,
    Bairro,
    Endereco,
    Categoria,
    CapacidadeAtendimento,
    Certificacoes,
    Fornecedor
} = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'supply-hub-dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

const requiredFields = [
    'razaoSocial',
    'nome_fantasia',
    'cnpj',
    'email',
    'telefone',
    'senha',
    'descricao',
    'tempo_mercado',
    'categoria',
    'capacidade_atendimento',
    'certificacao'
];

const requiredAddressFields = ['estado', 'cidade', 'bairro', 'cep', 'logradouro', 'numero'];

const normalizeText = (value) => String(value || '').trim();
const normalizeEmail = (value) => normalizeText(value).toLowerCase();
const onlyDigits = (value) => normalizeText(value).replace(/\D/g, '');
const clampNumber = (value, min, max, fallback) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(max, Math.max(min, parsed));
};

const publicFornecedor = (fornecedor) => {
    const data = fornecedor.toJSON ? fornecedor.toJSON() : fornecedor;
    const { senha, ...safeData } = data;
    return safeData;
};

const validateCadastroPayload = (payload) => {
    const missing = requiredFields.filter((field) => !normalizeText(payload[field]));
    const endereco = payload.endereco || {};
    const missingAddress = requiredAddressFields.filter((field) => !normalizeText(endereco[field]));

    if (missing.length || missingAddress.length) {
        return 'Preencha todos os campos obrigatórios do cadastro de fornecedor.';
    }

    const email = normalizeEmail(payload.email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Informe um e-mail válido.';
    }

    if (onlyDigits(payload.cnpj).length !== 14) {
        return 'Informe um CNPJ válido com 14 dígitos.';
    }

    if (onlyDigits(endereco.cep).length !== 8) {
        return 'Informe um CEP válido com 8 dígitos.';
    }

    if (normalizeText(payload.senha).length < 6) {
        return 'A senha deve ter pelo menos 6 caracteres.';
    }

    if (normalizeText(payload.website)) {
        try {
            new URL(normalizeText(payload.website));
        } catch {
            return 'Informe um website válido, incluindo http:// ou https://.';
        }
    }

    return null;
};

const findOrCreateByName = async (model, field, value, defaults = {}, transaction) => {
    const normalized = normalizeText(value);
    const [record] = await model.findOrCreate({
        where: { [field]: normalized },
        defaults: { [field]: normalized, ...defaults },
        transaction
    });

    return record;
};

const listarOpcoes = async () => {
    const [categorias, capacidadesAtendimento, certificacoes] = await Promise.all([
        Categoria.findAll({ order: [['categoria', 'ASC']] }),
        CapacidadeAtendimento.findAll({ order: [['atendimento', 'ASC']] }),
        Certificacoes.findAll({ order: [['certificacao', 'ASC']] })
    ]);

    return {
        categorias: categorias.map((item) => item.categoria),
        capacidades_atendimento: capacidadesAtendimento.map((item) => item.atendimento),
        certificacoes: certificacoes.map((item) => item.certificacao)
    };
};

const fornecedorCatalogoAttributes = [
    'idFornecedor',
    'razaoSocial',
    'nome_fantasia',
    'descricao',
    'website',
    'avaliacao',
    'data_cadastro',
    'telefone',
    'email'
];

const likeFilter = (value) => ({ [Op.like]: `%${value}%` });

const buildCatalogoOrder = (sort, search) => {
    if (sort === 'alfabetica') return [['nome_fantasia', 'ASC']];
    if (sort === 'recentes') return [['data_cadastro', 'DESC']];
    if (sort === 'avaliacao') return [['avaliacao', 'DESC'], ['nome_fantasia', 'ASC']];

    if (search) {
        const escapedSearch = sequelize.escape(`%${search}%`);
        return [
            [
                literal(`CASE
                    WHEN Fornecedor.nome_fantasia LIKE ${escapedSearch} THEN 1
                    WHEN Fornecedor.razaoSocial LIKE ${escapedSearch} THEN 2
                    WHEN Categorium.categoria LIKE ${escapedSearch} THEN 3
                    WHEN Certificaco.certificacao LIKE ${escapedSearch} THEN 4
                    ELSE 5
                END`),
                'ASC'
            ],
            ['avaliacao', 'DESC'],
            ['nome_fantasia', 'ASC']
        ];
    }

    return [['avaliacao', 'DESC'], ['nome_fantasia', 'ASC']];
};

const mapFornecedorCatalogo = (fornecedor) => {
    const data = fornecedor.toJSON ? fornecedor.toJSON() : fornecedor;
    const categoria = data.Categoria?.categoria || data.Categorium?.categoria || '';
    const qualificacao = data.Certificaco?.certificacao || data.Certificacoes?.certificacao || '';
    const cidade = data.Endereco?.Bairro?.Cidade?.cidade || '';
    const estado = data.Endereco?.Bairro?.Cidade?.Estado?.estado || '';
    const tipoProduto = normalizeText(data.descricao)
        .replace(/^especialistas?\s+em\s+/i, '')
        .replace(/^fabricacao\s+de\s+/i, '')
        .replace(/^fabricação\s+de\s+/i, '')
        .replace(/^desenvolvimento\s+de\s+/i, '')
        .split(/[,.]/)[0]
        .trim();

    return {
        idFornecedor: data.idFornecedor,
        razaoSocial: data.razaoSocial,
        nome_fantasia: data.nome_fantasia,
        descricao: data.descricao,
        categoria,
        qualificacao,
        tipoProduto: tipoProduto || categoria,
        avaliacao: Number(data.avaliacao || 0),
        cidade,
        estado,
        website: data.website,
        telefone: data.telefone,
        email: data.email,
        data_cadastro: data.data_cadastro
    };
};

const buscarCatalogo = async (params = {}) => {
    const search = normalizeText(params.search);
    const categoria = normalizeText(params.categoria);
    const qualificacao = normalizeText(params.qualificacao);
    const tipoProduto = normalizeText(params.tipoProduto);
    const estado = normalizeText(params.estado);
    const cidade = normalizeText(params.cidade);
    const sortOptions = ['relevancia', 'avaliacao', 'recentes', 'alfabetica'];
    const sort = sortOptions.includes(normalizeText(params.sort)) ? normalizeText(params.sort) : 'relevancia';
    const page = clampNumber(params.page, 1, 100000, 1);
    const limit = clampNumber(params.limit, 1, 50, 10);
    const avaliacaoMinima = params.avaliacaoMinima === undefined || normalizeText(params.avaliacaoMinima) === ''
        ? null
        : clampNumber(params.avaliacaoMinima, 0, 5, null);

    const where = { status: true };
    if (avaliacaoMinima !== null) {
        where.avaliacao = { [Op.gte]: avaliacaoMinima };
    }

    const andFilters = [];
    if (search) {
        const searchLike = likeFilter(search);
        andFilters.push({
            [Op.or]: [
                { nome_fantasia: searchLike },
                { razaoSocial: searchLike },
                { descricao: searchLike },
                { '$Categorium.categoria$': searchLike },
                { '$Certificaco.certificacao$': searchLike },
                { '$CapacidadeAtendimento.atendimento$': searchLike },
                { '$Endereco.Bairro.Cidade.cidade$': searchLike },
                { '$Endereco.Bairro.Cidade.Estado.estado$': searchLike }
            ]
        });
    }

    if (tipoProduto) {
        const tipoProdutoLike = likeFilter(tipoProduto);
        andFilters.push({
            [Op.or]: [
                { descricao: tipoProdutoLike },
                { '$Categorium.categoria$': tipoProdutoLike },
                { '$Certificaco.certificacao$': tipoProdutoLike },
                { '$CapacidadeAtendimento.atendimento$': tipoProdutoLike }
            ]
        });
    }

    if (andFilters.length) {
        where[Op.and] = andFilters;
    }

    const include = [
        {
            model: Categoria,
            attributes: ['categoria'],
            where: categoria ? { categoria: likeFilter(categoria) } : undefined,
            required: Boolean(categoria)
        },
        {
            model: Certificacoes,
            attributes: ['certificacao'],
            where: qualificacao ? { certificacao: likeFilter(qualificacao) } : undefined,
            required: Boolean(qualificacao)
        },
        {
            model: CapacidadeAtendimento,
            attributes: ['atendimento']
        },
        {
            model: Endereco,
            attributes: ['logradouro', 'numero'],
            required: Boolean(cidade || estado),
            include: [{
                model: Bairro,
                attributes: ['bairro'],
                required: Boolean(cidade || estado),
                include: [{
                    model: Cidade,
                    attributes: ['cidade'],
                    where: cidade ? { cidade: likeFilter(cidade) } : undefined,
                    required: Boolean(cidade || estado),
                    include: [{
                        model: Estado,
                        attributes: ['estado'],
                        where: estado ? { estado: likeFilter(estado) } : undefined,
                        required: Boolean(estado)
                    }]
                }]
            }]
        }
    ];

    const result = await Fornecedor.findAndCountAll({
        attributes: fornecedorCatalogoAttributes,
        where,
        include,
        distinct: true,
        limit,
        offset: (page - 1) * limit,
        order: buildCatalogoOrder(sort, search)
    });

    return {
        data: result.rows.map(mapFornecedorCatalogo),
        pagination: {
            page,
            limit,
            total: result.count,
            totalPages: Math.ceil(result.count / limit)
        }
    };
};

const cadastrarFornecedor = async (payload) => {
    const validationError = validateCadastroPayload(payload);
    if (validationError) {
        const error = new Error(validationError);
        error.status = 400;
        throw error;
    }

    const email = normalizeEmail(payload.email);
    const cnpj = onlyDigits(payload.cnpj);

    const duplicated = await Fornecedor.findOne({
        where: {
            [Op.or]: [{ email }, { cnpj }]
        }
    });

    if (duplicated) {
        const error = new Error('E-mail ou CNPJ já cadastrado.');
        error.status = 409;
        throw error;
    }

    return sequelize.transaction(async (transaction) => {
        const enderecoPayload = payload.endereco;
        const estado = await findOrCreateByName(Estado, 'estado', enderecoPayload.estado, {}, transaction);
        const [cidade] = await Cidade.findOrCreate({
            where: { cidade: normalizeText(enderecoPayload.cidade), idEstado: estado.idEstado },
            defaults: { cidade: normalizeText(enderecoPayload.cidade), idEstado: estado.idEstado },
            transaction
        });
        const [bairro] = await Bairro.findOrCreate({
            where: { bairro: normalizeText(enderecoPayload.bairro), idCidade: cidade.idCidade },
            defaults: { bairro: normalizeText(enderecoPayload.bairro), idCidade: cidade.idCidade },
            transaction
        });
        const [endereco] = await Endereco.findOrCreate({
            where: {
                idBairro: bairro.idBairro,
                cep: onlyDigits(enderecoPayload.cep),
                logradouro: normalizeText(enderecoPayload.logradouro),
                numero: normalizeText(enderecoPayload.numero)
            },
            defaults: {
                idBairro: bairro.idBairro,
                cep: onlyDigits(enderecoPayload.cep),
                logradouro: normalizeText(enderecoPayload.logradouro),
                numero: normalizeText(enderecoPayload.numero)
            },
            transaction
        });

        const categoria = await findOrCreateByName(
            Categoria,
            'categoria',
            payload.categoria,
            { descricao: `Categoria ${normalizeText(payload.categoria)}` },
            transaction
        );
        const atendimento = await findOrCreateByName(
            CapacidadeAtendimento,
            'atendimento',
            payload.capacidade_atendimento,
            {},
            transaction
        );
        const certificacao = await findOrCreateByName(
            Certificacoes,
            'certificacao',
            payload.certificacao,
            {},
            transaction
        );

        const senhaHash = await bcrypt.hash(payload.senha, 10);

        const fornecedor = await Fornecedor.create({
            idEndereco: endereco.idEndereco,
            idAtendimento: atendimento.idAtendimento,
            idCertificacoes: certificacao.idCertificacoes,
            idCategoria: categoria.idCategoria,
            razaoSocial: normalizeText(payload.razaoSocial),
            nome_fantasia: normalizeText(payload.nome_fantasia),
            cnpj,
            email,
            telefone: onlyDigits(payload.telefone),
            senha: senhaHash,
            descricao: normalizeText(payload.descricao),
            tempo_mercado: normalizeText(payload.tempo_mercado),
            website: normalizeText(payload.website),
            avaliacao: 0,
            status: true
        }, { transaction });

        return publicFornecedor(fornecedor);
    });
};

const loginFornecedor = async ({ email, senha }) => {
    if (!normalizeText(email) || !normalizeText(senha)) {
        const error = new Error('Informe e-mail e senha.');
        error.status = 400;
        throw error;
    }

    const fornecedor = await Fornecedor.findOne({
        where: { email: normalizeEmail(email) },
        include: [
            Categoria,
            CapacidadeAtendimento,
            Certificacoes,
            {
                model: Endereco,
                include: [{
                    model: Bairro,
                    include: [{
                        model: Cidade,
                        include: [Estado]
                    }]
                }]
            }
        ]
    });

    if (!fornecedor) {
        const error = new Error('E-mail ou senha inválidos.');
        error.status = 401;
        throw error;
    }

    if (!fornecedor.status) {
        const error = new Error('Fornecedor inativo. Entre em contato com o suporte.');
        error.status = 403;
        throw error;
    }

    const senhaValida = await bcrypt.compare(senha, fornecedor.senha);
    if (!senhaValida) {
        const error = new Error('E-mail ou senha inválidos.');
        error.status = 401;
        throw error;
    }

    const token = jwt.sign(
        {
            idFornecedor: fornecedor.idFornecedor,
            email: fornecedor.email,
            tipoUsuario: 'fornecedor'
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    return {
        token,
        fornecedor: publicFornecedor(fornecedor)
    };
};

module.exports = {
    cadastrarFornecedor,
    loginFornecedor,
    listarOpcoes,
    buscarCatalogo
};
