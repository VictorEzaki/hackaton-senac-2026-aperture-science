CREATE TABLE `empresa`(
    `idEmpresa` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idEndereco` INT UNSIGNED NOT NULL,
    `idPorte` INT UNSIGNED NOT NULL,
    `razaoSocial` VARCHAR(255) NOT NULL,
    `nome_fantasia` VARCHAR(255) NOT NULL,
    `cnpj` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `telefone` VARCHAR(255) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `descricao` TEXT NOT NULL,
    `seguimento` VARCHAR(255) NOT NULL,
    `porte` VARCHAR(255) NOT NULL,
    `website` VARCHAR(255) NOT NULL,
    `data_cadastro` DATETIME NOT NULL,
    `status` BOOLEAN NOT NULL
);
CREATE TABLE `bairro`(
    `idBairro` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idCidade` INT UNSIGNED NOT NULL,
    `bairro` VARCHAR(255) NOT NULL
);
CREATE TABLE `cidade`(
    `idCidade` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idEstado` INT UNSIGNED NOT NULL,
    `cidade` VARCHAR(255) NOT NULL
);
CREATE TABLE `estado`(
    `idEstado` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `estado` VARCHAR(255) NOT NULL
);
CREATE TABLE `endereco`(
    `idEndereco` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idBairro` INT UNSIGNED NOT NULL,
    `cep` VARCHAR(8) NOT NULL,
    `logradouro` VARCHAR(255) NOT NULL,
    `numero` VARCHAR(10) NOT NULL
);
CREATE TABLE `porte_empresa`(
    `idPorte` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `porte` VARCHAR(255) NOT NULL
);
CREATE TABLE `fornecedor`(
    `idFornecedor` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idEndereco` INT UNSIGNED NOT NULL,
    `idAtendimento` INT UNSIGNED NOT NULL,
    `idCertificacoes` INT UNSIGNED NOT NULL,
    `idCategoria` INT UNSIGNED NOT NULL,
    `razaoSocial` VARCHAR(255) NOT NULL,
    `nome_fantasia` VARCHAR(255) NOT NULL,
    `cnpj` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `telefone` VARCHAR(255) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `descricao` TEXT NOT NULL,
    `tempo_mercado` VARCHAR(255) NOT NULL,
    `website` VARCHAR(255) NOT NULL,
    `avaliacao` FLOAT(53) NOT NULL,
    `data_cadastro` DATETIME NOT NULL,
    `status` BOOLEAN NOT NULL
);
CREATE TABLE `capacidade_atendimento`(
    `idAtendimento` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `atendimento` VARCHAR(255) NOT NULL
);
CREATE TABLE `certificacoes`(
    `idCertificacoes` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `certificacao` VARCHAR(255) NOT NULL
);
CREATE TABLE `categoria`(
    `idCategoria` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `categoria` VARCHAR(255) NOT NULL,
    `descricao` TEXT NOT NULL
);
CREATE TABLE `produto`(
    `idProduto` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `idCategoria` INT UNSIGNED NOT NULL,
    `produto` VARCHAR(255) NOT NULL,
    `descricao` TEXT NOT NULL,
    `preco` DECIMAL(8, 2) NOT NULL,
    `prazo_entrega` VARCHAR(255) NOT NULL,
    `estoque_disponivel` BOOLEAN NOT NULL
);
ALTER TABLE
    `bairro` ADD CONSTRAINT `bairro_idcidade_foreign` FOREIGN KEY(`idCidade`) REFERENCES `cidade`(`idCidade`);
ALTER TABLE
    `endereco` ADD CONSTRAINT `endereco_idbairro_foreign` FOREIGN KEY(`idBairro`) REFERENCES `bairro`(`idBairro`);
ALTER TABLE
    `fornecedor` ADD CONSTRAINT `fornecedor_idcategoria_foreign` FOREIGN KEY(`idCategoria`) REFERENCES `categoria`(`idCategoria`);
ALTER TABLE
    `fornecedor` ADD CONSTRAINT `fornecedor_idendereco_foreign` FOREIGN KEY(`idEndereco`) REFERENCES `endereco`(`idEndereco`);
ALTER TABLE
    `cidade` ADD CONSTRAINT `cidade_idestado_foreign` FOREIGN KEY(`idEstado`) REFERENCES `estado`(`idEstado`);
ALTER TABLE
    `fornecedor` ADD CONSTRAINT `fornecedor_idatendimento_foreign` FOREIGN KEY(`idAtendimento`) REFERENCES `capacidade_atendimento`(`idAtendimento`);
ALTER TABLE
    `produto` ADD CONSTRAINT `produto_idcategoria_foreign` FOREIGN KEY(`idCategoria`) REFERENCES `categoria`(`idCategoria`);
ALTER TABLE
    `empresa` ADD CONSTRAINT `empresa_idporte_foreign` FOREIGN KEY(`idPorte`) REFERENCES `porte_empresa`(`idPorte`);
ALTER TABLE
    `fornecedor` ADD CONSTRAINT `fornecedor_idcertificacoes_foreign` FOREIGN KEY(`idCertificacoes`) REFERENCES `certificacoes`(`idCertificacoes`);
ALTER TABLE
    `empresa` ADD CONSTRAINT `empresa_idendereco_foreign` FOREIGN KEY(`idEndereco`) REFERENCES `endereco`(`idEndereco`);