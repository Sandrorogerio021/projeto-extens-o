const express = require('express');
const cors = require('cors');
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./database.sqlite"
    },
    useNullAsDefault: true
});

const app = express();
app.use(cors());
app.use(express.json());

const path = require('path');

app.use(express.static(path.join(__dirname, 'dist')));

app.all(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


async function initDB() {
    try {
        const hasTable = await knex.schema.hasTable('respostas');
        if (!hasTable) {
            await knex.schema.createTable('respostas', t => {
                t.increments('id').primary(); 
                t.string('pergunta');
                t.string('resposta_dada');
                t.boolean('correta');
                t.timestamp('data').defaultTo(knex.fn.now());
            });
            console.log("Tabela 'respostas' criada com sucesso!");
        }

        
        const hasUsersTable = await knex.schema.hasTable('usuarios');
        if (!hasUsersTable) {
            await knex.schema.createTable('usuarios', t => {
                t.increments('id').primary();
                t.string('nome');
                t.string('senha');
                t.string('role');
                t.integer('idade');
            });
            console.log("Tabela 'usuarios' criada com sucesso!");
        }
    } catch (error) {
        console.error("Erro ao inicializar banco de dados:", error);
    }
}

initDB();

// --- Rotas ---

app.post('/cadastro', async (req, res) => {
    try {
        const [id] = await knex('usuarios').insert(req.body);
        res.json({ id });
    } catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar usuário" });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { nome, senha, role } = req.body;
        const user = await knex('usuarios').where({ nome, role }).first();
        
        if (!user) return res.status(404).json("Não encontrado");
        if (user.senha !== senha) return res.status(401).json("Senha incorreta");
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Erro no login" });
    }
});

app.post('/respostas', async (req, res) => {
    try {
        await knex('respostas').insert(req.body);
        res.json("Salvo!");
    } catch (error) {
        res.status(500).json({ error: "Erro ao salvar resposta" });
    }
});

app.get('/admin/relatorio', async (req, res) => {
    try {
        const dados = await knex('respostas')
            .join('usuarios', 'respostas.aluno_id', 'usuarios.id')
            .select('usuarios.nome', 'respostas.*');
        res.json(dados);
    } catch (error) {
        res.status(500).json({ error: "Erro ao gerar relatório" });
    }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});