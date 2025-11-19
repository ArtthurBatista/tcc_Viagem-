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
    this.viagens = [];
    this.nextClientId = 1;
    this.nextViagemId = 1;
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      const dataPath = path.join(__dirname, 'data.json');
      if (fs.existsSync(dataPath)) {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        this.clients = data.clients || [];
        this.viagens = data.viagens || [];
        this.nextClientId = data.nextClientId || 1;
        this.nextViagemId = data.nextViagemId || 1;
        console.log(`💾 Dados carregados de data.json (${this.clients.length} clientes, ${this.viagens.length} viagens)`);
      }
    } catch (err) {
      console.error('⚠️  Erro ao carregar data.json:', err.message);
    }
  }

  saveToFile() {
    try {
      const dataPath = path.join(__dirname, 'data.json');
      fs.writeFileSync(dataPath, JSON.stringify({ 
        clients: this.clients, 
        viagens: this.viagens,
        nextClientId: this.nextClientId,
        nextViagemId: this.nextViagemId
      }, null, 2));
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
      
      // Viagens
      if (sqlLower.includes('from viagens')) {
        if (sqlLower.includes('count(*)')) return [{ total: this.viagens.length }];
        if (sqlLower.includes('where id =')) {
          const id = params[0];
          return this.viagens.filter(v => v.id === Number(id));
        }
        if (sqlLower.includes('where cliente_id =')) {
          const cliente_id = params[0];
          let filtered = this.viagens.filter(v => v.cliente_id === Number(cliente_id));
          if (params.length > 1 && sqlLower.includes('and status =')) {
            filtered = filtered.filter(v => v.status === params[1]);
          }
          return filtered;
        }
        if (sqlLower.includes('where status =')) {
          const status = params[0];
          return this.viagens.filter(v => v.status === status);
        }
        return this.viagens;
      }
      
      // Clientes
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
      // Viagens
      if (sqlLower.includes('into viagens')) {
        const [cliente_id, destino, origem, data_inicio, data_fim, orcamento, descricao, imagem_url, status] = params;
        const newViagem = { 
          id: this.nextViagemId++,
          cliente_id: Number(cliente_id),
          destino,
          origem,
          data_inicio,
          data_fim,
          orcamento: orcamento ? Number(orcamento) : null,
          gasto_total: 0,
          descricao,
          imagem_url,
          status: status || 'planejada',
          data_criacao: new Date().toISOString()
        };
        this.viagens.push(newViagem);
        this.saveToFile();
        return { insertId: BigInt(newViagem.id), affectedRows: 1 };
      }
      
      // Clientes
      const [nome, email, password, foto_perfil] = params;
      const newClient = { id: this.nextClientId++, nome, email, password, foto_perfil: foto_perfil || null };
      this.clients.push(newClient);
      this.saveToFile();
      return { insertId: BigInt(newClient.id), affectedRows: 1 };
    }

    // UPDATE
    if (sqlLower.startsWith('update')) {
      // Viagens
      if (sqlLower.includes('viagens')) {
        const id = params[params.length - 1];
        const idx = this.viagens.findIndex(v => v.id === Number(id));
        if (idx !== -1) {
          if (sqlLower.includes('set imagem_url =') && params.length === 2) {
            // Atualizar apenas imagem
            this.viagens[idx].imagem_url = params[0];
          } else if (params.length === 9) {
            // Atualizar viagem completa
            this.viagens[idx].destino = params[0];
            this.viagens[idx].origem = params[1];
            this.viagens[idx].data_inicio = params[2];
            this.viagens[idx].data_fim = params[3];
            this.viagens[idx].orcamento = params[4] ? Number(params[4]) : null;
            this.viagens[idx].descricao = params[5];
            this.viagens[idx].imagem_url = params[6];
            this.viagens[idx].status = params[7] || 'planejada';
            this.viagens[idx].gasto_total = params[8] ? Number(params[8]) : 0;
          }
          this.saveToFile();
          return { affectedRows: 1 };
        }
        return { affectedRows: 0 };
      }
      
      // Clientes
      const id = params[params.length - 1];
      const idx = this.clients.findIndex(c => c.id === Number(id));
      if (idx !== -1) {
        if (params.length === 2 && sqlLower.includes('set foto_perfil')) {
          // Atualizar apenas foto
          this.clients[idx].foto_perfil = params[0];
        } else if (params.length === 3) {
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
      // Viagens
      if (sqlLower.includes('from viagens')) {
        const id = params[0];
        const before = this.viagens.length;
        this.viagens = this.viagens.filter(v => v.id !== Number(id));
        const affected = before - this.viagens.length;
        if (affected > 0) this.saveToFile();
        return { affectedRows: affected };
      }
      
      // Clientes
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
    database: process.env.DB_NAME || 'clients_orders_system',
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
      console.log(`   Database: ${process.env.DB_NAME || 'clients_orders_system'}`);
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

// Exporta MariaDB se disponível, senão usa memória
module.exports = pool || memoryDB;