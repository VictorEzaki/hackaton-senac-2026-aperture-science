const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const {
    sequelize,
    Empresa,
    PorteEmpresa,
    Endereco,
    Bairro,
    Cidade,
    Estado
} = require('../models');
const {
    findOrCreateByName,
    findOrCreateEndereco,
    normalizeText,
    normalizeEmail,
    onlyDigits,
    removePassword,
    validateEndereco
} = require('./LocalizacaoService');

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
    'seguimento',
    'porte'
];

const validateCadastroPayload = (payload) => {
    const missing = requiredFields.filter((field) => !normalizeText(payload[field]));

    if (missing.length) {
        return 'Preencha todos os campos obrigatórios do cadastro de empresa.';
    }

    const enderecoError = validateEndereco(payload.endereco);
    if (enderecoError) {
        return enderecoError;
    }

    const email = normalizeEmail(payload.email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Informe um e-mail válido.';
    }

    if (onlyDigits(payload.cnpj).length !== 14) {
        return 'Informe um CNPJ válido com 14 dígitos.';
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

const listarOpcoes = async () => {
    const portes = await PorteEmpresa.findAll({ order: [['porte', 'ASC']] });

    return {
        portes: portes.map((item) => item.porte)
    };
};

const cadastrarEmpresa = async (payload) => {
    const validationError = validateCadastroPayload(payload);
    if (validationError) {
        const error = new Error(validationError);
        error.status = 400;
        throw error;
    }

    const email = normalizeEmail(payload.email);
    const cnpj = onlyDigits(payload.cnpj);

    const duplicated = await Empresa.findOne({
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
        const endereco = await findOrCreateEndereco(payload.endereco, transaction);
        const porte = await findOrCreateByName(PorteEmpresa, 'porte', payload.porte, {}, transaction);
        const senhaHash = await bcrypt.hash(payload.senha, 10);

        const empresa = await Empresa.create({
            idEndereco: endereco.idEndereco,
            idPorte: porte.idPorte,
            razaoSocial: normalizeText(payload.razaoSocial),
            nome_fantasia: normalizeText(payload.nome_fantasia),
            cnpj,
            email,
            telefone: onlyDigits(payload.telefone),
            senha: senhaHash,
            descricao: normalizeText(payload.descricao),
            seguimento: normalizeText(payload.seguimento),
            website: normalizeText(payload.website),
            status: true
        }, { transaction });

        return removePassword(empresa);
    });
};

const loginEmpresa = async ({ email, senha }) => {
    if (!normalizeText(email) || !normalizeText(senha)) {
        const error = new Error('Informe e-mail e senha.');
        error.status = 400;
        throw error;
    }

    const empresa = await Empresa.findOne({
        where: { email: normalizeEmail(email) },
        include: [
            PorteEmpresa,
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

    if (!empresa) {
        const error = new Error('E-mail ou senha inválidos.');
        error.status = 401;
        throw error;
    }

    if (!empresa.status) {
        const error = new Error('Empresa inativa. Entre em contato com o suporte.');
        error.status = 403;
        throw error;
    }

    const senhaValida = await bcrypt.compare(senha, empresa.senha);
    if (!senhaValida) {
        const error = new Error('E-mail ou senha inválidos.');
        error.status = 401;
        throw error;
    }

    const token = jwt.sign(
        {
            idEmpresa: empresa.idEmpresa,
            email: empresa.email,
            tipoUsuario: 'empresa'
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    return {
        token,
        empresa: removePassword(empresa)
    };
};

module.exports = {
    cadastrarEmpresa,
    loginEmpresa,
    listarOpcoes
};
