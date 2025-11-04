import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LayoutV1 from '@/components/layouts/LayoutV1';

const UnifiedSearchPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [category, setCategory] = useState(searchParams.get('category') || 'all');
    const [nationality, setNationality] = useState('all');
    const [position, setPosition] = useState('all');
    const [personType, setPersonType] = useState('all'); // Filter by type (athlete/coach/referee)
    
    // Advanced filters
    const [sortBy, setSortBy] = useState('name'); // name, goals, experience
    const [minGoals, setMinGoals] = useState(0);
    const [isCaptain, setIsCaptain] = useState('all');
    const [coachingStyle, setCoachingStyle] = useState('all');
    const [minExperience, setMinExperience] = useState(0);
    
    const [athletes, setAthletes] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [referees, setReferees] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(() => {
        // Load saved tab from localStorage or default to 'ai'
        return localStorage.getItem('searchActiveTab') || 'ai';
    });
    const [sparqlQuery, setSparqlQuery] = useState('');
    const [showSparql, setShowSparql] = useState(false);

    // Auto-load all data on page mount
    useEffect(() => {
        fetchAll();
    }, []);

    useEffect(() => {
        if (activeTab === 'athletes' && athletes.length === 0) fetchAthletes();
        if (activeTab === 'coaches' && coaches.length === 0) fetchCoaches();
        if (activeTab === 'referees' && referees.length === 0) fetchReferees();
    }, [activeTab, nationality, position]);

    // Save active tab to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('searchActiveTab', activeTab);
    }, [activeTab]);

    useEffect(() => {
        const q = searchParams.get('q');
        if (q && activeTab === 'ai') {
            setQuery(q);
            performAISearch(q);
        }
    }, [searchParams]);

    const performAISearch = async (searchQuery) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/nl-search/search?q=${encodeURIComponent(searchQuery)}`);
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data.results || []);
                setSparqlQuery(data.sparql_query || '');
            }
        } catch (error) {
            console.error('AI Search error:', error);
        }
        setLoading(false);
    };

    const fetchAthletes = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/persons/athletes?limit=100');
            if (response.ok) {
                const data = await response.json();
                setAthletes(data.athletes || []);
            }
        } catch (error) {
            console.error('Athletes fetch error:', error);
        }
        setLoading(false);
    };

    const fetchCoaches = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/persons/coaches?limit=50');
            if (response.ok) {
                const data = await response.json();
                setCoaches(data.coaches || []);
            }
        } catch (error) {
            console.error('Coaches fetch error:', error);
        }
        setLoading(false);
    };

    const fetchReferees = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/persons/referees?limit=20');
            if (response.ok) {
                const data = await response.json();
                setReferees(data.referees || []);
            }
        } catch (error) {
            console.error('Referees fetch error:', error);
        }
        setLoading(false);
    };

    const fetchAll = async () => {
        await Promise.all([fetchAthletes(), fetchCoaches(), fetchReferees()]);
    };

    const handleAISearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            setActiveTab('ai');
            setSearchParams({ q: query, category: 'ai' });
            performAISearch(query);
        }
    };

    const filteredAthletes = athletes.filter(a => {
        const matchesNationality = nationality === 'all' || a.nationality === nationality;
        const matchesPosition = position === 'all' || a.position === position;
        const matchesQuery = !query || `${a.firstName} ${a.lastName}`.toLowerCase().includes(query.toLowerCase());
        const matchesGoals = !minGoals || (a.goalsScored && a.goalsScored >= minGoals);
        const matchesCaptain = isCaptain === 'all' || (isCaptain === 'yes' && a.isCaptain) || (isCaptain === 'no' && !a.isCaptain);
        return matchesNationality && matchesPosition && matchesQuery && matchesGoals && matchesCaptain;
    }).sort((a, b) => {
        if (sortBy === 'goals') return (b.goalsScored || 0) - (a.goalsScored || 0);
        if (sortBy === 'name') return `${a.lastName}`.localeCompare(`${b.lastName}`);
        return 0;
    });

    const filteredCoaches = coaches.filter(c => {
        const matchesQuery = !query || `${c.firstName} ${c.lastName}`.toLowerCase().includes(query.toLowerCase());
        const matchesNationality = nationality === 'all' || c.nationality === nationality;
        const matchesStyle = coachingStyle === 'all' || c.coachingStyle === coachingStyle;
        const matchesExperience = !minExperience || (c.experienceYears && c.experienceYears >= minExperience);
        return matchesQuery && matchesNationality && matchesStyle && matchesExperience;
    }).sort((a, b) => {
        if (sortBy === 'experience') return (b.experienceYears || 0) - (a.experienceYears || 0);
        if (sortBy === 'titles') return (b.titlesWon || 0) - (a.titlesWon || 0);
        if (sortBy === 'name') return `${a.lastName}`.localeCompare(`${b.lastName}`);
        return 0;
    });

    const filteredReferees = referees.filter(r => {
        const matchesQuery = !query || `${r.firstName} ${r.lastName}`.toLowerCase().includes(query.toLowerCase());
        const matchesNationality = nationality === 'all' || r.nationality === nationality;
        const matchesExperience = !minExperience || (r.experienceYears && r.experienceYears >= minExperience);
        return matchesQuery && matchesNationality && matchesExperience;
    }).sort((a, b) => {
        if (sortBy === 'experience') return (b.experienceYears || 0) - (a.experienceYears || 0);
        if (sortBy === 'matches') return (b.matchesOfficiated || 0) - (a.matchesOfficiated || 0);
        if (sortBy === 'name') return `${a.lastName}`.localeCompare(`${b.lastName}`);
        return 0;
    });


    const nationalities = [...new Set(athletes.map(a => a.nationality).filter(Boolean))];
    const positions = [...new Set(athletes.map(a => a.position).filter(Boolean))];

    // Smart AI suggestion prompts
    const aiSuggestions = [
        "Show all athletes from Spain",
        "List coaches by experience",
        "Find referees with most matches",
        "Show athletes who are captains",
        "Find top scoring athletes"
    ];

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        setActiveTab('ai');
        setSearchParams({ q: suggestion, category: 'ai' });
        performAISearch(suggestion);
    };

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        setSearchParams({}); // Clear search params when switching tabs
        
        // Clear query when switching away from AI tab to prevent filtering
        if (tabId !== 'ai') {
            setQuery('');
        }
        
        // Fetch data if not already loaded
        if (tabId === 'athletes' && athletes.length === 0) fetchAthletes();
        if (tabId === 'coaches' && coaches.length === 0) fetchCoaches();
        if (tabId === 'referees' && referees.length === 0) fetchReferees();
    };

    const tabs = [
        { id: 'ai', label: '🤖 AI Search', icon: 'fas fa-magic', count: searchResults.length },
        { id: 'athletes', label: '🏃 Athletes', icon: 'fas fa-running', count: filteredAthletes.length },
        { id: 'coaches', label: '📋 Coaches', icon: 'fas fa-clipboard', count: filteredCoaches.length },
        { id: 'referees', label: '🟨 Referees', icon: 'fas fa-whistle', count: filteredReferees.length }
    ];

    return (
        <LayoutV1>
            <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
                <div className="container">
                    {/* Header - Futuristic AI Design */}
                    <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
                        {/* Animated Background */}
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '200px',
                            height: '200px',
                            background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
                            borderRadius: '50%',
                            animation: 'pulse 3s ease-in-out infinite',
                            zIndex: 0
                        }}></div>

                        <style>{`
                            @keyframes pulse {
                                0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.5; }
                                50% { transform: translateX(-50%) scale(1.1); opacity: 0.8; }
                            }
                            @keyframes float {
                                0%, 100% { transform: translateY(0px); }
                                50% { transform: translateY(-10px); }
                            }
                            @keyframes glow {
                                0%, 100% { box-shadow: 0 0 20px rgba(124,58,237,0.3); }
                                50% { box-shadow: 0 0 30px rgba(124,58,237,0.6); }
                            }
                        `}</style>

                        {/* Robot Icon with Animation */}
                        <div style={{ 
                            display: 'inline-block', 
                            marginBottom: '15px',
                            animation: 'float 3s ease-in-out infinite',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <i className="fas fa-robot" style={{ 
                                fontSize: '56px', 
                                background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                filter: 'drop-shadow(0 4px 8px rgba(124,58,237,0.3))'
                            }}></i>
                        </div>

                        <h1 style={{ 
                            fontSize: '48px', 
                            fontWeight: '900', 
                            background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '12px',
                            letterSpacing: '-0.5px',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            AI-Powered Search
                        </h1>
                        {activeTab === 'ai' ? (
                            <>
                                <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '20px', fontWeight: '500' }}>
                                    🤖 Ask me anything in natural language
                                </p>
                                <div style={{ 
                                    display: 'flex', 
                                    flexWrap: 'wrap', 
                                    gap: '10px', 
                                    justifyContent: 'center',
                                    maxWidth: '800px',
                                    margin: '0 auto'
                                }}>
                                    {aiSuggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleSuggestionClick(suggestion);
                                            }}
                                            style={{
                                                background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                                                border: '2px solid #bfdbfe',
                                                padding: '10px 20px',
                                                borderRadius: '25px',
                                                fontSize: '14px',
                                                color: '#1e40af',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(37,99,235,0.3)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            💡 {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p style={{ fontSize: '17px', color: '#64748b', marginBottom: '25px' }}>
                                Browse all persons: Athletes, Coaches, and Referees
                            </p>
                        )}
                    </div>

                    {/* Main Search Bar */}
                    <form onSubmit={handleAISearch} style={{ marginBottom: '40px' }}>
                        <div style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '12px',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center'
                        }}>
                            <input
                                type="text"
                                placeholder="🔎 Search anything... or use AI (try: 'show athletes from Spain')"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    outline: 'none',
                                    padding: '18px 25px',
                                    fontSize: '17px',
                                    fontWeight: '500'
                                }}
                            />
                            <button type="submit" style={{
                                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '16px 35px',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(37,99,235,0.3)'
                            }}>
                                <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Tabs */}
                    <div style={{ marginBottom: '35px' }}>
                        <div style={{ 
                            display: 'flex', 
                            gap: '8px', 
                            padding: '8px',
                            background: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab.id)}
                                    style={{
                                        background: activeTab === tab.id ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : 'transparent',
                                        color: activeTab === tab.id ? 'white' : '#64748b',
                                        border: 'none',
                                        padding: '12px 24px',
                                        borderRadius: '10px',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        boxShadow: activeTab === tab.id ? '0 2px 8px rgba(37,99,235,0.3)' : 'none',
                                        position: 'relative'
                                    }}
                                    onMouseOver={(e) => {
                                        if (activeTab !== tab.id) {
                                            e.target.style.background = '#f1f5f9';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (activeTab !== tab.id) {
                                            e.target.style.background = 'transparent';
                                        }
                                    }}
                                >
                                    <span style={{ marginRight: '8px' }}>{tab.label.split(' ')[0]}</span>
                                    <span style={{ fontSize: '14px', fontWeight: '700' }}>
                                        {tab.label.split(' ').slice(1).join(' ')} ({tab.count})
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>



                    {/* Loading */}
                    {loading && (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#2563eb' }}></i>
                            <p style={{ marginTop: '20px', color: '#64748b' }}>Loading...</p>
                        </div>
                    )}

                    {/* AI Results */}
                    {!loading && activeTab === 'ai' && (
                        <div>
                            <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '25px', color: '#1e293b' }}>
                                {searchResults.length} AI Results
                            </h2>
                            {searchResults.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                    <i className="fas fa-robot" style={{ fontSize: '64px', color: '#e2e8f0', marginBottom: '20px' }}></i>
                                    <h3 style={{ fontSize: '20px', color: '#64748b' }}>No results found</h3>
                                    <p style={{ color: '#94a3b8' }}>Try: "show athletes from France" or "list all coaches"</p>
                                </div>
                            ) : (
                                <div className="row">
                                    {searchResults.map((result, index) => {
                                        const name = result.firstName ? `${result.firstName} ${result.lastName}` : (result.name || result.achievementType || result.recordType || 'Item');
                                        
                                        // Extract ID from URI first (contains type info)
                                        let rawId = result.id || result.athlete || result.coach || result.referee || result.achievement || result.record || '';
                                        const itemId = rawId.includes('#') ? rawId.split('#').pop() : rawId.split('/').pop();
                                        
                                        // Detect type based on multiple factors
                                        let itemType = 'athlete'; // default
                                        
                                        // Check for Achievement or Record first
                                        if (result.type === 'Achievement' || result.achievement || result.achievementType || rawId.toLowerCase().includes('achievement')) {
                                            itemType = 'achievement';
                                        } else if (result.type === 'Record' || result.record || result.recordType || rawId.toLowerCase().includes('record')) {
                                            itemType = 'record';
                                        }
                                        // Check URI field names for persons (most reliable)
                                        else if (result.referee || rawId.toLowerCase().includes('referee')) {
                                            itemType = 'referee';
                                        } else if (result.coach || rawId.toLowerCase().includes('coach')) {
                                            itemType = 'coach';
                                        } else if (result.athlete || rawId.toLowerCase().includes('athlete')) {
                                            itemType = 'athlete';
                                        } 
                                        // Check properties as fallback
                                        else if (result.matchesOfficiated !== undefined || result.experienceYears !== undefined && !result.coachingStyle) {
                                            itemType = 'referee';
                                        } else if (result.coachingStyle || result.titlesWon !== undefined) {
                                            itemType = 'coach';
                                        }
                                        
                                        return (
                                            <div key={index} className="col-lg-4 col-md-6 mb-4">
                                                <div style={{ background: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', transition: 'all 0.3s', border: '2px solid transparent' }}
                                                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(37,99,235,0.15)'; e.currentTarget.style.borderColor = '#2563eb'; }}
                                                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = 'transparent'; }}>
                                                    <h4 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '15px' }}>{name}</h4>
                                                    
                                                    {/* Person fields */}
                                                    {result.nationality && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-globe" style={{ marginRight: '8px', color: '#2563eb' }}></i>{result.nationality}</p>}
                                                    {result.position && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-futbol" style={{ marginRight: '8px', color: '#2563eb' }}></i>{result.position}</p>}
                                                    {result.goalsScored !== undefined && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-trophy" style={{ marginRight: '8px', color: '#f59e0b' }}></i>Goals: {result.goalsScored}</p>}
                                                    {result.coachingStyle && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-lightbulb" style={{ marginRight: '8px', color: '#16a34a' }}></i>{result.coachingStyle}</p>}
                                                    {result.matchesOfficiated !== undefined && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-whistle" style={{ marginRight: '8px', color: '#dc2626' }}></i>Matches: {result.matchesOfficiated}</p>}
                                                    
                                                    {/* Achievement fields */}
                                                    {result.year && itemType === 'achievement' && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-calendar" style={{ marginRight: '8px', color: '#f59e0b' }}></i>Year: {result.year}</p>}
                                                    {result.achievedBy && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-user" style={{ marginRight: '8px', color: '#2563eb' }}></i>Achieved by: {result.achievedBy || result.athleteName}</p>}
                                                    
                                                    {/* Record fields */}
                                                    {result.recordValue && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-medal" style={{ marginRight: '8px', color: '#8b5cf6' }}></i>Value: {result.recordValue}</p>}
                                                    {result.setBy && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-user" style={{ marginRight: '8px', color: '#2563eb' }}></i>Set by: {result.setBy || result.athleteName}</p>}
                                                    
                                                    {itemId && (
                                                        <button
                                                            onClick={() => {
                                                                if (itemType === 'achievement') {
                                                                    navigate(`/performance/achievement/${itemId}`);
                                                                } else if (itemType === 'record') {
                                                                    navigate(`/performance/record/${itemId}`);
                                                                } else {
                                                                    navigate(`/person/${itemType}/${itemId}`);
                                                                }
                                                            }}
                                                            style={{
                                                                width: '100%',
                                                                padding: '10px',
                                                                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '8px',
                                                                fontSize: '13px',
                                                                fontWeight: '700',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.3s',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px',
                                                                marginTop: '12px'
                                                            }}
                                                            onMouseOver={(e) => {
                                                                e.currentTarget.style.transform = 'scale(1.05)';
                                                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(124,58,237,0.4)';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.currentTarget.style.transform = 'scale(1)';
                                                                e.currentTarget.style.boxShadow = 'none';
                                                            }}
                                                        >
                                                            <i className="fas fa-eye" style={{ marginRight: '8px' }}></i>
                                                            View Details
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}


                    {/* Athletes Results */}
                    {!loading && activeTab === 'athletes' && (
                        <div>
                            <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '25px', color: '#1e293b' }}>
                                <i className="fas fa-running" style={{ marginRight: '10px', color: '#2563eb' }}></i>
                                {filteredAthletes.length} Athletes
                            </h2>

                            {/* ADVANCED FILTERS FOR ATHLETES */}
                            <div style={{ background: 'white', padding: '25px', borderRadius: '15px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
                                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>
                                    <i className="fas fa-filter" style={{ marginRight: '8px', color: '#2563eb' }}></i>
                                    Advanced Filters
                                </h4>
                                <div className="row">
                                    <div className="col-md-3 mb-3">
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px', display: 'block' }}>Sort By</label>
                                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '14px' }}>
                                            <option value="name">Name (A-Z)</option>
                                            <option value="goals">Goals (High to Low)</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px', display: 'block' }}>Min Goals: {minGoals}</label>
                                        <input type="range" min="0" max="900" value={minGoals} onChange={(e) => setMinGoals(Number(e.target.value))} style={{ width: '100%' }} />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px', display: 'block' }}>Captain</label>
                                        <select value={isCaptain} onChange={(e) => setIsCaptain(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '14px' }}>
                                            <option value="all">All Players</option>
                                            <option value="yes">Captains Only</option>
                                            <option value="no">Non-Captains</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px', display: 'block' }}>Position</label>
                                        <select value={position} onChange={(e) => setPosition(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '14px' }}>
                                            <option value="all">All Positions</option>
                                            {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                {filteredAthletes.map((athlete, index) => (
                                    <div key={index} className="col-lg-4 col-md-6 mb-4">
                                        <div style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', transition: 'all 0.3s', border: '2px solid transparent' }}
                                            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = '#2563eb'; }}
                                            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'transparent'; }}>
                                            <div style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', padding: '35px', textAlign: 'center' }}>
                                                <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                                                    <i className="fas fa-running" style={{ fontSize: '32px', color: '#2563eb' }}></i>
                                                </div>
                                            </div>
                                            <div style={{ padding: '25px' }}>
                                                <h4 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '12px', textAlign: 'center' }}>
                                                    {athlete.firstName} {athlete.lastName}
                                                </h4>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '15px', flexWrap: 'wrap' }}>
                                                    {athlete.nationality && <span style={{ background: '#f1f5f9', padding: '5px 12px', borderRadius: '20px', fontSize: '13px', color: '#64748b' }}><i className="fas fa-globe" style={{ marginRight: '5px' }}></i>{athlete.nationality}</span>}
                                                    {athlete.position && <span style={{ background: '#dbeafe', padding: '5px 12px', borderRadius: '20px', fontSize: '13px', color: '#2563eb', fontWeight: '600' }}>{athlete.position}</span>}
                                                </div>
                                                {(athlete.goalsScored || athlete.assists || athlete.jerseyNumber) && (
                                                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px', fontSize: '14px', marginBottom: '15px' }}>
                                                        {athlete.goalsScored && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#64748b' }}>Goals:</span><span style={{ fontWeight: '600', color: '#1e293b' }}>{athlete.goalsScored}</span></div>}
                                                        {athlete.assists && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: '#64748b' }}>Assists:</span><span style={{ fontWeight: '600', color: '#1e293b' }}>{athlete.assists}</span></div>}
                                                        {athlete.jerseyNumber && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Jersey:</span><span style={{ fontWeight: '600', color: '#1e293b' }}>#{athlete.jerseyNumber}</span></div>}
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => navigate(`/person/athlete/${athlete.id}`)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px',
                                                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '10px',
                                                        fontSize: '14px',
                                                        fontWeight: '700',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1.05)';
                                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(37,99,235,0.4)';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    <i className="fas fa-eye" style={{ marginRight: '8px' }}></i>
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Coaches Results */}
                    {!loading && activeTab === 'coaches' && (
                        <div>
                            <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '25px', color: '#1e293b' }}>
                                <i className="fas fa-clipboard" style={{ marginRight: '10px', color: '#16a34a' }}></i>
                                {filteredCoaches.length} Coaches
                            </h2>

                            {/* ADVANCED FILTERS FOR COACHES */}
                            <div style={{ background: 'white', padding: '25px', borderRadius: '15px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
                                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>
                                    <i className="fas fa-filter" style={{ marginRight: '8px', color: '#16a34a' }}></i>
                                    Advanced Filters
                                </h4>
                                <div className="row">
                                    <div className="col-md-3 mb-3">
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px', display: 'block' }}>Sort By</label>
                                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '14px' }}>
                                            <option value="name">Name (A-Z)</option>
                                            <option value="experience">Experience (High to Low)</option>
                                            <option value="titles">Titles Won (High to Low)</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px', display: 'block' }}>Min Experience: {minExperience} years</label>
                                        <input type="range" min="0" max="30" value={minExperience} onChange={(e) => setMinExperience(Number(e.target.value))} style={{ width: '100%' }} />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px', display: 'block' }}>Coaching Style</label>
                                        <select value={coachingStyle} onChange={(e) => setCoachingStyle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '14px' }}>
                                            <option value="all">All Styles</option>
                                            <option value="Possession-based">Possession-based</option>
                                            <option value="Defensive">Defensive</option>
                                            <option value="Gegenpressing">Gegenpressing</option>
                                            <option value="Counter-attacking">Counter-attacking</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px', display: 'block' }}>Nationality</label>
                                        <select value={nationality} onChange={(e) => setNationality(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '14px' }}>
                                            <option value="all">All Countries</option>
                                            {nationalities.map(nat => <option key={nat} value={nat}>{nat}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {filteredCoaches.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                    <i className="fas fa-clipboard" style={{ fontSize: '64px', color: '#e2e8f0', marginBottom: '20px' }}></i>
                                    <h3 style={{ fontSize: '20px', color: '#64748b' }}>No coaches found</h3>
                                </div>
                            ) : (
                                <div className="row">
                                    {filteredCoaches.map((coach, index) => (
                                        <div key={index} className="col-lg-12 mb-4">
                                            <div style={{ background: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', transition: 'all 0.3s', border: '2px solid transparent' }}
                                                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#16a34a'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'transparent'; }}>
                                                <div className="row align-items-center">
                                                    <div className="col-lg-2 col-md-3 text-center mb-3 mb-md-0">
                                                        <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #15803d)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                                                            <i className="fas fa-clipboard" style={{ fontSize: '40px', color: 'white' }}></i>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-8 col-md-7">
                                                        <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
                                                            {coach.firstName} {coach.lastName}
                                                        </h3>
                                                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                                            {coach.experienceYears && <span style={{ background: '#dcfce7', color: '#16a34a', padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}><i className="fas fa-calendar" style={{ marginRight: '6px' }}></i>{coach.experienceYears} years</span>}
                                                            {coach.titlesWon && <span style={{ background: '#fef3c7', color: '#d97706', padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}><i className="fas fa-trophy" style={{ marginRight: '6px' }}></i>{coach.titlesWon} titles</span>}
                                                            {coach.nationality && <span style={{ background: '#f1f5f9', color: '#64748b', padding: '6px 14px', borderRadius: '20px', fontSize: '14px' }}><i className="fas fa-globe" style={{ marginRight: '6px' }}></i>{coach.nationality}</span>}
                                                        </div>
                                                        {coach.coachingStyle && <p style={{ color: '#64748b', marginTop: '12px', marginBottom: '0' }}><strong>Style:</strong> {coach.coachingStyle}</p>}
                                                    </div>
                                                    <div className="col-lg-2 col-md-2 text-center d-flex align-items-center justify-content-center">
                                                        <button
                                                            onClick={() => navigate(`/person/coach/${coach.id}`)}
                                                            style={{
                                                                padding: '12px 20px',
                                                                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '10px',
                                                                fontSize: '14px',
                                                                fontWeight: '700',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.3s',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                            onMouseOver={(e) => {
                                                                e.currentTarget.style.transform = 'scale(1.05)';
                                                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(22,163,74,0.4)';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.currentTarget.style.transform = 'scale(1)';
                                                                e.currentTarget.style.boxShadow = 'none';
                                                            }}
                                                        >
                                                            <i className="fas fa-eye" style={{ marginRight: '8px' }}></i>
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Referees Results */}
                    {!loading && activeTab === 'referees' && (
                        <div>
                            <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '25px', color: '#1e293b' }}>
                                <i className="fas fa-whistle" style={{ marginRight: '10px', color: '#dc2626' }}></i>
                                {filteredReferees.length} Referees
                            </h2>

                            {/* ADVANCED FILTERS FOR REFEREES */}
                            <div style={{ background: 'white', padding: '25px', borderRadius: '15px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
                                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>
                                    <i className="fas fa-filter" style={{ marginRight: '8px', color: '#dc2626' }}></i>
                                    Advanced Filters
                                </h4>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px', display: 'block' }}>Sort By</label>
                                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '14px' }}>
                                            <option value="name">Name (A-Z)</option>
                                            <option value="experience">Experience (High to Low)</option>
                                            <option value="matches">Matches Officiated (High to Low)</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px', display: 'block' }}>Min Experience: {minExperience} years</label>
                                        <input type="range" min="0" max="30" value={minExperience} onChange={(e) => setMinExperience(Number(e.target.value))} style={{ width: '100%' }} />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px', display: 'block' }}>Nationality</label>
                                        <select value={nationality} onChange={(e) => setNationality(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '14px' }}>
                                            <option value="all">All Countries</option>
                                            {nationalities.map(nat => <option key={nat} value={nat}>{nat}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {filteredReferees.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                    <i className="fas fa-whistle" style={{ fontSize: '64px', color: '#e2e8f0', marginBottom: '20px' }}></i>
                                    <h3 style={{ fontSize: '20px', color: '#64748b' }}>No referees found</h3>
                                </div>
                            ) : (
                                <div className="row">
                                    {filteredReferees.map((referee, index) => (
                                        <div key={index} className="col-lg-6 col-md-6 mb-4">
                                            <div style={{ background: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', transition: 'all 0.3s', border: '2px solid transparent', height: '100%' }}
                                                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#dc2626'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'transparent'; }}>
                                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                                    <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, #dc2626, #991b1b)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '20px' }}>
                                                        <i className="fas fa-whistle" style={{ fontSize: '32px', color: 'white' }}></i>
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                                                            {referee.firstName} {referee.lastName}
                                                        </h3>
                                                        {referee.nationality && (
                                                            <span style={{ background: '#f1f5f9', color: '#64748b', padding: '5px 12px', borderRadius: '20px', fontSize: '13px' }}>
                                                                <i className="fas fa-globe" style={{ marginRight: '5px' }}></i>
                                                                {referee.nationality}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px', marginBottom: '15px' }}>
                                                    {referee.experienceYears && (
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                            <span style={{ color: '#64748b', fontSize: '14px' }}>
                                                                <i className="fas fa-calendar" style={{ marginRight: '8px', color: '#dc2626' }}></i>
                                                                Experience:
                                                            </span>
                                                            <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{referee.experienceYears} years</span>
                                                        </div>
                                                    )}
                                                    {referee.matchesOfficiated && (
                                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <span style={{ color: '#64748b', fontSize: '14px' }}>
                                                                <i className="fas fa-futbol" style={{ marginRight: '8px', color: '#dc2626' }}></i>
                                                                Matches:
                                                            </span>
                                                            <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{referee.matchesOfficiated}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => navigate(`/person/referee/${referee.id}`)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px',
                                                        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '10px',
                                                        fontSize: '14px',
                                                        fontWeight: '700',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1.05)';
                                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(220,38,38,0.4)';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    <i className="fas fa-eye" style={{ marginRight: '8px' }}></i>
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </LayoutV1>
    );
};

export default UnifiedSearchPage;
