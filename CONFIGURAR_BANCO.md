# 🎯 Passo a Passo: Conectar MariaDB com HeidiSQL

## 📋 O que você precisa fazer

### ✅ **PASSO 1: Abrir HeidiSQL e conectar ao MariaDB**

1. Abra **HeidiSQL** (já deve estar instalado)
2. Clique em **"New"** ou pressione **Ctrl+N**
3. Preencha com:
   - **Hostname**: `localhost`
   - **User**: `root`
   - **Password**: `1234` (ou sua senha de root)
   - **Port**: `3306`
4. Clique em **"Open"**

![Conexão HeidiSQL](https://imgur.com/abc123.png)

---

### ✅ **PASSO 2: Criar o banco de dados**

No painel esquerdo do HeidiSQL:

1. Clique com botão direito em **"Databases"**
2. Selecione **"Create new"** → **"Database"**
3. Na caixa de diálogo que aparece, escreva: `tcc_viagem`
4. Clique em **"OK"** ou **"Create"**

**Alternativa (com SQL):**
Clique no botão **"Query"** (ou F9) e copie/cole:

```sql
CREATE DATABASE tcc_viagem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Depois pressione **F9** ou clique em **"Execute"**

---

### ✅ **PASSO 3: Criar as tabelas**

1. Selecione o banco `tcc_viagem` no painel esquerdo (clique nele)
2. Clique no botão **"Query"** (F9) para abrir editor SQL
3. **Cole TODO o código** do arquivo: `Backend/schema.sql`
4. Pressione **F9** para executar

```sql
-- Copie tudo do schema.sql e cole aqui
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  ...
)
```

---

### ✅ **PASSO 4: Verificar se funcionou**

No HeidiSQL:

1. Expanda **"tcc_viagem"** no painel esquerdo
2. Você deve ver as tabelas:
   - ✅ `clientes`
   - ✅ `viagens`
   - ✅ `despesas`
   - ✅ `atividades`
   - ✅ `lista_compras`

Se aparecerem, parabéns! 🎉

---

## 🔍 Verificar a Conexão Backend

Agora que você criou o banco, o backend deve conectar:

### No Terminal:
```bash
cd Backend
node server.js
```

Você deve ver:
```
✅ Conectado ao MariaDB com sucesso!
   Host: localhost
   Database: tcc_viagem
🚀 Server funcionando em http://localhost:3000
```

### No Navegador:
Abra: http://localhost:3000/test-connection

Você deve ver:
```json
{
  "message": "✅ Conexão com banco de dados OK",
  "result": [{"test": 1}],
  "database": "tcc_viagem"
}
```

---

## 📌 Checklist de Conclusão

- [ ] HeidiSQL aberto e conectado ao MariaDB
- [ ] Banco `tcc_viagem` criado
- [ ] Todas as 5 tabelas criadas (verificar em HeidiSQL)
- [ ] Backend rodando: `node server.js`
- [ ] Teste de conexão OK: http://localhost:3000/test-connection
- [ ] Arquivo `.env` criado no Backend com credenciais corretas

---

## ⚠️ Se der erro...

### Erro: "Access denied for user 'root'@'localhost'"
**Solução:** A senha está errada. Atualize em `Backend/.env`:
```
DB_PASSWORD=sua_senha_correta
```

### Erro: "Can't connect to MariaDB server"
**Solução:** MariaDB não está rodando. No Windows:
1. Abra **Serviços** (Services)
2. Procure por **"MariaDB"** ou **"MySQL"**
3. Clique com botão direito → **"Iniciar"**

### Erro: "No database selected" ou "Unknown database"
**Solução:** Rode o script SQL para criar o banco:
```sql
CREATE DATABASE tcc_viagem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 🎓 O que aconteceu

1. **Backend criado** em Node.js/Express
2. **Arquivo db.js** configurado para usar MariaDB
3. **Servidor rodando** em http://localhost:3000
4. **Tabelas criadas** para gerenciar:
   - Usuários (clientes)
   - Viagens
   - Despesas
   - Atividades
   - Lista de compras

---

## 🚀 Próximos Passos

Depois que tudo funcionar, você pode:

1. Testar endpoints da API com Postman
2. Integrar com o Frontend (React)
3. Implementar autenticação JWT
4. Adicionar mais funcionalidades

---

## 📚 Comandos Úteis no HeidiSQL

```sql
-- Ver todas as tabelas
SHOW TABLES;

-- Ver estrutura da tabela
DESCRIBE clientes;

-- Ver todos os dados
SELECT * FROM clientes;

-- Limpar dados (cuidado!)
DELETE FROM clientes;

-- Dropar tabela (cuidado!)
DROP TABLE clientes;

-- Contar registros
SELECT COUNT(*) FROM clientes;
```

---

**Está com dúvidas?** Leia o arquivo `BANCO_DADOS.md` para mais detalhes!

Bom trabalho! 🎉
