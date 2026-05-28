const { Empresa } = require('../models');

exports.cadastrarEmpresa = async (req, res) => {
    try {
        const {
            razaoSocial,
            nome_fantasia,
            cnpj,
            email,
            telefone,
            senha,
            descricao,
            seguimento,
            website
        } = req.body;

        if (!razaoSocial || !nome_fantasia || !cnpj || !email || !telefone || !senha || !seguimento) {
            return res.status(400).json({
                sucesso: false,
                erro: 'Preencha os campos obrigatórios: razão social, nome fantasia, CNPJ, e-mail, telefone, senha e seguimento.'
            });
        }

        const novaEmpresa = await Empresa.create({
            razaoSocial,
            nome_fantasia,
            cnpj,
            email,
            telefone,
            senha,
            descricao,
            seguimento,
            website
        });

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Empresa cadastrada com sucesso.',
            dados: novaEmpresa
        });
    } catch (error) {
        console.error('Erro ao cadastrar empresa:', error);
        return res.status(500).json({
            sucesso: false,
            erro: 'Falha ao salvar a empresa.'
        });
    }
};