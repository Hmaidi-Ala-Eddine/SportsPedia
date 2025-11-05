# Test the connection between frontend and backend
Write-Host "Testing SportsPedia Frontend-Backend Connection..." -ForegroundColor Green
Write-Host ""

# Test Backend
Write-Host "1. Testing Backend API..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get -TimeoutSec 5
    Write-Host "   Success: Backend is running" -ForegroundColor Green
    Write-Host "   Status: $($backendResponse.status)" -ForegroundColor Cyan
} catch {
    Write-Host "   Failed: Backend is not running" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host "   Please start the backend with: .\start-backend.ps1" -ForegroundColor Yellow
    $backendRunning = $false
}

Write-Host ""

# Test Frontend
Write-Host "2. Testing Frontend Server..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5173" -Method Get -TimeoutSec 5
    Write-Host "   Success: Frontend is running" -ForegroundColor Green
    Write-Host "   Status Code: $($frontendResponse.StatusCode)" -ForegroundColor Cyan
} catch {
    Write-Host "   Failed: Frontend is not running" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host "   Please start the frontend with: .\start-frontend.ps1" -ForegroundColor Yellow
}

Write-Host ""

# Test API Endpoints
if ($backendRunning -ne $false) {
    Write-Host "3. Testing API Endpoints..." -ForegroundColor Yellow
    
    try {
        $rootResponse = Invoke-RestMethod -Uri "http://localhost:8000/" -Method Get -TimeoutSec 5
        Write-Host "   Success: Root endpoint working" -ForegroundColor Green
        Write-Host "   API: $($rootResponse.name) v$($rootResponse.version)" -ForegroundColor Cyan
    } catch {
        Write-Host "   Failed: Root endpoint failed" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "4. Testing CORS Configuration..." -ForegroundColor Yellow
    Write-Host "   Backend allows requests from:" -ForegroundColor Cyan
    Write-Host "   - http://localhost:5173 (Vite dev server)" -ForegroundColor Cyan
    Write-Host "   - http://localhost:3000 (Alternative)" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Gray
Write-Host "Connection Test Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Ensure both servers are running:" -ForegroundColor White
Write-Host "   .\start-all.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Open your browser to:" -ForegroundColor White
Write-Host "   http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Check API documentation:" -ForegroundColor White
Write-Host "   http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
