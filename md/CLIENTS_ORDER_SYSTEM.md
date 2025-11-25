# ✅ CONFIGURAÇÃO: Usar Database `clients_order_system`

## 📋 Status Atual

```
Backend está configurado para usar:
✅ Database: clients_order_system
✅ User: root
✅ Password: 1234
✅ Port: 3306
```

---

## 🎯 Próximos Passos

### **Passo 1: Verificar se a tabela `clientes` existe**

No HeidiSQL:

1. Abra a conexão com seu banco de dados
2. Selecione o banco: **clients_order_system**
3. Procure pela tabela **clientes**

**Se a tabela JÁ EXISTE:**
- ✅ Pule para o Passo 3

**Se a tabela NÃO EXISTE:**
- ⬜ Vá para o Passo 2

---

### **Passo 2: Criar a tabela `clientes` (se não existir)**

No HeidiSQL:

1. Clique em **"Query"** (ou F9)
2. Abra o arquivo: `Backend/setup-clients-orders-system.sql`
3. Copie TODO o conteúdo
4. Cole no editor SQL do HeidiSQL
5. Pressione **F9** para executar

**Ou copie este SQL:**

```sql
USE clients_order_system;

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  endereco VARCHAR(255),
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT 1,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Resultado esperado:**
```
✅ Tabela 'clientes' criada com sucesso
```

---

### **Passo 3: Verificar a Tabela**

No HeidiSQL, execute:

```sql
DESC clientes;
```

Você deve ver:
```
Field      | Type         | Null | Key | Default
-----------+--------------+------+-----+--------
id         | int          | NO   | PRI | NULL
nome       | varchar(100) | NO   |     | NULL
email      | varchar(100) | NO   | UNI | NULL
password   | varchar(255) | NO   |     | NULL
telefone   | varchar(20)  | YES  |     | NULL
endereco   | varchar(255) | YES  |     | NULL
data_criacao | timestamp  | NO   |     | CURRENT_TIMESTAMP
ativo      | tinyint(1)   | NO   |     | 1
```

---

### **Passo 4: Testar o Backend**

Terminal:

```bash
cd Backend
node server.js
```

**Resultado esperado:**
```
✅ Conectado ao MariaDB com sucesso!
   Host: localhost
   Database: clients_order_system
🚀 Server funcionando em http://localhost:3001
```

---

### **Passo 5: Testar o Registro**

No Postman ou Terminal (usando curl):

```bash
curl -X POST http://localhost:3001/clients/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "password": "123456"
  }'
```

**Resultado esperado:**
```json
{
  "message": "Client cadastrado com sucesso",
  "clientId": 1
}
```

---

### **Passo 6: Verificar no Banco**

No HeidiSQL, execute:

```sql
SELECT * FROM clientes;
```

Você deve ver o usuário cadastrado:
```
id | nome        | email              | password (hash)
1  | João Silva  | joao@example.com   | $2b$10$...
```

---

## 🧪 Testar Fluxo Completo

### **Terminal 1 - Backend**
```bash
cd Backend
node server.js
```

### **Terminal 2 - Frontend**
```bash
cd FrontEnd
npm run dev
```

### **Browser - Registrar Usuário**

1. Abra: http://localhost:3000
2. Clique em **"Crie agora"**
3. Preencha:
   ```
   Nome: Seu Nome
   Email: seu@email.com
   Senha: 123456
   Confirmar: 123456
   ```
4. Clique em **"Criar Conta"**
5. Deve aparecer: ✅ **"Cadastro realizado com sucesso!"**

### **HeidiSQL - Verificar Dados**

```sql
SELECT * FROM clientes;
```

Você deve ver seu usuário salvo no banco! ✅

---

## 📊 Estrutura da Tabela `clientes`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT | ID único (auto-incremento) |
| `nome` | VARCHAR(100) | Nome completo do usuário |
| `email` | VARCHAR(100) | Email único |
| `password` | VARCHAR(255) | Senha hasheada com bcrypt |
| `telefone` | VARCHAR(20) | Telefone (opcional) |
| `endereco` | VARCHAR(255) | Endereço (opcional) |
| `data_criacao` | TIMESTAMP | Data de criação (automático) |
| `ativo` | BOOLEAN | Ativo/Inativo (padrão: 1) |

---

## 🔐 Segurança

✅ Senhas **hasheadas com bcrypt**  
✅ Email **UNIQUE** (sem duplicatas)  
✅ **Índice em email** para busca rápida  
✅ **Charset utf8mb4** para caracteres especiais  

---

## 🆘 Troubleshooting

### Erro: "Table 'clients_order_system.clientes' doesn't exist"
**Solução:** Execute o SQL do Passo 2 para criar a tabela

### Erro: "Duplicate entry for key 'email'"
**Solução:** Email já cadastrado. Use outro email.

### Erro: "Access denied for user 'root'"
**Solução:** Verifique credenciais em `Backend/.env`

### Erro: "Can't connect to MariaDB"
**Solução:** MariaDB não está rodando. Inicie nos Serviços do Windows.

---

## ✅ Checklist

- [ ] Banco `clients_order_system` existe
- [ ] Tabela `clientes` foi criada
- [ ] Backend conecta ao banco com sucesso
- [ ] Usuário consegue registrar
- [ ] Dados aparecem na tabela `clientes`
- [ ] Usuário consegue fazer login
- [ ] Frontend e Backend se comunicam

---

## 🎉 Pronto!

Agora você tem:
- ✅ Backend usando `clients_order_system`
- ✅ Tabela `clientes` criada
- ✅ Registro de usuários funcionando
- ✅ Login com banco de dados funcionando
- ✅ Senhas seguras com bcrypt
- ✅ Frontend integrado com Backend

**Próximas funcionalidades:**
- ⬜ CRUD de viagens
- ⬜ Sistema de despesas
- ⬜ Itinerário/atividades
- ⬜ Lista de compras

---

**Tudo pronto! Teste agora! 🚀**
