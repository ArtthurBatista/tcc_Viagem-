# Script de teste da API de Viagens
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TESTE DA API DE VIAGENS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3001"

# Teste 1: Criar viagem sem imagem
Write-Host "1. Criando viagem sem imagem..." -ForegroundColor Yellow
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
    $viagemId = $null
}
Write-Host ""

# Teste 2: Listar todas as viagens
Write-Host "2. Listando todas as viagens..." -ForegroundColor Yellow
try {
    $viagens = Invoke-RestMethod -Uri "$baseUrl/viagens" -Method Get
    Write-Host "   OK Total de viagens: $($viagens.Count)" -ForegroundColor Green
    if ($viagens.Count -gt 0) {
        Write-Host "   Primeira viagem: $($viagens[0].destino)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ERRO: $_" -ForegroundColor Red
}
Write-Host ""

# Teste 3: Buscar viagem por ID
if ($viagemId) {
    Write-Host "3. Buscando viagem ID: $viagemId..." -ForegroundColor Yellow
    try {
        $viagem = Invoke-RestMethod -Uri "$baseUrl/viagens/$viagemId" -Method Get
        Write-Host "   OK Viagem encontrada: $($viagem.destino)" -ForegroundColor Green
        Write-Host "   Origem: $($viagem.origem)" -ForegroundColor Cyan
        Write-Host "   Data inicio: $($viagem.data_inicio)" -ForegroundColor Cyan
        Write-Host "   Orcamento: R$ $($viagem.orcamento)" -ForegroundColor Cyan
    } catch {
        Write-Host "   ERRO: $_" -ForegroundColor Red
    }
    Write-Host ""
}

# Teste 4: Listar viagens por cliente
Write-Host "4. Listando viagens do cliente 1..." -ForegroundColor Yellow
try {
    $viagens = Invoke-RestMethod -Uri "$baseUrl/viagens?cliente_id=1" -Method Get
    Write-Host "   OK Viagens do cliente 1: $($viagens.Count)" -ForegroundColor Green
} catch {
    Write-Host "   ERRO: $_" -ForegroundColor Red
}
Write-Host ""

# Teste 5: Atualizar viagem
if ($viagemId) {
    Write-Host "5. Atualizando viagem ID: $viagemId..." -ForegroundColor Yellow
    try {
        $body = @{
            cliente_id = 1
            destino = "Londres"
            origem = "Sao Paulo"
            data_inicio = "2025-07-01"
            data_fim = "2025-07-15"
            orcamento = 6000
            descricao = "Viagem atualizada para Londres"
            status = "planejada"
            gasto_total = 0
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri "$baseUrl/viagens/$viagemId" -Method Put -Body $body -ContentType "application/json"
        Write-Host "   OK Viagem atualizada!" -ForegroundColor Green
    } catch {
        Write-Host "   ERRO: $_" -ForegroundColor Red
    }
    Write-Host ""
}

# Teste 6: Criar viagem com imagem (se existir uma imagem de teste)
Write-Host "6. Testando criacao com imagem..." -ForegroundColor Yellow
$imagePath = "C:\Users\$env:USERNAME\Pictures\test-image.jpg"
if (Test-Path $imagePath) {
    Write-Host "   Imagem encontrada: $imagePath" -ForegroundColor Cyan
    try {
        $form = @{
            cliente_id = "1"
            destino = "Tokyo"
            origem = "Sao Paulo"
            data_inicio = "2025-08-01"
            data_fim = "2025-08-15"
            orcamento = "8000"
            descricao = "Viagem para Tokyo com imagem"
            status = "planejada"
            imagem = Get-Item $imagePath
        }

        $response = Invoke-RestMethod -Uri "$baseUrl/viagens" -Method Post -Form $form
        Write-Host "   OK Viagem com imagem criada! ID: $($response.viagemId)" -ForegroundColor Green
        Write-Host "   URL da imagem: $($response.imagem_url)" -ForegroundColor Cyan
    } catch {
        Write-Host "   ERRO: $_" -ForegroundColor Red
    }
} else {
    Write-Host "   PULADO: Imagem de teste nao encontrada em $imagePath" -ForegroundColor Yellow
    Write-Host "   Para testar upload, coloque uma imagem nesse caminho" -ForegroundColor Yellow
}
Write-Host ""

# Teste 7: Deletar viagem (comentado para não deletar os dados de teste)
# if ($viagemId) {
#     Write-Host "7. Deletando viagem ID: $viagemId..." -ForegroundColor Yellow
#     try {
#         $response = Invoke-RestMethod -Uri "$baseUrl/viagens/$viagemId" -Method Delete
#         Write-Host "   OK Viagem deletada!" -ForegroundColor Green
#     } catch {
#         Write-Host "   ERRO: $_" -ForegroundColor Red
#     }
#     Write-Host ""
# }

# Resumo
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TESTES CONCLUIDOS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para testar com imagens:" -ForegroundColor Yellow
Write-Host "1. Coloque uma imagem em: C:\Users\$env:USERNAME\Pictures\test-image.jpg" -ForegroundColor White
Write-Host "2. Execute o teste novamente" -ForegroundColor White
Write-Host ""
Write-Host "Documentacao completa em: Backend/API_VIAGENS.md" -ForegroundColor Cyan
