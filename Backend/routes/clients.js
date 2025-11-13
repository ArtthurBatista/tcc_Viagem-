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
  console.log('📥 Dados recebidos:', req.body);
  const { nome, email, password } = req.body;
  
  if (!nome || !email || !password) {
    console.log('❌ Campos faltando:', { nome, email, password: password ? '***' : undefined });
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  // Validar formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('❌ Email inválido:', email);
    return res.status(400).json({ 
      error: 'Por favor, insira um email válido (exemplo: usuario@email.com)' 
    });
  }

  // Validar senha mínima
  if (password.length < 6) {
    console.log('❌ Senha muito curta');
    return res.status(400).json({ 
      error: 'A senha deve ter pelo menos 6 caracteres' 
    });
  }

  try {
    console.log('🔐 Gerando hash da senha...');
    const hashedPassword = await bcrypt.hash(password, 10);  // Hashea a senha
    
    console.log('💾 Inserindo no banco de dados...');
    const result = await pool.query(
      'INSERT INTO clientes (nome, email, password) VALUES (?, ?, ?)',
      [nome, email, hashedPassword]
    );
    
    console.log('✅ Client cadastrado com sucesso! ID:', result.insertId);
    // mariadb retorna um objeto com insertId/affectedRows em result
    res.status(201).json({ 
      message: 'Client cadastrado com sucesso', 
      clientId: Number(result.insertId) 
    });
  } catch (error) {
    console.error('❌ Erro ao registrar:', error);
    
    // Verificar se é erro de email duplicado
    if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('email')) {
      return res.status(409).json({ 
        error: 'Este email já está cadastrado. Por favor, use outro email ou faça login.' 
      });
    }
    
    res.status(500).json({ error: error.message });
  }
});

// 4. POST /login - Faz login para clientes (para a página de login)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  try {
    const rows = await pool.query('SELECT * FROM clientes WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const client = rows[0];
    const match = await bcrypt.compare(password, client.password);  // Compara a senha hasheada
    if (!match) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    res.json({ 
      message: 'Login bem-sucedido', 
      clientId: client.id,
      id: client.id,
      nome: client.nome,
      email: client.email
    });
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