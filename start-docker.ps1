# SportsPedia Docker Startup Script
# This script helps you start the SportsPedia application using Docker

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   SportsPedia Docker Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✓ Docker is running" -ForegroundColor Green
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠ No .env file found. Creating from template..." -ForegroundColor Yellow
    if (Test-Path ".env.docker") {
        Copy-Item ".env.docker" ".env"
        Write-Host "✓ Created .env file from .env.docker" -ForegroundColor Green
        Write-Host "  You can edit .env to customize settings" -ForegroundColor Gray
    }
    Write-Host ""
}

# Start Docker Compose
Write-Host "Starting Docker containers..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Containers started successfully" -ForegroundColor Green
    Write-Host ""
    
    # Wait for services to be ready
    Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Initialize database
    Write-Host "Initializing database..." -ForegroundColor Yellow
    docker-compose exec -T backend python init_db.py 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database initialized" -ForegroundColor Green
    } else {
        Write-Host "⚠ Database initialization may have issues (this is OK if already initialized)" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   🚀 SportsPedia is ready!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Access Points:" -ForegroundColor Cyan
    Write-Host "  • Frontend:  http://localhost:5173" -ForegroundColor White
    Write-Host "  • Backend:   http://localhost:8000" -ForegroundColor White
    Write-Host "  • API Docs:  http://localhost:8000/docs" -ForegroundColor White
    Write-Host "  • Fuseki:    http://localhost:3030" -ForegroundColor White
    Write-Host ""
    Write-Host "Useful Commands:" -ForegroundColor Cyan
    Write-Host "  • View logs:      docker-compose logs -f" -ForegroundColor White
    Write-Host "  • Stop services:  docker-compose down" -ForegroundColor White
    Write-Host "  • Restart:        docker-compose restart" -ForegroundColor White
    Write-Host ""
    
    # Open browser
    $openBrowser = Read-Host "Open browser to http://localhost:5173? (Y/n)"
    if ($openBrowser -eq "" -or $openBrowser -eq "Y" -or $openBrowser -eq "y") {
        Start-Process "http://localhost:5173"
    }
    
} else {
    Write-Host "❌ Failed to start containers" -ForegroundColor Red
    Write-Host "Check the error messages above for details" -ForegroundColor Red
    Write-Host ""
    docker-compose logs
}

Write-Host ""
Read-Host "Press Enter to exit"
