# SportsPedia - Semantic Sports Encyclopedia

A comprehensive sports database powered by semantic web technology, featuring a modern React frontend, FastAPI backend, and Apache Jena Fuseki for SPARQL queries.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local frontend development)
- Python 3.9+ (for local backend development)

### Running with Docker (Recommended)

1. **Start all services:**
   ```bash
   docker-compose up
   ```

2. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Fuseki Server: http://localhost:3030

### Manual Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Fuseki Setup
```bash
# Run the setup script
powershell .\scripts\setup_fuseki.ps1

# Start Fuseki server
.\start-fuseki.bat
```

## 📁 Project Structure

```
SportsPedia/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/routes/   # API endpoints (11 modules)
│   │   ├── models/       # Pydantic models
│   │   ├── services/     # Business logic & SPARQL
│   │   └── main.py       # FastAPI app
├── frontend/             # React frontend
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   ├── services/    # API client
│   │   └── routes.jsx   # React Router config
├── ontology/             # SPARQL queries
└── fuseki/              # Fuseki configuration
```

## 🎯 Features

### Frontend Pages
- ✅ Home Page with category navigation
- ✅ Search Page with semantic search results
- ✅ Athletes Page - Browse and search athletes
- ✅ Teams Page - Explore professional teams
- ✅ Competitions Page - View leagues and championships
- ✅ Venues Page - Discover iconic stadiums
- ✅ Sports Page - Browse sport disciplines

### Backend API
RESTful API with 11 modules:
- `/api/persons/` - Athletes, coaches, referees
- `/api/teams/` - Team data and rosters
- `/api/competitions/` - Leagues, matches
- `/api/venues/` - Stadium information
- `/api/sports/` - Sport disciplines
- `/api/search/` - Semantic search across all entities
- `/api/organizations/`, `/api/equipment/`, `/api/media/`, `/api/performance/`, `/api/sponsorships/`

### Semantic Search
- Cross-entity search powered by SPARQL
- Auto-suggestions from search API
- Smart filtering by entity type

## 🛠 Tech Stack

**Frontend:**
- React 19 + React Router v7
- Vite for build tooling
- TailwindCSS 4 for styling
- Zustand for state management
- Axios for HTTP requests

**Backend:**
- FastAPI with Pydantic validation
- SPARQLWrapper for RDF queries
- Apache Jena Fuseki (SPARQL server)
- Docker containerization

**Data:**
- RDF/SPARQL semantic web queries
- Custom sports ontology
- SportsPedia RDF dataset

## 📊 Database

The project uses Apache Jena Fuseki as the SPARQL endpoint:
- Configuration: `fuseki/configuration/sportspedia-config.ttl`
- Ontology data: `sportspedia_final.rdf`
- Dataset path: `fuseki/data/sportspedia`

## 🌐 API Endpoints

All endpoints are documented at `/docs` (Swagger UI) and `/redoc`.

Example endpoints:
```bash
GET /api/persons/athletes          # List all athletes
GET /api/search?q=messi           # Search all entities
GET /api/teams                     # List all teams
GET /api/competitions/leagues      # List leagues
GET /api/venues                    # List venues
```

## 🎨 UI Features

- Modern gradient-based design
- Responsive layout
- Interactive search with autocomplete
- Smooth animations and transitions
- Glass-morphism effects
- Category-based navigation

## 🔧 Development

### Adding New Pages
1. Create page component in `frontend/src/pages/`
2. Add API service methods in `frontend/src/services/api.js`
3. Register route in `frontend/src/routes.jsx`

### Adding New API Endpoints
1. Create route handler in `backend/app/api/routes/`
2. Create service in `backend/app/services/domain/`
3. Define Pydantic models in `backend/app/models/`
4. Add SPARQL queries in `ontology/sparql_queries/`

## 📝 Notes

- The application uses semantic web technology for flexible data queries
- All data is stored in RDF format for maximum interoperability
- The backend handles SPARQL query execution and result transformation
- Frontend uses modern React patterns with hooks and context

## 🐛 Troubleshooting

**Frontend won't connect to backend:**
- Check that backend is running on port 8000
- Verify CORS settings in `backend/app/config/settings.py`

**Fuseki connection errors:**
- Ensure Fuseki is running on port 3030
- Check Fuseki health: http://localhost:3030/$
- Verify dataset is loaded

**Docker issues:**
- Use `docker-compose logs` to view logs
- Check all containers are running: `docker-compose ps`
- Restart services: `docker-compose restart`

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- Apache Jena Fuseki for SPARQL capabilities
- FastAPI for modern Python web framework
- React ecosystem for powerful frontend tools

