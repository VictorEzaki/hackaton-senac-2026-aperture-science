const {
    Estado,
    Cidade,
    Categoria,
    Certificacoes
} = require('../models');
const FornecedorService = require('./FornecedorService');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';

const normalizeText = (value) => String(value || '').trim();
const normalizeSearch = (value) => normalizeText(value).toLowerCase();
const stripAccents = (value) => normalizeSearch(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const emptyFilters = () => ({
    categoria: null,
    qualificacao: null,
    tipoProduto: null,
    avaliacaoMinima: null,
    estado: null,
    cidade: null,
    palavrasChave: []
});

const sanitizeFilters = (filters = {}) => {
    const avaliacao = Number(filters.avaliacaoMinima);
    const palavrasChave = Array.isArray(filters.palavrasChave)
        ? filters.palavrasChave.map(normalizeText).filter(Boolean).slice(0, 8)
        : [];

    return {
        categoria: normalizeText(filters.categoria) || null,
        qualificacao: normalizeText(filters.qualificacao) || null,
        tipoProduto: normalizeText(filters.tipoProduto) || null,
        avaliacaoMinima: Number.isFinite(avaliacao) ? Math.min(5, Math.max(0, avaliacao)) : null,
        estado: normalizeText(filters.estado) || null,
        cidade: normalizeText(filters.cidade) || null,
        palavrasChave
    };
};

const buildPrompt = (necessidade) => `Você é um assistente de matchmaking B2B para uma plataforma chamada Supply Hub.

Sua tarefa é transformar a necessidade de uma empresa em filtros estruturados para busca de fornecedores.

Retorne apenas JSON válido, sem markdown e sem explicações.

Campos possíveis:
{
"categoria": string | null,
"qualificacao": string | null,
"tipoProduto": string | null,
"avaliacaoMinima": number | null,
"estado": string | null,
"cidade": string | null,
"palavrasChave": string[]
}

Regras:

* Se o texto mencionar produto, serviço ou ramo, tente preencher categoria e tipoProduto.
* Se mencionar localização, preencha estado e/ou cidade.
* Se mencionar boa reputação, qualidade, fornecedor confiável ou bem avaliado, use avaliacaoMinima = 4.
* Se mencionar certificação, ISO, selo, ESG ou qualificação, preencha qualificacao.
* Se não tiver certeza sobre algum campo, use null.
* Sempre retorne palavrasChave relevantes.
* Retorne somente JSON válido.

Texto da empresa:
"${necessidade}"`;

const parseJsonFromText = (text) => {
    const cleaned = normalizeText(text)
        .replace(/^```json/i, '')
        .replace(/^```/i, '')
        .replace(/```$/i, '')
        .trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');

    if (start === -1 || end === -1 || end < start) {
        throw new Error('A IA não retornou JSON válido.');
    }

    return JSON.parse(cleaned.slice(start, end + 1));
};

const interpretarComGemini = async (necessidade) => {
    if (!GEMINI_API_KEY) {
        return null;
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': GEMINI_API_KEY
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: buildPrompt(necessidade) }]
                }],
                generationConfig: {
                    temperature: 0.1,
                    responseMimeType: 'application/json'
                }
            })
        }
    );

    const data = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(data?.error?.message || 'Falha ao chamar Gemini.');
    }

    const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
    return sanitizeFilters(parseJsonFromText(text));
};

const findMatchingLookup = (items, text) => {
    const normalizedText = stripAccents(text);
    return items.find((item) => normalizedText.includes(stripAccents(item))) || null;
};

const fallbackInterpretacao = async (necessidade) => {
    const text = stripAccents(necessidade);
    const [categorias, certificacoes, estados, cidades] = await Promise.all([
        Categoria.findAll({ attributes: ['categoria'], order: [['categoria', 'ASC']] }),
        Certificacoes.findAll({ attributes: ['certificacao'], order: [['certificacao', 'ASC']] }),
        Estado.findAll({ attributes: ['estado'], order: [['estado', 'ASC']] }),
        Cidade.findAll({ attributes: ['cidade'], order: [['cidade', 'ASC']] })
    ]);

    const categoriaNames = categorias.map((item) => item.categoria);
    const certificacaoNames = certificacoes.map((item) => item.certificacao);
    const estadoNames = estados.map((item) => item.estado);
    const cidadeNames = cidades.map((item) => item.cidade);
    const filters = emptyFilters();
    const palavrasChave = [];

    filters.categoria = findMatchingLookup(categoriaNames, necessidade);
    filters.qualificacao = findMatchingLookup(certificacaoNames, necessidade);
    filters.estado = findMatchingLookup(estadoNames, necessidade);
    filters.cidade = findMatchingLookup(cidadeNames, necessidade);

    if (!filters.categoria && /embalagem|embalagens|papelao|papelão|caixa|caixas/.test(text)) {
        filters.categoria = 'Embalagens';
    }
    if (!filters.categoria && /metal|metalurgia|usinagem|aco|aço/.test(text)) {
        filters.categoria = 'Metalurgia';
    }
    if (!filters.categoria && /polimero|polímero|plastico|plástico|resina/.test(text)) {
        filters.categoria = 'Polímeros';
    }
    if (!filters.categoria && /software|tecnologia|erp|integracao|integração/.test(text)) {
        filters.categoria = 'Tecnologia';
    }
    if (!filters.qualificacao && /iso|certificacao|certificação|selo|esg|fsc/.test(text)) {
        if (/iso\s*14001/.test(text)) filters.qualificacao = 'ISO 14001';
        else if (/iso\s*9001/.test(text)) filters.qualificacao = 'ISO 9001';
        else if (/fsc/.test(text)) filters.qualificacao = 'FSC';
    }
    if (/boa avaliacao|boa avaliação|bem avaliado|reputacao|reputação|confiavel|confiável|qualidade/.test(text)) {
        filters.avaliacaoMinima = 4;
    }

    if (/sustentavel|sustentável|reciclavel|reciclável|biodegradavel|biodegradável|esg|verde/.test(text)) {
        palavrasChave.push('sustentável');
    }
    if (/entrega rapida|entrega rápida|prazo|agil|ágil/.test(text)) {
        palavrasChave.push('entrega rápida');
    }
    if (/embalagem|embalagens|papelao|papelão|caixa|caixas/.test(text)) {
        palavrasChave.push('embalagens');
    }

    filters.tipoProduto = palavrasChave.length ? palavrasChave.join(' ') : filters.categoria;
    filters.palavrasChave = [...new Set([
        ...palavrasChave,
        ...normalizeText(necessidade).split(/\s+/).filter((word) => word.length > 4).slice(0, 5)
    ])];

    return sanitizeFilters(filters);
};

const interpretarNecessidade = async (necessidade) => {
    try {
        const filters = await interpretarComGemini(necessidade);
        if (filters) return filters;
    } catch (error) {
        console.warn('Gemini indisponível, usando fallback local:', error.message);
    }

    return fallbackInterpretacao(necessidade);
};

const includesTerm = (text, term) => stripAccents(text).includes(stripAccents(term));

const calcularMatchScore = (fornecedor, filtros) => {
    let score = 0;
    const searchableText = [
        fornecedor.nome_fantasia,
        fornecedor.razaoSocial,
        fornecedor.descricao,
        fornecedor.categoria,
        fornecedor.qualificacao,
        fornecedor.tipoProduto,
        fornecedor.cidade,
        fornecedor.estado
    ].join(' ');

    if (filtros.categoria && includesTerm(fornecedor.categoria, filtros.categoria)) score += 30;
    if (filtros.estado && includesTerm(fornecedor.estado, filtros.estado)) score += 20;
    if (filtros.cidade && includesTerm(fornecedor.cidade, filtros.cidade)) score += 15;
    if (filtros.avaliacaoMinima !== null && Number(fornecedor.avaliacao || 0) >= filtros.avaliacaoMinima) score += 15;
    if (filtros.qualificacao && includesTerm(fornecedor.qualificacao, filtros.qualificacao)) score += 10;

    const keywordMatches = filtros.palavrasChave.some((keyword) => includesTerm(searchableText, keyword));
    if (keywordMatches || (filtros.tipoProduto && includesTerm(searchableText, filtros.tipoProduto))) {
        score += 10;
    }

    if (score === 0 && Number(fornecedor.avaliacao || 0) >= 4) {
        score = 10;
    }

    return Math.max(0, Math.min(100, score));
};

const buscarComFiltros = async (filtros, necessidade) => {
    const primarySearch = filtros.palavrasChave[0] || filtros.tipoProduto || necessidade;
    const result = await FornecedorService.buscarCatalogo({
        search: primarySearch,
        categoria: filtros.categoria || '',
        qualificacao: filtros.qualificacao || '',
        tipoProduto: filtros.tipoProduto || '',
        avaliacaoMinima: filtros.avaliacaoMinima || '',
        estado: filtros.estado || '',
        cidade: filtros.cidade || '',
        page: 1,
        limit: 50,
        sort: 'relevancia'
    });

    if (result.data.length) return result.data;

    const broadResult = await FornecedorService.buscarCatalogo({
        search: filtros.palavrasChave.join(' ') || filtros.categoria || necessidade,
        page: 1,
        limit: 50,
        sort: 'relevancia'
    });

    return broadResult.data;
};

const buscarFornecedores = async (necessidade) => {
    const filtrosInterpretados = await interpretarNecessidade(necessidade);
    const fornecedores = await buscarComFiltros(filtrosInterpretados, necessidade);
    const data = fornecedores
        .map((fornecedor) => ({
            ...fornecedor,
            matchScore: calcularMatchScore(fornecedor, filtrosInterpretados)
        }))
        .filter((fornecedor) => fornecedor.matchScore > 0 || fornecedores.length <= 5)
        .sort((a, b) => b.matchScore - a.matchScore || Number(b.avaliacao || 0) - Number(a.avaliacao || 0));

    return {
        filtrosInterpretados,
        data
    };
};

module.exports = {
    buscarFornecedores,
    interpretarNecessidade,
    calcularMatchScore
};
