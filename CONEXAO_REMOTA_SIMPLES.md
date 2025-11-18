# 🌐 Como Permitir Cadastros Remotos no Seu MariaDB

## 📍 Situação
- **Seu computador:** Tem MariaDB instalado (servidor)
- **Outro computador:** Quer cadastrar clientes que vão para SUA tabela

## ✅ Configuração Rápida (3 Passos)

### Passo 1: Liberar Acesso Remoto no MariaDB

**Abra o HeidiSQL** e execute este comando SQL:

```sql
-- Permite que qualquer IP se conecte como root
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '1234' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

### Passo 2: Liberar Porta 3306 no Firewall

**Windows:**

```powershell
# Execute como Administrador no PowerShell
New-NetFirewallRule -DisplayName "MariaDB" -Direction Inbound -LocalPort 3306 -Protocol TCP -Action Allow
```

**OU manualmente:**
1. Painel de Controle → Firewall do Windows
2. Configurações Avançadas → Regras de Entrada
3. Nova Regra → Porta → TCP 3306
4. Permitir conexão → Concluir

### Passo 3: Descobrir Seu IP

No **seu computador** (com MariaDB), execute:

```powershell
ipconfig
```

Procure por **"Endereço IPv4"** - será algo como: `192.168.1.100`

---

## 🖥️ No Outro Computador

### Configure o arquivo `.env`

No outro computador, edite `Backend/.env`:

```env
# Coloque o IP do SEU computador aqui
DB_HOST=192.168.1.100

DB_USER=root
DB_PASSWORD=1234
DB_NAME=clients_orders_system
DB_PORT=3306

# IMPORTANTE: Mude para false para usar MariaDB
USE_MEMORY_DB=false

PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### Inicie o servidor

```powershell
cd Backend
npm install
node server.js
```

**Se funcionar, você verá:**
```
✅ Conectado ao MariaDB com sucesso!
   Host: 192.168.1.100
   Database: clients_orders_system
🚀 Server funcionando em http://localhost:3001
```

---

## 🧪 Testar a Conexão

**Do outro computador:**

```powershell
# Testar conexão
Invoke-RestMethod -Uri http://localhost:3001/test-connection

# Listar clientes
Invoke-RestMethod -Uri http://localhost:3001/clients

# Criar cliente (vai para SEU banco!)
$body = @{
    name = "Cliente Remoto"
    email = "remoto@email.com"
    phone = "11999999999"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3001/clients -Method Post -Body $body -ContentType "application/json"
```

---

## ❓ Solução de Problemas

### Erro: "Impossível conectar"

1. **Verifique o Firewall:** Porta 3306 liberada?
2. **Verifique o IP:** Está correto no `.env`?
3. **Mesma rede?** Ambos computadores na mesma rede WiFi/LAN?

### Testar conexão MariaDB diretamente

**Do outro computador:**

```powershell
# Instale mysql client (se necessário)
# choco install mysql

# Teste a conexão
mysql -h 192.168.1.100 -u root -p1234 -e "SHOW DATABASES;"
```

### Verificar se MariaDB aceita conexões remotas

**No seu computador**, verifique no HeidiSQL:

```sql
SELECT User, Host FROM mysql.user WHERE User='root';
```

**Deve aparecer:**
```
root | localhost
root | %          ← Este é importante!
```

---

## 📱 Resumo Visual

```
┌─────────────────────────────┐
│   Outro Computador          │
│   (Cliente)                 │
│                             │
│   Backend → .env:           │
│   DB_HOST=192.168.1.100    │
│   USE_MEMORY_DB=false      │
│                             │
└──────────┬──────────────────┘
           │
           │ Internet/WiFi
           │ Porta 3306
           ▼
┌─────────────────────────────┐
│   Seu Computador            │
│   (Servidor MariaDB)        │
│                             │
│   📦 MariaDB rodando        │
│   🔓 Firewall liberado      │
│   📊 clients_orders_system  │
│                             │
└─────────────────────────────┘
```

---

## 🔒 Dicas de Segurança

⚠️ **Para demonstração/desenvolvimento:**
- Está OK usar root e senha simples na rede local

🔐 **Para produção:**
1. Crie usuário específico (não use root)
2. Use senha forte
3. Limite IPs específicos em vez de '%'
4. Use SSL/TLS

```sql
-- Exemplo mais seguro:
CREATE USER 'tcc_app'@'192.168.1.%' IDENTIFIED BY 'Senha_Forte_123!@#';
GRANT ALL PRIVILEGES ON clients_orders_system.* TO 'tcc_app'@'192.168.1.%';
FLUSH PRIVILEGES;
```
