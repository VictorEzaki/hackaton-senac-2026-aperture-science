const {
    Estado,
    Cidade,
    Bairro,
    Endereco
} = require('../models');

const normalizeText = (value) => String(value || '').trim();
const normalizeEmail = (value) => normalizeText(value).toLowerCase();
const onlyDigits = (value) => normalizeText(value).replace(/\D/g, '');

const requiredAddressFields = ['estado', 'cidade', 'bairro', 'cep', 'logradouro', 'numero'];

const validateEndereco = (endereco = {}) => {
    const missingAddress = requiredAddressFields.filter((field) => !normalizeText(endereco[field]));

    if (missingAddress.length) {
        return 'Preencha todos os dados de endereço.';
    }

    if (onlyDigits(endereco.cep).length !== 8) {
        return 'Informe um CEP válido com 8 dígitos.';
    }

    return null;
};

const findOrCreateByName = async (model, field, value, defaults = {}, transaction) => {
    const normalized = normalizeText(value);
    const [record] = await model.findOrCreate({
        where: { [field]: normalized },
        defaults: { [field]: normalized, ...defaults },
        transaction
    });

    return record;
};

const findOrCreateEndereco = async (enderecoPayload, transaction) => {
    const estado = await findOrCreateByName(Estado, 'estado', enderecoPayload.estado, {}, transaction);
    const [cidade] = await Cidade.findOrCreate({
        where: { cidade: normalizeText(enderecoPayload.cidade), idEstado: estado.idEstado },
        defaults: { cidade: normalizeText(enderecoPayload.cidade), idEstado: estado.idEstado },
        transaction
    });
    const [bairro] = await Bairro.findOrCreate({
        where: { bairro: normalizeText(enderecoPayload.bairro), idCidade: cidade.idCidade },
        defaults: { bairro: normalizeText(enderecoPayload.bairro), idCidade: cidade.idCidade },
        transaction
    });
    const [endereco] = await Endereco.findOrCreate({
        where: {
            idBairro: bairro.idBairro,
            cep: onlyDigits(enderecoPayload.cep),
            logradouro: normalizeText(enderecoPayload.logradouro),
            numero: normalizeText(enderecoPayload.numero)
        },
        defaults: {
            idBairro: bairro.idBairro,
            cep: onlyDigits(enderecoPayload.cep),
            logradouro: normalizeText(enderecoPayload.logradouro),
            numero: normalizeText(enderecoPayload.numero)
        },
        transaction
    });

    return endereco;
};

const removePassword = (record) => {
    const data = record.toJSON ? record.toJSON() : record;
    const { senha, ...safeData } = data;
    return safeData;
};

module.exports = {
    findOrCreateByName,
    findOrCreateEndereco,
    normalizeText,
    normalizeEmail,
    onlyDigits,
    removePassword,
    validateEndereco
};
