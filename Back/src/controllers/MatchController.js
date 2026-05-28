const { Op } = require('sequelize');
const {
    Fornecedor,
    Categoria,
    Endereco,
    Bairro,
    Cidade,
    Estado,
    Certificacoes,
    CapacidadeAtendimento
} = require('../models');
const FornecedorService = require('../services/FornecedorService');
const EmpresaService = require('../services/EmpresaService');
const AvaliacaoService = require('../services/AvaliacaoService');

const sendServiceError = (res, error, fallbackMessage) => {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
            sucesso: false,
            erro: "Erro de relacionamento ao salvar os dados. Verifique as informações vinculadas."
        });
    }

    return res.status(error.status || 500).json({
        sucesso: false,
        erro: error.status ? error.message : fallbackMessage
    });
};

// 🔍 GET - Buscar fornecedores com filtros inteligentes e Ranking (Com os JOINs do DER)
exports.buscarFornecedores = async (req, res) => {
    try {
        const { categoria, localizacao } = req.query;

        const fornecedores = await Fornecedor.findAll({
            attributes: { exclude: ['senha'] },
            where: { status: true },
            include: [
                {
                    model: Categoria,
                    where: categoria ? { categoria: { [Op.like]: `%${categoria}%` } } : undefined
                },
                {
                    model: Certificacoes
                },
                {
                    model: CapacidadeAtendimento
                },
                {
                    model: Endereco,
                    include: [{
                        model: Bairro,
                        include: [{
                            model: Cidade,
                            include: [{
                                model: Estado,
                                where: localizacao ? { estado: { [Op.like]: `%${localizacao}%` } } : undefined
                            }]
                        }]
                    }]
                }
            ],
            order: [['avaliacao', 'DESC']]
        });

        res.status(200).json({
            sucesso: true,
            totalEncontrado: fornecedores.length,
            ranking: fornecedores
        });
    } catch (error) {
        console.error("Erro na busca inteligente:", error);
        res.status(500).json({ sucesso: false, erro: "Falha ao buscar fornecedores." });
    }
};

// 📥 POST - Cadastrar um novo fornecedor (Adaptado para o novo Banco de Dados)
exports.cadastrarFornecedor = async (req, res) => {
    try {
        const novoFornecedor = await FornecedorService.cadastrarFornecedor(req.body);

        res.status(201).json({
            sucesso: true,
            mensagem: "Fornecedor cadastrado com sucesso!",
            fornecedor: novoFornecedor
        });
    } catch (error) {
        console.error("Erro ao cadastrar fornecedor:", error);
        sendServiceError(res, error, "Falha ao salvar o fornecedor.");
    }
};

exports.loginFornecedor = async (req, res) => {
    try {
        const { token, fornecedor } = await FornecedorService.loginFornecedor(req.body);

        res.status(200).json({
            sucesso: true,
            token,
            fornecedor
        });
    } catch (error) {
        console.error("Erro ao fazer login do fornecedor:", error);
        sendServiceError(res, error, "Falha ao fazer login.");
    }
};

exports.listarOpcoesFornecedor = async (req, res) => {
    try {
        const opcoes = await FornecedorService.listarOpcoes();

        res.status(200).json({
            sucesso: true,
            ...opcoes
        });
    } catch (error) {
        console.error("Erro ao listar opções de fornecedor:", error);
        res.status(500).json({
            sucesso: false,
            erro: "Falha ao carregar opções de cadastro."
        });
    }
};

exports.buscarCatalogoFornecedores = async (req, res) => {
    try {
        const result = await FornecedorService.buscarCatalogo(req.query);

        res.status(200).json(result);
    } catch (error) {
        console.error("Erro ao buscar catálogo de fornecedores:", error);
        sendServiceError(res, error, "Falha ao buscar fornecedores do catálogo.");
    }
};

exports.cadastrarEmpresa = async (req, res) => {
    try {
        const novaEmpresa = await EmpresaService.cadastrarEmpresa(req.body);

        res.status(201).json({
            sucesso: true,
            mensagem: "Empresa cadastrada com sucesso!",
            empresa: novaEmpresa
        });
    } catch (error) {
        console.error("Erro ao cadastrar empresa:", error);
        sendServiceError(res, error, "Falha ao salvar a empresa.");
    }
};

exports.loginEmpresa = async (req, res) => {
    try {
        const { token, empresa } = await EmpresaService.loginEmpresa(req.body);

        res.status(200).json({
            sucesso: true,
            token,
            empresa
        });
    } catch (error) {
        console.error("Erro ao fazer login da empresa:", error);
        sendServiceError(res, error, "Falha ao fazer login.");
    }
};

exports.listarOpcoesEmpresa = async (req, res) => {
    try {
        const opcoes = await EmpresaService.listarOpcoes();

        res.status(200).json({
            sucesso: true,
            ...opcoes
        });
    } catch (error) {
        console.error("Erro ao listar opções de empresa:", error);
        res.status(500).json({
            sucesso: false,
            erro: "Falha ao carregar opções de cadastro."
        });
    }
};

exports.listarAvaliacoesFornecedor = async (req, res) => {
    try {
        const result = await AvaliacaoService.listarAvaliacoesFornecedor(req.params.idFornecedor);

        res.status(200).json({
            sucesso: true,
            ...result
        });
    } catch (error) {
        console.error("Erro ao listar avaliações do fornecedor:", error);
        sendServiceError(res, error, "Falha ao carregar avaliações do fornecedor.");
    }
};

exports.avaliarFornecedor = async (req, res) => {
    try {
        const result = await AvaliacaoService.avaliarFornecedor(
            req.params.idFornecedor,
            req.usuario,
            req.body
        );

        res.status(200).json({
            sucesso: true,
            mensagem: "Avaliação registrada com sucesso.",
            ...result
        });
    } catch (error) {
        console.error("Erro ao avaliar fornecedor:", error);
        sendServiceError(res, error, "Falha ao registrar avaliação do fornecedor.");
    }
};

exports.listarAvaliacoesEmpresa = async (req, res) => {
    try {
        const result = await AvaliacaoService.listarAvaliacoesEmpresa(req.params.idEmpresa);

        res.status(200).json({
            sucesso: true,
            ...result
        });
    } catch (error) {
        console.error("Erro ao listar avaliações da empresa:", error);
        sendServiceError(res, error, "Falha ao carregar avaliações da empresa.");
    }
};

exports.avaliarEmpresa = async (req, res) => {
    try {
        const avaliacao = await AvaliacaoService.avaliarEmpresa(
            req.params.idEmpresa,
            req.usuario,
            req.body
        );

        res.status(200).json({
            sucesso: true,
            mensagem: "Avaliação registrada com sucesso.",
            avaliacao
        });
    } catch (error) {
        console.error("Erro ao avaliar empresa:", error);
        sendServiceError(res, error, "Falha ao registrar avaliação da empresa.");
    }
};
