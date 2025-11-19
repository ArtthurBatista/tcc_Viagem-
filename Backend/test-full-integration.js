require('dotenv').config();
const pool = require('./db');

async function testConnection() {
  console.log('🔍 Testando conexão com o banco...\n');
  
  try {
    // 1. Testar conexão
    const conn = await pool.getConnection();
    console.log('✅ Conexão estabelecida com sucesso!');
    console.log(`   Database: ${process.env.DB_NAME || 'clients_orders_system'}`);
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}\n`);
    
    // 2. Verificar tabela clientes
    const tables = await conn.query("SHOW TABLES LIKE 'clientes'");
    if (tables.length === 0) {
      console.log('❌ Tabela "clientes" não encontrada!');
      console.log('   Execute: node -e "require(\'./db\'); const fs = require(\'fs\'); const sql = fs.readFileSync(\'schema.sql\', \'utf8\'); // rode manualmente"\n');
      conn.release();
      return;
    }
    console.log('✅ Tabela "clientes" encontrada\n');
    
    // 3. Verificar estrutura da tabela
    const structure = await conn.query('DESCRIBE clientes');
    console.log('📋 Estrutura da tabela clientes:');
    structure.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type} ${col.Key === 'PRI' ? '(PRIMARY KEY)' : ''}`);
    });
    console.log('');
    
    // 4. Contar registros
    const [result] = await conn.query('SELECT COUNT(*) as total FROM clientes');
    console.log(`📊 Total de clientes cadastrados: ${result.total}\n`);
    
    // 5. Listar últimos 5 clientes
    if (result.total > 0) {
      const clients = await conn.query('SELECT id, nome, email FROM clientes ORDER BY id DESC LIMIT 5');
      console.log('👥 Últimos clientes cadastrados:');
      clients.forEach(c => {
        console.log(`   - [${c.id}] ${c.nome} (${c.email})`);
      });
    }
    
    conn.release();
    console.log('\n✅ Teste concluído com sucesso!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('\n💡 Dicas:');
    console.error('   1. Verifique se o MariaDB está rodando');
    console.error('   2. Confira as credenciais no arquivo .env');
    console.error('   3. Execute o schema.sql no HeidiSQL ou MySQL Workbench');
    process.exit(1);
  }
}

testConnection();
