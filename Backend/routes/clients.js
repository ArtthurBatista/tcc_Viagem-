const express = require('express');
const router = express.Router();
const pool = require('../db');  // Sua conexão com o MariaDB
const bcrypt = require('bcrypt');  // Para hashear senhas
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar pasta de uploads para fotos de perfil
const uploadDir = path.join(__dirname, '..', 'uploads', 'perfil');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar Multer para upload de fotos de perfil
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'perfil-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|heic|heif|avif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test((file.mimetype || '').toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp, heic, heif, avif)'));
    }
  }
});

// 1. GET /clientes - Lista todos os clientes
router.get('/', async (req, res) => {
  try {
    // mariadb.pool.query retorna um array de linhas diretamente (não [rows, fields])
    const rows = await pool.query('SELECT id, nome, email, foto_perfil FROM clientes');  // Seleciona sem a senha por segurança
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET /clientes/:id - Busca um client específico
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await pool.query('SELECT id, nome, email, foto_perfil FROM clientes WHERE id = ?', [id]);
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
  const { usuario, email, password } = req.body;
  
  if (!usuario || !email || !password) {
    console.log('❌ Campos faltando:', { usuario, email, password: password ? '***' : undefined });
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
      'INSERT INTO clientes (nome, email, password, foto_perfil) VALUES (?, ?, ?, ?)',
      [usuario, email, hashedPassword, null]
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
  console.log('🔐 Tentativa de login:', req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    console.log('❌ Campos faltando');
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  try {
    console.log('🔍 Buscando usuário:', email);
    const rows = await pool.query('SELECT * FROM clientes WHERE email = ?', [email]);
    console.log('📊 Resultado da busca:', rows.length, 'usuário(s) encontrado(s)');
    
    if (rows.length === 0) {
      console.log('❌ Usuário não encontrado');
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const client = rows[0];
    console.log('👤 Cliente encontrado:', { id: client.id, nome: client.nome, email: client.email });
    
    const match = await bcrypt.compare(password, client.password);  // Compara a senha hasheada
    console.log('🔑 Senha válida?', match);
    
    if (!match) {
      console.log('❌ Senha incorreta');
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    console.log('✅ Login bem-sucedido!');
    res.json({ 
      message: 'Login bem-sucedido', 
      clientId: client.id,
      id: client.id,
      nome: client.nome,
      email: client.email,
      foto_perfil: client.foto_perfil
    });
  } catch (error) {
    console.error('❌ Erro no login:', error);
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

// 7. PUT /clientes/:id/foto - Upload de foto de perfil
// Tratamento explícito de erros do Multer (tipo/limite)
router.put('/:id/foto', (req, res, next) => {
  upload.single('foto')(req, res, function (err) {
    if (err) {
      if (err.message && err.message.includes('Apenas imagens')) {
        return res.status(400).json({ error: err.message });
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'Arquivo muito grande. Máximo 10MB.' });
      }
      console.error('Erro no upload da foto:', err);
      return res.status(400).json({ error: 'Falha no upload da foto.' });
    }
    next();
  });
}, async (req, res) => {
  const { id } = req.params;
  
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhuma foto foi enviada' });
  }
  
  try {
    // Buscar cliente atual para deletar foto antiga
    const clienteAtual = await pool.query('SELECT foto_perfil FROM clientes WHERE id = ?', [id]);
    
    if (clienteAtual.length === 0) {
      // Deletar arquivo enviado se cliente não existir
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    // Deletar foto antiga se existir (caminho relativo a Backend/)
    if (clienteAtual[0].foto_perfil) {
      const rel = clienteAtual[0].foto_perfil.replace(/^[/\\]+/, '');
      const oldPhotoPath = path.join(__dirname, '..', rel);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }
    
    // Atualizar com nova foto
    const foto_perfil = `/uploads/perfil/${req.file.filename}`;
    await pool.query('UPDATE clientes SET foto_perfil = ? WHERE id = ?', [foto_perfil, id]);
    
    res.json({ 
      message: 'Foto de perfil atualizada com sucesso',
      foto_perfil: foto_perfil
    });
  } catch (error) {
    // Deletar arquivo em caso de erro
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Erro ao atualizar foto de perfil:', error);
    res.status(500).json({ error: error.message });
  }
});

// 8. DELETE /clientes/:id/foto - Remove foto de perfil
router.delete('/:id/foto', async (req, res) => {
  const { id } = req.params;
  
  try {
    const cliente = await pool.query('SELECT foto_perfil FROM clientes WHERE id = ?', [id]);
    
    if (cliente.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    // Deletar arquivo de foto se existir
    if (cliente[0].foto_perfil) {
      const photoPath = path.join(__dirname, '..', cliente[0].foto_perfil);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    
    // Remover referência do banco
    await pool.query('UPDATE clientes SET foto_perfil = NULL WHERE id = ?', [id]);
    
    res.json({ message: 'Foto de perfil removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover foto de perfil:', error);
    res.status(500).json({ error: error.message });
  }
});


// 9. POST /forgot-password - Recuperação de senha
router.post('/forgot-password', async (req, res) => {
  const { email, usuario, novaSenha } = req.body;
  if (!email || !usuario || !novaSenha) {
    return res.status(400).json({ error: 'Preencha email, usuário e nova senha.' });
  }
  try {
    // Verifica se existe cliente com email e usuario
    const rows = await pool.query('SELECT id FROM clientes WHERE email = ? AND nome = ?', [email, usuario]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário ou email não encontrados.' });
    }
    // Atualiza senha
    const hashedPassword = await bcrypt.hash(novaSenha, 10);
    await pool.query('UPDATE clientes SET password = ? WHERE id = ?', [hashedPassword, rows[0].id]);
    res.json({ message: 'Senha atualizada com sucesso.' });
  } catch (err) {
    console.error('Erro ao recuperar senha:', err);
    res.status(500).json({ error: 'Erro interno ao recuperar senha.' });
  }
});

module.exports = router;