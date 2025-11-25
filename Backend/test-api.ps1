# Script de teste da API
Write-Host "🧪 Testando API do Backend..." -ForegroundColor Cyan

# Teste 1: Conexão básica
Write-Host "`n1. Testando conexão básica..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/" -Method Get
    Write-Host "✅ Servidor respondendo: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
}

# Teste 2: Teste de conexão do banco
Write-Host "`n2. Testando conexão com banco..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/test-connection" -Method Get
    Write-Host "✅ Conexão OK" -ForegroundColor Green
    Write-Host "   Modo: $($response.mode)" -ForegroundColor Cyan
    Write-Host "   Database: $($response.database)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
}

# Teste 3: Listar clientes
Write-Host "`n3. Testando listagem de clientes..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/clients" -Method Get
    Write-Host "✅ Clientes encontrados: $($response.Count)" -ForegroundColor Green
    if ($response.Count -gt 0) {
        Write-Host "   Primeiro cliente: $($response[0].name)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
}

# Teste 4: Criar novo cliente
Write-Host "`n4. Testando criação de cliente..." -ForegroundColor Yellow
try {
    $body = @{
        name = "Cliente Teste"
        email = "teste@email.com"
        phone = "11999999999"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:3001/clients" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ Cliente criado com ID: $($response.id)" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
}

Write-Host "`n✅ Testes concluídos!" -ForegroundColor Green
