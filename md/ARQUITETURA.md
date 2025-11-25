# 📊 FLUXO VISUAL - Como o Sistema Funciona

## 1️⃣ Arquitetura Geral

```
USUÁRIO (Browser)
    ↓
    └─ Acessa http://localhost:5173 (Frontend React)
            ↓
            Frontend envia requisição HTTP/JSON
            ↓
    Backend (Node.js/Express) - http://localhost:3000
            ↓
            Backend executa SQL queries
            ↓
    MariaDB (Banco de Dados)
            ↓
            Retorna dados
            ↓
            Backend responde com JSON
            ↓
            Frontend exibe dados na tela
            ↓
USUÁRIO vê a página atualizada
```

---

## 2️⃣ Fluxo de Login Detalhado

```
┌─────────────────────────────────────────────────────────────┐
│ USUÁRIO digita email e senha na página de login              │
└────────────────┬────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ Frontend (React) - login.jsx                                 │
│                                                               │
│ const { user } = await api.login('email@example.com', '123') │
└────────────────┬────────────────────────────────────────────┘
                 ↓
          HTTP POST
    http://localhost:3000/clients/login
    Body: { nome: "João", password: "senha123" }
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ Backend (Express) - routes/clients.js                        │
│                                                               │
│ router.post('/login', async (req, res) => {                 │
│   const { nome, password } = req.body;                      │
│   // Busca no banco de dados                                │
│   // Compara senha com bcrypt                               │
│   // Retorna resultado                                      │
│ })                                                           │
└────────────────┬────────────────────────────────────────────┘
                 ↓
       SELECT * FROM clientes
       WHERE nome = 'João'
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ MariaDB - Busca na tabela "clientes"                         │
│                                                               │
│ ID │ Nome  │ Email            │ Password (hash)             │
│ ───┼───────┼──────────────────┼─────────────────────────   │
│ 1  │ João  │ joao@example.com │ $2b$10$... (bcrypt)        │
│ 2  │ Maria │ maria@example.com│ $2b$10$... (bcrypt)        │
└────────────────┬────────────────────────────────────────────┘
                 ↓
    Retorna dados do usuário
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ Backend - Compara senhas                                     │
│                                                               │
│ await bcrypt.compare('senha123', hash_do_banco)            │
│ → true (senha correta!)                                      │
└────────────────┬────────────────────────────────────────────┘
                 ↓
          HTTP 200 OK + JSON
    { message: "Login bem-sucedido", clientId: 1 }
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ Frontend - Recebe resposta                                   │
│                                                               │
│ - Salva dados do usuário em localStorage                    │
│ - Redireciona para página Home                              │
│ - Mostra mensagem de sucesso                                │
└────────────────┬────────────────────────────────────────────┘
                 ↓
USUÁRIO logado com sucesso! ✅
```

---

## 3️⃣ Fluxo de Listar Viagens

```
USUÁRIO clica em "Minhas Viagens"
    ↓
Frontend (React Hook - useEffect)
    ↓
const viagens = await api.getClientVoyages(clientId);
    ↓
GET http://localhost:3000/viagens?cliente_id=1
    ↓
Backend (Express)
    ↓
SELECT * FROM viagens WHERE cliente_id = 1;
    ↓
MariaDB retorna:
[
  {
    id: 1,
    cliente_id: 1,
    destino: "Paris",
    data_inicio: "2025-06-01",
    ...
  },
  { ... }
]
    ↓
Backend responde com JSON
    ↓
Frontend recebe dados e atualiza estado
    ↓
React renderiza a lista de viagens na tela
    ↓
USUÁRIO vê suas viagens ✅
```

---

## 4️⃣ Estrutura de Pastas

```
tcc_Viagem-/
│
├── Backend/
│   ├── .env ........................ Variáveis de ambiente
│   ├── .env.example ................ Exemplo de .env
│   ├── server.js ................... Configuração do Express
│   ├── db.js ....................... Conexão com MariaDB
│   ├── package.json ................ Dependências
│   ├── schema.sql .................. Script SQL das tabelas
│   └── routes/
│       └── clients.js .............. Rotas de clientes
│
├── FrontEnd/
│   ├── .env.local .................. Variáveis do frontend
│   ├── package.json ................ Dependências
│   ├── vite.config.js .............. Config do Vite
│   └── src/
│       ├── App.jsx ................. Componente principal
│       ├── pages/
│       │   ├── login/
│       │   ├── home/
│       │   ├── minhas-viagens/
│       │   └── ...
│       └── services/
│           └── api.js .............. 🔑 Chamar o backend
│
├── QUICKSTART.md ................... 👈 Comece AQUI
├── CONFIGURAR_BANCO.md ............. Passo a passo visual
├── BANCO_DADOS.md .................. Documentação completa
├── EXEMPLOS_API.md ................. Exemplos de requisições
└── INTEGRACAO.md ................... Integração geral
```

---

## 5️⃣ Componentes-Chave

### 🔑 `src/services/api.js` (Frontend)
```javascript
// Este arquivo tem todas as funções para chamar a API
api.login(email, password)     // POST /clients/login
api.register(userData)         // POST /clients/register
api.getClients()               // GET /clients
api.getClientById(id)          // GET /clients/:id
api.updateClient(id, data)     // PUT /clients/:id
api.deleteClient(id)           // DELETE /clients/:id
```

### 🔑 `routes/clients.js` (Backend)
```javascript
// Este arquivo tem todas as rotas da API
router.post('/login', ...)     // POST /clients/login
router.post('/register', ...)  // POST /clients/register
router.get('/', ...)           // GET /clients
router.get('/:id', ...)        // GET /clients/:id
router.put('/:id', ...)        // PUT /clients/:id
router.delete('/:id', ...)     // DELETE /clients/:id
```

### 🔑 `.env` (Backend)
```
DB_HOST=localhost              # Onde está o MariaDB
DB_USER=root                   # Usuário do banco
DB_PASSWORD=1234               # Senha do banco
DB_NAME=tcc_viagem             # Nome do banco
DB_PORT=3306                   # Porta padrão
PORT=3000                      # Porta do backend
```

---

## 6️⃣ Fluxo de Desenvolvimento

### **Semana 1: Configuração Inicial** ✅
- [x] Criar backend com Express
- [x] Criar frontend com React/Vite
- [x] Configurar MariaDB
- [x] Criar tabelas
- [x] Conectar backend com banco

### **Semana 2: Autenticação**
- [ ] Implementar login funcional
- [ ] Implementar registro
- [ ] Adicionar JWT para segurança
- [ ] Criar proteção de rotas

### **Semana 3: CRUD de Viagens**
- [ ] Criar viagem (POST)
- [ ] Listar viagens (GET)
- [ ] Editar viagem (PUT)
- [ ] Deletar viagem (DELETE)
- [ ] Integrar com frontend

### **Semana 4: Despesas e Atividades**
- [ ] CRUD de despesas
- [ ] CRUD de atividades
- [ ] CRUD de lista de compras
- [ ] Cálculo de gastos

### **Semana 5: Refinamentos**
- [ ] Validações
- [ ] Tratamento de erros
- [ ] Testes
- [ ] Deploy

---

## 7️⃣ Ciclo de Requisição HTTP

```
REQUISIÇÃO (Frontend → Backend)
├── Método: GET, POST, PUT, DELETE
├── URL: http://localhost:3000/clients/1
├── Headers: { Content-Type: application/json }
└── Body (se POST/PUT): { nome: "João", ... }

    ↓↓↓ Viaja pela internet ↓↓↓

BACKEND PROCESSA
├── Recebe a requisição
├── Extrai dados (req.body, req.params)
├── Valida os dados
├── Executa comando SQL no banco
└── Prepara resposta

    ↓↓↓ Resposta volta ↓↓↓

RESPOSTA (Backend → Frontend)
├── Status Code: 200, 201, 400, 404, 500
├── Headers: { Content-Type: application/json }
└── Body: { mensagem: "...", dados: {...} }

    ↓↓↓ Frontend processa ↓↓↓

FRONTEND ATUALIZA
├── Recebe os dados
├── Atualiza estado (useState)
├── React renderiza a interface
└── Usuário vê a mudança
```

---

## 8️⃣ Segurança (Resumo)

```
❌ ERRADO                    ✅ CORRETO
─────────────────────────────────────────
Senha em plain text    →     Usar bcrypt
Conexão sem SSL        →     Usar HTTPS em produção
Sem validação          →     Validar todos inputs
Token em localStorage  →     localStorage é OK para agora
Secrets no código      →     Usar .env
```

---

## 9️⃣ Comando Rápidos

```bash
# Terminal 1 - Backend
cd Backend
npm install
npm run dev
# Vê: 🚀 Server funcionando em http://localhost:3000

# Terminal 2 - Frontend
cd FrontEnd
npm install
npm run dev
# Vê: ✓ ready in XXXms

# Terminal 3 - Testar API (opcional)
curl http://localhost:3000/test-connection
```

---

## 🔟 Próximas Ações

### ✅ Já Feito
- Backend configurado
- Database schema criado
- API service no Frontend
- Documentação completa

### ⬜ Próximo Passo
1. **Abra HeidiSQL**
2. **Crie o banco `tcc_viagem`**
3. **Execute o `schema.sql`**
4. **Rode `node server.js`**
5. **Teste em http://localhost:3000/test-connection**
6. **Comece a integrar com o Frontend**

---

## 📞 Resumo Visual Rápido

```
┌─────────────┐
│  Frontend   │  (React/Vite)
│  Port 5173  │
└──────┬──────┘
       │ API Calls
       │ HTTP/JSON
       ↓
┌─────────────┐
│  Backend    │  (Express/Node)
│  Port 3000  │
└──────┬──────┘
       │ SQL Queries
       │
       ↓
┌─────────────┐
│  MariaDB    │  (Banco)
│  Port 3306  │
└─────────────┘
```

---

**Você está pronto para conectar tudo! 🚀**

Siga o `QUICKSTART.md` para os próximos passos!
