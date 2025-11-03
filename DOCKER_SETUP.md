# Docker Setup Guide for SportsPedia

This guide will help you run the entire SportsPedia application using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- At least 4GB of free RAM

## Quick Start

### 1. Environment Configuration

Create a `.env` file in the project root (optional - defaults will be used if not provided):

```bash
cp .env.docker .env
```

Then edit `.env` with your preferred values, especially the `SECRET_KEY` for production use.

### 2. Start All Services

Run the following command from the project root:

```powershell
docker-compose up -d
```

This will start all services in detached mode:
- MySQL database (port 3306)
- Apache Jena Fuseki (port 3030)
- Backend API (port 8000)
- Frontend application (port 5173)

### 3. Initialize the Database

After services are running, initialize the database tables:

```powershell
docker-compose exec backend python init_db.py
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Fuseki UI**: http://localhost:3030

## Docker Commands

### View Logs

```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
docker-compose logs -f fuseki
```

### Stop Services

```powershell
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v
```

### Restart Services

```powershell
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Rebuild Services

If you make changes to the code:

```powershell
# Rebuild and restart
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
```

### Execute Commands in Containers

```powershell
# Backend shell
docker-compose exec backend bash

# Frontend shell
docker-compose exec frontend sh

# MySQL shell
docker-compose exec mysql mysql -u sportspedia -p
```

## Service Details

### MySQL Database
- **Container**: sportspedia-mysql
- **Port**: 3306
- **Default User**: sportspedia
- **Default Password**: sportspedia123
- **Database**: sportspedia
- **Data Volume**: mysql_data

### Apache Jena Fuseki
- **Container**: sportspedia-fuseki
- **Port**: 3030
- **Default Admin Password**: admin123
- **Data Volume**: fuseki_data
- **Ontology Path**: ./ontology (mounted to /staging)

### Backend API
- **Container**: sportspedia-backend
- **Port**: 8000
- **Hot Reload**: Enabled (watches ./backend directory)
- **Health Check**: http://localhost:8000/health

### Frontend Application
- **Container**: sportspedia-frontend
- **Port**: 5173 (mapped to internal port 80)
- **Web Server**: Nginx
- **Build**: Production optimized

## Development Mode

The backend is configured with hot-reload in Docker. Changes to Python files will automatically restart the server.

For frontend development with hot-reload:

```powershell
# Stop the Docker frontend
docker-compose stop frontend

# Run frontend locally
cd frontend
npm install
npm run dev
```

## Troubleshooting

### Services won't start

```powershell
# Check if ports are in use
netstat -ano | findstr :8000
netstat -ano | findstr :3306
netstat -ano | findstr :3030
netstat -ano | findstr :5173

# View detailed logs
docker-compose logs
```

### Database connection errors

```powershell
# Wait for MySQL to be fully initialized
docker-compose logs mysql

# Reinitialize database
docker-compose exec backend python init_db.py
```

### Clear everything and start fresh

```powershell
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Rebuild from scratch
docker-compose up -d --build
```

### Port conflicts

If ports are already in use, edit `docker-compose.yml` to change the port mappings:

```yaml
ports:
  - "8001:8000"  # Change 8001 to any available port
```

## Production Deployment

For production use:

1. **Update Environment Variables**:
   - Change `SECRET_KEY` to a strong random value
   - Update database passwords
   - Set `DEBUG=False`

2. **Use Production Docker Compose**:
   ```powershell
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Enable SSL/TLS** with a reverse proxy (nginx/traefik)

4. **Set up backups** for MySQL and Fuseki volumes

5. **Configure logging** and monitoring

## Useful Commands

```powershell
# Check container status
docker-compose ps

# View resource usage
docker stats

# Clean up unused images and volumes
docker system prune -a --volumes

# Export database backup
docker-compose exec mysql mysqldump -u sportspedia -p sportspedia > backup.sql

# Import database backup
docker-compose exec -T mysql mysql -u sportspedia -p sportspedia < backup.sql
```

## Network Architecture

All services communicate through a Docker network called `sportspedia-network`:

```
Frontend (5173) → Backend (8000) → MySQL (3306)
                              ↓
                         Fuseki (3030)
```

## Data Persistence

Data is persisted in Docker volumes:
- `mysql_data` - MySQL database files
- `fuseki_data` - Fuseki RDF data

These volumes persist even when containers are stopped or removed (unless you use `docker-compose down -v`).
