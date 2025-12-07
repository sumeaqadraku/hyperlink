# PowerShell script to run all Telecom Services in background
# Run this script from the root directory

Write-Host "Starting Telecom Services in background..." -ForegroundColor Green
Write-Host ""

# Start Catalog Service
Write-Host "Starting Catalog Service (Port 8001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\src\services\Catalog\Catalog.API'; dotnet run" -WindowStyle Normal

Start-Sleep -Seconds 2

# Start Billing Service  
Write-Host "Starting Billing Service (Port 8002)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\src\services\Billing\Billing.API'; dotnet run --urls=http://localhost:8002" -WindowStyle Normal

Start-Sleep -Seconds 2

# Start Customer Service
Write-Host "Starting Customer Service (Port 8003)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\src\services\Customer\Customer.API'; dotnet run --urls=http://localhost:8003" -WindowStyle Normal

Start-Sleep -Seconds 2

# Start Provisioning Service
Write-Host "Starting Provisioning Service (Port 8004)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\src\services\Provisioning\Provisioning.API'; dotnet run --urls=http://localhost:8004" -WindowStyle Normal

Start-Sleep -Seconds 2

# Start Gateway
Write-Host "Starting API Gateway (Port 5000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\src\services\Gateway\Gateway.API'; dotnet run --urls=http://localhost:5000" -WindowStyle Normal

Write-Host ""
Write-Host "All services started in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "Access the application at:" -ForegroundColor Yellow
Write-Host "  Gateway:   http://localhost:5000" -ForegroundColor White
Write-Host "  Catalog:   http://localhost:8001/swagger" -ForegroundColor White
Write-Host "  Billing:   http://localhost:8002/swagger" -ForegroundColor White
Write-Host "  Customer:  http://localhost:8003/swagger" -ForegroundColor White
Write-Host "  Provision: http://localhost:8004/swagger" -ForegroundColor White
Write-Host ""
Write-Host "Databases are running on:" -ForegroundColor Yellow
Write-Host "  catalogdb      -> localhost:3316" -ForegroundColor White
Write-Host "  billingdb      -> localhost:3317" -ForegroundColor White
Write-Host "  customerdb     -> localhost:3318" -ForegroundColor White
Write-Host "  provisioningdb -> localhost:3319" -ForegroundColor White
