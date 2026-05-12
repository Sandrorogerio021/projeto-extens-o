// backend/server.js
const express = require('express');
const cors = require('cors');
const knex = require('knex')({
  client: 'sqlite3',
  connection: { filename: "./database.sqlite" },
  useNullAsDefault: true
});

const app = express();
app.use(cors());
app.use(express.json());

// Criar Tabelas ao Iniciar
async function initDB() {
  if (!await knex.schema.hasTable('usuarios')) {
    await knex.schema.createTable('usuarios', t => {
      t.increments('id');
      t.string('nome');
      t.string('role'); // 'aluno' ou 'professor'
      t.string('senha'); // professor
      t.integer('idade'); // aluno
    });
  }
  if (!await knex.schema.hasTable('respostas')) {
    await knex.schema.createTable('respostas', t => {
      t.increments('id');
      t.integer('aluno_id');
      t.string('pergunta');
      t.string('resposta_dada');
      t.boolean('correta');
      t.timestamp('data').defaultTo(knex.fn.now());
    });
  }
}
initDB();

// Rotas
app.post('/cadastro', async (req, res) => {
  const [id] = await knex('usuarios').insert(req.body);
  res.json({ id });
});

app.post('/login', async (req, res) => {
  const { nome, senha, idade, role } = req.body;
  const user = await knex('usuarios').where({ nome, role }).first();
  if (!user) return res.status(404).json("Não encontrado");
  if (role === 'professor' && user.senha !== senha) return res.status(401).json("Senha incorreta");
  res.json(user);
});

app.post('/respostas', async (req, res) => {
  await knex('respostas').insert(req.body);
  res.json("Salvo!");
});

app.get('/admin/relatorio', async (req, res) => {
  const dados = await knex('respostas')
    .join('usuarios', 'respostas.aluno_id', 'usuarios.id')
    .select('usuarios.nome', 'respostas.*');
  res.json(dados);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});