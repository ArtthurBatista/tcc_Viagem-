# 🔧 Configurar HeidiSQL para o Projeto

## Passos para Conectar ao Banco de Dados

### 1. Criar o Banco de Dados
No HeidiSQL, execute:
```sql
CREATE DATABASE IF NOT EXISTS clients_orders_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE clients_orders_system;
```

### 2. Criar as Tabelas
Execute o arquivo `schema.sql` completo no HeidiSQL:
- Clique em "Arquivo" → "Abrir SQL Script"
- Selecione `Backend/schema.sql`
- Clique em executar (F9)

**OU** se a tabela já existe, apenas adicione a coluna foto_perfil:
```sql
USE clients_orders_system;
ALTER TABLE clientes ADD COLUMN foto_perfil VARCHAR(255) AFTER password;
```

### 3. Verificar a Estrutura da Tabela
```sql
DESCRIBE clientes;
```

Deve mostrar:
- id
- nome
- email
- password
- foto_perfil ← **NOVA COLUNA**
- telefone
- endereco
- data_criacao
- ativo

### 4. Verificar Configuração do .env
Arquivo: `Backend/.env`
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=clients_orders_system
DB_PORT=3306
USE_MEMORY_DB=false
```

### 5. Reiniciar o Servidor Backend
No terminal PowerShell na pasta Backend:
```powershell
# Parar o servidor (Ctrl+C)
# Depois iniciar novamente
node server.js
```

Você deve ver:
```
✅ Conectado ao MariaDB com sucesso!
   Host: localhost
   Database: tcc_viagem
🚀 Servidor rodando na porta 3001
```

### 6. Testar a Conexão
Execute o script de teste:
```powershell
node test-db.js
```

## ⚠️ Problemas Comuns

### Erro: "MariaDB não disponível"
- Verifique se o MariaDB está rodando
- Verifique usuário e senha no .env
- Teste a conexão no HeidiSQL primeiro

### Erro: "Unknown column 'foto_perfil'"
- Execute o script `add-foto-perfil-column.sql`
- Ou recrie a tabela com o novo schema.sql

### Erro: "Unknown database 'tcc_viagem'"
- Crie o banco: `CREATE DATABASE tcc_viagem;`
- Ou mude DB_NAME no .env para o nome correto

### Ainda usando banco em memória
- Verifique se USE_MEMORY_DB=false no .env
- Reinicie o servidor backend
- Verifique os logs ao iniciar o servidor
