import express from 'express';
import chatbotService from '../services/chatbotService.js';

const router = express.Router();

/**
 * POST /api/chat
 * Rota principal do chatbot
 */
router.post('/chat', async (req, res) => {
  console.log('📨 Recebida requisição no /api/chat');
  console.log('Body:', req.body);
  
  try {
    const { message, context } = req.body;

    // Validação
    if (!message) {
      console.log('❌ Mensagem vazia');
      return res.status(400).json({ erro: 'Mensagem é obrigatória' });
    }

    // Gerar resposta usando o serviço
    const texto = await chatbotService.gerarResposta(message, context);
    
    res.json({ 
      response: texto,
      success: true 
    });

  } catch (error) {
    console.error('❌ Erro no chat:', error.message);
    console.error('Detalhes:', error);
    
    // Tratamento de erros específicos
    if (error.message?.includes('API_KEY') || error.message?.includes('API key')) {
      return res.status(500).json({ 
        erro: 'Erro de configuração da API. Verifique sua chave do Gemini.',
        detalhes: error.message
      });
    }
    
    if (error.message?.includes('PERMISSION_DENIED')) {
      return res.status(500).json({ 
        erro: 'Chave da API sem permissão. Verifique se a chave está ativa.',
        detalhes: error.message
      });
    }
    
    res.status(500).json({ 
      erro: 'Desculpe, tive um problema ao processar sua mensagem. Tente novamente!',
      detalhes: error.message
    });
  }
});

/**
 * POST /api/suggest-destination
 * Rota para sugerir destinos
 */
router.post('/suggest-destination', async (req, res) => {
  try {
    const { preferences } = req.body;
    
    const sugestoes = await chatbotService.sugerirDestinos(preferences);

    res.json({ 
      suggestions: sugestoes,
      success: true 
    });

  } catch (error) {
    console.error('❌ Erro ao sugerir destino:', error);
    res.status(500).json({ 
      erro: 'Erro ao gerar sugestões',
      detalhes: error.message
    });
  }
});

export default router;
