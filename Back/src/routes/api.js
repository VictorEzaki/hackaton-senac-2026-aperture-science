const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/MatchController');
const EmpresaController = require('../controllers/EmpresaController');

router.get('/match', MatchController.buscarFornecedores);

router.post('/fornecedores', MatchController.cadastrarFornecedor);

router.post('/empresas', EmpresaController.cadastrarEmpresa);

module.exports = router;