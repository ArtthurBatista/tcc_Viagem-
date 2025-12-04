import genAI from '../config/gemini.js';
import { PROMPT_SISTEMA_CHATBOT, MODELO_GEMINI } from '../config/prompts.js';

/**
 * Serviço de chat com Gemini AI
 */
class ChatbotService {
  /**
   * Gera uma resposta do chatbot baseada na mensagem e contexto
   * @param {string} mensagem - Mensagem do usuário
   * @param {Array} contexto - Histórico de mensagens anteriores
   * @returns {Promise<string>} - Resposta gerada pela IA
   */
  async gerarResposta(mensagem, contexto = []) {
    try {
      console.log('🤖 Gerando resposta com Gemini...');
      
      // Configurar o modelo
      const modelo = genAI.getGenerativeModel({ model: MODELO_GEMINI });

      // Montar histórico da conversa
      let historicoConversa = PROMPT_SISTEMA_CHATBOT + '\n\n';
      
      if (contexto && contexto.length > 0) {
        contexto.forEach(msg => {
          historicoConversa += `${msg.isAi ? 'Assistente' : 'Usuário'}: ${msg.text}\n`;
        });
      }
      
      historicoConversa += `Usuário: ${mensagem}\nAssistente:`;

      // Gerar resposta
      const resultado = await modelo.generateContent(historicoConversa);
      const resposta = await resultado.response;
      const texto = resposta.text();

      console.log('✅ Resposta gerada com sucesso');
      
      return texto;
    } catch (error) {
      console.error('❌ Erro ao gerar resposta:', error);
      throw error;
    }
  }

  /**
   * Sugere destinos baseado nas preferências do usuário
   * @param {string} preferencias - Preferências do usuário
   * @returns {Promise<string>} - Sugestões de destinos
   */
  async sugerirDestinos(preferencias) {
    try {
      const modelo = genAI.getGenerativeModel({ model: MODELO_GEMINI });
      
      const prompt = `Com base nas seguintes preferências, sugira 3 destinos de viagem ideais:
${preferencias}

Por favor, forneça para cada destino:
1. Nome do destino
2. Por que é adequado para essas preferências
3. Melhor época para visitar
4. Estimativa de custo (baixo/médio/alto)

Responda em formato JSON.`;

      const resultado = await modelo.generateContent(prompt);
      const resposta = await resultado.response;
      const texto = resposta.text();

      return texto;
    } catch (error) {
      console.error('❌ Erro ao sugerir destinos:', error);
      throw error;
    }
  }
}

export default new ChatbotService();
