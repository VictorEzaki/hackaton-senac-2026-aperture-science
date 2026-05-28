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
    idEstado: { type: DataTypes.INTEGER, allowNull: false },
    cidade: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'cidade', timestamps: false });

const Bairro = sequelize.define('Bairro', {
    idBairro: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idCidade: { type: DataTypes.INTEGER, allowNull: false },
    bairro: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'bairro', timestamps: false });

const Endereco = sequelize.define('Endereco', {
    idEndereco: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idBairro: { type: DataTypes.INTEGER, allowNull: false },
    cep: { type: DataTypes.STRING(8), allowNull: false },
    logradouro: { type: DataTypes.STRING, allowNull: false },
    numero: { type: DataTypes.STRING(10), allowNull: false }
}, { tableName: 'endereco', timestamps: false });

// ==========================================
// 2. ENTIDADES AUXILIARES
// ==========================================
const Categoria = sequelize.define('Categoria', {
    idCategoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    categoria: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' }
}, { tableName: 'categoria', timestamps: false });

const CapacidadeAtendimento = sequelize.define('CapacidadeAtendimento', {
    idAtendimento: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    atendimento: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'capacidade_atendimento', timestamps: false });

const Certificacoes = sequelize.define('Certificacoes', {
    idCertificacoes: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    certificacao: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'certificacoes', timestamps: false });

const PorteEmpresa = sequelize.define('PorteEmpresa', {
    idPorte: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    porte: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'porte_empresa', timestamps: false });

// ==========================================
// 3. ENTIDADES PRINCIPAIS
// ==========================================
const Fornecedor = sequelize.define('Fornecedor', {
    idFornecedor: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idEndereco: { type: DataTypes.INTEGER, allowNull: false },
    idAtendimento: { type: DataTypes.INTEGER, allowNull: false },
    idCertificacoes: { type: DataTypes.INTEGER, allowNull: false },
    idCategoria: { type: DataTypes.INTEGER, allowNull: false },
    razaoSocial: { type: DataTypes.STRING, allowNull: false },
    nome_fantasia: { type: DataTypes.STRING, allowNull: false },
    cnpj: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    telefone: { type: DataTypes.STRING, allowNull: false },
    senha: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: false },
    tempo_mercado: { type: DataTypes.STRING, allowNull: false },
    website: { type: DataTypes.STRING, allowNull: false },
    avaliacao: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { tableName: 'fornecedor', timestamps: true, createdAt: 'data_cadastro', updatedAt: false });

const Empresa = sequelize.define('Empresa', {
    idEmpresa: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idEndereco: { type: DataTypes.INTEGER, allowNull: false },
    idPorte: { type: DataTypes.INTEGER, allowNull: false },
    razaoSocial: { type: DataTypes.STRING, allowNull: false },
    nome_fantasia: { type: DataTypes.STRING, allowNull: false },
    cnpj: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    telefone: { type: DataTypes.STRING, allowNull: false },
    senha: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: false },
    seguimento: { type: DataTypes.STRING, allowNull: false },
    website: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { tableName: 'empresa', timestamps: true, createdAt: 'data_cadastro', updatedAt: false });

const Produto = sequelize.define('Produto', {
    idProduto: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    produto: { type: DataTypes.STRING },
    descricao: { type: DataTypes.TEXT },
    preco: { type: DataTypes.DECIMAL(10, 2) },
    prazo_entrega: { type: DataTypes.STRING },
    estoque_disponivel: { type: DataTypes.BOOLEAN }
}, { tableName: 'produto', timestamps: false });

const Avaliacao = sequelize.define('Avaliacao', {
    idAvaliacao: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idEmpresa: { type: DataTypes.INTEGER, allowNull: false },
    idFornecedor: { type: DataTypes.INTEGER, allowNull: false },
    tipoAvaliador: { type: DataTypes.ENUM('empresa', 'fornecedor'), allowNull: false },
    nota: { type: DataTypes.INTEGER, allowNull: false },
    comentario: { type: DataTypes.TEXT, allowNull: true },
}, {
    tableName: 'avaliacao',
    timestamps: true,
    createdAt: 'data_avaliacao',
    updatedAt: false,
    indexes: [
        {
            unique: true,
            fields: ['idEmpresa', 'idFornecedor', 'tipoAvaliador']
        }
    ]
});

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

// Relacionamentos de Avaliação
Empresa.hasMany(Avaliacao, { foreignKey: 'idEmpresa' });
Avaliacao.belongsTo(Empresa, { foreignKey: 'idEmpresa' });

Fornecedor.hasMany(Avaliacao, { foreignKey: 'idFornecedor' });
Avaliacao.belongsTo(Fornecedor, { foreignKey: 'idFornecedor' });

// Exportando todas as tabelas e a conexão
module.exports = {
    sequelize,
    Estado, Cidade, Bairro, Endereco,
    Categoria, CapacidadeAtendimento, Certificacoes, PorteEmpresa,
    Fornecedor, Empresa, Produto, Avaliacao
};
