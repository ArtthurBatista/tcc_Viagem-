# ===================================
# CONFIGURADOR DE ACESSO REMOTO
# ===================================
# Este script configura seu MariaDB para aceitar conexoes remotas

Write-Host "CONFIGURADOR DE ACESSO REMOTO AO MARIADB" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Descobrir IP
Write-Host "1. Descobrindo seu IP..." -ForegroundColor Yellow
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*"} | Select-Object -First 1).IPAddress
Write-Host "   OK Seu IP: $ip" -ForegroundColor Green
Write-Host "   Use este IP no outro computador!" -ForegroundColor Cyan
Write-Host ""

# 2. Verificar se MariaDB esta rodando
Write-Host "2. Verificando se MariaDB esta rodando..." -ForegroundColor Yellow
$mariadbProcess = Get-Process -Name "mariadbd" -ErrorAction SilentlyContinue
if ($mariadbProcess) {
    Write-Host "   OK MariaDB esta rodando" -ForegroundColor Green
} else {
    Write-Host "   AVISO: MariaDB nao encontrado. Verifique se esta instalado." -ForegroundColor Red
}
Write-Host ""

# 3. Verificar Firewall
Write-Host "3. Verificando regra de Firewall..." -ForegroundColor Yellow
$firewallRule = Get-NetFirewallRule -DisplayName "MariaDB" -ErrorAction SilentlyContinue
if ($firewallRule) {
    Write-Host "   OK Regra de firewall ja existe" -ForegroundColor Green
} else {
    Write-Host "   AVISO: Regra de firewall nao encontrada" -ForegroundColor Yellow
    Write-Host "   Para criar, execute como ADMINISTRADOR:" -ForegroundColor Cyan
    Write-Host "   New-NetFirewallRule -DisplayName 'MariaDB' -Direction Inbound -LocalPort 3306 -Protocol TCP -Action Allow" -ForegroundColor White
}
Write-Host ""

# 4. SQL para liberar acesso
Write-Host "4. Execute este SQL no HeidiSQL:" -ForegroundColor Yellow
Write-Host ""
Write-Host "-- Copie e execute no HeidiSQL:" -ForegroundColor Cyan
Write-Host "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '1234' WITH GRANT OPTION;" -ForegroundColor White
Write-Host "FLUSH PRIVILEGES;" -ForegroundColor White
Write-Host "SELECT User, Host FROM mysql.user WHERE User='root';" -ForegroundColor White
Write-Host ""

# 5. Criar arquivo .env para o outro computador
Write-Host "5. Criando arquivo de exemplo para o outro computador..." -ForegroundColor Yellow
$envContent = "# Configuracao para outro computador`n"
$envContent += "DB_HOST=$ip`n"
$envContent += "DB_USER=root`n"
$envContent += "DB_PASSWORD=1234`n"
$envContent += "DB_NAME=clients_orders_system`n"
$envContent += "DB_PORT=3306`n"
$envContent += "USE_MEMORY_DB=false`n"
$envContent += "PORT=3001`n"
$envContent += "NODE_ENV=development`n"
$envContent += "CORS_ORIGIN=http://localhost:3000`n"

$envPath = Join-Path $PSScriptRoot ".env.exemplo_remoto"
$envContent | Out-File -FilePath $envPath -Encoding UTF8
Write-Host "   OK Criado: .env.exemplo_remoto" -ForegroundColor Green
Write-Host "   Copie este arquivo para o outro computador e renomeie para .env" -ForegroundColor Cyan
Write-Host ""

# Resumo
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESUMO - O QUE FAZER:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NO SEU COMPUTADOR (este):" -ForegroundColor Yellow
Write-Host "1. Abra HeidiSQL" -ForegroundColor White
Write-Host "2. Execute o SQL mostrado acima" -ForegroundColor White
Write-Host "3. Libere o Firewall (como Admin)" -ForegroundColor White
Write-Host ""
Write-Host "NO OUTRO COMPUTADOR:" -ForegroundColor Yellow
Write-Host "1. Copie a pasta Backend" -ForegroundColor White
Write-Host "2. Use o arquivo .env.exemplo_remoto como .env" -ForegroundColor White
Write-Host "3. Execute: npm install" -ForegroundColor White
Write-Host "4. Execute: node server.js" -ForegroundColor White
Write-Host ""
Write-Host "IP PARA USAR: $ip" -ForegroundColor Green
Write-Host ""
Write-Host "OK Configuracao completa!" -ForegroundColor Green
