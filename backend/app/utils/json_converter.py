from typing import Dict, List, Any, Optional


def sparql_results_to_list(results: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Convert SPARQL JSON results to a simple list of dictionaries.
    
    Args:
        results: SPARQL query results in JSON format
        
    Returns:
        List of dictionaries with simplified data
    """
    if not results or 'results' not in results:
        return []
    
    bindings = results['results'].get('bindings', [])
    
    converted = []
    for binding in bindings:
        item = {}
        for key, value in binding.items():
            # Extract the actual value based on type
            if value['type'] == 'uri':
                item[key] = value['value']
            elif value['type'] == 'literal':
                item[key] = value['value']
                # Include datatype if present
                if 'datatype' in value:
                    item[f"{key}_datatype"] = value['datatype']
            elif value['type'] == 'bnode':
                item[key] = value['value']
        converted.append(item)
    
    return converted


def extract_id_from_uri(uri: str) -> str:
    """
    Extract the ID from a URI.
    
    Args:
        uri: Full URI string
        
    Returns:
        ID extracted from URI
    """
    if not uri:
        return ""
    
    # Try splitting by #
    if '#' in uri:
        return uri.split('#')[-1]
    
    # Try splitting by /
    if '/' in uri:
        return uri.split('/')[-1]
    
    return uri


def format_sparql_value(value: Any, datatype: Optional[str] = None) -> Any:
    """
    Format a value based on its SPARQL datatype.
    
    Args:
        value: The value to format
        datatype: XSD datatype URI
        
    Returns:
        Formatted value
    """
    if datatype:
        if 'integer' in datatype:
            return int(value)
        elif 'float' in datatype or 'double' in datatype:
            return float(value)
        elif 'boolean' in datatype:
            return value.lower() in ('true', '1')
        elif 'date' in datatype:
            return value  # Return as string, can be parsed by frontend
    
    return value