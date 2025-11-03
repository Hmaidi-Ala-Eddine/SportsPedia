# SportsPedia

A comprehensive sports encyclopedia powered by semantic web technology.

## Architecture

- **Frontend**: React + Vite + TailwindCSS (Port 5173)
- **Backend**: FastAPI + Python (Port 8000)
- **Database**: Apache Jena Fuseki (SPARQL endpoint on Port 3030)

## Prerequisites

### Docker (Recommended)
- Docker Desktop
- Docker Compose

### Manual Setup
- Python 3.8+
- Node.js 18+
- MySQL 8.0+
- Apache Jena Fuseki (optional, for full functionality)

## Quick Start

### Option 1: Docker (Recommended)

Run the entire application stack with Docker:

```powershell
# Start all services
docker-compose up -d

# Initialize database
docker-compose exec backend python init_db.py

# View logs
docker-compose logs -f
```

Access the application at http://localhost:5173

For detailed Docker instructions, see [DOCKER_SETUP.md](DOCKER_SETUP.md)

### Option 2: Start Everything (PowerShell)

Run both frontend and backend servers with a single command:

```powershell
.\start-all.ps1
```

This will open two PowerShell windows - one for the backend and one for the frontend.

### Option 3: Start Servers Individually

**Backend:**
```powershell
.\start-backend.ps1
```

**Frontend:**
```powershell
.\start-frontend.ps1
```

## Access Points

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation (Swagger)**: http://localhost:8000/docs
- **API Documentation (ReDoc)**: http://localhost:8000/redoc

## Project Structure

```
SportsPedia/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── models/      # Pydantic models
│   │   ├── services/    # Business logic
│   │   ├── config/      # Configuration
│   │   └── main.py      # Application entry point
│   ├── requirements.txt
│   └── .env
│
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── package.json
│   └── .env
│
└── start-*.ps1          # Startup scripts
```

## Frontend-Backend Integration

### API Services

The frontend includes pre-configured service modules for all backend endpoints:

- `personsService` - Athletes/persons management
- `teamsService` - Team management
- `competitionsService` - Competitions and tournaments
- `venuesService` - Stadiums and arenas
- `sportsService` - Sports disciplines
- `searchService` - Search functionality

### Example Usage

```javascript
import { personsService } from './services';

// Fetch all athletes
const athletes = await personsService.getAll();

// Get specific athlete
const athlete = await personsService.getById(athleteId);

// Create new athlete
const newAthlete = await personsService.create({
  name: "John Doe",
  nationality: "USA",
  sport: "Basketball"
});
```

### API Health Monitoring

The frontend includes a real-time API health check indicator in the bottom-right corner that shows:
- 🟢 Green: API is connected
- 🟡 Yellow: Checking connection
- 🔴 Red: API is disconnected

## Environment Configuration

### Backend (.env)

```env
APP_NAME=SportsPedia API
DEBUG=True
API_HOST=0.0.0.0
API_PORT=8000
FUSEKI_ENDPOINT=http://localhost:3030/sportspedia/query
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_FUSEKI_ENDPOINT=http://localhost:3030/sportspedia
```

## Development

### Backend Development

```bash
cd backend

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run development server
python -m uvicorn app.main:app --reload
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Testing the Connection

1. Start both servers using `.\start-all.ps1`
2. Open http://localhost:5173 in your browser
3. Check the API health indicator in the bottom-right corner
4. Navigate to "Athletes" or "Teams" to see the frontend fetching data from the backend
5. Visit http://localhost:8000/docs to explore the API endpoints

## CORS Configuration

The backend is configured to accept requests from:
- http://localhost:5173 (Vite dev server)
- http://localhost:3000 (Alternative frontend port)

The frontend uses a Vite proxy to forward `/api` requests to the backend during development.

## Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed
- Check if port 8000 is available
- Verify virtual environment is activated
- Check `.env` file exists with correct settings

### Frontend won't start
- Ensure Node.js 18+ is installed
- Run `npm install` to install dependencies
- Check if port 5173 is available
- Verify `.env` file exists

### CORS errors
- Ensure backend is running on port 8000
- Check CORS_ORIGINS in backend `.env`
- Verify frontend URL matches allowed origins

### API connection issues
- Check both servers are running
- Verify backend is accessible at http://localhost:8000
- Check browser console for error messages
- Test API directly at http://localhost:8000/docs

## License

MIT
