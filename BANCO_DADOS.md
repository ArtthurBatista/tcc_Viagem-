# 📚 Guia Completo: Conectar Backend ao MariaDB (HeidiSQL)

## 🎯 Objetivo
Conectar sua aplicação Node.js/Express com o banco de dados MariaDB através do HeidiSQL.

---

## ✅ Passo 1: Configurar HeidiSQL e Criar o Banco de Dados

### 1.1 Abrir HeidiSQL
1. Inicie o **HeidiSQL**
2. Clique em **"New"** para criar uma nova conexão
3. Configure:
   - **Hostname**: `localhost`
   - **User**: `root`
   - **Password**: `1234` (ou sua senha)
   - **Port**: `3306`
4. Clique em **"Open"**

### 1.2 Criar o Banco de Dados
No painel esquerdo, clique com botão direito em **"Databases"** e selecione **"Create new"** > **"Database"**

```sql
CREATE DATABASE tcc_viagem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 📋 Passo 2: Criar as Tabelas Necessárias

Cole este script SQL no HeidiSQL para criar as tabelas:

```sql
-- Banco: tcc_viagem
USE tcc_viagem;

-- Tabela de Usuários/Clientes
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  endereco VARCHAR(255),
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Viagens
CREATE TABLE viagens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  destino VARCHAR(100) NOT NULL,
  origem VARCHAR(100) NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  orcamento DECIMAL(10, 2),
  gasto_total DECIMAL(10, 2) DEFAULT 0,
  descricao TEXT,
  status ENUM('planejada', 'em_progresso', 'concluida', 'cancelada') DEFAULT 'planejada',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Despesas
CREATE TABLE despesas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  viagem_id INT NOT NULL,
  cliente_id INT NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  descricao VARCHAR(255),
  valor DECIMAL(10, 2) NOT NULL,
  data_despesa DATE NOT NULL,
  metodo_pagamento ENUM('dinheiro', 'cartao_credito', 'cartao_debito', 'pix', 'outro') DEFAULT 'cartao_credito',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (viagem_id) REFERENCES viagens(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Itinerário/Atividades
CREATE TABLE atividades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  viagem_id INT NOT NULL,
  titulo VARCHAR(100) NOT NULL,
  descricao TEXT,
  data_atividade DATE NOT NULL,
  hora_inicio TIME,
  hora_fim TIME,
  local VARCHAR(255),
  status ENUM('planejada', 'em_progresso', 'concluida', 'cancelada') DEFAULT 'planejada',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (viagem_id) REFERENCES viagens(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Lista de Compras
CREATE TABLE lista_compras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  viagem_id INT NOT NULL,
  cliente_id INT NOT NULL,
  item VARCHAR(100) NOT NULL,
  quantidade INT DEFAULT 1,
  concluido BOOLEAN DEFAULT 0,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (viagem_id) REFERENCES viagens(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para melhor performance
CREATE INDEX idx_cliente_viagens ON viagens(cliente_id);
CREATE INDEX idx_viagem_despesas ON despesas(viagem_id);
CREATE INDEX idx_cliente_despesas ON despesas(cliente_id);
CREATE INDEX idx_viagem_atividades ON atividades(viagem_id);
CREATE INDEX idx_viagem_lista ON lista_compras(viagem_id);
```

---

## 🔧 Passo 3: Configurar o Arquivo db.js

Atualize o arquivo `Backend/db.js` para usar variáveis de ambiente:

```javascript
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
});

// Testar conexão
pool.getConnection()
  .then(conn => {
    console.log('✅ Conectado ao MariaDB com sucesso!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao MariaDB:', err.message);
  });

module.exports = pool;
```

---

## 📝 Passo 4: Criar o Arquivo .env

Crie o arquivo `Backend/.env`:

```
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=tcc_viagem
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

---

## ✔️ Passo 5: Atualizar server.js para usar variáveis de ambiente

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

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

// Rota de teste de conexão
app.get('/test-connection', async (req, res) => {
  try {
    const pool = require('./db');
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT 1');
    conn.release();
    res.json({ message: '✅ Conexão com banco de dados OK', result });
  } catch (error) {
    res.status(500).json({ error: '❌ Erro na conexão', message: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server funcionando em http://localhost:${port}`);
  console.log(`📍 API de clientes em http://localhost:${port}/clients`);
  console.log(`🧪 Teste de conexão em http://localhost:${port}/test-connection`);
});

module.exports = app;
```

---

## 🧪 Passo 6: Testar a Conexão

### 6.1 Iniciar o Backend
```bash
cd Backend
npm run dev
```

### 6.2 Testar a Conexão via Browser
Abra seu navegador e acesse:
```
http://localhost:3000/test-connection
```

Você deve ver uma resposta como:
```json
{
  "message": "✅ Conexão com banco de dados OK",
  "result": [1]
}
```

### 6.3 Testar com Postman/Insomnia
- **GET**: `http://localhost:3000/clients` - Listar clientes
- **POST**: `http://localhost:3000/clients/register` - Registrar novo cliente
- **POST**: `http://localhost:3000/clients/login` - Fazer login

---

## 🔗 Verificar no HeidiSQL

### Ver os dados inseridos:
1. No HeidiSQL, selecione o banco `tcc_viagem`
2. Navegue até a tabela `clientes`
3. Clique em **"Select all"** ou escreva:

```sql
SELECT * FROM clientes;
SELECT * FROM viagens;
SELECT * FROM despesas;
```

---

## ⚠️ Troubleshooting

### Problema: "ECONNREFUSED - Connection refused"
**Solução:**
- Verifique se o MariaDB está rodando (services do Windows)
- Confirme credenciais em `.env`
- Teste no HeidiSQL se consegue conectar

### Problema: "ER_NO_DB_ERROR - No database selected"
**Solução:**
- Certifique-se que criou o banco `tcc_viagem`
- Verifique se o nome está correto em `.env`

### Problema: "ER_ACCESS_DENIED_ERROR"
**Solução:**
- Verifique user e password em `.env`
- Teste as credenciais no HeidiSQL

### Problema: "ER_TABLE_EXISTS_ERROR"
**Solução:**
- As tabelas já existem, é normal
- Ou use `DROP TABLE IF EXISTS` antes de criar

---

## 📊 Estrutura do Banco Criado

```
tcc_viagem
├── clientes (usuários)
├── viagens (viagens planejadas)
├── despesas (gastos da viagem)
├── atividades (itinerário)
└── lista_compras (coisas para levar)
```

---

## 🚀 Próximos Passos

1. ✅ Criar banco e tabelas no HeidiSQL
2. ✅ Configurar `.env` no Backend
3. ✅ Testar conexão em `http://localhost:3000/test-connection`
4. ⬜ Implementar rotas CRUD completas
5. ⬜ Integrar com Frontend
6. ⬜ Adicionar autenticação JWT

---

## 📚 Recursos

- [MariaDB Documentation](https://mariadb.com/docs/)
- [HeidiSQL Tutorial](https://www.heidisql.com/)
- [Express.js + MariaDB](https://github.com/mariadb-corporation/mariadb-connector-nodejs)

---

Está pronto! Agora você tem um backend conectado ao MariaDB! 🎉
