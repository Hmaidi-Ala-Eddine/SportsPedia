# 🚀 SportsPedia - Team Setup & Development Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Running the Project](#running-the-project)
4. [Adding Your Classes](#adding-your-classes)
5. [Testing Your Changes](#testing-your-changes)
6. [Git Workflow](#git-workflow)

---

## 🛠️ Prerequisites

### Required Software
- **Docker Desktop** (with WSL2 on Windows)
- **Git**
- **Node.js 18+** (optional, for local frontend development)
- **Python 3.11+** (optional, for local backend development)
- **VS Code** or any code editor

### GitHub Account
- Create a GitHub account if you don't have one
- Generate a **Personal Access Token**:
  1. Go to https://github.com/settings/tokens
  2. Click "Generate new token (classic)"
  3. Select `repo` scope (full control)
  4. Copy and save the token (you'll need it for pushing)

---

## 📥 Initial Setup

### 1. Clone the Repository

```bash
# Clone the project
git clone https://github.com/Hmaidi-Ala-Eddine/SportsPedia.git

# Navigate into the project
cd SportsPedia
```

### 2. Configure Git

Replace with your information:

```bash
# Set your name and email
git config --global user.name "Your GitHub Username"
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

### 3. Create a .env File (Optional)

Copy the environment template:

```bash
# Windows PowerShell
Copy-Item .env.docker .env

# Linux/Mac
cp .env.docker .env
```

---

## 🐳 Running the Project

### Step 1: Start Docker Desktop

Make sure Docker Desktop is running.

### Step 2: Start All Services

```bash
# Start all containers in detached mode
docker-compose up -d

# Wait for services to be healthy (30-60 seconds)
```

### Step 3: Initialize Database

```bash
# Create database tables
docker-compose exec backend python init_db.py

# Create admin user (username: admin, password: admin)
docker-compose exec backend python create_admin.py
```

### Step 4: Load RDF Data into Fuseki

```bash
# Load the ontology data (1339 triples)
docker-compose exec backend curl -X POST -u admin:admin123 \
  -H "Content-Type: application/rdf+xml" \
  --data-binary "@/app/data/sportspedia_final.rdf" \
  http://fuseki:3030/sportspedia/data?default
```

### Step 5: Verify Everything is Running

```bash
# Check service status
docker-compose ps

# All services should show "healthy" or "running"
```

### Step 6: Access the Application

Open your browser:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/docs
- **Fuseki UI**: http://localhost:3030

**Login Credentials:**
- Username: `admin`
- Password: `admin`

---

## 🎯 Adding Your Classes

Each team member needs to add their assigned classes to both the **backend** and **frontend**.

### 👤 **Ala's Classes (30%)**
- ✅ Team (already exists)
- ✅ Competition (already exists)
- ✅ Organization (already exists)

**Status**: Your classes are already implemented! You can focus on:
1. Adding more instances to the RDF file
2. Enhancing UI components
3. Adding advanced filters

---

### 👤 **Mehdi's Classes (22%)**

#### Classes to Add:
1. **Venue** (Stadium, Arena, Court) - 10 instances
2. **Media** (Television, DigitalMedia) - 3 instances

#### Step-by-Step Implementation:

##### 1. Add to RDF File (`ontology/sportspedia_final.rdf`)

Add your Venue and Media instances following this pattern:

```xml
<!-- Venue Example -->
<sport:Venue rdf:about="#WembleyStadium">
    <sport:venueName>Wembley Stadium</sport:venueName>
    <sport:capacity rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">90000</sport:capacity>
    <sport:location>London, England</sport:location>
    <sport:surfaceType>Grass</sport:surfaceType>
    <sport:yearOpened rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">2007</sport:yearOpened>
</sport:Venue>

<!-- Media Example -->
<sport:Media rdf:about="#ESPN">
    <sport:mediaName>ESPN</sport:mediaName>
    <sport:mediaType>Television</sport:mediaType>
    <sport:country>United States</sport:country>
    <sport:yearFounded rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">1979</sport:yearFounded>
</sport:Media>
```

##### 2. Create Backend Model (`backend/app/models/domain/venue.py`)

```python
from pydantic import BaseModel, Field
from typing import Optional, List

class Venue(BaseModel):
    id: str
    venueName: str
    capacity: Optional[int] = None
    location: Optional[str] = None
    surfaceType: Optional[str] = None
    yearOpened: Optional[int] = None
    description: Optional[str] = None

class VenueList(BaseModel):
    venues: List[Venue]
    total: int

class VenueCreate(BaseModel):
    venueName: str
    capacity: Optional[int] = None
    location: Optional[str] = None
    surfaceType: Optional[str] = None
    yearOpened: Optional[int] = None

class VenueUpdate(BaseModel):
    venueName: Optional[str] = None
    capacity: Optional[int] = None
    location: Optional[str] = None
    surfaceType: Optional[str] = None
    yearOpened: Optional[int] = None
```

##### 3. Create Backend Service (`backend/app/services/domain/venue_service.py`)

```python
from app.services.sparql_service import sparql_service
from app.models.domain.venue import Venue, VenueList
from app.utils.json_converter import sparql_results_to_list
from typing import Optional

class VenueService:
    async def get_all_venues(self, limit: int = 100, offset: int = 0) -> VenueList:
        query = f"""
        PREFIX sport: <http://example.org/sports-ontology#>
        SELECT DISTINCT ?venue ?venueName ?capacity ?location ?surfaceType ?yearOpened
        WHERE {{
            ?venue a sport:Venue .
            OPTIONAL {{ ?venue sport:venueName ?venueName }}
            OPTIONAL {{ ?venue sport:capacity ?capacity }}
            OPTIONAL {{ ?venue sport:location ?location }}
            OPTIONAL {{ ?venue sport:surfaceType ?surfaceType }}
            OPTIONAL {{ ?venue sport:yearOpened ?yearOpened }}
        }}
        LIMIT {limit} OFFSET {offset}
        """
        results = await sparql_service.execute_query(query)
        venues_data = sparql_results_to_list(results)
        
        venues = [Venue(**self._format_venue(v)) for v in venues_data]
        return VenueList(venues=venues, total=len(venues))
    
    def _format_venue(self, data: dict) -> dict:
        from app.utils.json_converter import extract_id_from_uri
        return {
            "id": extract_id_from_uri(data.get('venue', '')),
            "venueName": data.get('venueName', ''),
            "capacity": int(data['capacity']) if data.get('capacity') else None,
            "location": data.get('location'),
            "surfaceType": data.get('surfaceType'),
            "yearOpened": int(data['yearOpened']) if data.get('yearOpened') else None
        }

venue_service = VenueService()
```

##### 4. Create Backend Routes (`backend/app/api/routes/venues.py`)

Check the existing `venues.py` file - it might already exist! If not, create it following the pattern in `persons.py`.

##### 5. Create Frontend Page (`frontend/src/pages/VenuesPage.jsx`)

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VenuesPage = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/venues');
      setVenues(response.data.venues || []);
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading venues...</div>;

  return (
    <div className="venues-page">
      <h1>Venues</h1>
      <div className="venues-grid">
        {venues.map((venue) => (
          <div key={venue.id} className="venue-card">
            <h3>{venue.venueName}</h3>
            <p>Capacity: {venue.capacity?.toLocaleString()}</p>
            <p>Location: {venue.location}</p>
            <p>Surface: {venue.surfaceType}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenuesPage;
```

##### 6. Add Route to Frontend (`frontend/src/Routers.jsx`)

```jsx
import VenuesPage from './pages/VenuesPage';

// Add to routes array
<Route path="/venues" element={<VenuesPage />} />
```

---

### 👤 **Ahmed's Classes (20%)**

#### Classes to Add:
1. **SportDiscipline** (TeamSport, IndividualSport, etc.) - 5 instances
2. **Equipment** (PlayingEquipment, Footwear, Apparel) - 4 instances
3. **Sponsorship** (TechnicalSponsor, NamingRights, Endorsement) - 3 instances

Follow the same implementation pattern as Mehdi above:
1. Add instances to RDF file
2. Create backend models
3. Create backend services
4. Create backend routes
5. Create frontend pages
6. Add routes to Router

**Example RDF for Sport:**

```xml
<sport:Sport rdf:about="#Football">
    <sport:sportName>Football</sport:sportName>
    <sport:sportType>TeamSport</sport:sportType>
    <sport:numberOfPlayers rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">11</sport:numberOfPlayers>
    <sport:playingSurface>Grass</sport:playingSurface>
</sport:Sport>
```

---

## 🧪 Testing Your Changes

### 1. Reload RDF Data into Fuseki

After adding instances to the RDF file:

```bash
# Delete existing data
docker-compose exec backend curl -X DELETE -u admin:admin123 \
  http://fuseki:3030/sportspedia/data?default

# Upload new data
docker-compose exec backend curl -X POST -u admin:admin123 \
  -H "Content-Type: application/rdf+xml" \
  --data-binary "@/app/data/sportspedia_final.rdf" \
  http://fuseki:3030/sportspedia/data?default
```

### 2. Test Backend API

```bash
# Test your endpoint (example for venues)
curl http://localhost:8000/api/venues

# Or open in browser
# http://localhost:8000/docs
```

### 3. Test Frontend

1. Restart frontend container:
   ```bash
   docker-compose restart frontend
   ```

2. Open http://localhost:5173 and navigate to your new page

### 4. View Logs

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 📤 Git Workflow

### Before Starting Work

```bash
# Pull latest changes
git pull origin main

# Create a new branch for your work
git checkout -b feature/add-venues-media  # Mehdi example
git checkout -b feature/add-sports-equipment  # Ahmed example
```

### After Making Changes

```bash
# Check what changed
git status

# Add all changes
git add .

# Commit with descriptive message
git commit -m "Added Venue and Media classes with 13 instances"

# Push to GitHub
git push origin feature/add-venues-media
```

### If Push Fails (Authentication)

Use your **Personal Access Token** as the password when prompted.

---

## 🐛 Troubleshooting

### Docker Issues

```bash
# Stop all containers
docker-compose down

# Remove volumes and rebuild
docker-compose down -v
docker-compose up -d --build
```

### Fuseki Not Loading Data

```bash
# Check if Fuseki is healthy
docker-compose ps

# Check Fuseki logs
docker-compose logs fuseki

# Reload data manually (see Testing section)
```

### Port Already in Use

```bash
# Find what's using the port (example: 8000)
netstat -ano | findstr :8000

# Kill the process or change ports in docker-compose.yml
```

### Frontend Not Updating

```bash
# Rebuild frontend
docker-compose up -d --build frontend

# Or rebuild everything
docker-compose up -d --build
```

---

## 📁 Project Structure Reference

```
SportsPedia/
├── backend/
│   ├── app/
│   │   ├── api/routes/          # Your API endpoints go here
│   │   ├── models/domain/       # Your Pydantic models go here
│   │   ├── services/domain/     # Your service logic goes here
│   ├── init_db.py
│   └── create_admin.py
├── frontend/
│   └── src/
│       ├── pages/               # Your React pages go here
│       └── Routers.jsx          # Add routes here
├── ontology/
│   └── sportspedia_final.rdf    # Add your RDF instances here
├── docker-compose.yml
└── TEAM_SETUP_GUIDE.md (this file)
```

---

## 📞 Support

**Questions?** Contact your team lead or check:
- Backend API Docs: http://localhost:8000/docs
- Existing code patterns in `persons.py`, `teams.py`, `competitions.py`

---

## ✅ Checklist for Each Team Member

### Mehdi's Checklist:
- [ ] Clone repository
- [ ] Run project successfully
- [ ] Add 10 Venue instances to RDF file
- [ ] Add 3 Media instances to RDF file
- [ ] Create Venue backend (model, service, routes)
- [ ] Create Media backend (model, service, routes)
- [ ] Create Venue frontend page
- [ ] Create Media frontend page
- [ ] Test all endpoints
- [ ] Commit and push changes

### Ahmed's Checklist:
- [ ] Clone repository
- [ ] Run project successfully
- [ ] Add 5 Sport instances to RDF file
- [ ] Add 4 Equipment instances to RDF file
- [ ] Add 3 Sponsorship instances to RDF file
- [ ] Create Sport backend (model, service, routes)
- [ ] Create Equipment backend (model, service, routes)
- [ ] Create Sponsorship backend (model, service, routes)
- [ ] Create Sport frontend page
- [ ] Create Equipment frontend page
- [ ] Create Sponsorship frontend page
- [ ] Test all endpoints
- [ ] Commit and push changes

---

## 🎉 Good Luck!

Remember: Follow the existing code patterns in the project. Copy and adapt from classes that already work (like `Person`, `Team`, `Competition`).
