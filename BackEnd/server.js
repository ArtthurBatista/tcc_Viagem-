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
      return res.status(400).json({ erro: 'Mensagem é obrigatória' });
    }

    console.log('🤖 Gerando resposta com Gemini...');
    
    // Configurar o modelo Gemini (usando modelo disponível)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Criar o contexto da conversa com foco em viagens
    const promptSistema = `Você é o Viajante+, um assistente virtual do site de planejamento de viagens.
Sua função principal é GUIAR o usuário pelas funcionalidades do site e ajudá-lo a planejar sua viagem completa.

PÁGINAS DISPONÍVEIS NO SITE:
1. **Início** (/home) - Página inicial onde o usuário pode começar
2. **Planejar Viagens** (/plan-trip) - Onde o usuário cria e planeja novas viagens
3. **Minhas Viagens** (/my-trips) - Lista das viagens salvas/planejadas pelo usuário
4. **Perfil** (/user-profile) - Dados e configurações do usuário

IMPORTANTE - FORMATO DE LINKS:
Quando você quiser que o usuário acesse uma página, use o formato:
[BOTAO:/rota]Texto do Botão[/BOTAO]

Exemplos:
- [BOTAO:/plan-trip]Planejar Nova Viagem[/BOTAO]
- [BOTAO:/my-trips]Ver Minhas Viagens[/BOTAO]
- [BOTAO:/user-profile]Acessar Meu Perfil[/BOTAO]
- [BOTAO:/home]Voltar para Início[/BOTAO]

COMO VOCÊ DEVE AJUDAR:

**1. Planejamento Inicial:**
- Pergunte sobre o destino, datas, orçamento e preferências
- Ofereça o botão para acessar "Planejar Viagens"
- Oriente sobre documentação necessária, melhor época para visitar, clima

**2. Durante o Planejamento:**
- Ajude com sugestões de roteiros, pontos turísticos
- Dê dicas de hospedagem, alimentação, transporte
- Informe sobre cultura local e costumes
- Sempre que relevante, ofereça botões para as páginas

**3. Acompanhamento:**
- Ofereça botão para "Minhas Viagens" quando o usuário perguntar sobre viagens salvas
- Oriente sobre como acessar os detalhes
- Ajude com dúvidas sobre a viagem já planejada

**4. Informações de Pagamento:**
- Informe que o site oferece opções de pagamento seguras
- Oriente sobre os passos para finalizar a compra/reserva
- Dê dicas sobre formas de pagamento em viagens

DIRETRIZES:
- SEMPRE use [BOTAO:rota]texto[/BOTAO] quando mencionar páginas
- Use botões no início ou fim das respostas
- Seja proativo em sugerir o próximo passo
- Use linguagem amigável e emojis quando apropriado
- Seja objetivo mas completo nas respostas

EXEMPLO DE INTERAÇÃO:
Usuário: "Quero fazer uma viagem para o Rio de Janeiro"
Você: "Que legal! 😊 Vamos planejar sua viagem ao Rio! 

Para começar, você pode criar sua viagem aqui:
[BOTAO:/plan-trip]Criar Viagem para o Rio[/BOTAO]

Enquanto isso, me conta: quando você pretende viajar e quantos dias vai ficar? Assim posso te dar dicas personalizadas sobre o que fazer por lá! 🏖️"

Use botões sempre que fizer sentido direcionar o usuário para uma página específica.
`;

    // Montar histórico da conversa
    let historicoConversa = promptSistema + '\n\n';
    
    if (context && context.length > 0) {
      context.forEach(msg => {
        historicoConversa += `${msg.isAi ? 'Assistente' : 'Usuário'}: ${msg.text}\n`;
      });
    }
    
    historicoConversa += `Usuário: ${message}\nAssistente:`;

    // Gerar resposta com Gemini
    const resultado = await model.generateContent(historicoConversa);
    const resposta = await resultado.response;
    const texto = resposta.text();

    console.log('✅ Resposta gerada com sucesso');
    
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
