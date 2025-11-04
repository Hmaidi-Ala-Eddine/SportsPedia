"""
Ollama-based Natural Language to SPARQL Query Service
Converts natural language queries to SPARQL queries using Ollama LLM
"""

import httpx
import json
import logging
from typing import Dict, Tuple, Optional
from app.config.settings import settings

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
        Convert natural language query to SPARQL.
        
        Args:
            user_query: Natural language query from user
            
        Returns:
            Tuple of (sparql_query, explanation, metadata)
        """
        try:
            # First try pattern matching (faster and more reliable)
            sparql, explanation = self._pattern_match(user_query.lower())
            
            if sparql:
                return sparql, explanation, {"method": "pattern_matching"}
            
            # If no pattern match, use Ollama
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
LIMIT 50
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

Available classes:
- sport:Athlete (properties: firstName, lastName, nationality, position, goalsScored, assists, jerseyNumber, isCaptain)
- sport:Coach (properties: firstName, lastName, yearsExperience, titlesWon, coachingStyle)
- sport:Referee (properties: firstName, lastName, nationality, experienceYears, matchesOfficiated)
- sport:Achievement (properties: achievementType, year, performanceValue, unit, achievedBy)
- sport:Record (properties: recordType, recordValue, setOn, setBy)

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
