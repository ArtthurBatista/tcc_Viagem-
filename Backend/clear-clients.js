require('dotenv').config();
const pool = require('./db');

async function clearClients() {
  console.log('🗑️  Limpando tabela clientes...\n');
  
  try {
    const conn = await pool.getConnection();
    
    // Contar registros antes
    const [before] = await conn.query('SELECT COUNT(*) as total FROM clientes');
    console.log(`📊 Total de registros ANTES: ${before.total}`);
    
    if (before.total === 0) {
      console.log('✅ Tabela já está vazia!');
      conn.release();
      process.exit(0);
      return;
    }
    
    // Confirmar limpeza
    console.log('\n⚠️  Deletando todos os registros...');
    
    // Deletar todos os registros
    const result = await conn.query('DELETE FROM clientes');
    console.log(`✅ ${result.affectedRows} registros deletados`);
    
    // Resetar auto_increment
    await conn.query('ALTER TABLE clientes AUTO_INCREMENT = 1');
    console.log('✅ Auto increment resetado para 1');
    
    // Contar registros depois
    const [after] = await conn.query('SELECT COUNT(*) as total FROM clientes');
    console.log(`\n📊 Total de registros DEPOIS: ${after.total}`);
    
    conn.release();
    console.log('\n✅ Tabela clientes completamente limpa!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

clearClients();
