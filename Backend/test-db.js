// 🧪 Teste de Conexão MariaDB
// Salve este arquivo como: Backend/test-db.js
// Execute: node test-db.js

const mariadb = require('mariadb');

async function testConnection() {
  console.log('🧪 TESTE DE CONEXÃO MARIADB\n');

  // Configurações de teste
  const configs = [
    {
      name: '1. localhost (padrão)',
      config: {
        host: 'localhost',
        user: 'root',
        password: '1234',
        port: 3306,
      }
    },
    {
      name: '2. localhost (sem senha)',
      config: {
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3306,
      }
    },
    {
      name: '3. 127.0.0.1 (IP)',
      config: {
        host: '127.0.0.1',
        user: 'root',
        password: '1234',
        port: 3306,
      }
    },
    {
      name: '4. localhost (porta 3307)',
      config: {
        host: 'localhost',
        user: 'root',
        password: '1234',
        port: 3307,
      }
    },
  ];

  for (const { name, config } of configs) {
    console.log(`\n${name}`);
    console.log(`Host: ${config.host}, Port: ${config.port}, User: ${config.user}`);

    try {
      const conn = await mariadb.createConnection(config);
      console.log('✅ CONECTADO COM SUCESSO!\n');
      console.log(`Configuração correta:`);
      console.log(`  host: ${config.host}`);
      console.log(`  user: ${config.user}`);
      console.log(`  password: ${config.password || '(vazio)'}`);
      console.log(`  port: ${config.port}`);
      console.log(`\nAtualize Backend/.env com esses valores!`);
      await conn.end();
      return; // Parar após primeira conexão bem-sucedida
    } catch (err) {
      console.log(`❌ Erro: ${err.message.substring(0, 80)}`);
    }
  }

  console.log('\n\n❌ NENHUMA CONFIGURAÇÃO FUNCIONOU!');
  console.log('\nVerifique:');
  console.log('1. MariaDB está rodando? (Serviços do Windows)');
  console.log('2. Qual é a senha do usuário root?');
  console.log('3. MariaDB está na porta padrão (3306)?');
  console.log('4. MariaDB está realmente instalado?');
}

testConnection().catch(console.error);
