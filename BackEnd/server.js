import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatbotRoutes from './src/routes/chatbot.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API Viagem+ está rodando! 🚀' });
});

// Rotas do chatbot
app.use('/api', chatbotRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}`);
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'sua_chave_api_aqui') {
    console.warn('⚠️  ATENÇÃO: Configure sua GEMINI_API_KEY no arquivo .env');
  }
});
