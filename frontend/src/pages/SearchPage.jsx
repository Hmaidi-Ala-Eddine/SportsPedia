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
        const type = result.type || '';
        
        // Person types
        if (type === 'Athlete') return '#2563eb';
        if (type === 'Coach') return '#16a34a';
        if (type === 'Referee') return '#ec4899';
        
        // Entity types
        if (type === 'Team') return '#0891b2';
        if (type === 'Competition') return '#dc2626';
        if (type === 'Organization') return '#7c3aed';
        if (type === 'Venue') return '#10b981';
        if (type === 'Media') return '#ec4899';
        if (type === 'Sport') return '#fb923c';
        if (type === 'Equipment') return '#0ea5e9';
        if (type === 'Sponsorship') return '#a855f7';
        
        // Legacy types
        if (type.includes('Achievement') || type.includes('Ballon')) return '#f59e0b';
        if (type.includes('Record') || type.includes('Goals')) return '#8b5cf6';
        
        return '#6b7280';
    };

    const getCategoryIcon = (result) => {
        const type = result.type || '';
        
        // Person types
        if (type === 'Athlete') return 'fas fa-running';
        if (type === 'Coach') return 'fas fa-clipboard';
        if (type === 'Referee') return 'fas fa-whistle';
        
        // Entity types
        if (type === 'Team') return 'fas fa-users';
        if (type === 'Competition') return 'fas fa-trophy';
        if (type === 'Organization') return 'fas fa-building';
        if (type === 'Venue') return 'fas fa-map-marker-alt';
        if (type === 'Media') return 'fas fa-broadcast-tower';
        if (type === 'Sport') return 'fas fa-futbol';
        if (type === 'Equipment') return 'fas fa-basketball-ball';
        if (type === 'Sponsorship') return 'fas fa-handshake';
        
        // Legacy
        if (type.includes('Achievement')) return 'fas fa-trophy';
        if (type.includes('Record')) return 'fas fa-medal';
        
        return 'fas fa-circle';
    };

    const getCategoryLabel = (result) => {
        const type = result.type || '';
        if (type) return type;
        return 'Item';
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
                                        // Determine display name based on entity type
                                        let displayName = 'Item';
                                        if (result.firstName && result.lastName) {
                                            displayName = `${result.firstName} ${result.lastName}`;
                                        } else if (result.teamName) {
                                            displayName = result.teamName;
                                        } else if (result.competitionName) {
                                            displayName = result.competitionName;
                                        } else if (result.organizationName) {
                                            displayName = result.organizationName;
                                        } else if (result.venueName) {
                                            displayName = result.venueName;
                                        } else if (result.mediaName) {
                                            displayName = result.mediaName;
                                        } else if (result.sportName) {
                                            displayName = result.sportName;
                                        } else if (result.equipmentName) {
                                            displayName = result.equipmentName;
                                        } else if (result.sponsorName) {
                                            displayName = result.sponsorName;
                                        } else if (result.name) {
                                            displayName = result.name;
                                        }
                                        
                                        const color = getCategoryColor(result);
                                        const icon = getCategoryIcon(result);
                                        const categoryLabel = getCategoryLabel(result);
                                        
                                        // Determine the correct detail page URL based on entity type
                                        const getDetailUrl = () => {
                                            const id = result.id || 'unknown';
                                            const type = result.type || '';
                                            
                                            // Person types
                                            if (type === 'Athlete') return `/person/athlete/${id}`;
                                            if (type === 'Coach') return `/person/coach/${id}`;
                                            if (type === 'Referee') return `/person/referee/${id}`;
                                            
                                            // TCO types - match existing routes
                                            if (type === 'Team') return `/teams/${id}`;
                                            if (type === 'Competition') return `/competitions/${id}`;
                                            if (type === 'Organization') return `/organizations/${id}`;
                                            
                                            // New entity types - for now route to list pages
                                            // TODO: Create detail pages for these
                                            if (type === 'Venue') return `/venues`;
                                            if (type === 'Media') return `/media`;
                                            if (type === 'Sport') return `/sports`;
                                            if (type === 'Equipment') return `/equipment`;
                                            if (type === 'Sponsorship') return `/sponsorships`;
                                            
                                            // Fallback
                                            return '#';
                                        };
                                        
                                        const detailUrl = getDetailUrl();
                                        
                                        return (
                                            <div key={index} className="col-lg-6 col-md-6 mb-30">
                                                <div 
                                                    onClick={() => detailUrl !== '#' && navigate(detailUrl)}
                                                    style={{ backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', transition: 'all 0.3s', cursor: 'pointer', border: '2px solid transparent' }} 
                                                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = color; }} 
                                                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = 'transparent'; }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                                        <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px' }}>
                                                            <i className={icon} style={{ fontSize: '24px', color: color }}></i>
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <span style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: `${color}15`, color: color, borderRadius: '20px', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                                                                {categoryLabel}
                                                            </span>
                                                            <h4 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '5px' }}>{displayName}</h4>
                                                            {result.nationality && (
                                                                <span style={{ fontSize: '14px', color: '#64748b' }}>
                                                                    <i className="fas fa-globe" style={{ marginRight: '5px' }}></i>
                                                                    {result.nationality}
                                                                </span>
                                                            )}
                                                            {result.country && !result.nationality && (
                                                                <span style={{ fontSize: '14px', color: '#64748b' }}>
                                                                    <i className="fas fa-flag" style={{ marginRight: '5px' }}></i>
                                                                    {result.country}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div style={{ paddingTop: '15px', borderTop: '1px solid #f1f5f9' }}>
                                                        {/* Person fields */}
                                                        {result.position && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Position:</strong> {result.position}</p>}
                                                        {result.goals && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Goals:</strong> {result.goals}</p>}
                                                        {result.goalsScored && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Goals:</strong> {result.goalsScored}</p>}
                                                        {result.experienceYears && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Experience:</strong> {result.experienceYears} years</p>}
                                                        {result.titlesWon && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Titles:</strong> {result.titlesWon}</p>}
                                                        {result.matchesOfficiated && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Matches:</strong> {result.matchesOfficiated}</p>}
                                                        
                                                        {/* Team fields */}
                                                        {result.team_type && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Type:</strong> {result.team_type}</p>}
                                                        {result.foundedYear && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Founded:</strong> {result.foundedYear}</p>}
                                                        {result.city && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>City:</strong> {result.city}</p>}
                                                        
                                                        {/* Competition fields */}
                                                        {result.compType && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Type:</strong> {result.compType}</p>}
                                                        {result.season && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Season:</strong> {result.season}</p>}
                                                        {result.startDate && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Start:</strong> {result.startDate}</p>}
                                                        {result.prizeMoney && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Prize:</strong> ${result.prizeMoney}M</p>}
                                                        
                                                        {/* Organization fields */}
                                                        {result.orgType && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Type:</strong> {result.orgType}</p>}
                                                        {result.headquarters && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>HQ:</strong> {result.headquarters}</p>}
                                                        {result.establishedYear && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Established:</strong> {result.establishedYear}</p>}
                                                        
                                                        {/* Venue fields */}
                                                        {result.capacity && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Capacity:</strong> {result.capacity.toLocaleString()}</p>}
                                                        {result.openedYear && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Opened:</strong> {result.openedYear}</p>}
                                                        {result.surfaceType && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Surface:</strong> {result.surfaceType}</p>}
                                                        
                                                        {/* Media fields */}
                                                        {result.audience && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Audience:</strong> {result.audience.toLocaleString()}</p>}
                                                        {result.launchYear && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Launched:</strong> {result.launchYear}</p>}
                                                        
                                                        {/* Sport fields */}
                                                        {result.isOlympic !== undefined && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Olympic:</strong> {result.isOlympic ? '✓ Yes' : '✗ No'}</p>}
                                                        {result.originCountry && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Origin:</strong> {result.originCountry}</p>}
                                                        
                                                        {/* Equipment fields */}
                                                        {result.brand && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Brand:</strong> {result.brand}</p>}
                                                        {result.model && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Model:</strong> {result.model}</p>}
                                                        {result.sport && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Sport:</strong> {result.sport}</p>}
                                                        {result.price && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Price:</strong> ${result.price}</p>}
                                                        
                                                        {/* Sponsorship fields */}
                                                        {result.dealValue && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Deal Value:</strong> ${result.dealValue}M</p>}
                                                        {result.industry && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Industry:</strong> {result.industry}</p>}
                                                        {result.sponsors && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Sponsors:</strong> {result.sponsors}</p>}
                                                        {result.endorses && <p style={{ marginBottom: '5px', color: '#64748b' }}><strong>Endorses:</strong> {result.endorses}</p>}
                                                    </div>

                                                    <div style={{ marginTop: '15px', color: color, fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                                                        View Details <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                                                    </div>
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
