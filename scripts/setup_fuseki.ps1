param(
    [string]$FusekiVersion = "5.6.0",
    [string]$InstallDir = ".\fuseki-server"
)

Write-Host "SportsPedia - Fuseki Setup Script" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

Write-Host "[1/6] Checking Java installation..." -ForegroundColor Yellow
$ErrorActionPreference = "SilentlyContinue"
$javaVersion = java -version 2>&1
$ErrorActionPreference = "Stop"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR Java is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Java 11+ from https://adoptium.net/" -ForegroundColor Yellow
    Write-Host "Make sure Java is added to your system PATH" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "OK Java is installed" -ForegroundColor Green
    if ($javaVersion -and $javaVersion.Count -gt 0) {
        Write-Host "    $($javaVersion[0])" -ForegroundColor Gray
    }
}

Write-Host "[2/6] Creating installation directory..." -ForegroundColor Yellow
if (!(Test-Path $InstallDir)) {
    New-Item -ItemType Directory -Path $InstallDir | Out-Null
    Write-Host "OK Created directory" -ForegroundColor Green
}
else {
    Write-Host "OK Directory exists" -ForegroundColor Green
}

$fusekiUrl = "https://dlcdn.apache.org/jena/binaries/apache-jena-fuseki-$FusekiVersion.zip"
$downloadPath = "$InstallDir\apache-jena-fuseki-$FusekiVersion.zip"

Write-Host "[3/6] Downloading Fuseki..." -ForegroundColor Yellow
if (!(Test-Path $downloadPath)) {
    try {
        Invoke-WebRequest -Uri $fusekiUrl -OutFile $downloadPath
        Write-Host "OK Downloaded" -ForegroundColor Green
    }
    catch {
        Write-Host "ERROR Download failed" -ForegroundColor Red
        Write-Host "Download manually from https://jena.apache.org/download/" -ForegroundColor Yellow
        exit 1
    }
}
else {
    Write-Host "OK Already downloaded" -ForegroundColor Green
}

Write-Host "[4/6] Extracting..." -ForegroundColor Yellow
$extractPath = "$InstallDir\apache-jena-fuseki-$FusekiVersion"
if (!(Test-Path $extractPath)) {
    Expand-Archive -Path $downloadPath -DestinationPath $InstallDir -Force
    Write-Host "OK Extracted" -ForegroundColor Green
}
else {
    Write-Host "OK Already extracted" -ForegroundColor Green
}

Write-Host "[5/6] Configuring..." -ForegroundColor Yellow
$configSource = ".\fuseki\configuration\sportspedia-config.ttl"
$configDir = "$extractPath\run\configuration"
$configDest = "$configDir\sportspedia.ttl"
if (Test-Path $configSource) {
    # Create configuration directory if it doesn't exist
    if (!(Test-Path $configDir)) {
        New-Item -ItemType Directory -Path $configDir -Force | Out-Null
    }
    Copy-Item -Path $configSource -Destination $configDest -Force
    Write-Host "OK Configuration copied" -ForegroundColor Green
}
else {
    Write-Host "WARNING Config file not found" -ForegroundColor Yellow
}

Write-Host "[6/6] Creating start script..." -ForegroundColor Yellow
$batContent = "@echo off`r`necho Starting Fuseki...`r`ncd `"$extractPath`"`r`njava -Xmx4G -jar fuseki-server.jar --config=run\configuration\sportspedia.ttl"
Set-Content -Path ".\start-fuseki.bat" -Value $batContent
Write-Host "OK Start script created" -ForegroundColor Green

Write-Host ""
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "Next: Run .\start-fuseki.bat" -ForegroundColor White
