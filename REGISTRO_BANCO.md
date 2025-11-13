# 📱 GUIA: Registrar Usuário no Banco de Dados

## ✅ O que foi feito

Agora quando você registra ou faz login no site, os dados vão **diretamente para o banco de dados MariaDB**!

---

## 🔄 Fluxo de Registro

```
┌────────────────────────────────────┐
│  Usuário preenche formulário       │
│  Nome, Email, Senha                │
└──────────────┬──────────────────────┘
               │
               ↓ Clica em "Criar Conta"
┌────────────────────────────────────┐
│  Frontend (login.jsx)              │
│  - Valida dados (senha 6+ chars)   │
│  - Chama api.register()            │
└──────────────┬──────────────────────┘
               │
               ↓ HTTP POST
    POST /clients/register
    Body: { nome, email, password }
               │
┌──────────────V──────────────────────┐
│  Backend (clients.js)              │
│  - Recebe dados                    │
│  - Hash a senha com bcrypt         │
│  - Insere na tabela clientes       │
└──────────────┬──────────────────────┘
               │
               ↓ SQL INSERT
    INSERT INTO clientes 
    (nome, email, password) 
    VALUES (?, ?, ?)
               │
┌──────────────V──────────────────────┐
│  MariaDB                           │
│  Tabela: clientes                  │
│  Salva: id, nome, email, password  │
└──────────────┬──────────────────────┘
               │
               ↓ Retorna JSON
    { message: "...", clientId: 1 }
               │
┌──────────────V──────────────────────┐
│  Frontend                          │
│  - Mostra mensagem de sucesso      │
│  - Redireciona para login          │
│  - Limpa formulário                │
└────────────────────────────────────┘
```

---

## 📝 Arquivos Atualizados

### **1. Frontend - login.jsx** ✅ ATUALIZADO

```jsx
import { api } from "../../services/api"

const handleSubmit = async (e) => {
  e.preventDefault()
  
  if (isSignUp) {
    // Registrar novo usuário
    const response = await api.register({
      nome,
      email,
      password,
    })
    // Sucesso! Dados salvos no banco
    alert("✅ Cadastro realizado com sucesso!")
  } else {
    // Fazer login
    const response = await api.login(email, password)
    // Sucesso! Usuário autenticado
    localStorage.setItem("currentUser", JSON.stringify(userData))
  }
}
```

### **2. Backend - clients.js** ✅ ATUALIZADO

**POST /clients/register** - Registra novo usuário
```javascript
router.post('/register', async (req, res) => {
  const { nome, email, password } = req.body;
  
  // Hash a senha com bcrypt (seguro!)
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Insere no banco de dados
  const result = await pool.query(
    'INSERT INTO clientes (nome, email, password) VALUES (?, ?, ?)',
    [nome, email, hashedPassword]
  );
  
  // Retorna o ID do novo usuário
  res.status(201).json({ 
    message: 'Client cadastrado com sucesso', 
    clientId: result.insertId 
  });
});
```

**POST /clients/login** - Faz login (atualizado para usar email)
```javascript
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Busca no banco de dados
  const rows = await pool.query(
    'SELECT * FROM clientes WHERE email = ?', 
    [email]
  );
  
  // Compara senha com bcrypt
  const match = await bcrypt.compare(password, client.password);
  
  // Retorna dados do usuário
  res.json({ 
    message: 'Login bem-sucedido', 
    clientId: client.id,
    nome: client.nome,
    email: client.email
  });
});
```

### **3. Frontend - api.js** ✅ JÁ PRONTO

```javascript
export const api = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/clients/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/clients/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  },
};
```

---

## 🧪 Como Testar

### **Passo 1: Certificar que o banco existe**

No HeidiSQL:
```sql
-- Ver se a tabela clientes existe
DESCRIBE clientes;

-- Resultado esperado:
-- id       | int      | PRIMARY KEY | AUTO_INCREMENT
-- nome     | varchar  | NOT NULL
-- email    | varchar  | UNIQUE
-- password | varchar  | NOT NULL
```

### **Passo 2: Rodar o Backend**

```bash
cd Backend
node server.js

# Saída esperada:
# ✅ Conectado ao MariaDB com sucesso!
# 🚀 Server funcionando em http://localhost:3001
```

### **Passo 3: Rodar o Frontend**

```bash
cd FrontEnd
npm run dev

# Saída esperada:
# ✓ ready in XXXms
# ➜ http://localhost:3000
```

### **Passo 4: Testar o Registro**

1. Abra: http://localhost:3000
2. Clique em **"Crie agora"**
3. Preencha:
   ```
   Nome: João Silva
   Email: joao@example.com
   Senha: 123456
   Confirmar: 123456
   ```
4. Clique em **"Criar Conta"**
5. Deve aparecer: ✅ **"Cadastro realizado com sucesso!"**

### **Passo 5: Verificar no Banco**

No HeidiSQL, execute:
```sql
SELECT * FROM clientes;

-- Você deve ver:
-- id | nome        | email              | password (hash)
-- 1  | João Silva  | joao@example.com   | $2b$10$... (bcrypt)
```

### **Passo 6: Testar o Login**

1. Abra: http://localhost:3000
2. Preencha com os dados cadastrados:
   ```
   Email: joao@example.com
   Senha: 123456
   ```
3. Clique em **"Entrar"**
4. Deve ser redirecionado para a página **Home** ✅

---

## 🔐 Segurança

✅ **Senhas são hashadas com bcrypt** (não armazenadas em plain text)
✅ **Email é UNIQUE** (não pode ter dois iguais)
✅ **Validação no frontend e backend**
✅ **CORS configurado**

---

## 📊 Estrutura da Tabela `clientes`

```sql
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,           -- ID único
  nome VARCHAR(100) NOT NULL,                  -- Nome do usuário
  email VARCHAR(100) UNIQUE NOT NULL,          -- Email único
  password VARCHAR(255) NOT NULL,              -- Senha hasheada
  telefone VARCHAR(20),                        -- (opcional)
  endereco VARCHAR(255),                       -- (opcional)
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Data de criação
  ativo BOOLEAN DEFAULT 1                      -- Ativo/Inativo
);
```

---

## 🆘 Troubleshooting

### Erro: "Email já cadastrado"
- O email já existe no banco
- Use um email diferente

### Erro: "Conexão recusada"
- Backend não está rodando
- Execute: `cd Backend && node server.js`

### Erro: "Unknown database 'tcc_viagem'"
- Banco não foi criado no HeidiSQL
- Execute: `CREATE DATABASE tcc_viagem;`

### Erro: "Access denied for user"
- Credenciais erradas em `.env`
- Verifique: `DB_USER=root` e `DB_PASSWORD=1234`

### Dados não aparecem no banco
- Verifique se a tabela `clientes` foi criada
- Execute no HeidiSQL: `SELECT * FROM clientes;`

---

## 📱 Endpoints Disponíveis

```
POST /clients/register
  Body: { nome, email, password }
  Response: { message: "...", clientId: 1 }

POST /clients/login
  Body: { email, password }
  Response: { message: "...", clientId: 1, nome: "...", email: "..." }

GET /clients
  Response: [ { id, nome, email }, ... ]

GET /clients/:id
  Response: { id, nome, email }

PUT /clients/:id
  Body: { nome, email, password }
  Response: { message: "..." }

DELETE /clients/:id
  Response: { message: "..." }
```

---

## 🎉 Resumo

Agora você tem:
- ✅ Registro de usuários **salvando no banco**
- ✅ Login com validação **no banco**
- ✅ Senhas seguras com **bcrypt**
- ✅ Backend e Frontend **completamente integrados**

---

## 🚀 Próximos Passos

1. ✅ Registrar usuários no banco
2. ✅ Fazer login com banco
3. ⬜ Criar CRUD de viagens
4. ⬜ Implementar despesas
5. ⬜ Adicionar atividades
6. ⬜ Deploy em produção

---

**Tudo pronto! Teste agora! 🎉**
