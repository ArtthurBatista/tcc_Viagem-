const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'tcc_viagem',
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10,
  waitForConnections: true,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
  acquireTimeout: 30000,    // 30 segundos para adquirir conexão
  idleTimeout: 60000,       // 60 segundos timeout de inatividade
});

// Testar conexão ao iniciar
pool.getConnection()
  .then(conn => {
    console.log('✅ Conectado ao MariaDB com sucesso!');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Database: ${process.env.DB_NAME || 'tcc_viagem'}`);
    conn.release();
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao MariaDB:', err.message);
    console.error('   Verifique suas credenciais em .env');
  });

module.exports = pool;