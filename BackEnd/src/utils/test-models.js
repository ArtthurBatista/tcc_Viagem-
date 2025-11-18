import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModels() {
  console.log('🔍 Testando modelos disponíveis...\n');
  
  const modelsToTest = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.0-pro'
  ];
  
  for (const modelName of modelsToTest) {
    try {
      console.log(`Testando: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Diga apenas: funcionando');
      const response = await result.response;
      const text = response.text();
      console.log(`✅ ${modelName} - FUNCIONA!`);
      console.log(`   Resposta: ${text}\n`);
    } catch (error) {
      console.log(`❌ ${modelName} - ERRO: ${error.message}\n`);
    }
  }
}

testModels();
