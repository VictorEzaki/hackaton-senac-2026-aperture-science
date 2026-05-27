const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/MatchController');

router.get('/match', MatchController.buscarFornecedores);

router.post('/fornecedores', MatchController.cadastrarFornecedor);

module.exports = router;