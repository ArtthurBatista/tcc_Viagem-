# 🎯 Viagens Salvando no MariaDB - QUICK START

## ⚡ 3 Comandos Rápidos

### 1. Criar Tabela (HeidiSQL)
```sql
USE clients_orders_system;

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
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);
```

### 2. Iniciar Servidor
```powershell
cd Backend
node server.js
```

### 3. Criar Viagem
```powershell
$body = @{cliente_id=1;destino="Paris";origem="SP";data_inicio="2025-06-01";data_fim="2025-06-15";orcamento=5000} | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3001/viagens -Method Post -Body $body -ContentType "application/json"
```

## ✅ Configurado!
- `.env` → `USE_MEMORY_DB=false`
- API → `http://localhost:3001/viagens`
- Uploads → `Backend/uploads/`

**Viagens agora salvam no MariaDB!** 🎉
