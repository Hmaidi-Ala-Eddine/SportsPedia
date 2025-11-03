# SportsPedia Website User Guide

## 🌐 Accessing Your Website

- **Frontend Website**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Interactive Swagger UI)
- **Fuseki (Database)**: http://localhost:3030

---

## 📋 Available Features

### Public Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Main landing page |
| About Us | `/about-us` | Company information |
| Teams | `/team` | Browse sports teams |
| Team Details | `/team-details/:id` | Individual team information |
| Projects | `/project` | Sports projects and events |
| Project Details | `/project-details/:id` | Project information |
| Services | `/services` | Platform services |
| Service Details | `/services-details/:id` | Service information |
| Blog | `/blog-standard` | Sports news and articles |
| Blog Post | `/blog-single/:id` | Individual blog post |
| Explore | `/explore` | Discover content |
| Contact | `/contact-us` | Contact form |
| FAQ | `/faq` | Frequently asked questions |
| Pricing | `/pricing` | Service pricing plans |

### User Management

| Feature | URL | Description |
|---------|-----|-------------|
| Sign Up | `/signup` | Create new account |
| Login | `/login` | User authentication |
| Profile | `/profile` | View/edit your profile |

---

## 🔧 Backend API Endpoints

Access the interactive API documentation at **http://localhost:8000/docs**

### Authentication APIs
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Sports Data Management

#### Persons (Athletes/Coaches)
- `GET /api/persons` - List all persons
- `POST /api/persons` - Create new person
- `GET /api/persons/{id}` - Get person details
- `PUT /api/persons/{id}` - Update person
- `DELETE /api/persons/{id}` - Delete person

#### Teams
- `GET /api/teams` - List all teams
- `POST /api/teams` - Create new team
- `GET /api/teams/{id}` - Get team details
- `PUT /api/teams/{id}` - Update team
- `DELETE /api/teams/{id}` - Delete team

#### Competitions
- `GET /api/competitions` - List competitions
- `POST /api/competitions` - Create competition
- `GET /api/competitions/{id}` - Get competition details
- `PUT /api/competitions/{id}` - Update competition
- `DELETE /api/competitions/{id}` - Delete competition

#### Venues
- `GET /api/venues` - List venues
- `POST /api/venues` - Create venue
- `GET /api/venues/{id}` - Get venue details
- `PUT /api/venues/{id}` - Update venue
- `DELETE /api/venues/{id}` - Delete venue

#### Sports
- `GET /api/sports` - List sports
- `POST /api/sports` - Create sport
- `GET /api/sports/{id}` - Get sport details
- `PUT /api/sports/{id}` - Update sport
- `DELETE /api/sports/{id}` - Delete sport

#### Equipment
- `GET /api/equipment` - List equipment
- `POST /api/equipment` - Create equipment
- `GET /api/equipment/{id}` - Get equipment details
- `PUT /api/equipment/{id}` - Update equipment
- `DELETE /api/equipment/{id}` - Delete equipment

#### Organizations
- `GET /api/organizations` - List organizations
- `POST /api/organizations` - Create organization
- `GET /api/organizations/{id}` - Get organization details
- `PUT /api/organizations/{id}` - Update organization
- `DELETE /api/organizations/{id}` - Delete organization

#### Performance Data
- `GET /api/performance` - List performance records
- `POST /api/performance` - Create performance record
- `GET /api/performance/{id}` - Get performance details
- `PUT /api/performance/{id}` - Update performance
- `DELETE /api/performance/{id}` - Delete performance

#### Sponsorships
- `GET /api/sponsorships` - List sponsorships
- `POST /api/sponsorships` - Create sponsorship
- `GET /api/sponsorships/{id}` - Get sponsorship details
- `PUT /api/sponsorships/{id}` - Update sponsorship
- `DELETE /api/sponsorships/{id}` - Delete sponsorship

#### Media
- `GET /api/media` - List media files
- `POST /api/media` - Upload media
- `GET /api/media/{id}` - Get media details
- `PUT /api/media/{id}` - Update media
- `DELETE /api/media/{id}` - Delete media

#### Search
- `GET /api/search?q={query}` - Search across all entities
- `GET /api/search/persons?q={query}` - Search persons
- `GET /api/search/teams?q={query}` - Search teams
- `GET /api/search/competitions?q={query}` - Search competitions

---

## 🗄️ Working with Fuseki (RDF Database)

### What is Fuseki?

Fuseki stores your sports data as RDF (Resource Description Framework) - a semantic web standard that represents data as interconnected facts. This allows complex queries like:

- "Find all basketball players who played for teams in California"
- "Show competitions that happened in stadiums with capacity > 50,000"
- "List sponsors of teams that won championships in 2024"

### Setting Up Your Dataset

1. **Access Fuseki**: http://localhost:3030
2. **Login**: 
   - Username: `admin`
   - Password: `admin123`
3. **Create Dataset**:
   - Click "add one"
   - Name: `sportspedia`
   - Type: Persistent (TDB2)
   - Click "Create dataset"

### How It Works

```
User creates athlete via frontend form
           ↓
Frontend sends POST to backend API
           ↓
Backend validates data
           ↓
Backend converts to RDF triples
           ↓
Backend saves to Fuseki via SPARQL
           ↓
Data stored in sportspedia dataset
```

### Example RDF Data Structure

When you create an athlete, it's stored like this:

```turtle
@prefix sports: <http://sportspedia.org/ontology#> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

<http://sportspedia.org/person/john-doe>
    a sports:Athlete ;
    foaf:name "John Doe" ;
    sports:nationality "USA" ;
    sports:sport "Basketball" ;
    sports:playsFor <http://sportspedia.org/team/lakers> ;
    sports:birthDate "1995-03-15" .

<http://sportspedia.org/team/lakers>
    a sports:Team ;
    foaf:name "Los Angeles Lakers" ;
    sports:basedIn "Los Angeles" .
```

This creates relationships that can be queried semantically!

---

## 💡 Common Workflows

### Adding a New Athlete

**Option 1: Via API (Recommended)**

```bash
curl -X POST "http://localhost:8000/api/persons" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "nationality": "USA",
    "sport": "Basketball",
    "birthDate": "1995-03-15"
  }'
```

**Option 2: Via Frontend**
- Navigate to the persons management page
- Fill in the form
- Submit

**Option 3: Via Swagger UI**
- Go to http://localhost:8000/docs
- Find `POST /api/persons`
- Click "Try it out"
- Fill in the JSON
- Execute

### Searching for Data

```bash
# Search all entities
curl "http://localhost:8000/api/search?q=basketball"

# Search specific entity
curl "http://localhost:8000/api/search/persons?q=john"
```

### Querying with SPARQL (Advanced)

In Fuseki UI (http://localhost:3030):

```sparql
PREFIX sports: <http://sportspedia.org/ontology#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

SELECT ?name ?nationality
WHERE {
  ?person a sports:Athlete ;
          foaf:name ?name ;
          sports:nationality ?nationality .
  FILTER (?nationality = "USA")
}
```

---

## 🎨 Customizing Your Website

### Frontend Customization

**Styles**: TailwindCSS utility classes
- Location: `frontend/src/` 
- Components: `frontend/src/components/`
- Pages: `frontend/src/pages/`

**Adding New Pages**:
1. Create page component in `src/pages/`
2. Add route in `src/Routers.jsx`
3. Add navigation link in header component

### Backend Customization

**Adding New Endpoints**:
1. Create route file in `backend/app/api/routes/`
2. Create service in `backend/app/services/`
3. Define model in `backend/app/models/`
4. Register route in `backend/app/main.py`

---

## 🔍 Monitoring and Debugging

### Check Service Status

```powershell
docker-compose ps
```

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

### Test API Health

```bash
curl http://localhost:8000/health
```

### Database Connection

```bash
# Check MySQL
docker-compose exec mysql mysql -u sportspedia -p

# Check Fuseki
curl http://localhost:3030/$/ping
```

---

## 📚 Learning Resources

### Understanding RDF & SPARQL
- **RDF**: https://www.w3.org/RDF/
- **SPARQL**: https://www.w3.org/TR/sparql11-query/
- **Turtle Syntax**: https://www.w3.org/TR/turtle/

### Framework Documentation
- **FastAPI**: https://fastapi.tiangolo.com/
- **React**: https://react.dev/
- **TailwindCSS**: https://tailwindcss.com/
- **Apache Jena**: https://jena.apache.org/

---

## 🆘 Getting Help

1. **API Errors**: Check http://localhost:8000/docs for endpoint details
2. **Frontend Issues**: Open browser console (F12) for JavaScript errors
3. **Database Issues**: Check Fuseki logs: `docker-compose logs fuseki`
4. **Connection Issues**: Verify all services are running: `docker-compose ps`

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues and solutions.

---

## 🚀 Next Steps

1. ✅ Create Fuseki dataset named `sportspedia`
2. ✅ Create user account at `/signup`
3. ✅ Explore API at http://localhost:8000/docs
4. ✅ Add sample data (athletes, teams, competitions)
5. ✅ Test search functionality
6. ✅ Customize frontend pages
7. ✅ Add your sports ontology to Fuseki

---

Happy building! 🎉
