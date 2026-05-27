const express = require('express');
const { sequelize } = require('./src/models'); // Ele puxa o index.js que criamos automaticamente
const apiRoutes = require('./src/routes/api');

const app = express();
app.use(express.json());

app.use('/api', apiRoutes);

// O force: true garante que o MySQL vai apagar as tabelas velhas e criar as 11 novas exatamente como no seu DER.
// DICA: Após rodar a primeira vez e ver as tabelas criadas no banco, mude para force: false para não perder os dados.
sequelize.sync({ force: true }).then(() => {
    app.listen(3000, () => {
        console.log('API Aperture Science rodando na porta 3000 com o novo Banco de Dados!');
    });
}).catch(err => console.log('Erro ao conectar com o banco:', err));