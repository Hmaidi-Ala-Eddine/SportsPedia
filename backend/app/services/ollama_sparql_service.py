"""
Ollama-based Natural Language to SPARQL Query Service
Converts natural language queries to SPARQL queries using Ollama LLM
"""

import httpx
import json
import logging
from typing import Dict, Tuple, Optional
from app.config.settings import settings
from app.services.fuseki_client import fuseki_client
from app.utils.json_converter import sparql_results_to_list, extract_id_from_uri
import re

logger = logging.getLogger(__name__)


class OllamaSparqlService:
    """Service for converting natural language to SPARQL using Ollama."""
    
    def __init__(self):
        self.ollama_url = settings.OLLAMA_URL
        self.model = settings.OLLAMA_MODEL
        self.namespace = settings.ONTOLOGY_NAMESPACE
        
        # SPARQL query templates for Person and Performance classes
        self.query_templates = {
            "list_athletes": """
PREFIX sport: <{namespace}>
SELECT ?athlete ?firstName ?lastName ?nationality ?position ?goals
WHERE {{
  ?athlete a sport:Athlete .
  ?athlete sport:firstName ?firstName .
  ?athlete sport:lastName ?lastName .
  OPTIONAL {{ ?athlete sport:nationality ?nationality }}
  OPTIONAL {{ ?athlete sport:position ?position }}
  OPTIONAL {{ ?athlete sport:goalsScored ?goals }}
}}
""",
            "filter_by_nationality": """
PREFIX sport: <{namespace}>
SELECT ?athlete ?firstName ?lastName ?position
WHERE {{
  ?athlete a sport:Athlete .
  ?athlete sport:firstName ?firstName .
  ?athlete sport:lastName ?lastName .
  ?athlete sport:nationality "{nationality}" .
  OPTIONAL {{ ?athlete sport:position ?position }}
}}
""",
            "list_coaches": """
PREFIX sport: <{namespace}>
SELECT ?coach ?firstName ?lastName ?years ?titles
WHERE {{
  ?coach a sport:Coach .
  ?coach sport:firstName ?firstName .
  ?coach sport:lastName ?lastName .
  OPTIONAL {{ ?coach sport:yearsExperience ?years }}
  OPTIONAL {{ ?coach sport:titlesWon ?titles }}
}}
ORDER BY DESC(?years)
""",
            "list_achievements": """
PREFIX sport: <{namespace}>
SELECT ?achievement ?achievementType ?year ?performanceValue ?unit ?athleteName ?athleteId
WHERE {{
  ?achievement a sport:Achievement .
  OPTIONAL {{ ?achievement sport:achievementType ?achievementType }}
  OPTIONAL {{ ?achievement sport:year ?year }}
  OPTIONAL {{ ?achievement sport:performanceValue ?performanceValue }}
  OPTIONAL {{ ?achievement sport:unit ?unit }}
  OPTIONAL {{
    ?achievement sport:achievedBy ?athlete .
    ?athlete sport:firstName ?firstName .
    ?athlete sport:lastName ?lastName .
    BIND(CONCAT(?firstName, " ", ?lastName) as ?athleteName)
    BIND(STRAFTER(STR(?athlete), "#") as ?athleteId)
  }}
}}
ORDER BY DESC(?year)
""",
            "list_records": """
PREFIX sport: <{namespace}>
SELECT ?record ?recordType ?recordValue ?setOn ?athleteName ?athleteId
WHERE {{
  ?record a sport:Record .
  OPTIONAL {{ ?record sport:recordType ?recordType }}
  OPTIONAL {{ ?record sport:recordValue ?recordValue }}
  OPTIONAL {{ ?record sport:setOn ?setOn }}
  OPTIONAL {{
    ?record sport:setBy ?athlete .
    ?athlete sport:firstName ?firstName .
    ?athlete sport:lastName ?lastName .
    BIND(CONCAT(?firstName, " ", ?lastName) as ?athleteName)
    BIND(STRAFTER(STR(?athlete), "#") as ?athleteId)
  }}
}}
ORDER BY DESC(?setOn)
""",
            "count_athletes": """
PREFIX sport: <{namespace}>
SELECT (COUNT(?athlete) as ?count)
WHERE {{
  ?athlete a sport:Athlete .
}}
""",
            "list_referees": """
PREFIX sport: <{namespace}>
SELECT ?referee ?firstName ?lastName ?nationality ?experienceYears ?matchesOfficiated
WHERE {{
  ?referee a sport:Referee .
  OPTIONAL {{ ?referee sport:firstName ?firstName }}
  OPTIONAL {{ ?referee sport:lastName ?lastName }}
  OPTIONAL {{ ?referee sport:nationality ?nationality }}
  OPTIONAL {{ ?referee sport:experienceYears ?experienceYears }}
  OPTIONAL {{ ?referee sport:matchesOfficiated ?matchesOfficiated }}
}}
ORDER BY DESC(?matchesOfficiated)
"""
        }
    
    async def convert_to_sparql(self, user_query: str) -> Tuple[str, str, Dict]:
        """
        UNIFIED SEARCH - Intelligently routes queries to appropriate service.
        Handles both Person/Performance queries AND Team/Competition/Organization queries.
        
        Args:
            user_query: Natural language query from user
            
        Returns:
            Tuple of (sparql_query, explanation, metadata)
        """
        try:
            # STEP 1: Detect if query is about TCO or Relationships
            is_special, entity_type, relationship_type = self._detect_tco_or_relationship_query(user_query.lower())
            
            if is_special:
                if entity_type == "relationship":
                    # Handle relationship queries
                    logger.info(f"Handling relationship query: {user_query} (type: {relationship_type})")
                    sparql_query, explanation = self._handle_relationship_query(user_query.lower(), relationship_type)
                else:
                    # Handle TCO queries directly with simple SPARQL
                    logger.info(f"Handling TCO query directly: {user_query} (type: {entity_type})")
                    sparql_query, explanation = self._handle_tco_query(user_query.lower(), entity_type)
                
                if sparql_query:
                    # Execute the query and return results directly
                    results = fuseki_client.execute_query(sparql_query)
                    results_list = sparql_results_to_list(results)
                    
                    # Format results with IDs extracted
                    formatted_results = []
                    for item in results_list:
                        formatted_item = {}
                        for key, value in item.items():
                            if 'http' in str(value) and any(x in key for x in ['team', 'competition', 'organization', 'athlete', 'coach']):
                                formatted_item['id'] = extract_id_from_uri(value)
                            formatted_item[key] = value
                        formatted_results.append(formatted_item)
                    
                    return (
                        "TCO_DIRECT_RESULTS",
                        explanation,
                        {
                            "method": "relationship" if entity_type == "relationship" else "tco_direct",
                            "entity_type": entity_type,
                            "relationship_type": relationship_type if entity_type == "relationship" else None,
                            "results": formatted_results,
                            "total": len(formatted_results),
                            "sparql": sparql_query
                        }
                    )
            
            # STEP 2: Not TCO, use pattern matching for Person/Performance queries
            sparql, explanation = self._pattern_match(user_query.lower())
            
            if sparql:
                return sparql, explanation, {"method": "pattern_matching"}
            
            # STEP 3: If no pattern match, use Ollama
            sparql, explanation = await self._use_ollama(user_query)
            
            return sparql, explanation, {"method": "ollama"}
            
        except Exception as e:
            logger.error(f"Error converting query: {e}")
            # Fallback to simple athlete list
            return (
                self.query_templates["list_athletes"].format(namespace=self.namespace),
                "Showing all athletes (fallback query)",
                {"method": "fallback", "error": str(e)}
            )
    
    def _detect_tco_or_relationship_query(self, query: str) -> Tuple[bool, Optional[str], Optional[str]]:
        """
        ULTIMATE DETECTION - Detects TCO queries AND relationship queries.
        Returns: (is_special, entity_type, relationship_type)
        """
        
        # STEP 1: Detect relationship queries first (highest priority)
        relationship_patterns = [
            # Competitions organized by (very specific - check first!)
            (r'(competition|competitions|league|leagues|tournament|tournaments).*(organized by|organiz|by)\s+(fifa|uefa|fiba|ioc|[a-z]+)', 'competitions_by_org'),
            # Teams member of (very specific - check first!)
            (r'(teams?).*(member|members|member of|in|under)\s+(uefa|fifa|fiba|[a-z]+\s+federation|federation)', 'teams_in_org'),
            # Athletes in teams
            (r'(athletes?|players?).*(in|of|on|for).*(team|club)', 'athletes_in_team'),
            # Teams in competitions
            (r'(teams?).*(in|of|at|competing|compete).*(competition|league|tournament|premier|champions|serie|liga|bundesliga)', 'teams_in_competition'),
            # Coaches of teams
            (r'(coach|coaches).*(of|for).*(team|club)', 'coaches_of_team'),
            # Venues for competitions
            (r'(venue|venues|stadium|stadiums).*(for|of|hosting|host).*(competition|match|league|tournament)', 'venues_for_competition'),
        ]
        
        for pattern, rel_type in relationship_patterns:
            if re.search(pattern, query):
                logger.info(f"Detected relationship query: {rel_type}")
                return True, "relationship", rel_type
        
        # STEP 2: Detect pure TCO queries
        # PRIORITY 1: Organization keywords (check first to avoid conflicts)
        organization_keywords = [
            "organization", "organizations", "organisation", "organisations",
            "federation", "federations", "fed", 
            "agency", "agencies", "sports agency", "talent agency",
            "governing body", "governing bodies",
            "headquarters", "headquarter", "hq",
            "fifa", "uefa", "fiba", "ioc", "wada", "nba office",
            "league office", "league organization"
        ]
        
        # Check organization first (highest priority)
        if any(keyword in query for keyword in organization_keywords):
            # Exclude relationship queries
            if not any(word in query for word in ["athlete", "player", "coach"]):
                # Make sure it's not about league competitions
                if "league" in query and "office" not in query and "organization" not in query:
                    return True, "competition", None
                return True, "organization", None
        
        # PRIORITY 2: Competition keywords
        competition_keywords = [
            "competition", "competitions", "compete",
            "league", "leagues", 
            "tournament", "tournaments", "tourney", "cup",
            "championship", "championships", "title",
            "world cup", "worldcup", "wc",
            "olympics", "olympic", "olympic games",
            "premier league", "epl",
            "la liga", "laliga",
            "serie a", "seriea",
            "bundesliga",
            "champions league", "ucl",
            "europa league", "uel",
            "nba finals", "nba playoff",
            "super bowl", "superbowl",
            "wimbledon", "us open", "french open",
            "season", "fixture", "match schedule",
            "prize money", "prize pool"
        ]
        
        # Check competition
        if any(keyword in query for keyword in competition_keywords):
            # Exclude relationship queries
            if not any(word in query for word in ["athlete", "player", "team in"]):
                # Exclude if it's clearly about a team in a league
                if "team" in query and "in" in query and ("league" in query or "competition" in query):
                    return True, "team", None
                return True, "competition", None
        
        # PRIORITY 3: Team keywords
        team_keywords = [
            "team", "teams", 
            "club", "clubs", "fc", "cf",
            "squad", "squads",
            "national team", "nt",
            "professional team", "pro team",
            "football club", "soccer club", "basketball team",
            # Specific team names
            "manchester", "barcelona", "barca", "madrid", "real", "atletico",
            "chelsea", "arsenal", "liverpool", "united", "city",
            "juventus", "juve", "milan", "inter", "roma", "napoli",
            "bayern", "munich", "dortmund", "leipzig",
            "lakers", "warriors", "celtics", "bulls", "nets", "raptors",
            # Team properties
            "founded", "home stadium", "home city", "team city",
            "team country", "team budget", "team ranking"
        ]
        
        # Check team
        if any(keyword in query for keyword in team_keywords):
            # Exclude relationship queries (athletes/players/coaches OF/IN team)
            if any(word in query for word in ["player", "athlete", "coach"]) and any(prep in query for prep in [" in ", " of ", " on ", " for "]):
                return False, None, None  # Let it be handled as relationship
            # Exclude if asking about rosters/lineups
            if any(word in query for word in ["roster", "lineup", "captain"]):
                return False, None, None  # Let it fall through to person queries
            return True, "team", None
        
        return False, None, None
    
    def _extract_number_from_query(self, query: str) -> Optional[int]:
        """
        ULTIMATE NUMBER EXTRACTION - Handles ALL possible numeric patterns.
        Supports: "top 5", "best 10", "show me 3", "give me five", "list 20", etc.
        """
        # Word to number mapping (comprehensive)
        word_to_num = {
            'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
            'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
            'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
            'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
            'twenty-five': 25, 'thirty': 30, 'forty': 40, 'fifty': 50,
            'hundred': 100, 'all': None  # 'all' means no limit
        }
        
        # Pattern 1: "top 5", "best 10", "first 3", "last 5", "bottom 10"
        match = re.search(r'(top|best|first|last|bottom|worst)\s+(\d+)', query)
        if match:
            return int(match.group(2))
        
        # Pattern 2: "show me 5", "give me 10", "list 3", "find 20"
        match = re.search(r'(show|give|list|find|get|display)\s+(me\s+)?(\d+)', query)
        if match:
            return int(match.group(3))
        
        # Pattern 3: "5 teams", "10 competitions", "3 organizations"
        match = re.search(r'(\d+)\s+(team|competition|organization|federation|league|tournament|club)', query)
        if match:
            return int(match.group(1))
        
        # Pattern 4: Word numbers "top five", "best ten", "show me three"
        match = re.search(r'(top|best|first|show|give|list)\s+(me\s+)?(' + '|'.join(word_to_num.keys()) + r')', query)
        if match:
            word = match.group(3) if len(match.groups()) >= 3 else match.group(2)
            return word_to_num.get(word)
        
        # Pattern 5: Just a number at start "5 ranked teams", "10 best"
        match = re.search(r'^(\d+)\s+', query)
        if match:
            return int(match.group(1))
        
        # Pattern 6: "only 5", "just 10"
        match = re.search(r'(only|just)\s+(\d+)', query)
        if match:
            return int(match.group(2))
        
        # Pattern 7: Ranges "top 1-10", "rank 1 to 5"
        match = re.search(r'(top|rank|ranking)\s+(\d+)\s*(to|-|through)\s*(\d+)', query)
        if match:
            # Return the end number as limit
            return int(match.group(4))
        
        return None
    
    def _handle_tco_query(self, query: str, entity_type: str) -> Tuple[Optional[str], str]:
        """
        ULTIMATE SPARQL GENERATION - Handles EVERY possible query variation.
        Now with NUMERIC DETECTION for "top 5", "best 10", etc.
        """
        prefix = f"PREFIX sport: <{self.namespace}>\n"
        
        # STEP 1: Extract numeric limit if present
        numeric_limit = self._extract_number_from_query(query)
        default_limit = numeric_limit if numeric_limit else 50
        
        if entity_type == "team":
            # TEAMS - Multiple query patterns
            
            # Pattern 1: Country filter - "teams from England", "teams in Spain", "top 5 teams from England"
            country_match = re.search(r'(from|in|based in)\s+(\w+)', query)
            if country_match:
                country = country_match.group(2).capitalize()
                sparql = prefix + f"""
SELECT ?team
       (SAMPLE(?type) as ?teamType)
       (SAMPLE(?name) as ?teamName)
       (SAMPLE(?cnt) as ?country)
       (SAMPLE(?founded) as ?foundedYear)
       (SAMPLE(?cty) as ?city)
       (SAMPLE(?bdgt) as ?budget)
       (SAMPLE(?ranking) as ?currentRanking)
WHERE {{{{
    ?team a ?type .
    FILTER(?type IN (sport:ProfessionalTeam, sport:NationalTeam, sport:AmateurTeam, sport:YouthTeam, sport:WomenTeam))
    OPTIONAL {{{{ ?team sport:teamName ?name . }}}}
    OPTIONAL {{{{ ?team sport:country ?cnt . }}}}
    OPTIONAL {{{{ ?team sport:foundedYear ?founded . }}}}
    OPTIONAL {{{{ ?team sport:city ?cty . }}}}
    OPTIONAL {{{{ ?team sport:budget ?bdgt . }}}}
    OPTIONAL {{{{ ?team sport:currentRanking ?ranking . }}}}
    FILTER(CONTAINS(LCASE(STR(?cnt)), "{country.lower()}"))
}}}}
GROUP BY ?team
ORDER BY ?teamName
LIMIT {default_limit}
"""
                return sparql, f"{'Top ' + str(numeric_limit) if numeric_limit else 'All'} teams from {country}"
            
            # Pattern 2: City filter - "teams in Manchester", "teams from Milan"
            city_match = re.search(r'(in|from)\s+(manchester|barcelona|madrid|milan|london|paris|munich|rome|liverpool|turin)', query)
            if city_match:
                city = city_match.group(2).capitalize()
                sparql = prefix + f"""
SELECT ?team
       (SAMPLE(?type) as ?teamType)
       (SAMPLE(?name) as ?teamName)
       (SAMPLE(?cnt) as ?country)
       (SAMPLE(?founded) as ?foundedYear)
       (SAMPLE(?cty) as ?cityName)
WHERE {{{{
    ?team a ?type .
    FILTER(?type IN (sport:ProfessionalTeam, sport:NationalTeam, sport:AmateurTeam))
    OPTIONAL {{{{ ?team sport:teamName ?name . }}}}
    OPTIONAL {{{{ ?team sport:country ?cnt . }}}}
    OPTIONAL {{{{ ?team sport:city ?cty . }}}}
    OPTIONAL {{{{ ?team sport:foundedYear ?founded . }}}}
    FILTER(CONTAINS(LCASE(STR(?cty)), "{city.lower()}"))
}}}}
GROUP BY ?team
ORDER BY ?teamName
LIMIT {default_limit}
"""
                return sparql, f"Teams in {city}"
            
            # Pattern 3: Type filter - "professional teams", "national teams"
            if "professional" in query:
                sparql = prefix + f"""
SELECT ?team
       (SAMPLE(?name) as ?teamName)
       (SAMPLE(?cnt) as ?country)
       (SAMPLE(?founded) as ?foundedYear)
       (SAMPLE(?cty) as ?city)
       (SAMPLE(?bdgt) as ?budget)
WHERE {{
    ?team a sport:ProfessionalTeam .
    OPTIONAL {{ ?team sport:teamName ?name . }}
    OPTIONAL {{ ?team sport:country ?cnt . }}
    OPTIONAL {{ ?team sport:foundedYear ?founded . }}
    OPTIONAL {{ ?team sport:city ?cty . }}
    OPTIONAL {{ ?team sport:budget ?bdgt . }}
}}
GROUP BY ?team
ORDER BY ?teamName
LIMIT {default_limit}
"""
                return sparql, "Professional teams"
            
            if "national" in query:
                sparql = prefix + f"""
SELECT ?team
       (SAMPLE(?name) as ?teamName)
       (SAMPLE(?cnt) as ?country)
       (SAMPLE(?founded) as ?foundedYear)
WHERE {{
    ?team a sport:NationalTeam .
    OPTIONAL {{ ?team sport:teamName ?name . }}
    OPTIONAL {{ ?team sport:country ?cnt . }}
    OPTIONAL {{ ?team sport:foundedYear ?founded . }}
}}
GROUP BY ?team
ORDER BY ?teamName
LIMIT {default_limit}
"""
                return sparql, "National teams"
            
            # Pattern 4: Budget filter - "rich teams", "teams with budget > 300", "high budget teams"
            if any(word in query for word in ["rich", "budget", "expensive", "wealthy", "money", "value"]):
                # Extract budget threshold if specified
                budget_match = re.search(r'budget\s*(>|>=|<|<=|above|over|more than|at least)\s*(\d+)', query)
                if budget_match:
                    operator = budget_match.group(1)
                    threshold = int(budget_match.group(2))
                    sparql_operator = '>' if operator in ['>', 'above', 'over', 'more than'] else '>='
                    if operator in ['<', '<=', 'less than', 'below', 'under']:
                        sparql_operator = '<' if operator == '<' else '<='
                    elif operator in ['>=', 'at least']:
                        sparql_operator = '>='
                else:
                    sparql_operator = '>'
                    threshold = 200
                
                sparql = prefix + f"""
SELECT ?team
       (SAMPLE(?type) as ?teamType)
       (SAMPLE(?name) as ?teamName)
       (SAMPLE(?cnt) as ?country)
       (SAMPLE(?bdgt) as ?budget)
       (SAMPLE(?ranking) as ?currentRanking)
WHERE {{{{
    ?team a ?type .
    FILTER(?type IN (sport:ProfessionalTeam, sport:NationalTeam))
    ?team sport:budget ?bdgt .
    OPTIONAL {{{{ ?team sport:teamName ?name . }}}}
    OPTIONAL {{{{ ?team sport:country ?cnt . }}}}
    OPTIONAL {{{{ ?team sport:currentRanking ?ranking . }}}}
    FILTER(?bdgt {sparql_operator} {threshold})
}}}}
GROUP BY ?team
ORDER BY DESC(MAX(?bdgt))
LIMIT {default_limit}
"""
                return sparql, f"Teams with budget {sparql_operator} ${threshold}M"
            
            # Pattern 5: Ranking filter - "top teams", "best teams", "top 5 teams"
            if any(word in query for word in ["top", "best", "ranked", "leading"]):
                # Use numeric limit for ranking filter if specified
                rank_limit = numeric_limit if numeric_limit and numeric_limit <= 100 else 20
                sparql = prefix + f"""
SELECT ?team
       (SAMPLE(?type) as ?teamType)
       (SAMPLE(?name) as ?teamName)
       (SAMPLE(?cnt) as ?country)
       (SAMPLE(?ranking) as ?currentRanking)
       (SAMPLE(?w) as ?wins)
WHERE {{{{
    ?team a ?type .
    FILTER(?type IN (sport:ProfessionalTeam, sport:NationalTeam))
    ?team sport:currentRanking ?ranking .
    OPTIONAL {{{{ ?team sport:teamName ?name . }}}}
    OPTIONAL {{{{ ?team sport:country ?cnt . }}}}
    OPTIONAL {{{{ ?team sport:wins ?w . }}}}
    FILTER(?ranking <= {rank_limit})
}}}}
GROUP BY ?team
ORDER BY MIN(?ranking)
LIMIT {default_limit}
"""
                return sparql, f"Top {rank_limit} ranked teams"
            
            # Default: All teams
            sparql = prefix + f"""
SELECT ?team
       (SAMPLE(?type) as ?teamType)
       (SAMPLE(?name) as ?teamName)
       (SAMPLE(?cnt) as ?country)
       (SAMPLE(?founded) as ?foundedYear)
       (SAMPLE(?cty) as ?city)
WHERE {{
    ?team a ?type .
    FILTER(?type IN (sport:ProfessionalTeam, sport:NationalTeam, sport:AmateurTeam, sport:YouthTeam, sport:WomenTeam))
    OPTIONAL {{ ?team sport:teamName ?name . }}
    OPTIONAL {{ ?team sport:country ?cnt . }}
    OPTIONAL {{ ?team sport:foundedYear ?founded . }}
    OPTIONAL {{ ?team sport:city ?cty . }}
}}
GROUP BY ?team
ORDER BY ?teamName
LIMIT {default_limit}
"""
            return sparql, "All teams"
        
        elif entity_type == "competition":
            # COMPETITIONS - Multiple query patterns
            
            # Pattern 1: Year filter - "competitions in 2024", "2024 competitions"
            year_match = re.search(r'(\d{4})', query)
            if year_match:
                year = year_match.group(1)
                sparql = prefix + f"""
SELECT ?competition
       (SAMPLE(?type) as ?compType)
       (SAMPLE(?name) as ?competitionName)
       (SAMPLE(?ssn) as ?season)
       (SAMPLE(?start) as ?startDate)
       (SAMPLE(?cnt) as ?country)
       (SAMPLE(?prize) as ?prizeMoney)
WHERE {{{{
    ?competition a ?type .
    FILTER(?type IN (sport:League, sport:Tournament, sport:Championship, sport:WorldCup, sport:Olympics))
    OPTIONAL {{{{ ?competition sport:competitionName ?name . }}}}
    OPTIONAL {{{{ ?competition sport:season ?ssn . }}}}
    OPTIONAL {{{{ ?competition sport:startDate ?start . }}}}
    OPTIONAL {{{{ ?competition sport:country ?cnt . }}}}
    OPTIONAL {{{{ ?competition sport:prizeMoney ?prize . }}}}
    FILTER(
        CONTAINS(STR(?ssn), "{year}") ||
        CONTAINS(STR(?start), "{year}")
    )
}}}}
GROUP BY ?competition
ORDER BY ?competitionName
LIMIT {default_limit}
"""
                return sparql, f"Competitions in {year}"
            
            # Pattern 2: Type filter - "leagues", "world cups", "tournaments"
            if any(word in query for word in ["league", "leagues"]) and "world cup" not in query:
                sparql = prefix + f"""
SELECT ?competition
       (SAMPLE(?name) as ?competitionName)
       (SAMPLE(?ssn) as ?season)
       (SAMPLE(?cnt) as ?country)
       (SAMPLE(?prize) as ?prizeMoney)
WHERE {{
    ?competition a sport:League .
    OPTIONAL {{ ?competition sport:competitionName ?name . }}
    OPTIONAL {{ ?competition sport:season ?ssn . }}
    OPTIONAL {{ ?competition sport:country ?cnt . }}
    OPTIONAL {{ ?competition sport:prizeMoney ?prize . }}
}}
GROUP BY ?competition
ORDER BY ?competitionName
LIMIT {default_limit}
"""
                return sparql, "Leagues"
            
            if "world cup" in query or "worldcup" in query:
                sparql = prefix + f"""
SELECT ?competition
       (SAMPLE(?name) as ?competitionName)
       (SAMPLE(?ssn) as ?season)
       (SAMPLE(?start) as ?startDate)
       (SAMPLE(?cnt) as ?country)
       (SAMPLE(?teams) as ?numberOfTeams)
WHERE {{
    ?competition a sport:WorldCup .
    OPTIONAL {{ ?competition sport:competitionName ?name . }}
    OPTIONAL {{ ?competition sport:season ?ssn . }}
    OPTIONAL {{ ?competition sport:startDate ?start . }}
    OPTIONAL {{ ?competition sport:country ?cnt . }}
    OPTIONAL {{ ?competition sport:numberOfTeams ?teams . }}
}}
GROUP BY ?competition
ORDER BY DESC(MAX(?start))
LIMIT {default_limit}
"""
                return sparql, "World Cups"
            
            if "olympic" in query or "olympics" in query:
                sparql = prefix + f"""
SELECT ?competition
       (SAMPLE(?name) as ?competitionName)
       (SAMPLE(?ssn) as ?season)
       (SAMPLE(?start) as ?startDate)
       (SAMPLE(?cnt) as ?country)
WHERE {{
    ?competition a sport:Olympics .
    OPTIONAL {{ ?competition sport:competitionName ?name . }}
    OPTIONAL {{ ?competition sport:season ?ssn . }}
    OPTIONAL {{ ?competition sport:startDate ?start . }}
    OPTIONAL {{ ?competition sport:country ?cnt . }}
}}
GROUP BY ?competition
ORDER BY DESC(MAX(?start))
LIMIT {default_limit}
"""
                return sparql, "Olympics"
            
            if any(word in query for word in ["tournament", "tournaments"]):
                sparql = prefix + f"""
SELECT ?competition
       (SAMPLE(?name) as ?competitionName)
       (SAMPLE(?ssn) as ?season)
       (SAMPLE(?start) as ?startDate)
       (SAMPLE(?prize) as ?prizeMoney)
WHERE {{
    ?competition a sport:Tournament .
    OPTIONAL {{ ?competition sport:competitionName ?name . }}
    OPTIONAL {{ ?competition sport:season ?ssn . }}
    OPTIONAL {{ ?competition sport:startDate ?start . }}
    OPTIONAL {{ ?competition sport:prizeMoney ?prize . }}
}}
GROUP BY ?competition
ORDER BY ?competitionName
LIMIT {default_limit}
"""
                return sparql, "Tournaments"
            
            if any(word in query for word in ["championship", "championships"]):
                sparql = prefix + f"""
SELECT ?competition
       (SAMPLE(?name) as ?competitionName)
       (SAMPLE(?ssn) as ?season)
       (SAMPLE(?cnt) as ?country)
WHERE {{
    ?competition a sport:Championship .
    OPTIONAL {{ ?competition sport:competitionName ?name . }}
    OPTIONAL {{ ?competition sport:season ?ssn . }}
    OPTIONAL {{ ?competition sport:country ?cnt . }}
}}
GROUP BY ?competition
ORDER BY ?competitionName
LIMIT {default_limit}
"""
                return sparql, "Championships"
            
            # Pattern 3: Prize money filter - "competitions with prize > 100", "high prize competitions"
            if any(word in query for word in ["prize", "money", "rich", "expensive", "reward"]):
                # Extract prize threshold if specified
                prize_match = re.search(r'prize\s*(money\s*)?(>|>=|<|<=|above|over|more than|at least)\s*(\d+)', query)
                if prize_match:
                    operator = prize_match.group(2)
                    threshold = int(prize_match.group(3))
                    sparql_operator = '>' if operator in ['>', 'above', 'over', 'more than'] else '>='
                    if operator in ['<', '<=', 'less than', 'below']:
                        sparql_operator = '<' if operator == '<' else '<='
                    elif operator in ['>=', 'at least']:
                        sparql_operator = '>='
                else:
                    sparql_operator = '>'
                    threshold = 50
                
                sparql = prefix + f"""
SELECT DISTINCT ?competition ?competitionName ?compType ?prizeMoney ?country ?season
WHERE {{{{
    ?competition a ?compType .
    FILTER(?compType IN (sport:League, sport:Tournament, sport:Championship, sport:WorldCup))
    ?competition sport:prizeMoney ?prizeMoney .
    OPTIONAL {{{{ ?competition sport:competitionName ?competitionName . }}}}
    OPTIONAL {{{{ ?competition sport:country ?country . }}}}
    OPTIONAL {{{{ ?competition sport:season ?season . }}}}
    FILTER(?prizeMoney {sparql_operator} {threshold})
}}}}
ORDER BY DESC(?prizeMoney)
LIMIT {default_limit}
"""
                return sparql, f"Competitions with prize {sparql_operator} ${threshold}M"
            
            # Pattern 4: Recent competitions - "recent", "latest", "current"
            if any(word in query for word in ["recent", "latest", "current", "upcoming"]):
                sparql = prefix + f"""
SELECT DISTINCT ?competition ?competitionName ?compType ?startDate ?season
WHERE {{
    ?competition a ?compType .
    FILTER(?compType IN (sport:League, sport:Tournament, sport:Championship, sport:WorldCup, sport:Olympics))
    OPTIONAL {{ ?competition sport:competitionName ?competitionName . }}
    OPTIONAL {{ ?competition sport:startDate ?startDate . }}
    OPTIONAL {{ ?competition sport:season ?season . }}
}}
ORDER BY DESC(?startDate)
LIMIT {default_limit}
"""
                return sparql, "Recent competitions"
            
            # Pattern 5: Country filter - "competitions in France", "French competitions"
            country_match = re.search(r'(in|from)\s+(\w+)', query)
            if country_match:
                country = country_match.group(2).capitalize()
                sparql = prefix + f"""
SELECT DISTINCT ?competition ?competitionName ?compType ?season ?country ?numberOfTeams
WHERE {{{{
    ?competition a ?compType .
    FILTER(?compType IN (sport:League, sport:Tournament, sport:Championship, sport:WorldCup, sport:Olympics))
    OPTIONAL {{{{ ?competition sport:competitionName ?competitionName . }}}}
    OPTIONAL {{{{ ?competition sport:season ?season . }}}}
    OPTIONAL {{{{ ?competition sport:country ?country . }}}}
    OPTIONAL {{{{ ?competition sport:numberOfTeams ?numberOfTeams . }}}}
    FILTER(CONTAINS(LCASE(STR(?country)), "{country.lower()}"))
}}}}
ORDER BY ?competitionName
LIMIT {default_limit}
"""
                return sparql, f"Competitions in {country}"
            
            # Pattern 6: Size/Scale - "big competitions", "major competitions"
            if any(word in query for word in ["big", "major", "large", "biggest"]):
                sparql = prefix + f"""
SELECT DISTINCT ?competition ?competitionName ?compType ?numberOfTeams ?prizeMoney
WHERE {{
    ?competition a ?compType .
    FILTER(?compType IN (sport:WorldCup, sport:Olympics, sport:Championship))
    OPTIONAL {{ ?competition sport:competitionName ?competitionName . }}
    OPTIONAL {{ ?competition sport:numberOfTeams ?numberOfTeams . }}
    OPTIONAL {{ ?competition sport:prizeMoney ?prizeMoney . }}
}}
ORDER BY DESC(?numberOfTeams)
LIMIT {default_limit}
"""
                return sparql, "Major competitions"
            
            # Default: All competitions
            sparql = prefix + f"""
SELECT ?competition
       (SAMPLE(?compType) as ?compType)
       (SAMPLE(?competitionName) as ?competitionName)
       (SAMPLE(?season) as ?season)
       (SAMPLE(?startDate) as ?startDate)
       (SAMPLE(?country) as ?country)
WHERE {{
    ?competition a ?compType .
    FILTER(?compType IN (sport:League, sport:Tournament, sport:Championship, sport:WorldCup, sport:Olympics))
    OPTIONAL {{ ?competition sport:competitionName ?competitionName . }}
    OPTIONAL {{ ?competition sport:season ?season . }}
    OPTIONAL {{ ?competition sport:startDate ?startDate . }}
    OPTIONAL {{ ?competition sport:country ?country . }}
}}
GROUP BY ?competition
ORDER BY ?competitionName
LIMIT {default_limit}
"""
            return sparql, "All competitions"
        
        elif entity_type == "organization":
            # ORGANIZATIONS - Multiple query patterns
            
            # Pattern 1: Type filter - specific organization types
            if "federation" in query or "federations" in query:
                sparql = prefix + f"""
SELECT ?organization
       (SAMPLE(?name) as ?organizationName)
       (SAMPLE(?hq) as ?headquarters)
       (SAMPLE(?year) as ?establishedYear)
       (SAMPLE(?pres) as ?president)
       (SAMPLE(?members) as ?memberCount)
WHERE {{
    ?organization a sport:Federation .
    OPTIONAL {{ ?organization sport:organizationName ?name . }}
    OPTIONAL {{ ?organization sport:headquarters ?hq . }}
    OPTIONAL {{ ?organization sport:establishedYear ?year . }}
    OPTIONAL {{ ?organization sport:president ?pres . }}
    OPTIONAL {{ ?organization sport:memberCount ?members . }}
}}
GROUP BY ?organization
ORDER BY ?organizationName
LIMIT {default_limit}
"""
                return sparql, "Federations"
            
            if "agency" in query or "agencies" in query:
                sparql = prefix + f"""
SELECT ?organization
       (SAMPLE(?name) as ?organizationName)
       (SAMPLE(?hq) as ?headquarters)
       (SAMPLE(?year) as ?establishedYear)
       (SAMPLE(?revenue) as ?annualRevenue)
WHERE {{
    ?organization a sport:SportsAgency .
    OPTIONAL {{ ?organization sport:organizationName ?name . }}
    OPTIONAL {{ ?organization sport:headquarters ?hq . }}
    OPTIONAL {{ ?organization sport:establishedYear ?year . }}
    OPTIONAL {{ ?organization sport:annualRevenue ?revenue . }}
}}
GROUP BY ?organization
ORDER BY ?organizationName
LIMIT {default_limit}
"""
                return sparql, "Sports agencies"
            
            if "league" in query and "org" in query:
                sparql = prefix + f"""
SELECT ?organization
       (SAMPLE(?name) as ?organizationName)
       (SAMPLE(?hq) as ?headquarters)
       (SAMPLE(?year) as ?establishedYear)
WHERE {{
    ?organization a sport:League_Org .
    OPTIONAL {{ ?organization sport:organizationName ?name . }}
    OPTIONAL {{ ?organization sport:headquarters ?hq . }}
    OPTIONAL {{ ?organization sport:establishedYear ?year . }}
}}
GROUP BY ?organization
ORDER BY ?organizationName
LIMIT {default_limit}
"""
                return sparql, "League organizations"
            
            # Pattern 2: Location filter - "organizations in Switzerland", "headquarters in Los Angeles"
            # Enhanced to detect city names and specific locations
            location_patterns = [
                (r'(headquarters?|hq|based|located)\s+(in|from|at)\s+([a-z\s]+)', 3),
                (r'(in|from)\s+(switzerland|france|usa|spain|italy|germany|england|los angeles|new york|zurich|geneva|london|paris)', 2)
            ]
            
            location_match = None
            location = None
            for pattern, group_idx in location_patterns:
                match = re.search(pattern, query)
                if match:
                    location = match.group(group_idx).strip().capitalize()
                    location_match = True
                    break
            
            if location_match and location:
                sparql = prefix + f"""
SELECT DISTINCT ?organization ?organizationName ?orgType ?headquarters ?establishedYear ?president
WHERE {{{{
    ?organization a ?orgType .
    FILTER(?orgType IN (sport:Federation, sport:Club, sport:League_Org, sport:SportsAgency, sport:AntiDoping))
    ?organization sport:headquarters ?headquarters .
    OPTIONAL {{{{ ?organization sport:organizationName ?organizationName . }}}}
    OPTIONAL {{{{ ?organization sport:establishedYear ?establishedYear . }}}}
    OPTIONAL {{{{ ?organization sport:president ?president . }}}}
    FILTER(CONTAINS(LCASE(STR(?headquarters)), "{location.lower()}"))
}}}}
ORDER BY ?organizationName
LIMIT {default_limit}
"""
                return sparql, f"Organizations in {location}"
            
            # Pattern 3: Large/Important organizations - "major", "big", "important"
            if any(word in query for word in ["major", "big", "important", "top", "leading"]):
                sparql = prefix + f"""
SELECT DISTINCT ?organization ?organizationName ?orgType ?headquarters ?memberCount ?annualRevenue
WHERE {{
    ?organization a ?orgType .
    FILTER(?orgType IN (sport:Federation, sport:League_Org))
    OPTIONAL {{ ?organization sport:organizationName ?organizationName . }}
    OPTIONAL {{ ?organization sport:headquarters ?headquarters . }}
    OPTIONAL {{ ?organization sport:memberCount ?memberCount . }}
    OPTIONAL {{ ?organization sport:annualRevenue ?annualRevenue . }}
    FILTER(BOUND(?memberCount) || BOUND(?annualRevenue))
}}
ORDER BY DESC(?memberCount) DESC(?annualRevenue)
LIMIT {default_limit}
"""
                return sparql, "Major organizations"
            
            # Pattern 4: International organizations - "international", "global", "world"
            if any(word in query for word in ["international", "global", "world", "fifa", "uefa"]):
                sparql = prefix + f"""
SELECT DISTINCT ?organization ?organizationName ?orgType ?headquarters ?establishedYear ?memberCount
WHERE {{
    ?organization a sport:Federation .
    OPTIONAL {{ ?organization sport:organizationName ?organizationName . }}
    OPTIONAL {{ ?organization sport:headquarters ?headquarters . }}
    OPTIONAL {{ ?organization sport:establishedYear ?establishedYear . }}
    OPTIONAL {{ ?organization sport:memberCount ?memberCount . }}
    FILTER(
        CONTAINS(LCASE(STR(?organizationName)), "international") ||
        CONTAINS(LCASE(STR(?organizationName)), "world") ||
        CONTAINS(LCASE(STR(?organizationName)), "fifa") ||
        CONTAINS(LCASE(STR(?organizationName)), "uefa") ||
        CONTAINS(LCASE(STR(?organizationName)), "fiba")
    )
}}
ORDER BY ?organizationName
LIMIT {default_limit}
"""
                return sparql, "International organizations"
            
            # Pattern 5: Year filter - "organizations established in 1904", "founded in 2000"
            year_match = re.search(r'(established|founded|created|formed)\s+in\s+(\d{4})', query)
            if not year_match:
                year_match = re.search(r'(\d{4})', query)
            
            if year_match:
                year = year_match.group(2) if len(year_match.groups()) >= 2 else year_match.group(1)
                sparql = prefix + f"""
SELECT DISTINCT ?organization ?organizationName ?orgType ?headquarters ?establishedYear ?president
WHERE {{{{
    ?organization a ?orgType .
    FILTER(?orgType IN (sport:Federation, sport:Club, sport:League_Org, sport:SportsAgency, sport:AntiDoping))
    ?organization sport:establishedYear ?establishedYear .
    OPTIONAL {{{{ ?organization sport:organizationName ?organizationName . }}}}
    OPTIONAL {{{{ ?organization sport:headquarters ?headquarters . }}}}
    OPTIONAL {{{{ ?organization sport:president ?president . }}}}
    FILTER(STR(?establishedYear) = "{year}")
}}}}
ORDER BY ?organizationName
LIMIT {default_limit}
"""
                return sparql, f"Organizations established in {year}"
            
            # Pattern 6: By size - "organizations with most members"
            if any(word in query for word in ["most members", "largest", "biggest", "most countries"]):
                sparql = prefix + f"""
SELECT DISTINCT ?organization ?organizationName ?orgType ?memberCount ?headquarters
WHERE {{
    ?organization a ?orgType .
    FILTER(?orgType IN (sport:Federation, sport:League_Org))
    ?organization sport:memberCount ?memberCount .
    OPTIONAL {{ ?organization sport:organizationName ?organizationName . }}
    OPTIONAL {{ ?organization sport:headquarters ?headquarters . }}
}}
ORDER BY DESC(?memberCount)
LIMIT {default_limit}
"""
                return sparql, "Largest organizations by membership"
            
            # Default: All organizations
            sparql = prefix + f"""
SELECT DISTINCT ?organization ?organizationName ?orgType ?headquarters ?establishedYear
WHERE {{
    ?organization a ?orgType .
    FILTER(?orgType IN (sport:Federation, sport:Club, sport:League_Org, sport:SportsAgency, sport:AntiDoping))
    OPTIONAL {{ ?organization sport:organizationName ?organizationName . }}
    OPTIONAL {{ ?organization sport:headquarters ?headquarters . }}
    OPTIONAL {{ ?organization sport:establishedYear ?establishedYear . }}
}}
ORDER BY ?organizationName
LIMIT {default_limit}
"""
            return sparql, "All organizations"
        
        return None, "Could not generate query"
    
    def _handle_relationship_query(self, query: str, relationship_type: str) -> Tuple[Optional[str], str]:
        """
        ULTIMATE RELATIONSHIP QUERY HANDLER
        Handles ALL relationship queries between entities using RDF properties.
        """
        prefix = f"PREFIX sport: <{self.namespace}>\n"
        numeric_limit = self._extract_number_from_query(query)
        default_limit = numeric_limit if numeric_limit else 50
        
        if relationship_type == "athletes_in_team":
            # Athletes who play for a specific team
            # Extract team name if specified
            team_match = re.search(r'(in|of|on|for)\s+([a-zA-Z\s]+)$', query)
            if team_match:
                team_name = team_match.group(2).strip().title()
                sparql = prefix + f"""
SELECT DISTINCT ?athlete ?firstName ?lastName ?nationality ?position ?teamName
WHERE {{{{
    ?athlete a sport:Athlete .
    ?athlete sport:playsFor ?team .
    ?team sport:teamName ?teamName .
    OPTIONAL {{{{ ?athlete sport:firstName ?firstName . }}}}
    OPTIONAL {{{{ ?athlete sport:lastName ?lastName . }}}}
    OPTIONAL {{{{ ?athlete sport:nationality ?nationality . }}}}
    OPTIONAL {{{{ ?athlete sport:position ?position . }}}}
    FILTER(CONTAINS(LCASE(?teamName), "{team_name.lower()}"))
}}}}
ORDER BY ?lastName
LIMIT {default_limit}
"""
                return sparql, f"Athletes playing for teams matching '{team_name}'"
            else:
                # General: Athletes in teams
                sparql = prefix + f"""
SELECT DISTINCT ?athlete ?firstName ?lastName ?nationality ?teamName
WHERE {{{{
    ?athlete a sport:Athlete .
    ?athlete sport:playsFor ?team .
    ?team sport:teamName ?teamName .
    OPTIONAL {{{{ ?athlete sport:firstName ?firstName . }}}}
    OPTIONAL {{{{ ?athlete sport:lastName ?lastName . }}}}
    OPTIONAL {{{{ ?athlete sport:nationality ?nationality . }}}}
}}}}
ORDER BY ?teamName ?lastName
LIMIT {default_limit}
"""
                return sparql, "Athletes and their teams"
        
        elif relationship_type == "teams_in_competition":
            # Teams competing in a competition
            competition_match = re.search(r'(in|of|at)\s+([a-zA-Z\s]+)$', query)
            if competition_match:
                comp_name = competition_match.group(2).strip().title()
                sparql = prefix + f"""
SELECT DISTINCT ?team ?teamName ?competitionName
WHERE {{{{
    ?team a ?teamType .
    FILTER(?teamType IN (sport:ProfessionalTeam, sport:NationalTeam))
    ?team sport:competesIn ?competition .
    ?competition sport:competitionName ?competitionName .
    OPTIONAL {{{{ ?team sport:teamName ?teamName . }}}}
    FILTER(CONTAINS(LCASE(?competitionName), "{comp_name.lower()}"))
}}}}
ORDER BY ?teamName
LIMIT {default_limit}
"""
                return sparql, f"Teams competing in '{comp_name}'"
            else:
                sparql = prefix + f"""
SELECT DISTINCT ?team ?teamName ?competitionName
WHERE {{{{
    ?team a ?teamType .
    FILTER(?teamType IN (sport:ProfessionalTeam, sport:NationalTeam))
    ?team sport:competesIn ?competition .
    ?competition sport:competitionName ?competitionName .
    OPTIONAL {{{{ ?team sport:teamName ?teamName . }}}}
}}}}
ORDER BY ?competitionName ?teamName
LIMIT {default_limit}
"""
                return sparql, "Teams and their competitions"
        
        elif relationship_type == "coaches_of_team":
            # Coaches of teams
            team_match = re.search(r'(of|for)\s+([a-zA-Z\s]+)$', query)
            if team_match:
                team_name = team_match.group(2).strip().title()
                sparql = prefix + f"""
SELECT DISTINCT ?coach ?firstName ?lastName ?teamName ?experienceYears
WHERE {{{{
    ?coach a sport:Coach .
    ?coach sport:coaches ?team .
    ?team sport:teamName ?teamName .
    OPTIONAL {{{{ ?coach sport:firstName ?firstName . }}}}
    OPTIONAL {{{{ ?coach sport:lastName ?lastName . }}}}
    OPTIONAL {{{{ ?coach sport:experienceYears ?experienceYears . }}}}
    FILTER(CONTAINS(LCASE(?teamName), "{team_name.lower()}"))
}}}}
ORDER BY ?lastName
LIMIT {default_limit}
"""
                return sparql, f"Coaches of teams matching '{team_name}'"
            else:
                sparql = prefix + f"""
SELECT DISTINCT ?coach ?firstName ?lastName ?teamName
WHERE {{{{
    ?coach a sport:Coach .
    ?coach sport:coaches ?team .
    ?team sport:teamName ?teamName .
    OPTIONAL {{{{ ?coach sport:firstName ?firstName . }}}}
    OPTIONAL {{{{ ?coach sport:lastName ?lastName . }}}}
}}}}
ORDER BY ?teamName ?lastName
LIMIT {default_limit}
"""
                return sparql, "Coaches and their teams"
        
        elif relationship_type == "competitions_by_org":
            # Competitions organized by organizations
            # Enhanced pattern to extract organization name
            org_match = re.search(r'(organized by|organiz.*by|by)\s+([a-zA-Z\s]+?)(?:\s*$|\.)', query)
            if org_match:
                org_name = org_match.group(2).strip()
                # Keep uppercase for well-known organizations
                if org_name.upper() in ['FIFA', 'UEFA', 'FIBA', 'IOC', 'WADA', 'NBA']:
                    org_name = org_name.upper()
                else:
                    org_name = org_name.title()
                
                sparql = prefix + f"""
SELECT DISTINCT ?competition ?competitionName ?organizationName ?season ?country
WHERE {{
    ?competition a ?compType .
    FILTER(?compType IN (sport:League, sport:Tournament, sport:Championship, sport:WorldCup, sport:Olympics))
    ?competition sport:organizedBy ?organization .
    ?organization sport:organizationName ?organizationName .
    OPTIONAL {{ ?competition sport:competitionName ?competitionName . }}
    OPTIONAL {{ ?competition sport:season ?season . }}
    OPTIONAL {{ ?competition sport:country ?country . }}
    FILTER(CONTAINS(LCASE(?organizationName), "{org_name.lower()}"))
}}
ORDER BY ?competitionName
LIMIT {default_limit}
"""
                return sparql, f"Competitions organized by {org_name}"
            else:
                sparql = prefix + f"""
SELECT DISTINCT ?competition ?competitionName ?organizationName
WHERE {{{{
    ?competition a ?compType .
    FILTER(?compType IN (sport:League, sport:Tournament, sport:Championship, sport:WorldCup))
    ?competition sport:organizedBy ?organization .
    ?organization sport:organizationName ?organizationName .
    OPTIONAL {{{{ ?competition sport:competitionName ?competitionName . }}}}
}}}}
ORDER BY ?organizationName ?competitionName
LIMIT {default_limit}
"""
                return sparql, "Competitions and their organizing bodies"
        
        elif relationship_type == "teams_in_org":
            # Teams that are members of organizations
            org_match = re.search(r'(of|in|under)\s+([a-zA-Z\s]+)$', query)
            if org_match:
                org_name = org_match.group(2).strip().title()
                sparql = prefix + f"""
SELECT DISTINCT ?team ?teamName ?organizationName
WHERE {{{{
    ?team a ?teamType .
    FILTER(?teamType IN (sport:ProfessionalTeam, sport:NationalTeam))
    ?team sport:memberOf ?organization .
    ?organization sport:organizationName ?organizationName .
    OPTIONAL {{{{ ?team sport:teamName ?teamName . }}}}
    FILTER(CONTAINS(LCASE(?organizationName), "{org_name.lower()}"))
}}}}
ORDER BY ?teamName
LIMIT {default_limit}
"""
                return sparql, f"Teams member of '{org_name}'"
            else:
                sparql = prefix + f"""
SELECT DISTINCT ?team ?teamName ?organizationName
WHERE {{{{
    ?team a ?teamType .
    FILTER(?teamType IN (sport:ProfessionalTeam, sport:NationalTeam))
    ?team sport:memberOf ?organization .
    ?organization sport:organizationName ?organizationName .
    OPTIONAL {{{{ ?team sport:teamName ?teamName . }}}}
}}}}
ORDER BY ?organizationName ?teamName
LIMIT {default_limit}
"""
                return sparql, "Teams and their member organizations"
        
        elif relationship_type == "venues_for_competition":
            # Venues where competitions take place
            comp_match = re.search(r'(for|of|hosting)\s+([a-zA-Z\s]+)$', query)
            if comp_match:
                comp_name = comp_match.group(2).strip().title()
                sparql = prefix + f"""
SELECT DISTINCT ?venue ?venueName ?competitionName ?capacity
WHERE {{{{
    ?competition a ?compType .
    FILTER(?compType IN (sport:League, sport:Tournament, sport:Championship, sport:WorldCup))
    ?competition sport:takesPlaceAt ?venue .
    ?venue sport:venueName ?venueName .
    OPTIONAL {{{{ ?competition sport:competitionName ?competitionName . }}}}
    OPTIONAL {{{{ ?venue sport:capacity ?capacity . }}}}
    FILTER(CONTAINS(LCASE(?competitionName), "{comp_name.lower()}"))
}}}}
ORDER BY ?venueName
LIMIT {default_limit}
"""
                return sparql, f"Venues for '{comp_name}'"
            else:
                sparql = prefix + f"""
SELECT DISTINCT ?venue ?venueName ?competitionName
WHERE {{{{
    ?competition a ?compType .
    FILTER(?compType IN (sport:League, sport:Tournament, sport:Championship))
    ?competition sport:takesPlaceAt ?venue .
    ?venue sport:venueName ?venueName .
    OPTIONAL {{{{ ?competition sport:competitionName ?competitionName . }}}}
}}}}
ORDER BY ?competitionName ?venueName
LIMIT {default_limit}
"""
                return sparql, "Venues and their competitions"
        
        return None, "Relationship type not implemented"
    
    def _pattern_match(self, query: str) -> Tuple[Optional[str], Optional[str]]:
        """
        SMART pattern matching for common queries (faster than LLM).
        Handles single words, flexible phrasing, and intelligent intent detection.
        
        Args:
            query: Lowercase user query
            
        Returns:
            Tuple of (sparql_query, explanation) or (None, None)
        """
        words = query.split()
        
        # SMART Pattern 1: Single word or phrase - Athletes
        if any(word in query for word in ["athletes", "athlete", "players", "player"]) and "count" not in query and "how many" not in query:
            # Check if nationality is specified
            countries = {
                "france": "France", "french": "France",
                "spain": "Spain", "spanish": "Spain",
                "portugal": "Portugal", "portuguese": "Portugal",
                "argentina": "Argentina", "argentinian": "Argentina",
                "brazil": "Brazil", "brazilian": "Brazil",
                "england": "England", "english": "England",
                "germany": "Germany", "german": "Germany",
                "italy": "Italy", "italian": "Italy",
                "croatia": "Croatia", "croatian": "Croatia",
                "poland": "Poland", "polish": "Poland",
                "egypt": "Egypt", "egyptian": "Egypt",
                "norway": "Norway", "norwegian": "Norway",
                "belgium": "Belgium", "belgian": "Belgium",
                "netherlands": "Netherlands", "dutch": "Netherlands",
                "serbia": "Serbia", "serbian": "Serbia",
                "switzerland": "Switzerland", "swiss": "Switzerland",
                "united states": "United States", "usa": "United States", "american": "United States",
                "greece": "Greece", "greek": "Greece",
                "tunisia": "Tunisia", "tunisian": "Tunisia",
                "morocco": "Morocco", "moroccan": "Morocco",
                "algeria": "Algeria", "algerian": "Algeria",
                "senegal": "Senegal", "senegalese": "Senegal",
                "nigeria": "Nigeria", "nigerian": "Nigeria",
                "ghana": "Ghana", "ghanaian": "Ghana",
                "cameroon": "Cameroon", "cameroonian": "Cameroon",
                "ivory coast": "Ivory Coast", "ivorian": "Ivory Coast",
                "south africa": "South Africa", "south african": "South Africa",
                "mexico": "Mexico", "mexican": "Mexico",
                "canada": "Canada", "canadian": "Canada",
                "japan": "Japan", "japanese": "Japan",
                "south korea": "South Korea", "korean": "South Korea",
                "australia": "Australia", "australian": "Australia",
                "uruguay": "Uruguay", "uruguayan": "Uruguay",
                "chile": "Chile", "chilean": "Chile",
                "colombia": "Colombia", "colombian": "Colombia"
            }
            
            # Check for position + nationality combination (VERY SPECIFIC)
            positions = ["forward", "midfielder", "defender", "goalkeeper", "striker", "winger"]
            for position in positions:
                if position in query:
                    for country_key, country_name in countries.items():
                        if country_key in query:
                            sparql = f"""
PREFIX sport: <{self.namespace}>
SELECT ?athlete ?firstName ?lastName ?nationality ?position ?goals
WHERE {{
  ?athlete a sport:Athlete .
  ?athlete sport:firstName ?firstName .
  ?athlete sport:lastName ?lastName .
  ?athlete sport:nationality "{country_name}" .
  ?athlete sport:position ?position .
  FILTER(CONTAINS(LCASE(?position), "{position}"))
  OPTIONAL {{ ?athlete sport:goalsScored ?goals }}
}}
ORDER BY DESC(?goals)
"""
                            return (sparql, f"Showing {position}s from {country_name}")
            
            for country_key, country_name in countries.items():
                if country_key in query:
                    return (
                        self.query_templates["filter_by_nationality"].format(
                            namespace=self.namespace,
                            nationality=country_name
                        ),
                        f"Filtering athletes from {country_name}"
                    )
            
            # No nationality specified - show all athletes
            return (
                self.query_templates["list_athletes"].format(namespace=self.namespace),
                "Retrieving all athletes with their details"
            )
        
        # SMART Pattern 2: Single word or phrase - Country names alone
        countries_standalone = {
            "france": "France", "french": "France",
            "spain": "Spain", "spanish": "Spain", 
            "portugal": "Portugal",
            "argentina": "Argentina",
            "brazil": "Brazil",
            "england": "England",
            "germany": "Germany",
            "italy": "Italy",
            "croatia": "Croatia",
            "poland": "Poland",
            "egypt": "Egypt",
            "norway": "Norway",
            "belgium": "Belgium",
            "netherlands": "Netherlands",
            "united states": "United States", "usa": "United States",
            "tunisia": "Tunisia", "tunisian": "Tunisia",
            "morocco": "Morocco", "moroccan": "Morocco",
            "algeria": "Algeria", "algerian": "Algeria",
            "senegal": "Senegal",
            "nigeria": "Nigeria",
            "ghana": "Ghana",
            "mexico": "Mexico",
            "canada": "Canada",
            "japan": "Japan",
            "australia": "Australia",
            "uruguay": "Uruguay",
            "chile": "Chile",
            "colombia": "Colombia"
        }
        
        for country_key, country_name in countries_standalone.items():
            if query == country_key or (country_key in query and len(words) <= 3):
                return (
                    self.query_templates["filter_by_nationality"].format(
                        namespace=self.namespace,
                        nationality=country_name
                    ),
                    f"Showing all persons from {country_name}"
                )
        
        # SMART Pattern 3: Single word - Coaches
        if any(word in query for word in ["coaches", "coach", "manager", "managers", "coaching"]):
            return (
                self.query_templates["list_coaches"].format(namespace=self.namespace),
                "Retrieving all coaches ordered by experience"
            )
        
        # SMART Pattern 4: Single word - Referees  
        if any(word in query for word in ["referee", "referees", "official", "officials", "ref", "refs"]):
            return (
                self.query_templates["list_referees"].format(namespace=self.namespace),
                "Retrieving all referees ordered by matches officiated"
            )
        
        # SMART Pattern 5: Captains
        if any(word in query for word in ["captain", "captains", "leader", "leaders"]):
            sparql = f"""
PREFIX sport: <{self.namespace}>
SELECT ?athlete ?firstName ?lastName ?nationality ?position
WHERE {{
  ?athlete a sport:Athlete .
  ?athlete sport:firstName ?firstName .
  ?athlete sport:lastName ?lastName .
  ?athlete sport:isCaptain true .
  OPTIONAL {{ ?athlete sport:nationality ?nationality }}
  OPTIONAL {{ ?athlete sport:position ?position }}
}}
"""
            return (sparql, "Showing athletes who are team captains")
        
        # SMART Pattern 6: Top scorers / goals (VERY SPECIFIC)
        if any(phrase in query for phrase in ["top scor", "most goals", "scorer", "highest goal"]):
            # Check for specific number
            import re
            number_match = re.search(r'top (\d+)', query)
            limit = int(number_match.group(1)) if number_match else 20
            
            # Check for nationality in top scorers
            for country_key, country_name in countries.items():
                if country_key in query:
                    sparql = f"""
PREFIX sport: <{self.namespace}>
SELECT ?athlete ?firstName ?lastName ?nationality ?position ?goals
WHERE {{
  ?athlete a sport:Athlete .
  ?athlete sport:firstName ?firstName .
  ?athlete sport:lastName ?lastName .
  ?athlete sport:nationality "{country_name}" .
  ?athlete sport:goalsScored ?goals .
  OPTIONAL {{ ?athlete sport:position ?position }}
  FILTER(?goals > 0)
}}
ORDER BY DESC(?goals)
LIMIT {limit}
"""
                    return (sparql, f"Top {limit} scorers from {country_name}")
            
            # General top scorers
            sparql = f"""
PREFIX sport: <{self.namespace}>
SELECT ?athlete ?firstName ?lastName ?nationality ?position ?goals
WHERE {{
  ?athlete a sport:Athlete .
  ?athlete sport:firstName ?firstName .
  ?athlete sport:lastName ?lastName .
  ?athlete sport:goalsScored ?goals .
  OPTIONAL {{ ?athlete sport:nationality ?nationality }}
  OPTIONAL {{ ?athlete sport:position ?position }}
  FILTER(?goals > 0)
}}
ORDER BY DESC(?goals)
LIMIT {limit}
"""
            return (sparql, f"Top {limit} scoring athletes worldwide")
        
        # SMART Pattern 6b: Specific goal queries
        if "goals" in query and any(word in query for word in ["over", "more than", "above", "at least"]):
            import re
            number_match = re.search(r'(\d+)', query)
            if number_match:
                min_goals = int(number_match.group(1))
                sparql = f"""
PREFIX sport: <{self.namespace}>
SELECT ?athlete ?firstName ?lastName ?nationality ?position ?goals
WHERE {{
  ?athlete a sport:Athlete .
  ?athlete sport:firstName ?firstName .
  ?athlete sport:lastName ?lastName .
  ?athlete sport:goalsScored ?goals .
  FILTER(?goals >= {min_goals})
  OPTIONAL {{ ?athlete sport:nationality ?nationality }}
  OPTIONAL {{ ?athlete sport:position ?position }}
}}
ORDER BY DESC(?goals)
"""
                return (sparql, f"Athletes with {min_goals}+ goals")
        
        # SMART Pattern 6c: Position-specific queries
        positions_detailed = {
            "forward": "Forward", "forwards": "Forward",
            "striker": "Striker", "strikers": "Striker",
            "midfielder": "Midfielder", "midfielders": "Midfielder",
            "defender": "Defender", "defenders": "Defender",
            "goalkeeper": "Goalkeeper", "goalkeepers": "Goalkeeper",
            "winger": "Winger", "wingers": "Winger"
        }
        
        for pos_key, pos_value in positions_detailed.items():
            if pos_key in query and "from" not in query:  # Avoid conflict with nationality+position
                sparql = f"""
PREFIX sport: <{self.namespace}>
SELECT ?athlete ?firstName ?lastName ?nationality ?position ?goals
WHERE {{
  ?athlete a sport:Athlete .
  ?athlete sport:firstName ?firstName .
  ?athlete sport:lastName ?lastName .
  ?athlete sport:position ?position .
  FILTER(CONTAINS(LCASE(?position), "{pos_value.lower()}"))
  OPTIONAL {{ ?athlete sport:nationality ?nationality }}
  OPTIONAL {{ ?athlete sport:goalsScored ?goals }}
}}
ORDER BY DESC(?goals)
LIMIT {default_limit}
"""
                return (sparql, f"Showing all {pos_value}s")
        
        # SMART Pattern 7: Achievements (VERY SPECIFIC)
        if any(word in query for word in ["achievement", "achievements", "award", "awards", "trophy", "trophies", "ballon", "champion", "winner", "won", "title"]):
            # Check for specific year
            import re
            year_match = re.search(r'(19\d{2}|20\d{2})', query)
            if year_match:
                year = year_match.group(1)
                sparql = f"""
PREFIX sport: <{self.namespace}>
SELECT ?achievement ?achievementType ?year ?athleteName ?athleteId
WHERE {{
  ?achievement a sport:Achievement .
  ?achievement sport:year {year} .
  OPTIONAL {{ ?achievement sport:achievementType ?achievementType }}
  OPTIONAL {{
    ?achievement sport:achievedBy ?athlete .
    ?athlete sport:firstName ?firstName .
    ?athlete sport:lastName ?lastName .
    BIND(CONCAT(?firstName, " ", ?lastName) as ?athleteName)
    BIND(STRAFTER(STR(?athlete), "#") as ?athleteId)
  }}
}}
"""
                return (sparql, f"Achievements from year {year}")
            
            return (
                self.query_templates["list_achievements"].format(namespace=self.namespace),
                "Retrieving all achievements and awards"
            )
        
        # SMART Pattern 8: Records
        if any(word in query for word in ["record", "records", "best", "fastest", "highest", "most career", "all-time", "world record"]):
            return (
                self.query_templates["list_records"].format(namespace=self.namespace),
                "Retrieving sports records"
            )
        
        # SMART Pattern 8: Count
        if "count" in query or "how many" in query or "number of" in query:
            if any(word in query for word in ["athlete", "athletes", "player", "players"]):
                return (
                    self.query_templates["count_athletes"].format(namespace=self.namespace),
                    "Counting total number of athletes"
                )
        
        # SMART Pattern 9: Experience / Best coaches
        if any(phrase in query for phrase in ["most experience", "best coach", "top coach", "experienced"]):
            return (
                self.query_templates["list_coaches"].format(namespace=self.namespace),
                "Showing coaches ordered by experience"
            )
        
        # SMART Pattern 10: Search by famous names
        famous_names = {
            "messi": "Messi", "lionel": "Messi",
            "ronaldo": "Ronaldo", "cristiano": "Ronaldo",
            "lebron": "LeBron", "james": "James",
            "curry": "Curry", "stephen": "Curry",
            "nadal": "Nadal", "rafael": "Nadal",
            "federer": "Federer", "roger": "Federer",
            "serena": "Williams", "williams": "Williams",
            "haaland": "Haaland", "erling": "Haaland",
            "guardiola": "Guardiola", "pep": "Guardiola",
            "ancelotti": "Ancelotti", "carlo": "Ancelotti",
            "klopp": "Klopp", "jurgen": "Klopp"
        }
        
        for name_key, name_value in famous_names.items():
            if name_key in query:
                sparql = f"""
PREFIX sport: <{self.namespace}>
SELECT ?person ?firstName ?lastName ?nationality ?position ?goals ?experienceYears ?titlesWon
WHERE {{
  {{
    ?person a sport:Athlete .
    ?person sport:firstName ?firstName .
    ?person sport:lastName ?lastName .
    FILTER(CONTAINS(LCASE(?lastName), "{name_value.lower()}") || CONTAINS(LCASE(?firstName), "{name_value.lower()}"))
    OPTIONAL {{ ?person sport:nationality ?nationality }}
    OPTIONAL {{ ?person sport:position ?position }}
    OPTIONAL {{ ?person sport:goalsScored ?goals }}
  }}
  UNION
  {{
    ?person a sport:Coach .
    ?person sport:firstName ?firstName .
    ?person sport:lastName ?lastName .
    FILTER(CONTAINS(LCASE(?lastName), "{name_value.lower()}") || CONTAINS(LCASE(?firstName), "{name_value.lower()}"))
    OPTIONAL {{ ?person sport:nationality ?nationality }}
    OPTIONAL {{ ?person sport:experienceYears ?experienceYears }}
    OPTIONAL {{ ?person sport:titlesWon ?titlesWon }}
  }}
}}
"""
                return (sparql, f"Searching for {name_value}")
        
        # SMART Pattern 11: General name search (any name not in famous list)
        # If query is 1-3 words and doesn't match other patterns, treat as name search
        if len(words) <= 3 and not any(keyword in query for keyword in [
            "athletes", "coaches", "referees", "achievement", "record", "count", "how many",
            "most", "best", "top", "all", "list", "show"
        ]):
            # Search for the name across all person types
            search_term = query.strip()
            sparql = f"""
PREFIX sport: <{self.namespace}>
SELECT ?person ?firstName ?lastName ?nationality ?position ?goals ?experienceYears ?titlesWon ?type
WHERE {{
  {{
    ?person a sport:Athlete .
    ?person sport:firstName ?firstName .
    ?person sport:lastName ?lastName .
    BIND("Athlete" as ?type)
    FILTER(
      CONTAINS(LCASE(?firstName), "{search_term}") || 
      CONTAINS(LCASE(?lastName), "{search_term}") ||
      CONTAINS(LCASE(CONCAT(?firstName, " ", ?lastName)), "{search_term}")
    )
    OPTIONAL {{ ?person sport:nationality ?nationality }}
    OPTIONAL {{ ?person sport:position ?position }}
    OPTIONAL {{ ?person sport:goalsScored ?goals }}
  }}
  UNION
  {{
    ?person a sport:Coach .
    ?person sport:firstName ?firstName .
    ?person sport:lastName ?lastName .
    BIND("Coach" as ?type)
    FILTER(
      CONTAINS(LCASE(?firstName), "{search_term}") || 
      CONTAINS(LCASE(?lastName), "{search_term}") ||
      CONTAINS(LCASE(CONCAT(?firstName, " ", ?lastName)), "{search_term}")
    )
    OPTIONAL {{ ?person sport:nationality ?nationality }}
    OPTIONAL {{ ?person sport:experienceYears ?experienceYears }}
    OPTIONAL {{ ?person sport:titlesWon ?titlesWon }}
  }}
  UNION
  {{
    ?person a sport:Referee .
    ?person sport:firstName ?firstName .
    ?person sport:lastName ?lastName .
    BIND("Referee" as ?type)
    FILTER(
      CONTAINS(LCASE(?firstName), "{search_term}") || 
      CONTAINS(LCASE(?lastName), "{search_term}") ||
      CONTAINS(LCASE(CONCAT(?firstName, " ", ?lastName)), "{search_term}")
    )
    OPTIONAL {{ ?person sport:nationality ?nationality }}
  }}
}}
"""
            return (sparql, f"Searching for people named '{search_term}'")
        
        return None, None
    
    async def _use_ollama(self, user_query: str) -> Tuple[str, str]:
        """
        Use Ollama LLM to convert query to SPARQL.
        
        Args:
            user_query: Natural language query
            
        Returns:
            Tuple of (sparql_query, explanation)
        """
        prompt = f"""You are a SPARQL query generator for a sports ontology.

Ontology namespace: {self.namespace}

Available classes for Person/Performance queries:
- sport:Athlete (properties: firstName, lastName, nationality, position, goalsScored, assists, jerseyNumber, isCaptain)
- sport:Coach (properties: firstName, lastName, yearsExperience, titlesWon, coachingStyle)
- sport:Referee (properties: firstName, lastName, nationality, experienceYears, matchesOfficiated)
- sport:Achievement (properties: achievementType, year, performanceValue, unit, achievedBy)
- sport:Record (properties: recordType, recordValue, setOn, setBy)

NOTE: For queries about Teams, Competitions, or Organizations, those are handled by a separate service.

User query: "{user_query}"

Generate a valid SPARQL query. Return ONLY the SPARQL query, no explanations.
"""

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.ollama_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "options": {
                            "temperature": 0.3,
                            "top_p": 0.9
                        }
                    }
                )
                
                if response.status_code == 200:
                    result = response.json()
                    sparql = result.get("response", "").strip()
                    
                    # Clean up the response
                    sparql = self._clean_sparql(sparql)
                    
                    return sparql, f"Generated SPARQL query using {self.model}"
                else:
                    logger.error(f"Ollama returned status {response.status_code}")
                    return self._fallback_query()
                    
        except Exception as e:
            logger.error(f"Error calling Ollama: {e}")
            return self._fallback_query()
    
    def _clean_sparql(self, sparql: str) -> str:
        """Clean up generated SPARQL query."""
        # Remove markdown code blocks if present
        sparql = sparql.replace("```sparql", "").replace("```", "")
        sparql = sparql.strip()
        
        # Ensure it has PREFIX
        if "PREFIX" not in sparql:
            sparql = f"PREFIX sport: <{self.namespace}>\n" + sparql
        
        return sparql
    
    def _fallback_query(self) -> Tuple[str, str]:
        """Return fallback query when Ollama fails."""
        return (
            self.query_templates["list_athletes"].format(namespace=self.namespace),
            "Showing all athletes (Ollama unavailable)"
        )


# Global service instance
ollama_sparql_service = OllamaSparqlService()
