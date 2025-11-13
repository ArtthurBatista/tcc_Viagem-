# TCC Viagem - Sistema de Planejamento de Viagens

Sistema web para planejamento de viagens com assistente virtual integrado usando Gemini AI.

## 🚀 Tecnologias Utilizadas

### Frontend
- React + Vite
- React Router
- CSS customizado

### Backend
- Node.js + Express
- Google Generative AI (Gemini)
- CORS

## 📋 Pré-requisitos

- Node.js v22.19.0 ou superior
- npm (gerenciador de pacotes)
- Chave de API do Google Gemini

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/ArtthurBatista/tcc_Viagem-.git
cd tcc_Viagem-
```

### 2. Instale as dependências do Backend
```powershell
cd BackEnd
npm install
```

### 3. Instale as dependências do Frontend
```powershell
cd ..\FrontEnd
npm install
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na pasta `BackEnd` com sua chave da API do Gemini:

```env
GEMINI_API_KEY=sua_chave_api_aqui
```

## ▶️ Como Executar

### Opção 1: Executar manualmente (2 terminais)

#### Terminal 1 - Backend
```powershell
cd BackEnd
npm start
```
O backend estará rodando em `http://localhost:3001`

#### Terminal 2 - Frontend
```powershell
cd FrontEnd
npm run dev
```
O frontend estará rodando em `http://localhost:3000`

### Opção 2: Executar tudo de uma vez

Abra 2 terminais PowerShell e execute:

**Terminal 1:**
```powershell
cd BackEnd; npm start
```

**Terminal 2:**
```powershell
cd FrontEnd; npm run dev
```

## 🌐 Acessando a Aplicação

1. Abra seu navegador
2. Acesse `http://localhost:3000`
3. O chatbot (Viajante+) aparecerá como um botão flutuante no canto inferior direito

## 🤖 Funcionalidades do Chatbot

O assistente virtual **Viajante+** utiliza o modelo `gemini-2.0-flash` e oferece:

- Sugestões de destinos de viagem
- Dicas de planejamento
- Informações sobre cultura e gastronomia
- Roteiros personalizados
- Formatação rica com negrito, itálico e listas

## 📁 Estrutura do Projeto

```
tcc_Viagem-/
│
├── BackEnd/
│   ├── server.js          # Servidor Express com integração Gemini
│   ├── package.json       # Dependências do backend
│   └── .env              # Variáveis de ambiente (não versionado)
│
└── FrontEnd/
    ├── src/
    │   ├── App.jsx       # Componente principal
    │   ├── pages/        # Páginas da aplicação
    │   │   ├── home/
    │   │   ├── login/
    │   │   ├── chatbot/  # Componente do chatbot
    │   │   └── ...
    │   └── components/
    │       └── ChatWidget/  # Widget flutuante do chatbot
    ├── package.json      # Dependências do frontend
    └── vite.config.js    # Configuração do Vite (proxy API)
```

## 🛠️ Comandos Úteis

### Backend
```powershell
cd BackEnd
npm start          # Inicia o servidor
npm install        # Instala dependências
```

### Frontend
```powershell
cd FrontEnd
npm run dev        # Inicia o servidor de desenvolvimento
npm run build      # Cria build de produção
npm install        # Instala dependências
```

## 🐛 Solução de Problemas

### Porta já em uso (EADDRINUSE)
```powershell
# Encerra todos os processos Node.js
Stop-Process -Name node -Force
```

### Backend não responde
1. Verifique se a chave da API do Gemini está correta no `.env`
2. Certifique-se de que o backend está rodando na porta 3001
3. Verifique os logs do terminal do backend

### Chatbot não aparece
1. Confirme que você não está na página de login
2. Verifique se o frontend está rodando
3. Abra o console do navegador (F12) para ver erros

## 📝 Notas Importantes

- O chatbot NÃO aparece na página de login
- O backend deve estar rodando para o chatbot funcionar
- As conversas do chatbot são armazenadas apenas na sessão atual (localStorage)
- O modelo do Gemini usado é o `gemini-2.0-flash`

## 👥 Autores

- **Arthur Batista** - [ArtthurBatista](https://github.com/ArtthurBatista)

## 📄 Licença

Este projeto é parte de um Trabalho de Conclusão de Curso (TCC).
