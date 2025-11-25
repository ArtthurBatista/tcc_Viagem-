-- Adicionar coluna foto_perfil na tabela clientes se não existir
USE clients_orders_system;

ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS foto_perfil VARCHAR(255) AFTER password;

-- Verificar estrutura da tabela
DESCRIBE clientes;
