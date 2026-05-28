const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supply-hub-dev-secret';

const autenticar = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const [, token] = authHeader.split(' ');

    if (!token) {
        return res.status(401).json({
            sucesso: false,
            erro: 'Token de autenticação não informado.'
        });
    }

    try {
        req.usuario = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({
            sucesso: false,
            erro: 'Token inválido ou expirado.'
        });
    }
};

module.exports = { autenticar };
