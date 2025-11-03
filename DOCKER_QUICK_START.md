# 🚀 Docker Quick Start Guide

Get SportsPedia running in 3 simple steps!

## Step 1: Start Docker Desktop

Make sure Docker Desktop is running on your computer.

## Step 2: Run the Startup Script

Open PowerShell in the SportsPedia folder and run:

```powershell
# If you get a script execution error, use this instead:
powershell -ExecutionPolicy Bypass -File .\start-docker.ps1

# Or run commands manually:
docker-compose up -d
docker-compose exec backend python init_db.py
```

That's it! The script will:
- ✅ Check if Docker is running
- ✅ Create environment file if needed
- ✅ Start all services (MySQL, Fuseki, Backend, Frontend)
- ✅ Initialize the database
- ✅ Show you the access URLs

## Step 3: Access the Application

Open your browser to:
- **Frontend**: http://localhost:5173

## Stopping the Application

To stop all services, run:

```powershell
.\stop-docker.ps1
```

Or manually:

```powershell
docker-compose down
```

## What Gets Started?

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 5173 | React web application |
| Backend | 8000 | FastAPI REST API |
| MySQL | 3306 | User database |
| Fuseki | 3030 | RDF/SPARQL database |

## Viewing Logs

To see what's happening:

```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Need More Details?

See [DOCKER_SETUP.md](DOCKER_SETUP.md) for complete documentation.

## Troubleshooting

**Port already in use?**
```powershell
# Check what's using the port
netstat -ano | findstr :8000

# Edit docker-compose.yml to use different ports
```

**Services won't start?**
```powershell
# View detailed logs
docker-compose logs

# Restart from scratch
docker-compose down -v
docker-compose up -d --build
```

**Database issues?**
```powershell
# Reinitialize database
docker-compose exec backend python init_db.py
```
