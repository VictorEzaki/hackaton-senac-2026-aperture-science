const express = require('express');
const { sequelize } = require('./src/models'); // Ele puxa o index.js que criamos automaticamente
const apiRoutes = require('./src/routes/api');

const app = express();
app.use(express.json());

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: process.env.DB_SYNC_ALTER === 'true' }).then(() => {
    app.listen(PORT, () => {
        console.log(`API Supply Hub rodando na porta ${PORT}!`);
    });
}).catch(err => console.log('Erro ao conectar com o banco:', err));
