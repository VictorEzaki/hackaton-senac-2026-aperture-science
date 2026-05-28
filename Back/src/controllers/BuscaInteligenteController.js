const BuscaInteligenteService = require('../services/BuscaInteligenteService');

const normalizeText = (value) => String(value || '').trim();

exports.buscar = async (req, res) => {
    try {
        const necessidade = normalizeText(req.body?.necessidade);

        if (!necessidade) {
            return res.status(400).json({
                sucesso: false,
                erro: 'Informe a necessidade da empresa.'
            });
        }

        if (necessidade.length > 500) {
            return res.status(400).json({
                sucesso: false,
                erro: 'A necessidade deve ter no máximo 500 caracteres.'
            });
        }

        const result = await BuscaInteligenteService.buscarFornecedores(necessidade);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Erro na busca inteligente:', error);
        return res.status(500).json({
            sucesso: false,
            erro: 'Falha ao realizar a busca inteligente de fornecedores.'
        });
    }
};
