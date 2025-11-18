-- Adicionar campo de imagem na tabela viagens
USE clients_orders_system;

ALTER TABLE viagens ADD COLUMN imagem_url VARCHAR(500) AFTER descricao;

-- Ou se a tabela não existe ainda:
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
