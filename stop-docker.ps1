# SportsPedia Docker Stop Script
# This script stops all SportsPedia Docker containers

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Stopping SportsPedia" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Stopping Docker containers..." -ForegroundColor Yellow
docker-compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ All containers stopped successfully" -ForegroundColor Green
    Write-Host ""
    Write-Host "To start again, run: .\start-docker.ps1" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "❌ Failed to stop containers" -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to exit"
