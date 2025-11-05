# Start the React frontend development server
Write-Host "Starting SportsPedia Frontend..." -ForegroundColor Green

# Navigate to frontend directory
Set-Location -Path $PSScriptRoot\frontend

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Warning: .env file not found. Using default settings." -ForegroundColor Yellow
}

# Start the development server
Write-Host "Starting Vite dev server on http://localhost:5173..." -ForegroundColor Green
npm run dev
