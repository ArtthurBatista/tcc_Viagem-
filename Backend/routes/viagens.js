const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar pasta de uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar Multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'viagem-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// ================================
// ROTAS DE VIAGENS
// ================================

// 1. GET /viagens - Lista todas as viagens
router.get('/', async (req, res) => {
  try {
    const { cliente_id, status } = req.query;
    let query = 'SELECT * FROM viagens';
    const params = [];
    
    if (cliente_id) {
      query += ' WHERE cliente_id = ?';
      params.push(cliente_id);
      
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
    } else if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY data_criacao DESC';
    
    const rows = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao listar viagens:', error);
    res.status(500).json({ error: error.message });
  }
});

// 2. GET /viagens/:id - Busca uma viagem específica
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await pool.query('SELECT * FROM viagens WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Viagem não encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar viagem:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. POST /viagens - Cria uma nova viagem (com imagem opcional)
router.post('/', upload.single('imagem'), async (req, res) => {
  console.log('📥 Dados recebidos:', req.body);
  console.log('📷 Arquivo:', req.file);
  
  const { cliente_id, destino, origem, data_inicio, data_fim, orcamento, descricao, status } = req.body;
  
  // Validações - apenas campos essenciais
  if (!cliente_id || !destino || !data_inicio || !data_fim) {
    return res.status(400).json({ 
      error: 'Todos os campos são obrigatórios',
      campos_obrigatorios: ['cliente_id', 'destino', 'data_inicio', 'data_fim'],
      campos_recebidos: Object.keys(req.body)
    });
  }
  
  try {
    // URL da imagem (se foi enviada)
    const imagem_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    const result = await pool.query(
      `INSERT INTO viagens 
       (cliente_id, destino, origem, data_inicio, data_fim, orcamento, descricao, imagem_url, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cliente_id, 
        destino, 
        origem, 
        data_inicio, 
        data_fim, 
        orcamento || null, 
        descricao || null, 
        imagem_url,
        status || 'planejada'
      ]
    );
    
    console.log('✅ Viagem criada com sucesso! ID:', result.insertId);
    res.status(201).json({ 
      message: 'Viagem criada com sucesso', 
      viagemId: Number(result.insertId),
      imagem_url: imagem_url
    });
  } catch (error) {
    console.error('❌ Erro ao criar viagem:', error);
    
    // Se deu erro, deletar a imagem que foi enviada
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Erro ao deletar imagem:', err);
      });
    }
    
    res.status(500).json({ error: error.message });
  }
});

// 4. PUT /viagens/:id - Atualiza uma viagem (com imagem opcional)
router.put('/:id', upload.single('imagem'), async (req, res) => {
  const { id } = req.params;
  const { destino, origem, data_inicio, data_fim, orcamento, descricao, status, gasto_total } = req.body;
  
  try {
    // Buscar viagem atual para pegar a imagem antiga
    const viagemAtual = await pool.query('SELECT imagem_url FROM viagens WHERE id = ?', [id]);
    if (viagemAtual.length === 0) {
      return res.status(404).json({ message: 'Viagem não encontrada' });
    }
    
    // Se enviou nova imagem, deletar a antiga
    let imagem_url = viagemAtual[0].imagem_url;
    if (req.file) {
      imagem_url = `/uploads/${req.file.filename}`;
      
      // Deletar imagem antiga
      if (viagemAtual[0].imagem_url) {
        const oldImagePath = path.join(__dirname, '..', viagemAtual[0].imagem_url);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.log('Aviso: não foi possível deletar imagem antiga');
        });
      }
    }
    
    const result = await pool.query(
      `UPDATE viagens 
       SET destino = ?, origem = ?, data_inicio = ?, data_fim = ?, 
           orcamento = ?, descricao = ?, imagem_url = ?, status = ?, gasto_total = ?
       WHERE id = ?`,
      [
        destino, 
        origem, 
        data_inicio, 
        data_fim, 
        orcamento, 
        descricao, 
        imagem_url,
        status || 'planejada',
        gasto_total || 0,
        id
      ]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Viagem não encontrada' });
    }
    
    console.log('✅ Viagem atualizada com sucesso! ID:', id);
    res.json({ 
      message: 'Viagem atualizada com sucesso',
      imagem_url: imagem_url
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar viagem:', error);
    
    // Se deu erro, deletar a nova imagem que foi enviada
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Erro ao deletar imagem:', err);
      });
    }
    
    res.status(500).json({ error: error.message });
  }
});

// 5. DELETE /viagens/:id - Deleta uma viagem
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Buscar imagem antes de deletar
    const viagem = await pool.query('SELECT imagem_url FROM viagens WHERE id = ?', [id]);
    
    const result = await pool.query('DELETE FROM viagens WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Viagem não encontrada' });
    }
    
    // Deletar imagem se existir
    if (viagem.length > 0 && viagem[0].imagem_url) {
      const imagePath = path.join(__dirname, '..', viagem[0].imagem_url);
      fs.unlink(imagePath, (err) => {
        if (err) console.log('Aviso: não foi possível deletar imagem');
      });
    }
    
    console.log('✅ Viagem deletada com sucesso! ID:', id);
    res.json({ message: 'Viagem deletada com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao deletar viagem:', error);
    res.status(500).json({ error: error.message });
  }
});

// 6. PATCH /viagens/:id/imagem - Atualiza apenas a imagem de uma viagem
router.patch('/:id/imagem', upload.single('imagem'), async (req, res) => {
  const { id } = req.params;
  
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
  }
  
  try {
    // Buscar viagem atual
    const viagemAtual = await pool.query('SELECT imagem_url FROM viagens WHERE id = ?', [id]);
    if (viagemAtual.length === 0) {
      // Deletar imagem enviada
      fs.unlink(req.file.path, () => {});
      return res.status(404).json({ message: 'Viagem não encontrada' });
    }
    
    const imagem_url = `/uploads/${req.file.filename}`;
    
    // Atualizar apenas a imagem
    await pool.query('UPDATE viagens SET imagem_url = ? WHERE id = ?', [imagem_url, id]);
    
    // Deletar imagem antiga
    if (viagemAtual[0].imagem_url) {
      const oldImagePath = path.join(__dirname, '..', viagemAtual[0].imagem_url);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.log('Aviso: não foi possível deletar imagem antiga');
      });
    }
    
    console.log('✅ Imagem da viagem atualizada! ID:', id);
    res.json({ 
      message: 'Imagem atualizada com sucesso',
      imagem_url: imagem_url
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar imagem:', error);
    
    // Deletar imagem enviada se deu erro
    fs.unlink(req.file.path, () => {});
    
    res.status(500).json({ error: error.message });
  }
});

// 7. DELETE /viagens/:id/imagem - Remove a imagem de uma viagem
router.delete('/:id/imagem', async (req, res) => {
  const { id } = req.params;
  
  try {
    const viagem = await pool.query('SELECT imagem_url FROM viagens WHERE id = ?', [id]);
    if (viagem.length === 0) {
      return res.status(404).json({ message: 'Viagem não encontrada' });
    }
    
    if (!viagem[0].imagem_url) {
      return res.status(400).json({ message: 'Viagem não possui imagem' });
    }
    
    // Remover imagem do banco
    await pool.query('UPDATE viagens SET imagem_url = NULL WHERE id = ?', [id]);
    
    // Deletar arquivo
    const imagePath = path.join(__dirname, '..', viagem[0].imagem_url);
    fs.unlink(imagePath, (err) => {
      if (err) console.log('Aviso: não foi possível deletar arquivo da imagem');
    });
    
    console.log('✅ Imagem removida! ID:', id);
    res.json({ message: 'Imagem removida com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao remover imagem:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
