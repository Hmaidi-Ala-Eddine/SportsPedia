"""
SportsPedia - Test SPARQL Queries
This script tests basic SPARQL queries against the Fuseki endpoint
"""

import sys
from SPARQLWrapper import SPARQLWrapper, JSON
import json

FUSEKI_ENDPOINT = "http://localhost:3030/sportspedia/query"
ONTOLOGY_NAMESPACE = "http://example.org/sports-ontology#"


def test_connection():
    """Test connection to Fuseki"""
    print("[1/5] Testing Fuseki connection...")
    try:
        sparql = SPARQLWrapper(FUSEKI_ENDPOINT)
        sparql.setQuery("ASK { ?s ?p ?o }")
        sparql.setReturnFormat(JSON)
        result = sparql.query().convert()
        print("✓ Connected to Fuseki successfully")
        return True
    except Exception as e:
        print(f"✗ Failed to connect to Fuseki: {e}")
        return False


def test_count_triples():
    """Count total triples in the dataset"""
    print("\n[2/5] Counting triples...")
    query = """
    SELECT (COUNT(*) as ?count)
    WHERE {
        ?s ?p ?o
    }
    """
    try:
        sparql = SPARQLWrapper(FUSEKI_ENDPOINT)
        sparql.setQuery(query)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        count = results["results"]["bindings"][0]["count"]["value"]
        print(f"✓ Total triples: {count}")
        return True
    except Exception as e:
        print(f"✗ Failed to count triples: {e}")
        return False


def test_get_classes():
    """Get all classes from the ontology"""
    print("\n[3/5] Fetching classes...")
    query = """
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT ?class ?label
    WHERE {
        ?class a owl:Class .
        OPTIONAL { ?class rdfs:label ?label }
    }
    ORDER BY ?class
    LIMIT 20
    """
    try:
        sparql = SPARQLWrapper(FUSEKI_ENDPOINT)
        sparql.setQuery(query)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        
        print(f"✓ Found {len(results['results']['bindings'])} classes")
        for binding in results["results"]["bindings"][:10]:
            class_name = binding["class"]["value"].split("#")[-1]
            label = binding.get("label", {}).get("value", "No label")
            print(f"  - {class_name}: {label}")
        
        return True
    except Exception as e:
        print(f"✗ Failed to get classes: {e}")
        return False


def test_get_individuals():
    """Get sample individuals from the ontology"""
    print("\n[4/5] Fetching individuals...")
    query = """
    PREFIX sport: <http://example.org/sports-ontology#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT ?individual ?type ?label
    WHERE {
        ?individual rdf:type ?type .
        ?type rdf:type <http://www.w3.org/2002/07/owl#Class> .
        OPTIONAL { ?individual rdfs:label ?label }
    }
    LIMIT 10
    """
    try:
        sparql = SPARQLWrapper(FUSEKI_ENDPOINT)
        sparql.setQuery(query)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        
        count = len(results["results"]["bindings"])
        print(f"✓ Found {count} individuals (showing sample)")
        
        for binding in results["results"]["bindings"][:5]:
            individual = binding["individual"]["value"].split("#")[-1]
            type_name = binding["type"]["value"].split("#")[-1]
            label = binding.get("label", {}).get("value", "No label")
            print(f"  - {individual} ({type_name}): {label}")
        
        return True
    except Exception as e:
        print(f"✗ Failed to get individuals: {e}")
        return False


def test_sample_athlete_query():
    """Test a sample athlete query"""
    print("\n[5/5] Testing athlete query...")
    query = """
    PREFIX sport: <http://example.org/sports-ontology#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT ?athlete ?name ?nationality
    WHERE {
        ?athlete rdf:type sport:Athlete .
        OPTIONAL { ?athlete sport:hasName ?name }
        OPTIONAL { ?athlete sport:hasNationality ?nationality }
    }
    LIMIT 5
    """
    try:
        sparql = SPARQLWrapper(FUSEKI_ENDPOINT)
        sparql.setQuery(query)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        
        count = len(results["results"]["bindings"])
        if count > 0:
            print(f"✓ Found {count} athletes")
            for binding in results["results"]["bindings"]:
                athlete_id = binding["athlete"]["value"].split("#")[-1]
                name = binding.get("name", {}).get("value", "Unknown")
                nationality = binding.get("nationality", {}).get("value", "Unknown")
                print(f"  - {athlete_id}: {name} ({nationality})")
        else:
            print("! No athletes found in the dataset")
            print("  This is expected if you haven't added instance data yet")
        
        return True
    except Exception as e:
        print(f"✗ Failed to query athletes: {e}")
        return False


def main():
    """Run all tests"""
    print("=" * 50)
    print("  SportsPedia - SPARQL Query Tests")
    print("=" * 50)
    print()
    
    tests = [
        test_connection,
        test_count_triples,
        test_get_classes,
        test_get_individuals,
        test_sample_athlete_query
    ]
    
    passed = 0
    for test in tests:
        if test():
            passed += 1
    
    print("\n" + "=" * 50)
    print(f"  Tests Passed: {passed}/{len(tests)}")
    print("=" * 50)
    print()
    
    if passed == len(tests):
        print("✓ All tests passed! Your Fuseki setup is working correctly.")
        return 0
    else:
        print("! Some tests failed. Check the errors above.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
