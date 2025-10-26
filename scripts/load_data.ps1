param(
    [string]$FusekiUrl = "http://localhost:3030",
    [string]$DatasetName = "sportspedia",
    [string]$RdfFile = ".\sportspedia_final.rdf"
)

Write-Host "SportsPedia - Data Loading Script" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

Write-Host "[1/4] Checking if Fuseki is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$FusekiUrl/$/ping" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "OK Fuseki is running" -ForegroundColor Green
    } else {
        throw "Fuseki not responding correctly"
    }
}
catch {
    Write-Host "ERROR Fuseki is not running!" -ForegroundColor Red
    Write-Host "Please start Fuseki first by running: .\start-fuseki.bat" -ForegroundColor Yellow
    exit 1
}

Write-Host "[2/4] Checking dataset..." -ForegroundColor Yellow
try {
    $datasetsResponse = Invoke-WebRequest -Uri "$FusekiUrl/$/datasets" -Method GET
    if ($datasetsResponse.Content -match $DatasetName) {
        Write-Host "OK Dataset '$DatasetName' found" -ForegroundColor Green
    } else {
        Write-Host "WARNING Dataset '$DatasetName' not found, but continuing..." -ForegroundColor Yellow
    }
}
catch {
    Write-Host "WARNING Could not check datasets, but continuing..." -ForegroundColor Yellow
}

Write-Host "[3/4] Checking RDF file..." -ForegroundColor Yellow
if (Test-Path $RdfFile) {
    $fileSize = (Get-Item $RdfFile).Length
    Write-Host "OK RDF file found ($('{0:N0}' -f $fileSize) bytes)" -ForegroundColor Green
} else {
    Write-Host "ERROR RDF file not found: $RdfFile" -ForegroundColor Red
    exit 1
}

Write-Host "[4/4] Loading data into Fuseki..." -ForegroundColor Yellow
try {
    $uploadUrl = "$FusekiUrl/$DatasetName/data"
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"

    $fileContent = Get-Content $RdfFile -Raw -Encoding UTF8

    $bodyLines = (
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"sportspedia_final.rdf`"",
        "Content-Type: application/rdf+xml",
        "",
        $fileContent,
        "--$boundary--",
        ""
    ) -join $LF

    $response = Invoke-RestMethod -Uri $uploadUrl -Method POST -Body $bodyLines -ContentType "multipart/form-data; boundary=$boundary" -TimeoutSec 300
    Write-Host "OK Data loaded successfully!" -ForegroundColor Green
}
catch {
    Write-Host "ERROR Failed to load data: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "You can also load data manually through the Fuseki web interface at: $FusekiUrl" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Data Loading Complete!" -ForegroundColor Green
Write-Host "Access your SPARQL endpoint at:" -ForegroundColor White
Write-Host "  Query:  $FusekiUrl/$DatasetName/query" -ForegroundColor Cyan
Write-Host "  Update: $FusekiUrl/$DatasetName/update" -ForegroundColor Cyan
Write-Host "  Web UI: $FusekiUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Example SPARQL Query:" -ForegroundColor White
Write-Host "SELECT * WHERE { ?s ?p ?o } LIMIT 10" -ForegroundColor Gray
