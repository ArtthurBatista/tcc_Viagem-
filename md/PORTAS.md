# 🔄 MUDANÇA DE PORTAS - RESUMO

## 📊 Novas Configurações

```
┌─────────────────────────────────────────────────────┐
│          ANTES                   │      DEPOIS      │
├──────────────────────────────────┼──────────────────┤
│ Frontend:  localhost:5173         │ localhost:3000   │
│ Backend:   localhost:3000         │ localhost:3001   │
│ MariaDB:   localhost:3306         │ localhost:3306   │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Arquivos Alterados

### **Backend**

#### `Backend/.env` (ATUALIZADO)
```
# Antes:
PORT=3000

# Depois:
PORT=3001
```

#### `Backend/server.js` (ATUALIZADO)
```javascript
// Antes:
const port = process.env.PORT || 3000;

// Depois:
const port = process.env.PORT || 3001;
```

#### `Backend/.env.example` (ATUALIZADO)
```
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

---

### **Frontend**

#### `FrontEnd/src/services/api.js` (ATUALIZADO)
```javascript
// Antes:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Depois:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

#### `FrontEnd/.env.example` (ATUALIZADO)
```
VITE_API_URL=http://localhost:3001
```

#### `FrontEnd/vite.config.js` (JÁ ESTAVA CORRETO)
```javascript
server: {
  port: 3000,  // ✅ Já estava assim
  open: true,
}
```

---

## 🚀 Como Rodar Agora

### **Terminal 1 - Backend**
```bash
cd Backend
node server.js

# Saída esperada:
# 🚀 Server funcionando em http://localhost:3001
```

### **Terminal 2 - Frontend**
```bash
cd FrontEnd
npm run dev

# Saída esperada:
# ➜ http://localhost:3000
```

---

## 🧪 Testar a Conexão

### **Teste 1: Backend**
```
http://localhost:3001/test-connection
```

### **Teste 2: Frontend**
```
http://localhost:3000
```

### **Teste 3: Postman**
```
POST http://localhost:3001/clients/register
{
  "nome": "João",
  "email": "joao@example.com",
  "password": "123"
}
```

---

## 📝 Resumo das Mudanças

| Componente | Antes | Depois |
|-----------|-------|--------|
| Frontend | localhost:5173 | localhost:3000 ✅ |
| Backend | localhost:3000 | localhost:3001 ✅ |
| Backend PORT | 3000 | 3001 ✅ |
| CORS_ORIGIN | :5173 | :3000 ✅ |
| API_BASE_URL | :3000 | :3001 ✅ |

---

## ✨ Próximos Passos

1. ✅ Portas alteradas
2. ⬜ Criar banco no HeidiSQL (se ainda não fez)
3. ⬜ Rodar Backend: `node server.js`
4. ⬜ Rodar Frontend: `npm run dev`
5. ⬜ Testar integração

---

**Pronto! Suas portas estão configuradas! 🎉**

Frontend: **http://localhost:3000**
Backend: **http://localhost:3001**

