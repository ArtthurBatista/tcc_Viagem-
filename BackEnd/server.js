import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializar Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API Viagem+ está rodando! 🚀' });
});

// Rota do chat com Gemini
app.post('/api/chat', async (req, res) => {
  console.log('📨 Recebida requisição no /api/chat');
  console.log('Body:', req.body);
  
  try {
    const { message, context } = req.body;

    if (!message) {
      console.log('❌ Mensagem vazia');
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }

    console.log('🤖 Gerando resposta com Gemini...');
    
    // Configurar o modelo Gemini (usando modelo disponível)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Criar o contexto da conversa com foco em viagens
    const systemPrompt = `Você é o Viajante+, um assistente virtual especializado em ajudar pessoas a planejarem suas viagens.
Você é amigável, útil e conhecedor sobre:
- Destinos turísticos ao redor do mundo
- Dicas de viagem (documentação, vacinas, melhor época para visitar)
- Planejamento de roteiros
- Estimativa de custos de viagem
- Sugestões de hospedagem e alimentação
- Cultura local e costumes
- Atividades turísticas e pontos de interesse
- Dicas de segurança para viajantes

Sempre responda de forma clara, objetiva e amigável. Use emojis quando apropriado para deixar a conversa mais leve.
`;

    // Montar histórico da conversa
    let conversationHistory = systemPrompt + '\n\n';
    
    if (context && context.length > 0) {
      context.forEach(msg => {
        conversationHistory += `${msg.isAi ? 'Assistente' : 'Usuário'}: ${msg.text}\n`;
      });
    }
    
    conversationHistory += `Usuário: ${message}\nAssistente:`;

    // Gerar resposta com Gemini
    const result = await model.generateContent(conversationHistory);
    const response = await result.response;
    const text = response.text();

    console.log('✅ Resposta gerada com sucesso');
    
    res.json({ 
      response: text,
      success: true 
    });

  } catch (error) {
    console.error('❌ Erro no chat:', error.message);
    console.error('Detalhes:', error);
    
    // Tratamento de erros específicos
    if (error.message?.includes('API_KEY') || error.message?.includes('API key')) {
      return res.status(500).json({ 
        error: 'Erro de configuração da API. Verifique sua chave do Gemini.',
        details: error.message
      });
    }
    
    if (error.message?.includes('PERMISSION_DENIED')) {
      return res.status(500).json({ 
        error: 'Chave da API sem permissão. Verifique se a chave está ativa.',
        details: error.message
      });
    }
    
    res.status(500).json({ 
      error: 'Desculpe, tive um problema ao processar sua mensagem. Tente novamente!',
      details: error.message
    });
  }
});

// Rota para sugestões de viagem
app.post('/api/suggest-destination', async (req, res) => {
  try {
    const { preferences } = req.body;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `Com base nas seguintes preferências, sugira 3 destinos de viagem ideais:
${preferences}

Por favor, forneça para cada destino:
1. Nome do destino
2. Por que é adequado para essas preferências
3. Melhor época para visitar
4. Estimativa de custo (baixo/médio/alto)

Responda em formato JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ 
      suggestions: text,
      success: true 
    });

  } catch (error) {
    console.error('Erro ao sugerir destino:', error);
    res.status(500).json({ error: 'Erro ao gerar sugestões' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}`);
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'sua_chave_api_aqui') {
    console.warn('⚠️  ATENÇÃO: Configure sua GEMINI_API_KEY no arquivo .env');
  }
});
