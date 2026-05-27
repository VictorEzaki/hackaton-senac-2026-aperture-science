const sequelize = require('./src/config/database');
const Fornecedor = require('./src/models/Fornecedor');

const seedDatabase = async () => {
    try {
        console.log("Conectando ao banco para limpar e alimentar os dados...");
        
        // force: true deleta a tabela existente e recria do zero (ótimo para limpar testes)
        await sequelize.sync({ force: true }); 

        // Inserindo dados baseados nos cenários de teste do seu README
        await Fornecedor.bulkCreate([
            {
                nome: "EcoEmbalagens Catarinense",
                categoria: "embalagens",
                localizacao: "Joinville, SC",
                praticas_esg: true, // Sustentável
                prazo_medio_dias: 2, // Entrega rápida
                nota_media: 4.9, // Alta reputação
                capacidade_atendimento: "Alta"
            },
            {
                nome: "GreenPack Litoral",
                categoria: "embalagens",
                localizacao: "Florianópolis, SC",
                praticas_esg: true, // Sustentável
                prazo_medio_dias: 1, // Entrega super rápida
                nota_media: 4.7, // Alta reputação
                capacidade_atendimento: "Média"
            },
            {
                nome: "Plásticos Industriais Vale",
                categoria: "embalagens",
                localizacao: "Blumenau, SC",
                praticas_esg: false, // Não sustentável
                prazo_medio_dias: 6,
                nota_media: 3.8,
                capacidade_atendimento: "Alta"
            },
            {
                nome: "TechSupri Distribuidora",
                categoria: "tecnologia",
                localizacao: "Joinville, SC",
                praticas_esg: false,
                prazo_medio_dias: 3,
                nota_media: 4.5,
                capacidade_atendimento: "Pequena"
            }
        ]);

        console.log("✅ Banco de dados alimentado com sucesso para o Hackaton!");
        process.exit(0); // Fecha o script após finalizar
    } catch (error) {
        console.error("❌ Erro ao alimentar o banco de dados:", error);
        process.exit(1);
    }
};

seedDatabase();