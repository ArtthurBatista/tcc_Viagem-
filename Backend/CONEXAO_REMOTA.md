# 🌐 Conectar ao MariaDB Remoto

## 📋 Passo a Passo

### 1️⃣ No Computador com MariaDB (Servidor)

#### A. Permitir Conexões Remotas no MariaDB

Edite o arquivo de configuração:
```bash
# Windows: C:\Program Files\MariaDB xx.x\data\my.ini
# Linux: /etc/mysql/mariadb.conf.d/50-server.cnf
```

Encontre e altere:
```ini
# De:
bind-address = 127.0.0.1

# Para:
bind-address = 0.0.0.0
```

#### B. Criar Usuário com Acesso Remoto

No HeidiSQL ou terminal MariaDB:

```sql
-- Criar usuário que pode acessar de qualquer IP
CREATE USER 'tcc_user'@'%' IDENTIFIED BY 'senha_forte_123';

-- Dar permissões no banco tcc_viagem
GRANT ALL PRIVILEGES ON tcc_viagem.* TO 'tcc_user'@'%';

-- Aplicar mudanças
FLUSH PRIVILEGES;
```

#### C. Configurar Firewall

**Windows:**
1. Painel de Controle → Firewall do Windows
2. Regras de Entrada → Nova Regra
3. Porta → TCP → 3306
4. Permitir conexão
5. Nome: "MariaDB Remoto"

**Linux:**
```bash
sudo ufw allow 3306/tcp
```

#### D. Descobrir seu IP Local

**Windows:**
```powershell
ipconfig
# Procure por "Endereço IPv4" (ex: 192.168.1.100)
```

**Linux/Mac:**
```bash
ip addr show
# ou
ifconfig
```

---

### 2️⃣ No Outro Computador (Cliente)

#### A. Configure o `.env`

Crie/edite `Backend/.env`:

```env
# Substitua 192.168.1.100 pelo IP do servidor
DB_HOST=192.168.1.100
DB_USER=tcc_user
DB_PASSWORD=senha_forte_123
DB_NAME=tcc_viagem
DB_PORT=3306

# Importante: deixe false para usar MariaDB remoto
USE_MEMORY_DB=false

PORT=3001
```

#### B. Execute o Backend

```powershell
cd Backend
npm install
node server.js
```

**Você verá:**
```
✅ Conectado ao MariaDB com sucesso!
   Host: 192.168.1.100
   Database: tcc_viagem
```

---

## 🌍 Acesso pela Internet (Opcional)

Se quiser acessar de fora da rede local:

### Opção 1: Exposição Direta (Não Recomendado)

1. Configure port forwarding no roteador (porta 3306)
2. Use seu IP público no `DB_HOST`
3. ⚠️ **Risco de segurança!**

### Opção 2: Túnel SSH (Recomendado)

```bash
# No computador cliente
ssh -L 3306:localhost:3306 usuario@ip_do_servidor

# No .env use:
DB_HOST=localhost
```

### Opção 3: VPN

Use Hamachi, ZeroTier ou similar para criar rede privada.

### Opção 4: Serviço Cloud

- **AWS RDS** (MariaDB gerenciado)
- **DigitalOcean Managed Database**
- **Google Cloud SQL**

No `.env`:
```env
DB_HOST=seu-banco.aws.com
DB_USER=admin
DB_PASSWORD=sua_senha
DB_NAME=tcc_viagem
DB_PORT=3306
```

---

## ✅ Testar Conexão

### Do Servidor:
```sql
-- No HeidiSQL, execute:
SELECT User, Host FROM mysql.user WHERE User='tcc_user';
```

### Do Cliente:
```powershell
# Teste a conexão
node -e "require('./db')"
```

Ou acesse:
```
http://localhost:3001/test-connection
```

---

## 🔒 Segurança

### ✅ Boas Práticas:

1. **Use senha forte** para o usuário remoto
2. **Crie usuário específico** (não use root)
3. **Limite por IP** quando possível:
   ```sql
   CREATE USER 'tcc_user'@'192.168.1.50' IDENTIFIED BY 'senha';
   ```
4. **Use SSL/TLS** em produção
5. **Firewall** ativo no servidor

### ⚠️ Evite:

- ❌ Usar `root` remotamente
- ❌ Senha vazia ou fraca
- ❌ Expor porta 3306 na Internet sem VPN
- ❌ Commitar `.env` com credenciais reais

---

## 🐛 Troubleshooting

### Erro: "Can't connect to MySQL server"

**Causa:** Firewall bloqueando
**Solução:** Verifique firewall no servidor

### Erro: "Access denied for user"

**Causa:** Usuário sem permissão remota
**Solução:** Execute os comandos SQL do passo 1.B

### Erro: "Connection timeout"

**Causa:** IP errado ou rede diferente
**Solução:** 
- Verifique IP com `ipconfig`
- Ambos computadores na mesma rede?
- Use IP público se necessário

### Erro: "Host 'XXX' is not allowed to connect"

**Causa:** MariaDB não configurado para aceitar conexões remotas
**Solução:** Verifique `bind-address` no passo 1.A

---

## 📦 Exemplo Completo

### Servidor (192.168.1.100):
```sql
CREATE USER 'tcc_user'@'%' IDENTIFIED BY 'Tcc@2024!';
GRANT ALL PRIVILEGES ON tcc_viagem.* TO 'tcc_user'@'%';
FLUSH PRIVILEGES;
```

### Cliente (qualquer PC na rede):
```env
DB_HOST=192.168.1.100
DB_USER=tcc_user
DB_PASSWORD=Tcc@2024!
DB_NAME=tcc_viagem
DB_PORT=3306
USE_MEMORY_DB=false
PORT=3001
```

```powershell
cd Backend
node server.js
# ✅ Conectado ao MariaDB com sucesso!
```

Agora todos os cadastros vão direto para o MariaDB no servidor! 🎉
