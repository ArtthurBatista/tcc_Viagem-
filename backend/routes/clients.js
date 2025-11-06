const express = require('express');
const router = express.Router();
const pool = require('../db');  // Sua conexão com o MariaDB
const bcrypt = require('bcrypt');  // Para hashear senhas

// 1. GET /clientes - Lista todos os clientes
router.get('/', async (req, res) => {
  try {
    // mariadb.pool.query retorna um array de linhas diretamente (não [rows, fields])
    const rows = await pool.query('SELECT id, nome, email FROM clientes');  // Seleciona sem a senha por segurança
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET /clientes/:id - Busca um client específico
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await pool.query('SELECT id, nome, email FROM clientes WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Client não encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. POST /register - Cadastra um novo client (para a página de cadastro)
router.post('/register', async (req, res) => {
  const { nome, email, password } = req.body;
  if (!nome || !email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);  // Hashea a senha
    const result = await pool.query(
      'INSERT INTO clientes (nome, email, password) VALUES (?, ?, ?)',
      [nome, email, hashedPassword]
    );
    // mariadb retorna um objeto com insertId/affectedRows em result
    res.status(201).json({ message: 'Client cadastrado com sucesso', clientId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. POST /login - Faz login para clientes (para a página de login)
router.post('/login', async (req, res) => {
  const { nome, password } = req.body;
  if (!nome || !password) {
    return res.status(400).json({ message: 'nome e senha são obrigatórios' });
  }

  try {
    const rows = await pool.query('SELECT * FROM clientes WHERE nome = ?', [nome]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const client = rows[0];
    const match = await bcrypt.compare(password, client.password);  // Compara a senha hasheada
    if (!match) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    res.json({ message: 'Login bem-sucedido', clientId: client.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. PUT /clientes/:id - Atualiza um client
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, password } = req.body;

  try {
    let updateQuery = 'UPDATE clientes SET nome = ?, email = ?';
    const params = [nome, email];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ', password = ?';
      params.push(hashedPassword);
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    const result = await pool.query(updateQuery, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Client não encontrado' });
    }
    res.json({ message: 'Client atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. DELETE /clientes/:id - Deleta um client
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM clientes WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Client não encontrado' });
    }
    res.json({ message: 'Client deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;