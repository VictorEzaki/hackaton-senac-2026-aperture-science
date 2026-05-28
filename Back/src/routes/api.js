const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/MatchController');
const BuscaInteligenteController = require('../controllers/BuscaInteligenteController');
const { autenticar } = require('../middlewares/AuthMiddleware');

router.get('/match', MatchController.buscarFornecedores);

router.get('/fornecedores/opcoes', MatchController.listarOpcoesFornecedor);
router.get('/fornecedores/catalogo', MatchController.buscarCatalogoFornecedores);
router.post('/fornecedores/busca-inteligente', BuscaInteligenteController.buscar);
router.post('/fornecedores', MatchController.cadastrarFornecedor);
router.post('/fornecedores/login', MatchController.loginFornecedor);
router.get('/fornecedores/:idFornecedor/avaliacoes', MatchController.listarAvaliacoesFornecedor);
router.post('/fornecedores/:idFornecedor/avaliacoes', autenticar, MatchController.avaliarFornecedor);

router.get('/empresas/opcoes', MatchController.listarOpcoesEmpresa);
router.post('/empresas', MatchController.cadastrarEmpresa);
router.post('/empresas/login', MatchController.loginEmpresa);
router.get('/empresas/:idEmpresa/avaliacoes', MatchController.listarAvaliacoesEmpresa);
router.post('/empresas/:idEmpresa/avaliacoes', autenticar, MatchController.avaliarEmpresa);

module.exports = router;
