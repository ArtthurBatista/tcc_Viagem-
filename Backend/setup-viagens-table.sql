-- ====================================
-- CONFIGURAR TABELA VIAGENS NO MARIADB
-- ====================================
-- Execute este script no HeidiSQL

USE clients_orders_system;

-- Criar tabela de viagens se não existir
CREATE TABLE IF NOT EXISTS viagens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  destino VARCHAR(100) NOT NULL,
  origem VARCHAR(100) NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  orcamento DECIMAL(10, 2),
  gasto_total DECIMAL(10, 2) DEFAULT 0,
  descricao TEXT,
  imagem_url VARCHAR(500),
  status ENUM('planejada', 'em_progresso', 'concluida', 'cancelada') DEFAULT 'planejada',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  INDEX idx_cliente_viagens (cliente_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Se a tabela já existe mas não tem o campo imagem_url, adicione:
ALTER TABLE viagens ADD COLUMN IF NOT EXISTS imagem_url VARCHAR(500) AFTER descricao;

-- Verificar se a tabela foi criada
SELECT 'Tabela viagens criada com sucesso!' as resultado;
SHOW COLUMNS FROM viagens;

-- Inserir uma viagem de teste
INSERT INTO viagens (cliente_id, destino, origem, data_inicio, data_fim, orcamento, descricao, status)
VALUES (1, 'Paris', 'São Paulo', '2025-06-01', '2025-06-15', 5000.00, 'Viagem dos sonhos para Paris', 'planejada');

-- Verificar dados
SELECT * FROM viagens;
