# ====================================
# CONFIGURAR VIAGENS NO MARIADB
# ====================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CONFIGURACAO DE VIAGENS NO MARIADB" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar se MariaDB está rodando
Write-Host "1. Verificando MariaDB..." -ForegroundColor Yellow
$mariadbProcess = Get-Process -Name "mariadbd" -ErrorAction SilentlyContinue
if ($mariadbProcess) {
    Write-Host "   OK MariaDB esta rodando" -ForegroundColor Green
} else {
    Write-Host "   ERRO: MariaDB nao encontrado!" -ForegroundColor Red
    Write-Host "   Por favor, inicie o MariaDB e tente novamente." -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# 2. Testar conexão
Write-Host "2. Testando conexao com o banco..." -ForegroundColor Yellow
Push-Location $PSScriptRoot
try {
    $result = node test-db.js 2>&1 | Out-String
    if ($result -match "CONECTADO COM SUCESSO") {
        Write-Host "   OK Conexao estabelecida!" -ForegroundColor Green
    } else {
        Write-Host "   AVISO: Verifique a conexao" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ERRO: $_" -ForegroundColor Red
}
Pop-Location
Write-Host ""

# 3. Instruções para criar a tabela
Write-Host "3. Criar tabela de viagens no HeidiSQL:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   a) Abra o HeidiSQL" -ForegroundColor Cyan
Write-Host "   b) Conecte-se ao banco 'clients_orders_system'" -ForegroundColor Cyan
Write-Host "   c) Abra o arquivo: Backend/setup-viagens-table.sql" -ForegroundColor Cyan
Write-Host "   d) Execute o script (F9)" -ForegroundColor Cyan
Write-Host ""
Write-Host "   OU copie e execute este SQL:" -ForegroundColor Yellow
Write-Host ""
$sqlCommand = @"
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
"@
Write-Host $sqlCommand -ForegroundColor White
Write-Host ""

# 4. Verificar .env
Write-Host "4. Verificando configuracao .env..." -ForegroundColor Yellow
$envPath = Join-Path $PSScriptRoot ".env"
$envContent = Get-Content $envPath -Raw
if ($envContent -match "USE_MEMORY_DB=false") {
    Write-Host "   OK USE_MEMORY_DB=false (vai usar MariaDB)" -ForegroundColor Green
} else {
    Write-Host "   AVISO: USE_MEMORY_DB=true (esta usando memoria)" -ForegroundColor Yellow
    Write-Host "   Alterando para false..." -ForegroundColor Cyan
    $envContent = $envContent -replace "USE_MEMORY_DB=true", "USE_MEMORY_DB=false"
    $envContent | Out-File -FilePath $envPath -Encoding UTF8 -NoNewline
    Write-Host "   OK Alterado para USE_MEMORY_DB=false" -ForegroundColor Green
}
Write-Host ""

# 5. Testar servidor
Write-Host "5. Pronto para testar!" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Execute: node server.js" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Depois teste criando uma viagem:" -ForegroundColor Cyan
Write-Host ""
$testCommand = @'
$body = @{
    cliente_id = 1
    destino = "Paris"
    origem = "Sao Paulo"
    data_inicio = "2025-06-01"
    data_fim = "2025-06-15"
    orcamento = 5000
    descricao = "Viagem teste"
    status = "planejada"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3001/viagens -Method Post -Body $body -ContentType "application/json"
'@
Write-Host $testCommand -ForegroundColor White
Write-Host ""

# Resumo
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESUMO DOS PASSOS:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. OK MariaDB verificado" -ForegroundColor White
Write-Host "2. OK Configuracao .env atualizada" -ForegroundColor White
Write-Host "3. [ ] Execute o SQL no HeidiSQL (arquivo: setup-viagens-table.sql)" -ForegroundColor Yellow
Write-Host "4. [ ] Inicie o servidor: node server.js" -ForegroundColor Yellow
Write-Host "5. [ ] Teste criando uma viagem" -ForegroundColor Yellow
Write-Host ""
Write-Host "Arquivo SQL: Backend/setup-viagens-table.sql" -ForegroundColor Cyan
Write-Host ""
Write-Host "OK Configuracao concluida!" -ForegroundColor Green
