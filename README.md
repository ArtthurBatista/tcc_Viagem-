# 🚀 TCC Viagem - Sistema Completo de Planejamento de Viagens

> ⭐ **COMECE AQUI**: Leia o arquivo `COMECE_AQUI.md` ou `SETUP.md` para instruções visuais simples!

## 📋 Status do Projeto

```
✅ Backend (Node.js/Express)  - PRONTO
✅ Frontend (React/Vite)      - PRONTO
✅ API Service                - PRONTO
✅ Database Schema            - PRONTO
⏳ MariaDB Connection         - AGUARDANDO VOCÊ
```

## 📋 Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn
- Git

## 🔧 Configuração do Backend

### 1. Instalar dependências
```bash
cd Backend
npm install
```

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env` no diretório `Backend/` com as seguintes variáveis:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=tcc_viagem
DB_PORT=3306
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**Atualize os dados de conexão com seu banco de dados!**

### 3. Iniciar o servidor
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

---

## 🎨 Configuração do Frontend

### 1. Instalar dependências
```bash
cd FrontEnd
npm install
```

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env.local` no diretório `FrontEnd/` com:

```
VITE_API_URL=http://localhost:3000
```

### 3. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

---

## 🔌 Como usar a API

No seu código Frontend, importe o serviço de API:

```javascript
import { api } from './services/api';

// Fazer login
const user = await api.login('email@example.com', 'senha123');

// Buscar clientes
const clients = await api.getClients();

// Buscar cliente por ID
const client = await api.getClientById(1);

// Atualizar cliente
const updated = await api.updateClient(1, { name: 'Novo Nome' });

// Deletar cliente
await api.deleteClient(1);
```

---

## 📝 Estrutura das Rotas do Backend

### Clientes `/clients`

- `POST /clients/login` - Login do usuário
- `POST /clients/register` - Registrar novo usuário
- `GET /clients` - Listar todos os clientes
- `GET /clients/:id` - Obter cliente por ID
- `PUT /clients/:id` - Atualizar cliente
- `DELETE /clients/:id` - Deletar cliente

---

## 🚀 Executar ambos os serviços simultaneamente

### Opção 1: Dois Terminals diferentes

**Terminal 1 (Backend):**
```bash
cd Backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd FrontEnd
npm run dev
```

### Opção 2: Usar um gerenciador de processos (concurrently)

Instale globalmente ou no projeto:
```bash
npm install -g concurrently
```

Crie um script no `package.json` raiz (se existir).

---

## ⚠️ Troubleshooting

### Erro: "CORS policy blocked"
- Certifique-se de que o CORS está configurado corretamente no `server.js`
- Verifique se a `CORS_ORIGIN` no `.env` do backend corresponde à URL do frontend

### Erro: "API não encontrada"
- Certifique-se de que o backend está rodando em `http://localhost:3000`
- Verifique se a `VITE_API_URL` no `.env` do frontend está correta

### Erro: "Cannot POST /clients/login"
- Verifique se as rotas foram implementadas em `Backend/routes/clients.js`
- Certifique-se de que o arquivo `clients.js` existe e tem as rotas corretas

---

## 📚 Recursos Adicionais

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [CORS Docs](https://expressjs.com/en/resources/middleware/cors.html)

---

## ✅ Checklist de Integração

- [ ] Backend dependencies instaladas (`npm install`)
- [ ] `.env` configurado no Backend
- [ ] Frontend dependencies instaladas (`npm install`)
- [ ] `.env.local` configurado no Frontend
- [ ] Backend rodando em `http://localhost:3000`
- [ ] Frontend rodando em `http://localhost:5173`
- [ ] API service importado no componente correto
- [ ] Rotas do backend implementadas em `routes/clients.js`
- [ ] Testes de login funcionando
- [ ] CORS funcionando sem erros no console

---

## 💬 Próximos Passos

1. **Implementar as rotas do Backend** em `Backend/routes/clients.js`
2. **Integrar o serviço de API** nas páginas do Frontend
3. **Testar a comunicação** entre frontend e backend
4. **Implementar tratamento de erros** adequado
5. **Adicionar autenticação com tokens** (JWT recomendado)

---

Bom trabalho! 🎉
