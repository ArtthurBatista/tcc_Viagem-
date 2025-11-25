# 🚀 Backend - Modo Portátil

Este backend funciona **com ou sem MariaDB instalado**!

## 🎯 Modos de Operação

### 1️⃣ Com MariaDB (Produção)
- Conecta ao banco de dados MariaDB
- Dados persistem no banco
- Melhor performance para muitos usuários

### 2️⃣ Sem MariaDB (Portátil/Desenvolvimento)
- Usa dados em memória + arquivo `data.json`
- **Funciona em qualquer computador**
- Dados salvos automaticamente em `data.json`
- Ideal para demonstrações e testes

---

## 📦 Como Rodar

### Instalação
```powershell
cd Backend
npm install
```

### Modo 1: Automático (Detecta MariaDB)
```powershell
node server.js
```
- Se MariaDB estiver disponível → usa MariaDB
- Se MariaDB NÃO estiver disponível → usa memória automaticamente

### Modo 2: Forçar Memória
```powershell
# Windows PowerShell
$env:USE_MEMORY_DB="true"
node server.js

# Windows CMD
set USE_MEMORY_DB=true
node server.js

# Linux/Mac
USE_MEMORY_DB=true node server.js
```

---

## ✅ Verificar Modo Ativo

Acesse: `http://localhost:3001/test-connection`

Resposta mostrará:
```json
{
  "message": "✅ Conexão com banco de dados OK",
  "mode": "Memória (Fallback)",  // ou "MariaDB"
  "database": "em memória"
}
```

---

## 📁 Persistência de Dados (Modo Memória)

Os dados são salvos em `data.json`:
```json
{
  "clients": [
    { "id": 1, "nome": "João", "email": "joao@email.com", "password": "hash..." }
  ],
  "nextId": 2
}
```

### ⚠️ Importante
- **NÃO commitar** `data.json` no Git (já está no `.gitignore`)
- Dados são salvos automaticamente a cada operação
- Para resetar dados: deletar `data.json` e reiniciar servidor

---

## 🔄 Compartilhar com Outros Computadores

### Opção 1: Sem Banco (Recomendado)
1. Copie a pasta `Backend/`
2. Execute `npm install`
3. Execute `node server.js`
4. ✅ Funciona imediatamente!

### Opção 2: Com MariaDB
1. Instale MariaDB no computador de destino
2. Configure credenciais em `.env`
3. Execute `schema.sql` no banco
4. Execute `node server.js`

---

## 🛠️ Configuração (.env)

```env
# Forçar modo memória (opcional)
USE_MEMORY_DB=false

# MariaDB (ignorado se USE_MEMORY_DB=true)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=clients_orders_system
DB_PORT=3306

PORT=3001
```

---

## 📊 APIs Disponíveis

Todas as rotas funcionam nos dois modos:

- `POST /clients/register` - Cadastrar cliente
- `POST /clients/login` - Login
- `GET /clients` - Listar clientes
- `GET /clients/:id` - Buscar cliente
- `PUT /clients/:id` - Atualizar cliente
- `DELETE /clients/:id` - Deletar cliente

---

## 🎓 Demonstrações e Apresentações

Para apresentar o TCC em outro computador:

1. **Não precisa instalar MariaDB!**
2. Apenas copie o projeto
3. Execute `npm install` no Backend e Frontend
4. Inicie os servidores
5. Tudo funcionará normalmente

Os dados de demonstração ficarão em `data.json` e podem ser resetados facilmente.

---

## 🐛 Troubleshooting

**Backend não inicia:**
- Verifique se a porta 3001 está livre
- Execute `npm install` novamente

**Dados não salvam:**
- Verifique permissões de escrita na pasta Backend
- Confira se `data.json` não está como somente leitura

**Erro "Cannot find module":**
```powershell
cd Backend
npm install
```
