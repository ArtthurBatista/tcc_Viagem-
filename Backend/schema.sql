-- ================================
-- Script SQL para criar as tabelas
-- Banco: tcc_viagem
-- ================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS tcc_viagem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE tcc_viagem;

-- ================================
-- TABELA: CLIENTES
-- ================================
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

-- ================================
-- TABELA: VIAGENS
-- ================================
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

-- ================================
-- TABELA: DESPESAS
-- ================================
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

-- ================================
-- TABELA: ATIVIDADES
-- ================================
CREATE TABLE IF NOT EXISTS atividades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  viagem_id INT NOT NULL,
  titulo VARCHAR(100) NOT NULL,
  descricao TEXT,
  data_atividade DATE NOT NULL,
  hora_inicio TIME,
  hora_fim TIME,
  local VARCHAR(255),
  status ENUM('planejada', 'em_progresso', 'concluida', 'cancelada') DEFAULT 'planejada',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (viagem_id) REFERENCES viagens(id) ON DELETE CASCADE,
  INDEX idx_viagem_atividades (viagem_id),
  INDEX idx_data (data_atividade)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- TABELA: LISTA DE COMPRAS
-- ================================
CREATE TABLE IF NOT EXISTS lista_compras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  viagem_id INT NOT NULL,
  cliente_id INT NOT NULL,
  item VARCHAR(100) NOT NULL,
  quantidade INT DEFAULT 1,
  concluido BOOLEAN DEFAULT 0,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (viagem_id) REFERENCES viagens(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  INDEX idx_viagem_lista (viagem_id),
  INDEX idx_cliente_lista (cliente_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- INSERTS DE TESTE
-- ================================

-- Inserir um cliente de teste
INSERT INTO clientes (nome, email, password, telefone, endereco) VALUES 
('João Silva', 'joao@example.com', 'senha123', '11999999999', 'Rua A, 123');

-- Inserir uma viagem de teste
INSERT INTO viagens (cliente_id, destino, origem, data_inicio, data_fim, orcamento, descricao) VALUES 
(1, 'Paris', 'São Paulo', '2025-06-01', '2025-06-15', 5000.00, 'Viagem para Paris');

-- Inserir uma despesa de teste
INSERT INTO despesas (viagem_id, cliente_id, categoria, descricao, valor, data_despesa) VALUES 
(1, 1, 'Passagem Aérea', 'Passagem aérea para Paris', 2000.00, '2025-06-01');

-- ================================
-- QUERIES ÚTEIS
-- ================================

-- Ver todas as tabelas criadas
-- SHOW TABLES;

-- Ver estrutura de uma tabela
-- DESCRIBE clientes;

-- Ver dados
-- SELECT * FROM clientes;
-- SELECT * FROM viagens;
-- SELECT * FROM despesas;

-- Ver viagens de um cliente
-- SELECT v.* FROM viagens v WHERE v.cliente_id = 1;

-- Ver total de gastos por viagem
-- SELECT v.id, v.destino, SUM(d.valor) as total_gasto 
-- FROM viagens v 
-- LEFT JOIN despesas d ON v.id = d.viagem_id 
-- GROUP BY v.id;

-- Ver dados de uma viagem com despesas
-- SELECT v.*, d.* FROM viagens v 
-- LEFT JOIN despesas d ON v.id = d.viagem_id 
-- WHERE v.cliente_id = 1;
