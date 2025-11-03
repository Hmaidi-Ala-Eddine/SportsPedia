# Troubleshooting Guide

## PowerShell Script Execution Error

### Problem
```
.\start-docker.ps1 : File cannot be loaded because running scripts is disabled on this system.
```

### Solutions

**Option 1: Bypass for single execution (Recommended for testing)**
```powershell
powershell -ExecutionPolicy Bypass -File .\start-docker.ps1
```

**Option 2: Run commands manually**
```powershell
# Check Docker
docker info

# Create .env from template (if needed)
cp .env.docker .env

# Start services
docker-compose up -d

# Initialize database
docker-compose exec backend python init_db.py
```

**Option 3: Change execution policy (Admin required)**
```powershell
# Open PowerShell as Administrator
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then run normally
.\start-docker.ps1
```

**Option 4: Use the bypass command**
```powershell
powershell -ExecutionPolicy Bypass -File .\start-docker.ps1
```

## Docker Build Errors

### React Version Conflict

**Problem**: Frontend fails to build with React peer dependency errors

**Solution**: Already fixed! The Dockerfile now uses `npm install --legacy-peer-deps`

If you still encounter issues:
```powershell
# Clean up and rebuild
docker-compose down
docker-compose build --no-cache frontend
docker-compose up -d
```

### Port Conflicts

**Problem**: Port already in use (8000, 3306, 3030, 5173)

**Solution**: 
```powershell
# Find what's using the port
netstat -ano | findstr :8000

# Stop the process or edit docker-compose.yml to use different ports
# Example: Change 8000:8000 to 8001:8000
```

### Container Startup Issues

**Problem**: Services fail to start or crash

**Solution**:
```powershell
# View logs to identify the issue
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs mysql

# Restart specific service
docker-compose restart backend

# Full reset
docker-compose down -v
docker-compose up -d --build
```

## Database Issues

### Connection Refused

**Problem**: Backend can't connect to MySQL

**Solution**:
```powershell
# Wait for MySQL to fully initialize (takes 20-30 seconds)
docker-compose logs mysql

# Once you see "ready for connections", initialize database
docker-compose exec backend python init_db.py
```

### Database Already Exists Error

**Problem**: init_db.py fails because tables already exist

**Solution**: This is normal on subsequent runs, the database is already set up!

### Reset Database

**Problem**: Need to start fresh with database

**Solution**:
```powershell
# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v

# Start fresh
docker-compose up -d
docker-compose exec backend python init_db.py
```

## Frontend Issues

### Blank Page or 404 Errors

**Problem**: Frontend loads but shows blank page or routing errors

**Solution**:
```powershell
# Check if build completed successfully
docker-compose logs frontend

# Rebuild frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Can't Connect to Backend API

**Problem**: Frontend shows API connection errors

**Solution**:
1. Verify backend is running: http://localhost:8000/docs
2. Check CORS settings in backend `.env`
3. View browser console for specific errors

## Backend Issues

### Import Errors or Module Not Found

**Problem**: Backend crashes with Python import errors

**Solution**:
```powershell
# Rebuild backend with fresh dependencies
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Health Check Failing

**Problem**: Backend container keeps restarting

**Solution**:
```powershell
# View detailed logs
docker-compose logs backend

# Common issues:
# - MySQL not ready yet (wait 30 seconds)
# - Missing environment variables (check .env file)
# - Port conflict (change port in docker-compose.yml)
```

## Fuseki Issues

### Can't Access Fuseki UI

**Problem**: http://localhost:3030 not accessible

**Solution**:
```powershell
# Check if Fuseki is running
docker-compose ps

# View Fuseki logs
docker-compose logs fuseki

# Restart Fuseki
docker-compose restart fuseki
```

## Complete Reset

When nothing else works:

```powershell
# 1. Stop everything
docker-compose down -v

# 2. Remove all images
docker-compose down --rmi all

# 3. Clean Docker system (optional, frees space)
docker system prune -a

# 4. Rebuild from scratch
docker-compose up -d --build

# 5. Initialize database
docker-compose exec backend python init_db.py
```

## Performance Issues

### Slow Build Times

**Solution**:
```powershell
# Use BuildKit for faster builds
$env:DOCKER_BUILDKIT=1
docker-compose build
```

### High Memory Usage

**Solution**:
- Increase Docker Desktop memory limit (Settings > Resources)
- Stop unused containers
- Clean up: `docker system prune`

## Getting Help

If you still have issues:

1. **Check logs**: `docker-compose logs`
2. **Check container status**: `docker-compose ps`
3. **Check Docker**: `docker info`
4. **View resource usage**: `docker stats`

Include these outputs when asking for help!
