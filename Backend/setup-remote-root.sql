-- Script para permitir acesso remoto ao MariaDB
-- Execute no HeidiSQL conectado como root

-- Permitir que root acesse de qualquer IP
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '1234' WITH GRANT OPTION;

-- Criar também o usuário tcc_user (alternativa mais segura)
CREATE USER IF NOT EXISTS 'tcc_user'@'%' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON clients_orders_system.* TO 'tcc_user'@'%';

-- Aplicar mudanças
FLUSH PRIVILEGES;

-- Verificar usuários criados
SELECT User, Host FROM mysql.user WHERE User IN ('root', 'tcc_user');
