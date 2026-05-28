const bcrypt = require('bcryptjs');
const {
    sequelize,
    Estado,
    Cidade,
    Bairro,
    Endereco,
    Categoria,
    CapacidadeAtendimento,
    Certificacoes,
    PorteEmpresa,
    Fornecedor,
    Empresa,
    Avaliacao
} = require('./src/models');

const senhaPadrao = '123456';

const onlyDigits = (value) => String(value || '').replace(/\D/g, '');
const normalizeText = (value) => String(value || '').trim();
const normalizeEmail = (value) => normalizeText(value).toLowerCase();

const seedLookup = async (model, field, items) => {
    const records = {};

    for (const item of items) {
        const [record] = await model.findOrCreate({
            where: { [field]: item[field] },
            defaults: item
        });

        records[item[field]] = record;
    }

    return records;
};

const findOrCreateByName = async (model, field, value, defaults = {}) => {
    const normalized = normalizeText(value);
    const [record] = await model.findOrCreate({
        where: { [field]: normalized },
        defaults: { [field]: normalized, ...defaults }
    });

    return record;
};

const findOrCreateEndereco = async ({ estado, cidade, bairro, cep, logradouro, numero }) => {
    const estadoRecord = await findOrCreateByName(Estado, 'estado', estado);
    const [cidadeRecord] = await Cidade.findOrCreate({
        where: { cidade: normalizeText(cidade), idEstado: estadoRecord.idEstado },
        defaults: { cidade: normalizeText(cidade), idEstado: estadoRecord.idEstado }
    });
    const [bairroRecord] = await Bairro.findOrCreate({
        where: { bairro: normalizeText(bairro), idCidade: cidadeRecord.idCidade },
        defaults: { bairro: normalizeText(bairro), idCidade: cidadeRecord.idCidade }
    });
    const [enderecoRecord] = await Endereco.findOrCreate({
        where: {
            idBairro: bairroRecord.idBairro,
            cep: onlyDigits(cep),
            logradouro: normalizeText(logradouro),
            numero: normalizeText(numero)
        },
        defaults: {
            idBairro: bairroRecord.idBairro,
            cep: onlyDigits(cep),
            logradouro: normalizeText(logradouro),
            numero: normalizeText(numero)
        }
    });

    return enderecoRecord;
};

const upsertEmpresa = async (empresa, senhaHash, portes) => {
    const endereco = await findOrCreateEndereco(empresa.endereco);
    const porte = portes[empresa.porte] || await findOrCreateByName(PorteEmpresa, 'porte', empresa.porte);
    const payload = {
        idEndereco: endereco.idEndereco,
        idPorte: porte.idPorte,
        razaoSocial: empresa.razaoSocial,
        nome_fantasia: empresa.nome_fantasia,
        cnpj: onlyDigits(empresa.cnpj),
        email: normalizeEmail(empresa.email),
        telefone: onlyDigits(empresa.telefone),
        senha: senhaHash,
        descricao: empresa.descricao,
        seguimento: empresa.seguimento,
        website: empresa.website,
        status: true
    };

    const [record, created] = await Empresa.findOrCreate({
        where: { email: payload.email },
        defaults: payload
    });

    if (!created) {
        await record.update(payload);
    }

    return record;
};

const upsertFornecedor = async (fornecedor, senhaHash, lookups) => {
    const endereco = await findOrCreateEndereco(fornecedor.endereco);
    const categoria = lookups.categorias[fornecedor.categoria]
        || await findOrCreateByName(Categoria, 'categoria', fornecedor.categoria, { descricao: `Categoria ${fornecedor.categoria}` });
    const atendimento = lookups.capacidades[fornecedor.atendimento]
        || await findOrCreateByName(CapacidadeAtendimento, 'atendimento', fornecedor.atendimento);
    const certificacao = lookups.certificacoes[fornecedor.certificacao]
        || await findOrCreateByName(Certificacoes, 'certificacao', fornecedor.certificacao);

    const payload = {
        idEndereco: endereco.idEndereco,
        idAtendimento: atendimento.idAtendimento,
        idCertificacoes: certificacao.idCertificacoes,
        idCategoria: categoria.idCategoria,
        razaoSocial: fornecedor.razaoSocial,
        nome_fantasia: fornecedor.nome_fantasia,
        cnpj: onlyDigits(fornecedor.cnpj),
        email: normalizeEmail(fornecedor.email),
        telefone: onlyDigits(fornecedor.telefone),
        senha: senhaHash,
        descricao: fornecedor.descricao,
        tempo_mercado: fornecedor.tempo_mercado,
        website: fornecedor.website,
        avaliacao: 0,
        status: true
    };

    const [record, created] = await Fornecedor.findOrCreate({
        where: { email: payload.email },
        defaults: payload
    });

    if (!created) {
        await record.update(payload);
    }

    return record;
};

const upsertAvaliacao = async ({ empresa, fornecedor, tipoAvaliador, nota, comentario }) => {
    const [record, created] = await Avaliacao.findOrCreate({
        where: {
            idEmpresa: empresa.idEmpresa,
            idFornecedor: fornecedor.idFornecedor,
            tipoAvaliador
        },
        defaults: {
            idEmpresa: empresa.idEmpresa,
            idFornecedor: fornecedor.idFornecedor,
            tipoAvaliador,
            nota,
            comentario
        }
    });

    if (!created) {
        await record.update({ nota, comentario, data_avaliacao: new Date() });
    }

    return record;
};

const atualizarMediaFornecedor = async (fornecedor) => {
    const avaliacoes = await Avaliacao.findAll({
        where: {
            idFornecedor: fornecedor.idFornecedor,
            tipoAvaliador: 'empresa'
        }
    });
    const media = avaliacoes.length
        ? avaliacoes.reduce((total, item) => total + Number(item.nota), 0) / avaliacoes.length
        : 0;

    await fornecedor.update({ avaliacao: Number(media.toFixed(2)) });
};

const seedDatabase = async () => {
    try {
        console.log('Conectando ao banco para alimentar dados completos...');

        await sequelize.sync({ alter: process.env.DB_SYNC_ALTER === 'true' });
        const senhaHash = await bcrypt.hash(senhaPadrao, 10);

        const categorias = await seedLookup(Categoria, 'categoria', [
            { categoria: 'Embalagens', descricao: 'Fornecedores de embalagens, caixas e materiais de proteção.' },
            { categoria: 'Metalurgia', descricao: 'Fornecedores de peças, chapas, fixadores e serviços metalúrgicos.' },
            { categoria: 'Polímeros', descricao: 'Fornecedores de plásticos, resinas e embalagens flexíveis.' },
            { categoria: 'Logística', descricao: 'Fornecedores de transporte, armazenagem e distribuição.' },
            { categoria: 'Tecnologia', descricao: 'Fornecedores de software, hardware e serviços de TI.' },
            { categoria: 'Limpeza', descricao: 'Fornecedores de produtos e serviços de limpeza profissional.' },
            { categoria: 'Alimentos', descricao: 'Fornecedores de insumos, alimentos e bebidas para empresas.' },
            { categoria: 'Mobiliário', descricao: 'Fornecedores de móveis corporativos e estruturas comerciais.' }
        ]);

        const capacidades = await seedLookup(CapacidadeAtendimento, 'atendimento', [
            { atendimento: 'Local' },
            { atendimento: 'Regional' },
            { atendimento: 'Nacional' },
            { atendimento: 'Internacional' }
        ]);

        const certificacoes = await seedLookup(Certificacoes, 'certificacao', [
            { certificacao: 'ISO 9001' },
            { certificacao: 'ISO 14001' },
            { certificacao: 'FSC' },
            { certificacao: 'ABNT' },
            { certificacao: 'B Corp' },
            { certificacao: 'Sem certificação' }
        ]);

        const portes = await seedLookup(PorteEmpresa, 'porte', [
            { porte: 'MEI' },
            { porte: 'Microempresa' },
            { porte: 'Pequena empresa' },
            { porte: 'Média empresa' },
            { porte: 'Grande empresa' }
        ]);

        const empresasSeed = [
            {
                key: 'natura',
                razaoSocial: 'Grupo Natura Alimentos LTDA',
                nome_fantasia: 'Natura Alimentos',
                cnpj: '11222333000101',
                email: 'compras@natura-alimentos.com',
                telefone: '11988880001',
                descricao: 'Empresa de varejo alimentar que busca fornecedores sustentáveis e confiáveis.',
                seguimento: 'Varejo alimentício',
                porte: 'Média empresa',
                website: 'https://natura-alimentos.com',
                endereco: { estado: 'São Paulo', cidade: 'São Paulo', bairro: 'Pinheiros', cep: '05422000', logradouro: 'Rua dos Pinheiros', numero: '890' }
            },
            {
                key: 'loggi',
                razaoSocial: 'Loggi Express Operações SA',
                nome_fantasia: 'Loggi Express',
                cnpj: '22333444000102',
                email: 'operacoes@loggiexpress.com',
                telefone: '11988880002',
                descricao: 'Operadora logística nacional focada em entregas B2B e e-commerce.',
                seguimento: 'Logística',
                porte: 'Grande empresa',
                website: 'https://loggiexpress.com',
                endereco: { estado: 'São Paulo', cidade: 'Barueri', bairro: 'Alphaville', cep: '06454000', logradouro: 'Alameda Rio Negro', numero: '500' }
            },
            {
                key: 'casa',
                razaoSocial: 'Casa e Cia Varejo LTDA',
                nome_fantasia: 'Casa & Cia',
                cnpj: '33444555000103',
                email: 'compras@casaecia.com',
                telefone: '21988880003',
                descricao: 'Rede de lojas de utilidades domésticas e decoração.',
                seguimento: 'Varejo',
                porte: 'Pequena empresa',
                website: 'https://casaecia.com',
                endereco: { estado: 'Rio de Janeiro', cidade: 'Rio de Janeiro', bairro: 'Centro', cep: '20040002', logradouro: 'Avenida Rio Branco', numero: '120' }
            },
            {
                key: 'sena',
                razaoSocial: 'Sena Tech Soluções LTDA',
                nome_fantasia: 'Sena Tech',
                cnpj: '44555666000104',
                email: 'suprimentos@senatech.com',
                telefone: '41988880004',
                descricao: 'Empresa de tecnologia que compra materiais, equipamentos e serviços recorrentes.',
                seguimento: 'Tecnologia',
                porte: 'Microempresa',
                website: 'https://senatech.com',
                endereco: { estado: 'Paraná', cidade: 'Curitiba', bairro: 'Batel', cep: '80420090', logradouro: 'Avenida do Batel', numero: '1750' }
            },
            {
                key: 'verde',
                razaoSocial: 'Verde Mar Hotelaria LTDA',
                nome_fantasia: 'Verde Mar Hotéis',
                cnpj: '55666777000105',
                email: 'compras@verdemarhoteis.com',
                telefone: '48988880005',
                descricao: 'Rede hoteleira regional com foco em fornecedores locais e sustentáveis.',
                seguimento: 'Hotelaria',
                porte: 'Média empresa',
                website: 'https://verdemarhoteis.com',
                endereco: { estado: 'Santa Catarina', cidade: 'Florianópolis', bairro: 'Centro', cep: '88010001', logradouro: 'Rua Felipe Schmidt', numero: '300' }
            }
        ];

        const fornecedoresSeed = [
            {
                key: 'ecopack',
                razaoSocial: 'EcoPack Embalagens Sustentáveis LTDA',
                nome_fantasia: 'EcoPack Embalagens',
                cnpj: '66777888000106',
                email: 'contato@ecopack.com',
                telefone: '47988880006',
                descricao: 'Especialistas em embalagens biodegradáveis, recicláveis e personalizadas para e-commerce e varejo.',
                tempo_mercado: '12 anos',
                website: 'https://ecopack.com',
                categoria: 'Embalagens',
                atendimento: 'Nacional',
                certificacao: 'FSC',
                endereco: { estado: 'Santa Catarina', cidade: 'Joinville', bairro: 'Distrito Industrial', cep: '89219000', logradouro: 'Rua Dona Francisca', numero: '8300' }
            },
            {
                key: 'metaltec',
                razaoSocial: 'MetalTec Indústria e Comércio SA',
                nome_fantasia: 'MetalTec Indústria',
                cnpj: '77888999000107',
                email: 'vendas@metaltec.com',
                telefone: '11988880007',
                descricao: 'Fabricação de peças metálicas sob medida, chapas, estruturas e serviços de usinagem CNC.',
                tempo_mercado: '30 anos',
                website: 'https://metaltec.com',
                categoria: 'Metalurgia',
                atendimento: 'Regional',
                certificacao: 'ISO 9001',
                endereco: { estado: 'São Paulo', cidade: 'São Bernardo do Campo', bairro: 'Rudge Ramos', cep: '09618000', logradouro: 'Avenida Caminho do Mar', numero: '2100' }
            },
            {
                key: 'flexpack',
                razaoSocial: 'Flexpack Polímeros LTDA',
                nome_fantasia: 'Flexpack Polímeros',
                cnpj: '88999000000108',
                email: 'comercial@flexpack.com',
                telefone: '48988880008',
                descricao: 'Embalagens plásticas flexíveis, bobinas, sacos e filmes técnicos para produção sob demanda.',
                tempo_mercado: '15 anos',
                website: 'https://flexpack.com',
                categoria: 'Polímeros',
                atendimento: 'Regional',
                certificacao: 'ISO 14001',
                endereco: { estado: 'Santa Catarina', cidade: 'Blumenau', bairro: 'Itoupava Central', cep: '89062080', logradouro: 'Rua Pedro Zimmermann', numero: '4500' }
            },
            {
                key: 'limpabrasil',
                razaoSocial: 'LimpaBrasil Produtos Profissionais LTDA',
                nome_fantasia: 'LimpaBrasil',
                cnpj: '99000111000109',
                email: 'contato@limpabrasil.com',
                telefone: '31988880009',
                descricao: 'Produtos de limpeza profissional, higiene institucional e insumos para hotelaria e varejo.',
                tempo_mercado: '9 anos',
                website: 'https://limpabrasil.com',
                categoria: 'Limpeza',
                atendimento: 'Nacional',
                certificacao: 'ABNT',
                endereco: { estado: 'Minas Gerais', cidade: 'Belo Horizonte', bairro: 'Savassi', cep: '30140130', logradouro: 'Rua Pernambuco', numero: '1100' }
            },
            {
                key: 'softbridge',
                razaoSocial: 'SoftBridge Tecnologia LTDA',
                nome_fantasia: 'SoftBridge',
                cnpj: '10111213000110',
                email: 'comercial@softbridge.com',
                telefone: '41988880010',
                descricao: 'Desenvolvimento de software, integrações ERP, automação de compras e suporte gerenciado.',
                tempo_mercado: '7 anos',
                website: 'https://softbridge.com',
                categoria: 'Tecnologia',
                atendimento: 'Nacional',
                certificacao: 'B Corp',
                endereco: { estado: 'Paraná', cidade: 'Curitiba', bairro: 'Centro Cívico', cep: '80530000', logradouro: 'Rua Mateus Leme', numero: '1800' }
            },
            {
                key: 'moveisnorte',
                razaoSocial: 'Móveis Norte Corporativo LTDA',
                nome_fantasia: 'Móveis Norte',
                cnpj: '12131415000111',
                email: 'vendas@moveisnorte.com',
                telefone: '91988880011',
                descricao: 'Mobiliário corporativo, estações de trabalho, cadeiras ergonômicas e projetos sob medida.',
                tempo_mercado: '18 anos',
                website: 'https://moveisnorte.com',
                categoria: 'Mobiliário',
                atendimento: 'Nacional',
                certificacao: 'Sem certificação',
                endereco: { estado: 'Pará', cidade: 'Belém', bairro: 'Umarizal', cep: '66055005', logradouro: 'Avenida Visconde de Souza Franco', numero: '700' }
            }
        ];

        const empresas = {};
        for (const empresa of empresasSeed) {
            empresas[empresa.key] = await upsertEmpresa(empresa, senhaHash, portes);
        }

        const fornecedores = {};
        for (const fornecedor of fornecedoresSeed) {
            fornecedores[fornecedor.key] = await upsertFornecedor(fornecedor, senhaHash, {
                categorias,
                capacidades,
                certificacoes
            });
        }

        const avaliacoesSeed = [
            { empresa: 'natura', fornecedor: 'ecopack', tipoAvaliador: 'empresa', nota: 5, comentario: 'Entrega consistente, embalagens resistentes e ótimo suporte no desenvolvimento de novas opções sustentáveis.' },
            { empresa: 'loggi', fornecedor: 'ecopack', tipoAvaliador: 'empresa', nota: 5, comentario: 'A qualidade das caixas reduziu avarias na operação e o atendimento comercial é muito ágil.' },
            { empresa: 'casa', fornecedor: 'ecopack', tipoAvaliador: 'empresa', nota: 4, comentario: 'Bom custo-benefício e produto alinhado à proposta ESG. Prazo poderia ser um pouco mais curto.' },
            { empresa: 'natura', fornecedor: 'metaltec', tipoAvaliador: 'empresa', nota: 4, comentario: 'Peças bem acabadas e equipe técnica cuidadosa. Recomendo para demandas industriais.' },
            { empresa: 'sena', fornecedor: 'metaltec', tipoAvaliador: 'empresa', nota: 5, comentario: 'Excelente precisão nas peças sob medida e comunicação clara durante todo o pedido.' },
            { empresa: 'verde', fornecedor: 'flexpack', tipoAvaliador: 'empresa', nota: 4, comentario: 'Atendimento regional eficiente e boa qualidade nas embalagens flexíveis.' },
            { empresa: 'loggi', fornecedor: 'limpabrasil', tipoAvaliador: 'empresa', nota: 4, comentario: 'Portfólio completo e reposição rápida para nossas unidades.' },
            { empresa: 'sena', fornecedor: 'softbridge', tipoAvaliador: 'empresa', nota: 5, comentario: 'Integração com nossos processos foi simples e o suporte respondeu muito rápido.' },
            { empresa: 'verde', fornecedor: 'moveisnorte', tipoAvaliador: 'empresa', nota: 4, comentario: 'Móveis robustos e bem instalados. Boa opção para reformas corporativas.' },
            { empresa: 'natura', fornecedor: 'limpabrasil', tipoAvaliador: 'fornecedor', nota: 5, comentario: 'Empresa organizada, pagamentos pontuais e briefing de compra muito claro.' },
            { empresa: 'loggi', fornecedor: 'ecopack', tipoAvaliador: 'fornecedor', nota: 5, comentario: 'Equipe técnica colaborativa e previsibilidade alta de demanda.' },
            { empresa: 'verde', fornecedor: 'flexpack', tipoAvaliador: 'fornecedor', nota: 4, comentario: 'Boa comunicação e aprovações rápidas durante a negociação.' }
        ];

        for (const avaliacao of avaliacoesSeed) {
            await upsertAvaliacao({
                empresa: empresas[avaliacao.empresa],
                fornecedor: fornecedores[avaliacao.fornecedor],
                tipoAvaliador: avaliacao.tipoAvaliador,
                nota: avaliacao.nota,
                comentario: avaliacao.comentario
            });
        }

        for (const fornecedor of Object.values(fornecedores)) {
            await atualizarMediaFornecedor(fornecedor);
        }

        console.log('Seed completo executado com sucesso.');
        console.log(`Senha padrão para todos os usuários seedados: ${senhaPadrao}`);
        process.exit(0);
    } catch (error) {
        console.error('Erro ao alimentar o banco de dados:', error);
        process.exit(1);
    }
};

seedDatabase();
