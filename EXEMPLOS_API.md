# 🔌 Exemplos de Uso da API

## 🎯 Como usar a API do Backend

---

## 1️⃣ **CLIENTES (Autenticação e Registro)**

### 1.1 Registrar novo cliente
```bash
POST http://localhost:3000/clients/register
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta esperada:**
```json
{
  "message": "Client cadastrado com sucesso",
  "clientId": 1
}
```

---

### 1.2 Fazer login
```bash
POST http://localhost:3000/clients/login
Content-Type: application/json

{
  "nome": "João Silva",
  "password": "senha123"
}
```

**Resposta esperada:**
```json
{
  "message": "Login bem-sucedido",
  "clientId": 1
}
```

---

### 1.3 Listar todos os clientes
```bash
GET http://localhost:3000/clients
```

**Resposta esperada:**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com"
  },
  {
    "id": 2,
    "nome": "Maria Santos",
    "email": "maria@example.com"
  }
]
```

---

### 1.4 Buscar cliente por ID
```bash
GET http://localhost:3000/clients/1
```

**Resposta esperada:**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com"
}
```

---

### 1.5 Atualizar cliente
```bash
PUT http://localhost:3000/clients/1
Content-Type: application/json

{
  "nome": "João Silva Atualizado",
  "email": "joao.novo@example.com",
  "password": "nova_senha123"
}
```

**Resposta esperada:**
```json
{
  "message": "Client atualizado com sucesso"
}
```

---

### 1.6 Deletar cliente
```bash
DELETE http://localhost:3000/clients/1
```

---

## 🚀 Como Testar com Postman/Insomnia

### Método 1: Postman
1. Baixe e instale [Postman](https://www.postman.com/downloads/)
2. Crie uma nova requisição
3. Escolha o método (GET, POST, PUT, DELETE)
4. Cole a URL: `http://localhost:3000/clients/register`
5. Vá para a aba **Body** → **raw** → **JSON**
6. Cole o JSON do exemplo
7. Clique em **Send**

### Método 2: Insomnia
1. Baixe e instale [Insomnia](https://insomnia.rest/download)
2. Crie uma nova requisição HTTP
3. Configure igual ao Postman

### Método 3: cURL (Terminal)
```bash
curl -X POST http://localhost:3000/clients/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@example.com","password":"senha123"}'
```

---

## 📱 Como usar no Frontend (React)

Você já tem o arquivo `src/services/api.js` pronto!

### Exemplo na página de login:

```javascript
import { api } from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Chamar a API
      const response = await api.login(email, password);
      
      // Salvar dados do usuário
      localStorage.setItem('user', JSON.stringify(response));
      
      // Redirecionar para home
      navigate('/home');
    } catch (err) {
      setError('Email ou senha inválidos');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
      <button type="submit">Entrar</button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </form>
  );
}
```

---

## 📊 Estrutura do Banco de Dados

```
tcc_viagem
├── clientes
│   ├── id (PK)
│   ├── nome
│   ├── email (UNIQUE)
│   ├── password
│   ├── telefone
│   ├── endereco
│   ├── data_criacao
│   └── ativo
│
├── viagens
│   ├── id (PK)
│   ├── cliente_id (FK → clientes)
│   ├── destino
│   ├── origem
│   ├── data_inicio
│   ├── data_fim
│   ├── orcamento
│   ├── gasto_total
│   ├── descricao
│   ├── status
│   └── data_criacao
│
├── despesas
│   ├── id (PK)
│   ├── viagem_id (FK → viagens)
│   ├── cliente_id (FK → clientes)
│   ├── categoria
│   ├── descricao
│   ├── valor
│   ├── data_despesa
│   ├── metodo_pagamento
│   └── data_criacao
│
├── atividades
│   ├── id (PK)
│   ├── viagem_id (FK → viagens)
│   ├── titulo
│   ├── descricao
│   ├── data_atividade
│   ├── hora_inicio
│   ├── hora_fim
│   ├── local
│   ├── status
│   └── data_criacao
│
└── lista_compras
    ├── id (PK)
    ├── viagem_id (FK → viagens)
    ├── cliente_id (FK → clientes)
    ├── item
    ├── quantidade
    ├── concluido
    └── data_criacao
```

---

## 🔐 Segurança Importante

⚠️ **Nunca exponha sua senha no código!**

Sempre use variáveis de ambiente:

```javascript
// ❌ ERRADO
const API_URL = 'http://localhost:3000';
const USER = 'root';
const PASSWORD = '1234';

// ✅ CORRETO
const API_URL = process.env.REACT_APP_API_URL;
```

---

## 🐛 Troubleshooting

### Erro 404 - Rota não encontrada
- Certifique-se que a rota está implementada em `Backend/routes/clients.js`
- Verifique a URL digitada corretamente

### Erro 500 - Erro interno do servidor
- Verifique se o banco de dados está conectado
- Olhe os logs no terminal do Backend
- Certifique-se de que as tabelas existem

### CORS Error
- Verifique se o `.env` tem `CORS_ORIGIN=http://localhost:5173`
- Reinicie o servidor Backend

---

## 📝 Próximos Passos

1. ✅ Criar todas as rotas CRUD
2. ✅ Implementar autenticação JWT
3. ✅ Adicionar validação de entrada
4. ✅ Integrar com Frontend
5. ✅ Fazer testes com Postman
6. ✅ Deploy na nuvem (Heroku, Railway, etc)

---

## 📚 Recursos

- [Express.js REST API](https://expressjs.com/en/guide/routing.html)
- [MariaDB Connector Node.js](https://mariadb.com/docs/nodejs-connector/)
- [Postman API Testing](https://learning.postman.com/docs/getting-started/introduction/)
- [React Hooks](https://react.dev/reference/react)

---

Agora você tem tudo que precisa para integrar seu Backend com o Frontend! 🎉
