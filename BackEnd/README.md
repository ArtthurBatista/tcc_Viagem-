# Backend Viagem+ com Gemini AI

## 📁 Estrutura do Projeto

```
BackEnd/
├── src/
│   ├── config/              # Configurações
│   │   ├── gemini.js        # Cliente Gemini AI
│   │   └── prompts.js       # Prompts do sistema
│   │
│   ├── services/            # Lógica de negócio
│   │   └── chatbotService.js  # Serviço do chatbot
│   │
│   ├── routes/              # Rotas da API
│   │   └── chatbot.js       # Endpoints do chatbot
│   │
│   ├── utils/               # Utilitários e testes
│   │
│   └── README.md            # Documentação detalhada
│
├── server.js                # Servidor principal
├── .env                     # Variáveis de ambiente
├── package.json             # Dependências
└── README.md                # Este arquivo
```

## 🚀 Como configurar e usar

### 1. Instalar dependências

Abra o terminal na pasta BackEnd e execute:

```bash
cd BackEnd
npm install
```

### 2. Obter a chave da API do Gemini

1. Acesse: https://makersuite.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada

### 3. Configurar a chave no arquivo .env

Abra o arquivo `.env` na pasta BackEnd e substitua:

```
GEMINI_API_KEY=sua_chave_api_aqui
```

Por:

```
GEMINI_API_KEY=SUA_CHAVE_REAL_AQUI
```

### 4. Iniciar o servidor

```bash
npm start
```

Ou para desenvolvimento com auto-reload:

```bash
npm run dev
```

O servidor iniciará na porta 3001: http://localhost:3001

### 5. Testar a API

Você pode testar fazendo uma requisição POST para:

```
POST http://localhost:3001/api/chat

Body (JSON):
{
  "message": "Quero viajar para o Japão, que dicas você tem?",
  "context": []
}
```

## 🔧 Configuração do Frontend

O chatbox já está configurado para usar a API `/api/chat`, mas você precisa atualizar a URL base.

### Opção 1: Usando proxy no Vite

Adicione no `vite.config.js` do frontend:

```javascript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
}
```

### Opção 2: Alterar a URL diretamente no chatbox

No arquivo `chatbox.jsx`, mude a URL da requisição de `/api/chat` para `http://localhost:3001/api/chat`

## 📝 Rotas disponíveis

- `GET /` - Teste da API
- `POST /api/chat` - Chat com Gemini
- `POST /api/suggest-destination` - Sugestões de destinos

## 🔍 Solução de problemas

### Erro "API_KEY inválida"
- Verifique se copiou a chave corretamente
- Certifique-se de que não há espaços antes ou depois da chave

### Erro "Cannot find module"
- Execute `npm install` novamente

### Servidor não inicia
- Verifique se a porta 3001 já não está em uso
- Mude a porta no arquivo .env: `PORT=3002`
