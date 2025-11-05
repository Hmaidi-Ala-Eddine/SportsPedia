# Start the FastAPI backend server
Write-Host "Starting SportsPedia Backend..." -ForegroundColor Green

# Navigate to backend directory
Set-Location -Path $PSScriptRoot\backend

# Check if virtual environment exists
if (Test-Path "venv\Scripts\Activate.ps1") {
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    & "venv\Scripts\Activate.ps1"
} else {
    Write-Host "Virtual environment not found. Creating one..." -ForegroundColor Yellow
    python -m venv venv
    & "venv\Scripts\Activate.ps1"
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    pip install -r requirements.txt
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Warning: .env file not found. Using default settings." -ForegroundColor Yellow
}

# Start the backend server
Write-Host "Starting FastAPI server on http://localhost:8000..." -ForegroundColor Green
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
