# 🎯 Resumo da Integração Frontend-Backend

## ✅ O que foi feito:

### 1. **Backend - package.json**
- ✅ Adicionado script `"dev": "node server.js"`
- ✅ Adicionado `cors` como dependência
- Agora você pode rodar: `npm run dev`

### 2. **Frontend - Serviço de API**
- ✅ Criado arquivo `src/services/api.js` com:
  - `api.login()` - Fazer login
  - `api.register()` - Registrar novo usuário
  - `api.getClients()` - Listar clientes
  - `api.getClientById(id)` - Buscar cliente por ID
  - `api.updateClient(id, data)` - Atualizar cliente
  - `api.deleteClient(id)` - Deletar cliente

### 3. **Variáveis de Ambiente**
- ✅ Criado `.env.example` no Frontend
- ✅ Criado `.env.example` no Backend

### 4. **Documentação**
- ✅ Criado `README.md` com instruções completas

---

## 🚀 Como Começar

### Passo 1: Backend
```bash
cd Backend
npm install  # Já foi feito!
npm run dev  # Inicia em http://localhost:3000
```

### Passo 2: Frontend
```bash
cd FrontEnd
npm install
npm run dev  # Inicia em http://localhost:5173
```

---

## 📌 Próximos Passos Importantes

### 1. **Criar arquivos .env**

No Backend (`Backend/.env`):
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

No Frontend (`FrontEnd/.env.local`):
```
VITE_API_URL=http://localhost:3000
```

### 2. **Usar o serviço de API**

Exemplo em um componente:
```javascript
import { api } from '../services/api';

// No seu componente
const handleLogin = async (email, password) => {
  try {
    const user = await api.login(email, password);
    console.log('Login bem-sucedido:', user);
    // Salvar dados do usuário
  } catch (error) {
    console.error('Erro no login:', error);
  }
};
```

### 3. **Atualizar o server.js (se necessário)**

Seu `server.js` já tem CORS configurado, mas verifique se está assim:

```javascript
const cors = require('cors');
const express = require('express');
const app = express();

// Middleware
app.use(cors()); // Permite requisições do frontend
app.use(express.json());

// Suas rotas
app.use('/clients', require('./routes/clients'));

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
```

---

## 🔌 Fluxo de Comunicação

```
Frontend (React/Vite)
    ↓ (fetch com api.login())
API Service (services/api.js)
    ↓ (POST /clients/login)
Backend Express Server (port 3000)
    ↓
Database (MariaDB)
    ↑
Backend (responde JSON)
    ↑
Frontend (recebe e processa)
```

---

## ⚠️ Checklist Final

- [ ] Backend dependencies instaladas (`npm install` já feito)
- [ ] Frontend dependencies instaladas
- [ ] `.env` configurado no Backend
- [ ] `.env.local` configurado no Frontend
- [ ] Backend rodando: `npm run dev` → http://localhost:3000
- [ ] Frontend rodando: `npm run dev` → http://localhost:5173
- [ ] Testar API com Postman ou Insomnia
- [ ] Integrar `api.js` na página de login
- [ ] Testar login funcionando
- [ ] Verificar console do navegador para erros

---

## 🐛 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| CORS error | Verifique se backend está rodando e CORS está configurado |
| API 404 | Certifique-se que as rotas estão implementadas em `routes/clients.js` |
| Connection refused | Backend não está rodando - execute `npm run dev` |
| Variáveis undefined | Crie o arquivo `.env` ou `.env.local` com as variáveis |

---

## 📚 Recursos Úteis

- **Testar API**: [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/)
- **Documentação Express**: https://expressjs.com/
- **Documentação React**: https://react.dev/
- **Documentação Vite**: https://vitejs.dev/

---

Agora você está pronto para integrar o frontend com o backend! 🎉
