const { fn, col } = require('sequelize');
const {
    sequelize,
    Avaliacao,
    Empresa,
    Fornecedor
} = require('../models');

const normalizeText = (value) => String(value || '').trim();

const validarNota = (nota) => {
    const numericNota = Number(nota);

    if (!Number.isInteger(numericNota) || numericNota < 1 || numericNota > 5) {
        const error = new Error('A nota deve ser um número inteiro entre 1 e 5.');
        error.status = 400;
        throw error;
    }

    return numericNota;
};

const validarComentario = (comentario) => {
    const normalized = normalizeText(comentario);

    if (normalized.length > 1000) {
        const error = new Error('O comentário deve ter no máximo 1000 caracteres.');
        error.status = 400;
        throw error;
    }

    return normalized || null;
};

const ensureTipoUsuario = (usuario, tipoEsperado) => {
    if (!usuario || usuario.tipoUsuario !== tipoEsperado) {
        const error = new Error('Você não tem permissão para realizar esta avaliação.');
        error.status = 403;
        throw error;
    }
};

const ensureEmpresaAtiva = async (idEmpresa) => {
    const empresa = await Empresa.findByPk(idEmpresa, {
        attributes: ['idEmpresa', 'razaoSocial', 'nome_fantasia', 'status']
    });

    if (!empresa || !empresa.status) {
        const error = new Error('Empresa não encontrada ou inativa.');
        error.status = 404;
        throw error;
    }

    return empresa;
};

const ensureFornecedorAtivo = async (idFornecedor) => {
    const fornecedor = await Fornecedor.findByPk(idFornecedor, {
        attributes: ['idFornecedor', 'razaoSocial', 'nome_fantasia', 'avaliacao', 'status']
    });

    if (!fornecedor || !fornecedor.status) {
        const error = new Error('Fornecedor não encontrado ou inativo.');
        error.status = 404;
        throw error;
    }

    return fornecedor;
};

const recalcularMediaFornecedor = async (idFornecedor, transaction) => {
    const result = await Avaliacao.findOne({
        attributes: [[fn('AVG', col('nota')), 'media']],
        where: { idFornecedor, tipoAvaliador: 'empresa' },
        raw: true,
        transaction
    });

    const media = Number(result?.media || 0);
    await Fornecedor.update(
        { avaliacao: Number(media.toFixed(2)) },
        { where: { idFornecedor }, transaction }
    );

    return media;
};

const listarAvaliacoesFornecedor = async (idFornecedor) => {
    await ensureFornecedorAtivo(idFornecedor);

    const avaliacoes = await Avaliacao.findAll({
        where: { idFornecedor, tipoAvaliador: 'empresa' },
        include: [{
            model: Empresa,
            attributes: ['idEmpresa', 'razaoSocial', 'nome_fantasia']
        }],
        order: [['data_avaliacao', 'DESC']]
    });

    const media = avaliacoes.length
        ? avaliacoes.reduce((total, item) => total + Number(item.nota), 0) / avaliacoes.length
        : 0;

    return {
        media: Number(media.toFixed(2)),
        total: avaliacoes.length,
        avaliacoes
    };
};

const avaliarFornecedor = async (idFornecedor, usuario, payload) => {
    ensureTipoUsuario(usuario, 'empresa');
    const nota = validarNota(payload.nota);
    const comentario = validarComentario(payload.comentario);

    await ensureFornecedorAtivo(idFornecedor);
    await ensureEmpresaAtiva(usuario.idEmpresa);

    return sequelize.transaction(async (transaction) => {
        const [avaliacao, created] = await Avaliacao.findOrCreate({
            where: {
                idEmpresa: usuario.idEmpresa,
                idFornecedor,
                tipoAvaliador: 'empresa'
            },
            defaults: {
                idEmpresa: usuario.idEmpresa,
                idFornecedor,
                tipoAvaliador: 'empresa',
                nota,
                comentario
            },
            transaction
        });

        if (!created) {
            await avaliacao.update({
                nota,
                comentario,
                data_avaliacao: new Date()
            }, { transaction });
        }

        const media = await recalcularMediaFornecedor(idFornecedor, transaction);

        return {
            avaliacao,
            media: Number(media.toFixed(2))
        };
    });
};

const listarAvaliacoesEmpresa = async (idEmpresa) => {
    await ensureEmpresaAtiva(idEmpresa);

    const avaliacoes = await Avaliacao.findAll({
        where: { idEmpresa, tipoAvaliador: 'fornecedor' },
        include: [{
            model: Fornecedor,
            attributes: ['idFornecedor', 'razaoSocial', 'nome_fantasia']
        }],
        order: [['data_avaliacao', 'DESC']]
    });

    const media = avaliacoes.length
        ? avaliacoes.reduce((total, item) => total + Number(item.nota), 0) / avaliacoes.length
        : 0;

    return {
        media: Number(media.toFixed(2)),
        total: avaliacoes.length,
        avaliacoes
    };
};

const avaliarEmpresa = async (idEmpresa, usuario, payload) => {
    ensureTipoUsuario(usuario, 'fornecedor');
    const nota = validarNota(payload.nota);
    const comentario = validarComentario(payload.comentario);

    await ensureEmpresaAtiva(idEmpresa);
    await ensureFornecedorAtivo(usuario.idFornecedor);

    const [avaliacao, created] = await Avaliacao.findOrCreate({
        where: {
            idEmpresa,
            idFornecedor: usuario.idFornecedor,
            tipoAvaliador: 'fornecedor'
        },
        defaults: {
            idEmpresa,
            idFornecedor: usuario.idFornecedor,
            tipoAvaliador: 'fornecedor',
            nota,
            comentario
        }
    });

    if (!created) {
        await avaliacao.update({
            nota,
            comentario,
            data_avaliacao: new Date()
        });
    }

    return avaliacao;
};

module.exports = {
    avaliarEmpresa,
    avaliarFornecedor,
    listarAvaliacoesEmpresa,
    listarAvaliacoesFornecedor
};
