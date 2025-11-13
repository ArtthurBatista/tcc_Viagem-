# 🔧 TROUBLESHOOTING - Pool Timeout Error

## 🚨 Erro Completo
```
Erro ao conectar ao MariaDB: (conn:-1, no: 45028, SQLState: HY000) 
pool timeout: failed to retrieve a connection from pool after 10005ms
```

---

## 🔍 O que significa?

O MariaDB não está **acessível** pela porta 3306. Isso pode ser:
- MariaDB não está rodando
- Credenciais erradas
- Banco não existe
- Firewall bloqueando
- Porta errada

---

## ✅ CHECKLIST DE SOLUÇÃO

### **1. Verificar se MariaDB está Rodando**

#### Windows:
```
1. Pressione: Windows + R
2. Digite: services.msc
3. Procure por "MariaDB" ou "MySQL"
4. Verifique se Status = "Started"
```

**Se não estiver rodando:**
- Clique com botão direito
- Selecione "Iniciar"
- Aguarde 5 segundos

#### Se não encontrar o serviço:
- MariaDB pode não estar instalado
- Você precisa instalar: https://mariadb.org/download/

---

### **2. Testar Credenciais no HeidiSQL**

Abra HeidiSQL e faça um teste rápido:

```
Hostname: localhost
User: root
Password: 1234
Port: 3306
```

1. Clique em "Test"
2. Se aparecer "Connection successful" ✅
   - MariaDB está OK
3. Se der erro ❌
   - Credenciais podem estar erradas
   - Tente com senha vazia

---

### **3. Verificar Credenciais em .env**

Abra `Backend/.env` e confirme:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=tcc_viagem
DB_PORT=3306
```

**Possíveis problemas:**
- ❌ Senha errada
- ❌ Usuário errado
- ❌ Host errado
- ❌ Porta errada
- ❌ Nome do banco errado

---

### **4. Testar Senha Vazia**

Se não sabe a senha do root, tente sem senha:

```env
DB_PASSWORD=
```

---

### **5. Usar IP 127.0.0.1 ao invés de localhost**

```env
DB_HOST=127.0.0.1
```

---

### **6. Aumentar Timeout (JÁ FEITO)**

Seu `db.js` foi atualizado com:
```javascript
acquireTimeout: 30000,  // 30 segundos
idleTimeout: 60000,     // 60 segundos
```

---

## 🎯 PASSOS PARA RESOLVER (em ordem)

### **Passo 1: Garantir que MariaDB está rodando**
- [ ] Abra Serviços do Windows
- [ ] Procure por "MariaDB"
- [ ] Se não estiver rodando, inicie
- [ ] Aguarde 5 segundos

### **Passo 2: Testar credenciais no HeidiSQL**
- [ ] Abra HeidiSQL
- [ ] Crie nova conexão com suas credenciais
- [ ] Clique em "Test"
- [ ] Veja se conecta

### **Passo 3: Criar banco tcc_viagem**
- [ ] No HeidiSQL, clique em "Open"
- [ ] Botão direito em "Databases"
- [ ] Crie novo banco: tcc_viagem
- [ ] Verifique se aparece na lista

### **Passo 4: Executar schema.sql**
- [ ] Abra Backend/schema.sql
- [ ] Copie tudo
- [ ] Abra editor SQL do HeidiSQL (F9)
- [ ] Cole e execute (F9)
- [ ] Verifique se criou 5 tabelas

### **Passo 5: Atualizar .env do Backend**
- [ ] Abra Backend/.env
- [ ] Coloque credenciais corretas
- [ ] Salve o arquivo

### **Passo 6: Rodar Backend novamente**
- [ ] Terminal: `cd Backend`
- [ ] `node server.js`
- [ ] Verifique se conecta com sucesso

---

## 📝 Arquivos para Verificar

### `Backend/.env` (suas credenciais)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=tcc_viagem
DB_PORT=3306
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### `Backend/db.js` (conexão)
```javascript
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
  acquireTimeout: 30000,
  idleTimeout: 60000,
});
```

---

## 🆘 Se AINDA não funcionar

### **Opção 1: Descobrir a senha do root**
```
1. Abra HeidiSQL
2. Tente conectar com senha vazia ("")
3. Se conectar, essa é a senha correta
4. Coloque em Backend/.env
```

### **Opção 2: Reinstalar MariaDB**
1. Desinstale MariaDB (Painel de Controle → Programas)
2. Baixe e instale novamente: https://mariadb.org/download/
3. Durante instalação, defina senha do root
4. Coloque essa senha em Backend/.env

### **Opção 3: Verificar se está em outra porta**
```
1. HeidiSQL → New Connection
2. Tente diferentes portas: 3307, 3308, etc
3. Se conectar, coloque essa porta em Backend/.env
```

---

## 🔐 Dados Padrão do MariaDB

Instalação padrão:
```
Hostname: localhost
User: root
Password: (vazio ou que você definiu)
Port: 3306
```

---

## 📊 Teste de Conexão

Após resolver, teste no navegador:
```
http://localhost:3001/test-connection
```

Você deve ver:
```json
{
  "message": "✅ Conexão com banco de dados OK",
  "database": "tcc_viagem"
}
```

---

## 🎯 Resumo

1. **Verificar**: MariaDB está rodando?
2. **Testar**: HeidiSQL consegue conectar?
3. **Criar**: Banco tcc_viagem existe?
4. **Executar**: schema.sql foi executado?
5. **Configurar**: .env tem credenciais certas?
6. **Rodar**: `node server.js` conecta?

---

## ✨ Próximos Passos

Após resolver o erro:
1. ✅ MariaDB conectando
2. ⬜ Banco tcc_viagem criado
3. ⬜ 5 tabelas criadas
4. ⬜ Backend rodando em 3001
5. ⬜ Frontend rodando em 3000
6. ⬜ Integração testada

---

Qual é a saída quando você tenta conectar ao HeidiSQL?
Consegue conectar lá com root/1234?
