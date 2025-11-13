require('dotenv').config();
const pool = require('./db');

async function clearTestData() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    console.log('\n🗑️  Limpando dados de teste...\n');
    
    // Contar registros antes
    const [beforeCount] = await conn.query('SELECT COUNT(*) as total FROM clientes');
    console.log(`📊 Registros antes: ${beforeCount.total}`);
    
    if (beforeCount.total > 0) {
      // Listar os usuários que serão deletados
      const users = await conn.query('SELECT id, nome, email FROM clientes');
      console.log('\n👥 Usuários que serão deletados:');
      users.forEach(user => {
        console.log(`   ${user.id}. ${user.nome} - ${user.email}`);
      });
      
      // Deletar viagens associadas primeiro (por causa da chave estrangeira)
      const viagensDeleted = await conn.query('DELETE FROM viagens');
      console.log(`\n🗑️  ${viagensDeleted.affectedRows} viagens deletadas`);
      
      // Deletar todos os clientes
      const result = await conn.query('DELETE FROM clientes');
      console.log(`🗑️  ${result.affectedRows} clientes deletados`);
      
      // Reset auto increment
      await conn.query('ALTER TABLE clientes AUTO_INCREMENT = 1');
      await conn.query('ALTER TABLE viagens AUTO_INCREMENT = 1');
      
      console.log('\n✅ Dados limpos com sucesso!');
      console.log('💡 Agora você pode cadastrar novos usuários do zero.');
    } else {
      console.log('\n⚠️  Nenhum dado para limpar.');
    }
    
  } catch (error) {
    console.error('\n❌ Erro ao limpar dados:', error.message);
  } finally {
    if (conn) conn.release();
    process.exit(0);
  }
}

clearTestData();
