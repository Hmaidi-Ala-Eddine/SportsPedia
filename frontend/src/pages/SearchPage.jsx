import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LayoutV1 from '@/components/layouts/LayoutV1';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [results, setResults] = useState([]);
    const [sparqlQuery, setSparqlQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSparql, setShowSparql] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const q = searchParams.get('q');
        if (q) {
            setQuery(q);
            performSearch(q);
        }
    }, [searchParams]);

    const performSearch = async (searchQuery) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`http://localhost:8000/api/nl-search/search?q=${encodeURIComponent(searchQuery)}`);
            
            if (!response.ok) {
                throw new Error('Search failed');
            }
            
            const data = await response.json();
            setResults(data.results || []);
            setSparqlQuery(data.sparql_query || '');
        } catch (err) {
            setError(err.message);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    const getCategoryColor = (result) => {
        const firstName = result.firstName || '';
        const type = result.type || result.recordType || '';
        
        if (firstName || type.includes('Athlete')) return '#2563eb';
        if (type.includes('Coach')) return '#16a34a';
        if (type.includes('Referee')) return '#dc2626';
        if (type.includes('Achievement') || type.includes('Ballon')) return '#f59e0b';
        if (type.includes('Record') || type.includes('Goals')) return '#8b5cf6';
        return '#6b7280';
    };

    const getCategoryIcon = (result) => {
        const type = result.type || result.recordType || '';
        if (result.firstName) return 'fas fa-running';
        if (type.includes('Coach')) return 'fas fa-clipboard';
        if (type.includes('Achievement')) return 'fas fa-trophy';
        if (type.includes('Record')) return 'fas fa-medal';
        return 'fas fa-user-circle';
    };

    return (
        <LayoutV1>
            <div style={{ padding: '40px 0', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
                <div className="container">
                    <form onSubmit={handleSearch} style={{ marginBottom: '40px' }}>
                        <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex' }}>
                            <input type="text" placeholder="Ask anything about sports..." value={query} onChange={(e) => setQuery(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', padding: '18px 25px', fontSize: '16px' }} />
                            <button type="submit" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: 'white', border: 'none', padding: '18px 35px', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                                <i className="fas fa-search" style={{ marginRight: '8px' }}></i>Search
                            </button>
                        </div>
                    </form>

                    {sparqlQuery && (
                        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
                                    <i className="fas fa-code" style={{ marginRight: '10px', color: '#2563eb' }}></i>
                                    Generated SPARQL Query
                                </h3>
                                <button onClick={() => setShowSparql(!showSparql)} style={{ background: 'none', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
                                    {showSparql ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {showSparql && (
                                <pre style={{ backgroundColor: '#1e293b', color: '#e2e8f0', padding: '20px', borderRadius: '8px', overflow: 'auto', fontSize: '13px', fontFamily: 'monospace', lineHeight: '1.6' }}>
                                    {sparqlQuery}
                                </pre>
                            )}
                        </div>
                    )}

                    {loading && (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#2563eb' }}></i>
                            <p style={{ marginTop: '20px', fontSize: '18px', color: '#64748b' }}>Searching...</p>
                        </div>
                    )}

                    {error && (
                        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
                            <i className="fas fa-exclamation-circle" style={{ marginRight: '10px' }}></i>
                            Error: {error}
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b', marginBottom: '30px' }}>
                                {results.length} Results Found
                            </h2>

                            {results.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                    <i className="fas fa-search" style={{ fontSize: '64px', color: '#e2e8f0', marginBottom: '20px' }}></i>
                                    <h3 style={{ fontSize: '20px', color: '#64748b', marginBottom: '10px' }}>No results found</h3>
                                    <p style={{ color: '#94a3b8' }}>Try a different search query</p>
                                </div>
                            ) : (
                                <div className="row">
                                    {results.map((result, index) => {
                                        const displayName = result.firstName ? `${result.firstName} ${result.lastName}` : (result.recordType || result.name || 'Item');
                                        const color = getCategoryColor(result);
                                        const icon = getCategoryIcon(result);
                                        
                                        return (
                                            <div key={index} className="col-lg-6 col-md-6 mb-30">
                                                <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', transition: 'all 0.3s', cursor: 'pointer', border: '2px solid transparent' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = color; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = 'transparent'; }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                                        <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px' }}>
                                                            <i className={icon} style={{ fontSize: '24px', color: color }}></i>
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <h4 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '5px' }}>{displayName}</h4>
                                                            {result.nationality && (
                                                                <span style={{ fontSize: '14px', color: '#64748b' }}>
                                                                    <i className="fas fa-globe" style={{ marginRight: '5px' }}></i>
                                                                    {result.nationality}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div style={{ paddingTop: '15px', borderTop: '1px solid #f1f5f9' }}>
                                                        {result.position && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Position:</strong> {result.position}</p>}
                                                        {result.goals && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Goals:</strong> {result.goals}</p>}
                                                        {result.assists && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Assists:</strong> {result.assists}</p>}
                                                        {result.performanceValue && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Value:</strong> {result.performanceValue}</p>}
                                                    </div>

                                                    <button style={{ marginTop: '15px', color: color, background: 'none', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                        View Details <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </LayoutV1>
    );
};

export default SearchPage;
