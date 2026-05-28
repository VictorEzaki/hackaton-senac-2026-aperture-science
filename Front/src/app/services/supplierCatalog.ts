export interface SupplierCatalogFilters {
  search?: string;
  categoria?: string;
  qualificacao?: string;
  tipoProduto?: string;
  avaliacaoMinima?: string;
  estado?: string;
  cidade?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface SupplierCatalogItem {
  idFornecedor: number;
  razaoSocial: string;
  nome_fantasia?: string;
  descricao?: string;
  categoria?: string;
  qualificacao?: string;
  tipoProduto?: string;
  avaliacao?: number;
  cidade?: string;
  estado?: string;
  website?: string;
  telefone?: string;
  email?: string;
  data_cadastro?: string;
}

export interface SupplierCatalogResponse {
  data: SupplierCatalogItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SupplierOptionsResponse {
  sucesso?: boolean;
  categorias?: string[];
  certificacoes?: string[];
  capacidades_atendimento?: string[];
}

const appendParam = (params: URLSearchParams, key: string, value?: string | number) => {
  const normalized = String(value ?? "").trim();
  if (normalized) params.set(key, normalized);
};

export const buildSupplierCatalogParams = (filters: SupplierCatalogFilters) => {
  const params = new URLSearchParams();

  appendParam(params, "search", filters.search);
  appendParam(params, "categoria", filters.categoria);
  appendParam(params, "qualificacao", filters.qualificacao);
  appendParam(params, "tipoProduto", filters.tipoProduto);
  appendParam(params, "avaliacaoMinima", filters.avaliacaoMinima);
  appendParam(params, "estado", filters.estado);
  appendParam(params, "cidade", filters.cidade);
  appendParam(params, "page", filters.page || 1);
  appendParam(params, "limit", filters.limit || 10);
  appendParam(params, "sort", filters.sort || "relevancia");

  return params;
};

export const fetchSupplierCatalog = async (filters: SupplierCatalogFilters) => {
  const params = buildSupplierCatalogParams(filters);
  const response = await fetch(`/api/fornecedores/catalogo?${params.toString()}`);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.erro || "Não foi possível carregar os fornecedores.");
  }

  return data as SupplierCatalogResponse;
};

export const fetchSupplierOptions = async () => {
  const response = await fetch("/api/fornecedores/opcoes");
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.erro || "Não foi possível carregar os filtros.");
  }

  return data as SupplierOptionsResponse;
};
