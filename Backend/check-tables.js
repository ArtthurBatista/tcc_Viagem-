require('dotenv').config();
const pool = require('./db');

async function checkTables() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    console.log('\n📊 Verificando banco de dados...\n');
    
    // Verificar banco atual
    const [currentDb] = await conn.query('SELECT DATABASE() as db');
    console.log('✅ Banco de dados atual:', currentDb.db);
    
    // Listar todas as tabelas
    const tables = await conn.query('SHOW TABLES');
    console.log('\n📋 Tabelas encontradas:');
    if (tables.length === 0) {
      console.log('   ❌ Nenhuma tabela encontrada!');
    } else {
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`   ✓ ${tableName}`);
      });
    }
    
    // Verificar se a tabela 'clientes' existe
    const clientesTable = tables.find(table => Object.values(table)[0] === 'clientes');
    
    if (clientesTable) {
      console.log('\n📊 Estrutura da tabela "clientes":');
      const columns = await conn.query('DESCRIBE clientes');
      columns.forEach(col => {
        console.log(`   - ${col.Field} (${col.Type}) ${col.Key ? '[' + col.Key + ']' : ''}`);
      });
      
      // Contar registros
      const [count] = await conn.query('SELECT COUNT(*) as total FROM clientes');
      console.log(`\n👥 Total de registros: ${count.total}`);
      
      // Listar emails cadastrados (sem mostrar senhas)
      if (count.total > 0) {
        const users = await conn.query('SELECT id, nome, email FROM clientes LIMIT 5');
        console.log('\n📧 Emails já cadastrados:');
        users.forEach(user => {
          console.log(`   ${user.id}. ${user.nome} - ${user.email}`);
        });
      }
    } else {
      console.log('\n❌ Tabela "clientes" NÃO ENCONTRADA!');
      console.log('\n💡 Você precisa criar a tabela. Execute:');
      console.log('   mysql -u root -p < schema.sql');
    }
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
  } finally {
    if (conn) conn.release();
    process.exit(0);
  }
}

checkTables();
