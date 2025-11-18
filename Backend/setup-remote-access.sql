-- Execute este script no HeidiSQL para permitir acesso remoto

-- 1. Criar usuário que pode acessar de qualquer IP
CREATE USER 'tcc_user'@'%' IDENTIFIED BY 'Tcc@2024!';

-- 2. Dar todas as permissões no banco clients_orders_system
GRANT ALL PRIVILEGES ON clients_orders_system.* TO 'tcc_user'@'%';

-- 3. Aplicar as mudanças
FLUSH PRIVILEGES;

-- 4. Verificar se foi criado
SELECT User, Host FROM mysql.user WHERE User='tcc_user';

-- Resultado esperado:
-- User      | Host
-- tcc_user  | %
