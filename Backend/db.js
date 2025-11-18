const mariadb = require('mariadb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Flag para forçar uso de memória (pode ser definida no .env)
const USE_MEMORY_DB = process.env.USE_MEMORY_DB === 'true';
let dbMode = 'unknown';

// Simulação de banco em memória
class InMemoryDB {
  constructor() {
    this.clients = [];
    this.nextId = 1;
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      const dataPath = path.join(__dirname, 'data.json');
      if (fs.existsSync(dataPath)) {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        this.clients = data.clients || [];
        this.nextId = data.nextId || 1;
        console.log(`💾 Dados carregados de data.json (${this.clients.length} clientes)`);
      }
    } catch (err) {
      console.error('⚠️  Erro ao carregar data.json:', err.message);
    }
  }

  saveToFile() {
    try {
      const dataPath = path.join(__dirname, 'data.json');
      fs.writeFileSync(dataPath, JSON.stringify({ clients: this.clients, nextId: this.nextId }, null, 2));
    } catch (err) {
      console.error('⚠️  Erro ao salvar data.json:', err.message);
    }
  }

  async query(sql, params = []) {
    // Simula queries do MariaDB
    const sqlLower = sql.toLowerCase().trim();

    // SELECT
    if (sqlLower.startsWith('select')) {
      if (sqlLower.includes('select 1')) return [{ test: 1 }];
      if (sqlLower.includes('count(*)')) return [{ total: this.clients.length }];
      if (sqlLower.includes('where id =')) {
        const id = params[0];
        return this.clients.filter(c => c.id === Number(id));
      }
      if (sqlLower.includes('where email =')) {
        const email = params[0];
        return this.clients.filter(c => c.email === email);
      }
      return this.clients;
    }

    // INSERT
    if (sqlLower.startsWith('insert')) {
      const [nome, email, password] = params;
      const newClient = { id: this.nextId++, nome, email, password };
      this.clients.push(newClient);
      this.saveToFile();
      return { insertId: BigInt(newClient.id), affectedRows: 1 };
    }

    // UPDATE
    if (sqlLower.startsWith('update')) {
      const id = params[params.length - 1];
      const idx = this.clients.findIndex(c => c.id === Number(id));
      if (idx !== -1) {
        if (params.length === 3) {
          this.clients[idx].nome = params[0];
          this.clients[idx].email = params[1];
        } else if (params.length === 4) {
          this.clients[idx].nome = params[0];
          this.clients[idx].email = params[1];
          this.clients[idx].password = params[2];
        }
        this.saveToFile();
        return { affectedRows: 1 };
      }
      return { affectedRows: 0 };
    }

    // DELETE
    if (sqlLower.startsWith('delete')) {
      const id = params[0];
      const before = this.clients.length;
      this.clients = this.clients.filter(c => c.id !== Number(id));
      const affected = before - this.clients.length;
      if (affected > 0) this.saveToFile();
      return { affectedRows: affected };
    }

    return [];
  }

  async getConnection() {
    return {
      query: this.query.bind(this),
      release: () => {}
    };
  }
}

const memoryDB = new InMemoryDB();

// Tentar conectar ao MariaDB
let pool = null;

if (!USE_MEMORY_DB) {
  pool = mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'tcc_viagem',
    port: process.env.DB_PORT || 3306,
    connectionLimit: 10,
    waitForConnections: true,
    enableKeepAlive: true,
    keepAliveInitialDelayMs: 0,
    acquireTimeout: 30000,
    idleTimeout: 60000,
  });

  // Testar conexão ao iniciar
  pool.getConnection()
    .then(conn => {
      console.log('✅ Conectado ao MariaDB com sucesso!');
      console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
      console.log(`   Database: ${process.env.DB_NAME || 'tcc_viagem'}`);
      dbMode = 'mariadb';
      conn.release();
    })
    .catch(err => {
      console.warn('⚠️  MariaDB não disponível:', err.message);
      console.log('💾 Usando banco de dados em memória (fallback)');
      dbMode = 'memory';
      pool = null;
    });
} else {
  console.log('💾 Modo memória ativado via USE_MEMORY_DB=true');
  dbMode = 'memory';
}

// Exporta pool híbrido que usa MariaDB ou memória
module.exports = new Proxy({}, {
  get(target, prop) {
    if (prop === 'getDbMode') return () => dbMode;
    if (pool && dbMode === 'mariadb') return pool[prop];
    return memoryDB[prop];
  }
});