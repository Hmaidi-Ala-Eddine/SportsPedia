# SportsPedia Setup Verification Script
# This script automatically checks if all components are properly configured

param(
    [switch]$Quick,
    [switch]$Detailed
)

$script:PassCount = 0
$script:FailCount = 0
$script:WarnCount = 0

function Write-TestResult {
    param(
        [string]$TestName,
        [string]$Status,
        [string]$Message = ""
    )

    $icon = switch ($Status) {
        "PASS" { "✓"; $script:PassCount++; "Green" }
        "FAIL" { "✗"; $script:FailCount++; "Red" }
        "WARN" { "⚠"; $script:WarnCount++; "Yellow" }
        "INFO" { "ℹ"; "Cyan" }
    }

    $color = $icon[1]
    $symbol = $icon[0]

    Write-Host "[$symbol] " -ForegroundColor $color -NoNewline
    Write-Host "$TestName" -NoNewline
    if ($Message) {
        Write-Host " - $Message" -ForegroundColor Gray
    } else {
        Write-Host ""
    }
}

function Test-Command {
    param([string]$Command)
    try {
        $null = Get-Command $Command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

function Test-URLAvailable {
    param([string]$Url)
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -TimeoutSec 5 -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         SportsPedia Setup Verification Script             ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# 1. PREREQUISITES CHECK
# ============================================================================

Write-Host "[1/7] Checking Prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Java
if (Test-Command "java") {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    if ($javaVersion -match "(\d+)\.(\d+)") {
        $major = [int]$matches[1]
        if ($major -ge 11) {
            Write-TestResult "Java Installation" "PASS" "$javaVersion"
        } else {
            Write-TestResult "Java Installation" "WARN" "Version too old, need 11+"
        }
    }
} else {
    Write-TestResult "Java Installation" "FAIL" "Java not found in PATH"
}

# Python
if (Test-Command "python") {
    $pythonVersion = python --version 2>&1
    if ($pythonVersion -match "(\d+)\.(\d+)") {
        $major = [int]$matches[1]
        $minor = [int]$matches[2]
        if ($major -eq 3 -and $minor -ge 11) {
            Write-TestResult "Python Installation" "PASS" "$pythonVersion"
        } else {
            Write-TestResult "Python Installation" "WARN" "Need Python 3.11+"
        }
    }
} else {
    Write-TestResult "Python Installation" "FAIL" "Python not found in PATH"
}

# Node.js
if (Test-Command "node") {
    $nodeVersion = node --version
    if ($nodeVersion -match "v(\d+)\.") {
        $major = [int]$matches[1]
        if ($major -ge 18) {
            Write-TestResult "Node.js Installation" "PASS" "$nodeVersion"
        } else {
            Write-TestResult "Node.js Installation" "WARN" "Need Node.js 18+"
        }
    }
} else {
    Write-TestResult "Node.js Installation" "FAIL" "Node.js not found in PATH"
}

# NPM
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-TestResult "NPM Installation" "PASS" "v$npmVersion"
} else {
    Write-TestResult "NPM Installation" "FAIL" "NPM not found"
}

Write-Host ""

# ============================================================================
# 2. FILE STRUCTURE CHECK
# ============================================================================

Write-Host "[2/7] Checking Project Structure..." -ForegroundColor Yellow
Write-Host ""

# RDF File
if (Test-Path ".\sportspedia_final.rdf") {
    $fileSize = (Get-Item ".\sportspedia_final.rdf").Length
    $sizeKB = [math]::Round($fileSize / 1KB, 2)
    Write-TestResult "RDF Ontology File" "PASS" "$sizeKB KB"
} else {
    Write-TestResult "RDF Ontology File" "FAIL" "sportspedia_final.rdf not found"
}

# Backend
if (Test-Path ".\backend\app\main.py") {
    Write-TestResult "Backend Structure" "PASS" "main.py found"
} else {
    Write-TestResult "Backend Structure" "FAIL" "Backend files missing"
}

# Backend requirements
if (Test-Path ".\backend\requirements.txt") {
    Write-TestResult "Backend Requirements" "PASS" "requirements.txt exists"
} else {
    Write-TestResult "Backend Requirements" "WARN" "requirements.txt missing"
}

# Frontend
if (Test-Path ".\frontend\package.json") {
    Write-TestResult "Frontend Structure" "PASS" "package.json found"
} else {
    Write-TestResult "Frontend Structure" "FAIL" "Frontend files missing"
}

# Frontend node_modules
if (Test-Path ".\frontend\node_modules") {
    Write-TestResult "Frontend Dependencies" "PASS" "node_modules exists"
} else {
    Write-TestResult "Frontend Dependencies" "WARN" "Run 'npm install' in frontend/"
}

# Backend venv
if (Test-Path ".\backend\venv") {
    Write-TestResult "Backend Virtual Env" "PASS" "venv exists"
} else {
    Write-TestResult "Backend Virtual Env" "WARN" "Create venv in backend/"
}

# Fuseki configuration
if (Test-Path ".\fuseki\configuration\sportspedia-config.ttl") {
    Write-TestResult "Fuseki Configuration" "PASS" "Config file exists"
} else {
    Write-TestResult "Fuseki Configuration" "FAIL" "Config file missing"
}

# Scripts
if (Test-Path ".\scripts\setup_fuseki.ps1") {
    Write-TestResult "Setup Scripts" "PASS" "Scripts directory exists"
} else {
    Write-TestResult "Setup Scripts" "WARN" "Setup scripts missing"
}

Write-Host ""

# ============================================================================
# 3. FUSEKI INSTALLATION CHECK
# ============================================================================

Write-Host "[3/7] Checking Fuseki Installation..." -ForegroundColor Yellow
Write-Host ""

# Fuseki directory
if (Test-Path ".\fuseki-server\apache-jena-fuseki-5.6.0") {
    Write-TestResult "Fuseki Downloaded" "PASS" "v5.6.0 found"

    # Fuseki jar
    if (Test-Path ".\fuseki-server\apache-jena-fuseki-5.6.0\fuseki-server.jar") {
        Write-TestResult "Fuseki JAR File" "PASS" "fuseki-server.jar exists"
    } else {
        Write-TestResult "Fuseki JAR File" "FAIL" "JAR file missing"
    }

    # Configuration copied
    if (Test-Path ".\fuseki-server\apache-jena-fuseki-5.6.0\run\configuration\sportspedia.ttl") {
        Write-TestResult "Fuseki Config Copied" "PASS" "Configuration in place"
    } else {
        Write-TestResult "Fuseki Config Copied" "WARN" "Configuration not copied"
    }
} else {
    Write-TestResult "Fuseki Downloaded" "FAIL" "Run setup_fuseki.ps1"
}

# Start script
if (Test-Path ".\start-fuseki.bat") {
    Write-TestResult "Start Script" "PASS" "start-fuseki.bat exists"
} else {
    Write-TestResult "Start Script" "WARN" "Start script not generated"
}

Write-Host ""

# ============================================================================
# 4. FUSEKI RUNTIME CHECK
# ============================================================================

Write-Host "[4/7] Checking Fuseki Runtime Status..." -ForegroundColor Yellow
Write-Host ""

# Fuseki ping
if (Test-URLAvailable "http://localhost:3030/`$/ping") {
    Write-TestResult "Fuseki Server" "PASS" "Running on port 3030"

    # Dataset check
    try {
        $datasets = Invoke-RestMethod -Uri "http://localhost:3030/`$/datasets" -Method GET -ErrorAction Stop
        if ($datasets -match "sportspedia") {
            Write-TestResult "Fuseki Dataset" "PASS" "sportspedia dataset exists"

            # Data loaded check (quick SPARQL query)
            if (!$Quick) {
                try {
                    $query = "SELECT (COUNT(*) as ?count) WHERE { ?s ?p ?o }"
                    $response = Invoke-RestMethod -Uri "http://localhost:3030/sportspedia/query" `
                        -Method POST `
                        -Headers @{"Content-Type"="application/sparql-query"} `
                        -Body $query `
                        -ErrorAction Stop

                    if ($response.results.bindings.count.value -gt 0) {
                        $tripleCount = $response.results.bindings[0].count.value
                        Write-TestResult "RDF Data Loaded" "PASS" "$tripleCount triples"
                    } else {
                        Write-TestResult "RDF Data Loaded" "WARN" "No triples found"
                    }
                } catch {
                    Write-TestResult "RDF Data Loaded" "WARN" "Could not query data"
                }
            }
        } else {
            Write-TestResult "Fuseki Dataset" "FAIL" "sportspedia dataset not found"
        }
    } catch {
        Write-TestResult "Fuseki Dataset" "WARN" "Could not check datasets"
    }
} else {
    Write-TestResult "Fuseki Server" "FAIL" "Not running on port 3030"
    Write-TestResult "Fuseki Dataset" "INFO" "Start Fuseki to check dataset"
    Write-TestResult "RDF Data Loaded" "INFO" "Start Fuseki to check data"
}

Write-Host ""

# ============================================================================
# 5. BACKEND RUNTIME CHECK
# ============================================================================

Write-Host "[5/7] Checking Backend Runtime Status..." -ForegroundColor Yellow
Write-Host ""

# Backend .env
if (Test-Path ".\backend\.env") {
    Write-TestResult "Backend Configuration" "PASS" ".env file exists"
} else {
    Write-TestResult "Backend Configuration" "WARN" "Create .env from .env.example"
}

# Backend server
if (Test-URLAvailable "http://localhost:8000/health") {
    Write-TestResult "Backend Server" "PASS" "Running on port 8000"

    # API Documentation
    if (Test-URLAvailable "http://localhost:8000/docs") {
        Write-TestResult "API Documentation" "PASS" "Accessible at /docs"
    } else {
        Write-TestResult "API Documentation" "WARN" "Docs endpoint not accessible"
    }
} else {
    Write-TestResult "Backend Server" "FAIL" "Not running on port 8000"
    Write-TestResult "API Documentation" "INFO" "Start backend to check"
}

Write-Host ""

# ============================================================================
# 6. FRONTEND RUNTIME CHECK
# ============================================================================

Write-Host "[6/7] Checking Frontend Runtime Status..." -ForegroundColor Yellow
Write-Host ""

# Frontend .env
if (Test-Path ".\frontend\.env") {
    Write-TestResult "Frontend Configuration" "PASS" ".env file exists"
} else {
    Write-TestResult "Frontend Configuration" "WARN" "Create .env from .env.example"
}

# Frontend server
if (Test-URLAvailable "http://localhost:5173") {
    Write-TestResult "Frontend Server" "PASS" "Running on port 5173"
} else {
    Write-TestResult "Frontend Server" "FAIL" "Not running on port 5173"
}

Write-Host ""

# ============================================================================
# 7. INTEGRATION CHECK
# ============================================================================

if (!$Quick -and !$Detailed) {
    Write-Host "[7/7] Checking Integration..." -ForegroundColor Yellow
    Write-Host ""

    $fusekiRunning = Test-URLAvailable "http://localhost:3030/`$/ping"
    $backendRunning = Test-URLAvailable "http://localhost:8000/health"
    $frontendRunning = Test-URLAvailable "http://localhost:5173"

    if ($fusekiRunning -and $backendRunning -and $frontendRunning) {
        Write-TestResult "Full Stack" "PASS" "All services running"
    } elseif ($fusekiRunning -and $backendRunning) {
        Write-TestResult "Full Stack" "WARN" "Frontend not running"
    } elseif ($fusekiRunning) {
        Write-TestResult "Full Stack" "WARN" "Only Fuseki running"
    } else {
        Write-TestResult "Full Stack" "FAIL" "Services not running"
    }

    Write-Host ""
}

# ============================================================================
# SUMMARY
# ============================================================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    VERIFICATION SUMMARY                    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "  Passed:  " -NoNewline
Write-Host "$script:PassCount" -ForegroundColor Green
Write-Host "  Failed:  " -NoNewline
Write-Host "$script:FailCount" -ForegroundColor Red
Write-Host "  Warnings:" -NoNewline
Write-Host "$script:WarnCount" -ForegroundColor Yellow

Write-Host ""

if ($script:FailCount -eq 0 -and $script:WarnCount -eq 0) {
    Write-Host "✓ Perfect! Your SportsPedia setup is complete!" -ForegroundColor Green
} elseif ($script:FailCount -eq 0) {
    Write-Host "✓ Setup is functional with minor warnings" -ForegroundColor Yellow
} else {
    Write-Host "✗ Setup has issues that need attention" -ForegroundColor Red
}

Write-Host ""

# ============================================================================
# RECOMMENDATIONS
# ============================================================================

if ($script:FailCount -gt 0 -or $script:WarnCount -gt 0) {
    Write-Host "Recommendations:" -ForegroundColor Cyan
    Write-Host ""

    if (!(Test-Path ".\fuseki-server\apache-jena-fuseki-5.6.0")) {
        Write-Host "  → Run: .\scripts\setup_fuseki.ps1" -ForegroundColor White
    }

    if (!(Test-URLAvailable "http://localhost:3030/`$/ping")) {
        Write-Host "  → Start Fuseki: .\start-fuseki.bat" -ForegroundColor White
    }

    if (!(Test-URLAvailable "http://localhost:8000/health")) {
        Write-Host "  → Start Backend: cd backend && uvicorn app.main:app --reload" -ForegroundColor White
    }

    if (!(Test-URLAvailable "http://localhost:5173")) {
        Write-Host "  → Start Frontend: cd frontend && npm run dev" -ForegroundColor White
    }

    Write-Host ""
}

Write-Host "For detailed testing instructions, see: TESTING_GUIDE.md" -ForegroundColor Gray
Write-Host ""

# ============================================================================
# EXIT CODE
# ============================================================================

if ($script:FailCount -gt 0) {
    exit 1
} else {
    exit 0
}
