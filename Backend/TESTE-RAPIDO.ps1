# ========================================
# TESTE RAPIDO DA API DE VIAGENS
# ========================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TESTANDO API DE VIAGENS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3001"

# Teste 1: Criar viagem
Write-Host "1. Criando uma viagem..." -ForegroundColor Yellow
try {
    $body = @{
        cliente_id = 1
        destino = "Paris"
        origem = "Sao Paulo"
        data_inicio = "2025-06-01"
        data_fim = "2025-06-15"
        orcamento = 5000
        descricao = "Viagem dos sonhos para Paris"
        status = "planejada"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/viagens" -Method Post -Body $body -ContentType "application/json"
    Write-Host "   OK Viagem criada! ID: $($response.viagemId)" -ForegroundColor Green
    $viagemId = $response.viagemId
} catch {
    Write-Host "   ERRO: $_" -ForegroundColor Red
    Write-Host "   Detalhes: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

Write-Host ""

# Teste 2: Listar viagens
Write-Host "2. Listando todas as viagens..." -ForegroundColor Yellow
try {
    $viagens = Invoke-RestMethod -Uri "$baseUrl/viagens" -Method Get
    Write-Host "   OK Total: $($viagens.Count) viagens" -ForegroundColor Green
    
    if ($viagens.Count -gt 0) {
        foreach ($v in $viagens) {
            Write-Host "      - ID: $($v.id) | Destino: $($v.destino) | Status: $($v.status)" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "   ERRO: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AGORA VERIFIQUE NO HEIDISQL:" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Execute este SQL:" -ForegroundColor White
Write-Host "SELECT * FROM viagens;" -ForegroundColor Cyan
Write-Host ""
Write-Host "A viagem deve aparecer la! " -ForegroundColor Green
Write-Host ""
