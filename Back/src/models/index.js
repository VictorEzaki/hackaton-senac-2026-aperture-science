// Arquivo: Back/src/models/index.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// ==========================================
// 1. ENTIDADES DE LOCALIZAÇÃO
// ==========================================
const Estado = sequelize.define('Estado', {
    idEstado: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    estado: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'estado', timestamps: false });

const Cidade = sequelize.define('Cidade', {
    idCidade: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cidade: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'cidade', timestamps: false });

const Bairro = sequelize.define('Bairro', {
    idBairro: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    bairro: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'bairro', timestamps: false });

const Endereco = sequelize.define('Endereco', {
    idEndereco: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cep: { type: DataTypes.STRING(8) },
    logradouro: { type: DataTypes.STRING },
    numero: { type: DataTypes.STRING(10) }
}, { tableName: 'endereco', timestamps: false });

// ==========================================
// 2. ENTIDADES AUXILIARES
// ==========================================
const Categoria = sequelize.define('Categoria', {
    idCategoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    categoria: { type: DataTypes.STRING },
    descricao: { type: DataTypes.TEXT }
}, { tableName: 'categoria', timestamps: false });

const CapacidadeAtendimento = sequelize.define('CapacidadeAtendimento', {
    idAtendimento: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    atendimento: { type: DataTypes.STRING }
}, { tableName: 'capacidade_atendimento', timestamps: false });

const Certificacoes = sequelize.define('Certificacoes', {
    idCertificacoes: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    certificacao: { type: DataTypes.STRING }
}, { tableName: 'certificacoes', timestamps: false });

const PorteEmpresa = sequelize.define('PorteEmpresa', {
    idPorte: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    porte: { type: DataTypes.STRING }
}, { tableName: 'porte_empresa', timestamps: false });

// ==========================================
// 3. ENTIDADES PRINCIPAIS
// ==========================================
const Fornecedor = sequelize.define('Fornecedor', {
    idFornecedor: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    razaoSocial: { type: DataTypes.STRING },
    nome_fantasia: { type: DataTypes.STRING },
    cnpj: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    telefone: { type: DataTypes.STRING },
    senha: { type: DataTypes.STRING },
    descricao: { type: DataTypes.TEXT },
    tempo_mercado: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },
    avaliacao: { type: DataTypes.FLOAT, defaultValue: 0 },
    status: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'fornecedor', timestamps: true, createdAt: 'data_cadastro', updatedAt: false });

const Empresa = sequelize.define('Empresa', {
    idEmpresa: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    razaoSocial: { type: DataTypes.STRING },
    nome_fantasia: { type: DataTypes.STRING },
    cnpj: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    telefone: { type: DataTypes.STRING },
    senha: { type: DataTypes.STRING },
    descricao: { type: DataTypes.TEXT },
    seguimento: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },
    status: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'empresa', timestamps: true, createdAt: 'data_cadastro', updatedAt: false });

const Produto = sequelize.define('Produto', {
    idProduto: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    produto: { type: DataTypes.STRING },
    descricao: { type: DataTypes.TEXT },
    preco: { type: DataTypes.DECIMAL(10, 2) },
    prazo_entrega: { type: DataTypes.STRING },
    estoque_disponivel: { type: DataTypes.BOOLEAN }
}, { tableName: 'produto', timestamps: false });

// ==========================================
// 4. ASSOCIAÇÕES E CHAVES ESTRANGEIRAS
// ==========================================

// Cascata de Localização
Estado.hasMany(Cidade, { foreignKey: 'idEstado' });
Cidade.belongsTo(Estado, { foreignKey: 'idEstado' });

Cidade.hasMany(Bairro, { foreignKey: 'idCidade' });
Bairro.belongsTo(Cidade, { foreignKey: 'idCidade' });

Bairro.hasMany(Endereco, { foreignKey: 'idBairro' });
Endereco.belongsTo(Bairro, { foreignKey: 'idBairro' });

// Relacionamentos do Fornecedor
Endereco.hasMany(Fornecedor, { foreignKey: 'idEndereco' });
Fornecedor.belongsTo(Endereco, { foreignKey: 'idEndereco' });

CapacidadeAtendimento.hasMany(Fornecedor, { foreignKey: 'idAtendimento' });
Fornecedor.belongsTo(CapacidadeAtendimento, { foreignKey: 'idAtendimento' });

Certificacoes.hasMany(Fornecedor, { foreignKey: 'idCertificacoes' });
Fornecedor.belongsTo(Certificacoes, { foreignKey: 'idCertificacoes' });

Categoria.hasMany(Fornecedor, { foreignKey: 'idCategoria' });
Fornecedor.belongsTo(Categoria, { foreignKey: 'idCategoria' });

// Relacionamentos da Empresa
Endereco.hasMany(Empresa, { foreignKey: 'idEndereco' });
Empresa.belongsTo(Endereco, { foreignKey: 'idEndereco' });

PorteEmpresa.hasMany(Empresa, { foreignKey: 'idPorte' });
Empresa.belongsTo(PorteEmpresa, { foreignKey: 'idPorte' });

// Relacionamentos do Produto
Categoria.hasMany(Produto, { foreignKey: 'idCategoria' });
Produto.belongsTo(Categoria, { foreignKey: 'idCategoria' });

// Exportando todas as tabelas e a conexão
module.exports = {
    sequelize,
    Estado, Cidade, Bairro, Endereco,
    Categoria, CapacidadeAtendimento, Certificacoes, PorteEmpresa,
    Fornecedor, Empresa, Produto
};