# SportsPedia Search Capabilities

## Overview
The SportsPedia search system supports comprehensive searching across **13 entity types** with the ability to search by **multiple properties** for each entity.

---

## Entity Types & Searchable Properties

### 1. **Athletes** 👟
Search by:
- First name
- Last name
- Full name (combined)
- Nationality

**Properties Retrieved:**
- Position, Goals Scored, Assists, Jersey Number, Captain status

---

### 2. **Coaches** 📋
Search by:
- First name
- Last name
- Full name (combined)
- Nationality

**Properties Retrieved:**
- Coaching Style, Experience Years, Titles Won

---

### 3. **Referees** 🔷
Search by:
- First name
- Last name
- Full name (combined)
- Nationality

**Properties Retrieved:**
- Experience Years, Matches Officiated

---

### 4. **Teams** ⚽
Search by:
- Team name
- Country
- City

**Properties Retrieved:**
- Team Type (Professional/National/Amateur/Youth/Women)
- Founded Year
- Budget
- Current Ranking
- Wins

**Examples:**
- "manchester" → finds Manchester United, Manchester City
- "spain" → finds all teams from Spain
- "london" → finds all teams in London

---

### 5. **Competitions** 🏆
Search by:
- Competition name
- Country
- Season

**Properties Retrieved:**
- Type (League/Tournament/Championship/WorldCup/Olympics)
- Start Date
- Prize Money
- Number of Teams

**Examples:**
- "premier league" → finds Premier League
- "2024" → finds competitions in 2024 season
- "france" → finds French competitions

---

### 6. **Organizations** 🏢
Search by:
- Organization name
- Headquarters location
- President name

**Properties Retrieved:**
- Type (Federation/Club/League_Org/SportsAgency/AntiDoping)
- Established Year
- Member Count

**Examples:**
- "fifa" → finds FIFA
- "switzerland" → finds organizations headquartered in Switzerland
- "gianni infantino" → finds organizations with this president

---

### 7. **Venues** 🏟️
Search by:
- Venue name
- City
- Country
- Surface type

**Properties Retrieved:**
- Capacity
- Opened Year
- Surface Type

**Examples:**
- "wembley" → finds Wembley Stadium
- "london" → finds all venues in London
- "grass" → finds all grass surface venues

---

### 8. **Media** 📺
Search by:
- Media name
- Media type
- Coverage area/sport

**Properties Retrieved:**
- Audience size
- Launch Year
- Type
- What it covers

**Examples:**
- "espn" → finds ESPN
- "football" → finds media covering football
- "television" → finds TV media outlets

---

### 9. **Sports** ⚽
Search by:
- Sport name
- Origin country
- Category

**Properties Retrieved:**
- Olympic status
- Global participants count
- Category

**Examples:**
- "football" → finds Football/Soccer
- "england" → finds sports originating from England
- "ball" → finds ball sports category

---

### 10. **Equipment** 🏀
Search by:
- Equipment name
- Brand
- Model
- Sport
- Material

**Properties Retrieved:**
- Price
- Required for sport
- Material

**Examples:**
- "nike" → finds Nike equipment
- "football" → finds football equipment
- "leather" → finds leather equipment

---

### 11. **Sponsorships** 🤝
Search by:
- Sponsor name
- Industry
- Sponsored entity
- Endorsed entity

**Properties Retrieved:**
- Deal value
- Start/End dates

**Examples:**
- "nike" → finds Nike sponsorships
- "technology" → finds tech industry sponsorships
- "barcelona" → finds sponsorships involving Barcelona

---

### 12. **Achievements** 🏅
Search by:
- Achievement type
- Year
- Athlete name

**Properties Retrieved:**
- Performance value
- Unit
- Achieved by

---

### 13. **Records** 🥇
Search by:
- Record type
- Record value
- Athlete name

**Properties Retrieved:**
- Set date
- Set by

---

## Search Interfaces

### 1. **AI Search Page** (`/search`)
- Natural language queries
- Shows SPARQL query
- Displays all entity types
- Routes to appropriate detail pages

### 2. **Admin Page** (`/admin`)
- Local tab-specific filtering
- Search within loaded data
- Full CRUD operations

### 3. **Unified Search Page** (with AI tab)
- Category-based search
- Filters by entity type
- Advanced filters
- Display categorized results

---

## Routing Logic

### Person Types
- Athletes → `/person/athlete/{id}`
- Coaches → `/person/coach/{id}`
- Referees → `/person/referee/{id}`

### TCO Types
- Teams → `/teams/{id}`
- Competitions → `/competitions/{id}`
- Organizations → `/organizations/{id}`

### New Entity Types (List Pages)
- Venues → `/venues`
- Media → `/media`
- Sports → `/sports`
- Equipment → `/equipment`
- Sponsorships → `/sponsorships`

### Performance Types
- Achievements → `/performance/achievement/{id}`
- Records → `/performance/record/{id}`

---

## Technical Implementation

### Backend
- **SPARQL Queries**: Pattern matching for each entity type
- **Multiple Filters**: Each entity supports searching by 3-5 properties
- **Case-Insensitive**: All searches use `LCASE()` for matching
- **Flexible Matching**: Uses `CONTAINS()` for partial matches
- **Limit**: Default 50 results, can be customized

### Frontend
- **Type Detection**: Uses `result.type` field for categorization
- **Dynamic Display**: Shows entity-specific properties
- **Smart Routing**: Routes based on entity type
- **Visual Feedback**: Color-coded by entity type

---

## Usage Examples

```
Search Query → Results
-------------------------------------------
"messi"         → Lionel Messi (Athlete)
"barcelona"     → FC Barcelona (Team), related athletes
"fifa"          → FIFA (Organization)
"wembley"       → Wembley Stadium (Venue)
"nike"          → Nike equipment, sponsorships
"2024"          → 2024 competitions, achievements
"england"       → English athletes, teams, venues
"grass"         → Grass surface venues
"technology"    → Tech industry sponsorships
"football"      → Sport, equipment, media coverage
```

---

## Future Enhancements
- [ ] Detail pages for Venues, Media, Sports, Equipment, Sponsorships
- [ ] Advanced filters for numeric properties (capacity, budget, etc.)
- [ ] Date range filters
- [ ] Saved searches
- [ ] Search history
- [ ] Export search results
