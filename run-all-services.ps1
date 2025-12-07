# PowerShell script to run all Telecom Services
# Run this script from the root directory

Write-Host "🚀 Starting Telecom Services..." -ForegroundColor Green
Write-Host ""

# Start Catalog Service
Write-Host "📦 Starting Catalog Service (Port 8001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\src\Services\Catalog\Catalog.API'; dotnet run"

Start-Sleep -Seconds 2

# Start Billing Service
Write-Host "💰 Starting Billing Service (Port 8002)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\src\Services\Billing\Billing.API'; dotnet run --urls=http://localhost:8002"

Start-Sleep -Seconds 2

# Start Customer Service
Write-Host "👥 Starting Customer Service (Port 8003)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\src\Services\Customer\Customer.API'; dotnet run --urls=http://localhost:8003"

Start-Sleep -Seconds 2

# Start Provisioning Service
Write-Host "⚙️ Starting Provisioning Service (Port 8004)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\src\Services\Provisioning\Provisioning.API'; dotnet run --urls=http://localhost:8004"

Start-Sleep -Seconds 2

# Start Gateway
Write-Host "🌐 Starting API Gateway (Port 5000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\src\Services\Gateway\Gateway.API'; dotnet run --urls=http://localhost:5000"

Start-Sleep -Seconds 2

# Start Frontend
Write-Host "🎨 Starting Frontend (Port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\src\Frontend\telecom-web-app'; npm run dev"

Write-Host ""
Write-Host "✅ All services starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "Access the application at:" -ForegroundColor Yellow
Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "  Gateway:   http://localhost:5000" -ForegroundColor White
Write-Host "  Catalog:   http://localhost:8001/swagger" -ForegroundColor White
Write-Host "  Billing:   http://localhost:8002/swagger" -ForegroundColor White
Write-Host "  Customer:  http://localhost:8003/swagger" -ForegroundColor White
Write-Host "  Provision: http://localhost:8004/swagger" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
