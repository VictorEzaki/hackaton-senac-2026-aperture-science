const { Op } = require('sequelize');
const { Fornecedor, Categoria, Endereco, Bairro, Cidade, Estado, Certificacoes } = require('../models');

// 🔍 GET - Buscar fornecedores com filtros inteligentes e Ranking (Com os JOINs do DER)
exports.buscarFornecedores = async (req, res) => {
    try {
        const { categoria, localizacao } = req.query;

        const fornecedores = await Fornecedor.findAll({
            include: [
                {
                    model: Categoria,
                    where: categoria ? { categoria: { [Op.like]: `%${categoria}%` } } : undefined
                },
                {
                    model: Certificacoes
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
        // Pegando os dados baseados no seu novo modelo de Entidade-Relacionamento
        const { razaoSocial, nome_fantasia, cnpj, email, telefone, descricao, website } = req.body;

        if (!razaoSocial || !cnpj) {
            return res.status(400).json({ 
                sucesso: false, 
                erro: "Os campos Razão Social e CNPJ são obrigatórios." 
            });
        }

        // Cria o fornecedor nas novas colunas
        const novoFornecedor = await Fornecedor.create({
            razaoSocial,
            nome_fantasia,
            cnpj,
            email,
            telefone,
            descricao,
            website,
            avaliacao: 0 // Inicia com nota 0
        });

        res.status(201).json({
            sucesso: true,
            mensagem: "Fornecedor cadastrado com sucesso no novo modelo!",
            dados: novoFornecedor
        });
    } catch (error) {
        console.error("Erro ao cadastrar fornecedor:", error);
        res.status(500).json({ sucesso: false, erro: "Falha ao salvar o fornecedor." });
    }
};