# ✅ INTEGRAÇÃO COMPLETA - Frontend → Backend → MariaDB

## Status Atual
- ✅ Backend rodando na porta **3001**
- ✅ Banco MariaDB conectado: `clients_orders_system`
- ✅ Tabela `clientes` com **3 usuários** cadastrados
- ✅ API de cadastro/login funcionando
- ✅ Frontend configurado com proxy Vite

---

## 🚀 Como Rodar

### 1. Backend (Terminal 1)
```powershell
cd "c:\Users\DS2A\Desktop\tcc\Backend"
node server.js
```

**Aguarde ver:**
```
🚀 Server funcionando em http://localhost:3001
✅ Conectado ao MariaDB com sucesso!
```

### 2. Frontend (Terminal 2)
```powershell
cd "c:\Users\DS2A\Desktop\tcc\FrontEnd"
npm install
npm run dev
```

**Aguarde ver:**
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

---

## 🧪 Teste Completo de Cadastro

### Passo 1: Abrir o App
1. Abra: `http://localhost:3000/login`
2. Clique em **"Crie agora"** (modo cadastro)

### Passo 2: Cadastrar Novo Usuário
Preencha:
- **Nome**: Teste Frontend
- **Email**: teste@frontend.com
- **Senha**: 123456
- **Confirmar Senha**: 123456

### Passo 3: Enviar
1. Clique em **"Criar Conta"**
2. O sistema automaticamente:
   - ✅ Envia POST para `/api/clients/register`
   - ✅ Backend salva no MariaDB (tabela `clientes`)
   - ✅ Faz login automaticamente
   - ✅ Redireciona para `/home`

### Passo 4: Verificar no HeidiSQL
1. Abra o **HeidiSQL**
2. Conecte no banco `clients_orders_system`
3. Execute:
```sql
SELECT * FROM clientes ORDER BY id DESC LIMIT 5;
```

**Você verá o novo usuário:**
```
id | nome            | email                | password (hash bcrypt)
4  | Teste Frontend  | teste@frontend.com   | $2b$10$...
```

---

## 🔍 Endpoints Disponíveis

### API Backend (porta 3001)
- `GET /` - Health check
- `GET /test-connection` - Testa conexão com banco
- `POST /clients/register` - Cadastrar cliente
- `POST /clients/login` - Login
- `GET /clients/:id` - Buscar cliente
- `PUT /clients/:id` - Atualizar cliente
- `DELETE /clients/:id` - Deletar cliente

### Frontend (porta 3000)
- Todas as chamadas para `/api/*` são redirecionadas para o backend via proxy Vite

---

## 🔐 O Que Acontece no Cadastro

1. **Frontend** (`login.jsx`):
   - Valida campos (nome, email, senha ≥6 chars)
   - Chama `registerClient({ nome, email, password })`
   
2. **Proxy Vite**:
   - `/api/clients/register` → `http://localhost:3001/clients/register`

3. **Backend** (`routes/clients.js`):
   ```javascript
   // Valida email único
   // Gera hash bcrypt da senha
   // INSERT INTO clientes (nome, email, password)
   ```

4. **MariaDB**:
   - Salva o registro na tabela `clientes`
   - Retorna `insertId`

5. **Resposta**:
   - Backend retorna `{ message: 'Client cadastrado com sucesso', clientId: 4 }`
   - Frontend faz login automático
   - Redireciona para `/home`

---

## ✅ Confirmação

Rodando agora:
- Backend ativo em `http://localhost:3001`
- 3 clientes já cadastrados no banco
- Próximo cadastro será o ID 4

**Pronto para testar!** 🎉
