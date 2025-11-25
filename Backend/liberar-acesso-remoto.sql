-- EXECUTE ESTE SCRIPT NO HEIDISQL PARA LIBERAR ACESSO REMOTO
-- Conecte como root@localhost e execute (F9)

-- Permitir que root conecte de qualquer IP
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '1234' WITH GRANT OPTION;

-- Aplicar mudanças
FLUSH PRIVILEGES;

-- Verificar se funcionou
SELECT User, Host FROM mysql.user WHERE User='root';

-- Resultado esperado: deve aparecer root com Host = % (além do localhost)
