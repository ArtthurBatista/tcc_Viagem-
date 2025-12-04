import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Verificando configuração...\n');
console.log('Chave API:', process.env.GEMINI_API_KEY);
console.log('Tamanho da chave:', process.env.GEMINI_API_KEY?.length);
console.log('Começa com AIza:', process.env.GEMINI_API_KEY?.startsWith('AIza'));

// Testar requisição direta
const testAPI = async () => {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ API Key válida!');
      console.log('\n📋 Modelos disponíveis:');
      data.models?.forEach(model => {
        console.log(`  - ${model.name}`);
      });
    } else {
      console.log('\n❌ Erro na API:');
      console.log(data);
    }
  } catch (error) {
    console.log('\n❌ Erro ao conectar:', error.message);
  }
};

testAPI();
