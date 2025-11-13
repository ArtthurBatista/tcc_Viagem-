# 🎯 PASSO A PASSO - CONECTAR AO MARIADB

## 3️⃣ Passos Simples em 10 Minutos

---

### ✅ PASSO 1: ABRIR HEIDISQL

**O que você vai fazer:**
1. Abra o programa **HeidiSQL** no seu computador
2. Clique no botão **"New"** (ou Ctrl+N)

**Preencha com:**
```
Hostname:  localhost
User:      root
Password:  1234
Port:      3306
```

3. Clique em **"Open"**
4. Pronto! Você está conectado ao MariaDB 🎉

---

### ✅ PASSO 2: CRIAR O BANCO

**O que você vai fazer:**

1. No painel esquerdo do HeidiSQL, você vai ver:
   ```
   + Databases
   + Tables
   + Views
   ...
   ```

2. **Clique com botão DIREITO** em **"Databases"**

3. Selecione **"Create new"** → **"Database"**

4. Uma caixa vai aparecer:
   ```
   Database name: [_______________]
   ```

5. Escreva: `tcc_viagem`

6. Clique em **"OK"**

7. Pronto! O banco foi criado ✅

---

### ✅ PASSO 3: EXECUTAR O SCHEMA

**O que você vai fazer:**

1. Abra o arquivo: `Backend/schema.sql`
   - (Use o Bloco de Notas ou qualquer editor)

2. **Copie TODO o conteúdo** (Ctrl+A, depois Ctrl+C)

3. Volte para o **HeidiSQL**

4. Clique no menu **"Query"** (ou pressione **F9**)
   - Uma aba nova vai abrir com um editor SQL

5. **Cole** o conteúdo (Ctrl+V)

6. Pressione **F9** para executar

7. Você deve ver:
   ```
   Query executed successfully.
   ```

8. Pronto! As tabelas foram criadas ✅

---

## 🔍 Como Verificar se Funcionou?

### No HeidiSQL:

1. No painel esquerdo, procure por **"tcc_viagem"**

2. Expanda clicando no **+** ao lado

3. Você deve ver **5 tabelas:**
   - ✅ **clientes**
   - ✅ **viagens**
   - ✅ **despesas**
   - ✅ **atividades**
   - ✅ **lista_compras**

Se aparecer, **PARABÉNS!** 🎉

---

## 🔌 Agora Testar o Backend

### Terminal - Passo 1: Abra um Prompt de Comando

```
Abra: Windows PowerShell ou CMD
```

### Terminal - Passo 2: Navegue até a pasta Backend

```powershell
cd C:\Users\DS2A\Desktop\tcc_Viagem-\Backend
```

### Terminal - Passo 3: Inicie o servidor

```powershell
node server.js
```

**Você deve ver:**
```
[dotenv@17.2.3] injecting env (8) from .env
✅ Conectado ao MariaDB com sucesso!
   Host: localhost
   Database: tcc_viagem
🚀 Server funcionando em http://localhost:3000
📍 API de clientes em http://localhost:3000/clients
🧪 Teste de conexão em http://localhost:3000/test-connection
```

### Terminal - Passo 4: Testar no Navegador

1. Abra seu navegador (Chrome, Firefox, Edge)

2. Digite na barra de endereço:
   ```
   http://localhost:3000/test-connection
   ```

3. Pressione **Enter**

4. Você deve ver uma resposta **JSON** com:
   ```json
   {
     "message": "✅ Conexão com banco de dados OK",
     "result": [{"test": 1}],
     "database": "tcc_viagem"
   }
   ```

**Se vir isto, PARABÉNS! Tudo está conectado! 🎉🎉🎉**

---

## ❌ Se der erro...

### Erro: "Access denied for user 'root'"
**Solução:** A senha está errada
- Abra `Backend/.env`
- Altere: `DB_PASSWORD=1234` para sua senha correta
- Salve o arquivo
- Rode `node server.js` novamente

### Erro: "Can't connect to MariaDB server"
**Solução:** MariaDB não está rodando
- Windows: Abra "Serviços" (Services)
- Procure por "MariaDB" ou "MySQL"
- Clique com botão direito → "Iniciar"

### Erro: "No database selected" ou "Unknown database"
**Solução:** O banco não foi criado
- Volte ao Passo 2 e crie o banco novamente
- Certifique-se que digitou `tcc_viagem` corretamente

### Erro 404 em /test-connection
**Solução:** Backend não está rodando
- Abra o terminal
- Vá para `Backend`
- Rode `node server.js`
- Teste novamente

---

## 📱 Próximo Passo: Testar com Postman (Opcional)

Se quiser testar as requisições HTTP:

1. Baixe [Postman](https://www.postman.com/downloads/)

2. Abra Postman

3. Crie nova requisição:
   - Método: **POST**
   - URL: `http://localhost:3000/clients/register`
   - Body → JSON:
     ```json
     {
       "nome": "João Silva",
       "email": "joao@example.com",
       "password": "senha123"
     }
     ```

4. Clique em **Send**

5. Você deve ver resposta:
   ```json
   {
     "message": "Client cadastrado com sucesso",
     "clientId": 1
   }
   ```

---

## 🎯 Resumo Visual

```
HEIDISQL                    TERMINAL                    NAVEGADOR
│                           │                           │
├─ Conectar                  ├─ Abrir cmd              ├─ Ir para
│  (localhost:3306)          │                         │  localhost:3000
│                            │                         │  /test-connection
├─ Criar banco               ├─ cd Backend             │
│  (tcc_viagem)              │                         ├─ Ver JSON
│                            ├─ node server.js         │  com ✅
├─ Executar schema.sql       │                         │
│  (F9)                      ├─ Pronto! ✅             │ CONECTADO! ✅
│                            │                         │
└─ PRONTO! ✅               └─ PRONTO! ✅             └─ PRONTO! ✅
```

---

## ✨ RESULTADO FINAL

Após completar os 3 passos:

```
✅ Banco de dados criado
✅ Tabelas criadas
✅ Backend conectado ao banco
✅ Sistema pronto para integração com Frontend
```

---

## 📖 Próximos Passos (Depois)

Depois que tudo funcionar:

1. Rodar o Frontend: `npm run dev` (na pasta FrontEnd)
2. Integrar o login
3. Criar CRUD de viagens
4. Implementar despesas
5. Deploy em produção

---

## 🎉 Parabéns!

Você agora tem:
- ✅ Backend (Express) rodando
- ✅ Banco de dados (MariaDB) conectado
- ✅ 5 tabelas criadas
- ✅ API pronta para usar

**Próximo: Integrar com o Frontend!**

---

## 📞 Resumo dos 3 Passos

1. **HeidiSQL**: Conectar + Criar banco + Executar schema (5 min)
2. **Backend**: Rodar `node server.js` (1 min)
3. **Navegador**: Acessar `/test-connection` (1 min)

**Total: ~10 minutos**

---

**Bom trabalho! 🚀**

Qualquer dúvida, consulte:
- `INDICE.md` - Índice de documentação
- `QUICKSTART.md` - Resumo rápido
- `CONFIGURAR_BANCO.md` - Guia detalhado
