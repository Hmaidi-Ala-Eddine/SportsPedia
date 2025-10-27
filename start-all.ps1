# Start both frontend and backend servers in separate windows
Write-Host "Starting SportsPedia Application..." -ForegroundColor Green

# Start backend in new PowerShell window
Write-Host "Launching backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& '$PSScriptRoot\start-backend.ps1'"

# Wait a few seconds for backend to start
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start frontend in new PowerShell window
Write-Host "Launching frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& '$PSScriptRoot\start-frontend.ps1'"

Write-Host ""
Write-Host "SportsPedia is starting!" -ForegroundColor Green
Write-Host "Backend will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend will be available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "API documentation: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop the servers" -ForegroundColor Yellow
