require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

// Fix para BigInt serialization
BigInt.prototype.toJSON = function() { return this.toString() };

// Middleware
app.use(cors());
app.use(express.json());

// Suas rotas existentes
const clientsRoutes = require('./routes/clients');
app.use('/clients', clientsRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({ message: 'Servidor de API funcionando' });
});

// Rota de teste de conexão com o banco de dados
app.get('/test-connection', async (req, res) => {
  try {
    const pool = require('./db');
    const dbMode = pool.getDbMode ? pool.getDbMode() : 'unknown';
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT 1 as test');
    conn.release();
    res.json({ 
      message: '✅ Conexão com banco de dados OK', 
      mode: dbMode === 'mariadb' ? 'MariaDB' : 'Memória (Fallback)',
      result,
      database: process.env.DB_NAME || 'em memória'
    });
  } catch (error) {
    res.status(500).json({ 
      error: '❌ Erro na conexão', 
      message: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server funcionando em http://localhost:${port}`);
  console.log(`📍 API de clientes em http://localhost:${port}/clients`);
  console.log(`🧪 Teste de conexão em http://localhost:${port}/test-connection`);
});

module.exports = app;