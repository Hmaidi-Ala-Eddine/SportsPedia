# SportsPedia - Load Ontology into Fuseki
# This script loads the SportsPedia ontology into Fuseki

param(
    [string]$FusekiEndpoint = "http://localhost:3030/sportspedia/data",
    [string]$OntologyFile = ".\sportspedia_final.rdf"
)

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  SportsPedia - Load Ontology" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Fuseki is running
Write-Host "[1/3] Checking if Fuseki is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3030" -Method GET -ErrorAction Stop
    Write-Host "✓ Fuseki is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Fuseki is not running!" -ForegroundColor Red
    Write-Host "Please start Fuseki first using: .\start-fuseki.bat" -ForegroundColor Yellow
    exit 1
}

# Check if ontology file exists
Write-Host "`n[2/3] Checking ontology file..." -ForegroundColor Yellow
if (!(Test-Path $OntologyFile)) {
    Write-Host "✗ Ontology file not found: $OntologyFile" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Found ontology file" -ForegroundColor Green

# Load ontology into Fuseki
Write-Host "`n[3/3] Loading ontology into Fuseki..." -ForegroundColor Yellow
try {
    $headers = @{
        "Content-Type" = "application/rdf+xml"
    }
    
    $ontologyContent = Get-Content -Path $OntologyFile -Raw
    
    Invoke-RestMethod -Uri $FusekiEndpoint `
        -Method POST `
        -Headers $headers `
        -Body $ontologyContent `
        -ErrorAction Stop
    
    Write-Host "✓ Ontology loaded successfully!" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to load ontology" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "  Ontology Loaded Successfully!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now:" -ForegroundColor Yellow
Write-Host "1. Query your data at: http://localhost:3030/#/dataset/sportspedia/query" -ForegroundColor White
Write-Host "2. Test the backend API" -ForegroundColor White
Write-Host ""
