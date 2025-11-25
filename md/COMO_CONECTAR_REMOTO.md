# 🌐 Como Conectar Outro Computador ao Seu MariaDB

## ✅ Situação
- **Seu computador:** `10.106.102.68` (com MariaDB)
- **Outro computador:** Vai cadastrar clientes no SEU banco

---

## 🚀 PASSO A PASSO

### 1️⃣ No SEU Computador (com MariaDB)

#### A. Execute o SQL no HeidiSQL

Abra o **HeidiSQL**, conecte-se e execute:

```sql
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '1234' WITH GRANT OPTION;
FLUSH PRIVILEGES;
SELECT User, Host FROM mysql.user WHERE User='root';
```

**Resultado esperado:** Deve aparecer `root | %`

#### B. Liberar Firewall (se necessário)

Execute como **Administrador** no PowerShell:

```powershell
New-NetFirewallRule -DisplayName "MariaDB" -Direction Inbound -LocalPort 3306 -Protocol TCP -Action Allow
```

---

### 2️⃣ No OUTRO Computador

#### A. Copie a pasta Backend

Copie toda a pasta `Backend` para o outro computador.

#### B. Configure o `.env`

Crie/edite o arquivo `Backend/.env` com:

```env
DB_HOST=10.106.102.68
DB_USER=root
DB_PASSWORD=1234
DB_NAME=clients_orders_system
DB_PORT=3306
USE_MEMORY_DB=false
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**⚠️ IMPORTANTE:** `USE_MEMORY_DB=false` para conectar no MariaDB

#### C. Instalar e Rodar

```powershell
cd Backend
npm install
node server.js
```

**Se funcionar, você verá:**
```
✅ Conectado ao MariaDB com sucesso!
   Host: 10.106.102.68
   Database: clients_orders_system
```

---

## 🧪 Testar Conexão Remota

No **outro computador**, execute:

```powershell
# Testar API
Invoke-RestMethod -Uri http://localhost:3001/test-connection

# Criar cliente (vai para SEU banco!)
$body = @{
    name = "Cliente Remoto"
    email = "remoto@email.com"
    phone = "11999999999"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3001/clients -Method Post -Body $body -ContentType "application/json"
```

Depois, verifique no **seu HeidiSQL** se o cliente apareceu na tabela `clients`!

---

## ❓ Problemas Comuns

### "Impossível conectar ao servidor remoto"

✅ **Checklist:**
1. Ambos na mesma rede WiFi/LAN?
2. Firewall liberado? (porta 3306)
3. SQL executado no HeidiSQL?
4. IP correto no `.env` do outro computador?
5. `USE_MEMORY_DB=false` no `.env`?

### Testar conexão direto do MariaDB

No outro computador (se tiver mysql client):

```powershell
mysql -h 10.106.102.68 -u root -p1234 -e "SHOW DATABASES;"
```

---

## 📁 Arquivos Criados

- ✅ `Backend/.env.exemplo_remoto` - Exemplo de configuração
- ✅ `Backend/configurar-remoto.ps1` - Script automatizado
- ✅ `CONEXAO_REMOTA_SIMPLES.md` - Guia completo
- ✅ Este arquivo - Resumo rápido

---

## 🎯 Resumo

```
┌─────────────────────────────┐
│   Outro Computador          │
│   Backend rodando           │
│   .env aponta para:         │
│   DB_HOST=10.106.102.68    │
└──────────┬──────────────────┘
           │
           │ WiFi/LAN
           │ Porta 3306
           ▼
┌─────────────────────────────┐
│   Seu Computador            │
│   IP: 10.106.102.68        │
│   MariaDB rodando           │
│   Firewall liberado         │
│   Tabela: clients           │
└─────────────────────────────┘
```

**✅ Pronto! Cadastros de qualquer computador vão para o SEU banco!**
