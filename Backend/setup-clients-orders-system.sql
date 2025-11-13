-- Script para criar a tabela clientes no banco clients_order_system
-- Execute isto no HeidiSQL

USE clients_order_system;

-- Criar tabela clientes (se não existir)
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  endereco VARCHAR(255),
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT 1,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de viagens (opcional - para funcionalidades futuras)
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
  status ENUM('planejada', 'em_progresso', 'concluida', 'cancelada') DEFAULT 'planejada',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  INDEX idx_cliente_viagens (cliente_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de despesas (opcional)
CREATE TABLE IF NOT EXISTS despesas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  viagem_id INT NOT NULL,
  cliente_id INT NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  descricao VARCHAR(255),
  valor DECIMAL(10, 2) NOT NULL,
  data_despesa DATE NOT NULL,
  metodo_pagamento ENUM('dinheiro', 'cartao_credito', 'cartao_debito', 'pix', 'outro') DEFAULT 'cartao_credito',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (viagem_id) REFERENCES viagens(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  INDEX idx_viagem_despesas (viagem_id),
  INDEX idx_cliente_despesas (cliente_id),
  INDEX idx_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verificar se as tabelas foram criadas
SELECT 'Tabelas criadas com sucesso!' as resultado;
SHOW TABLES;
