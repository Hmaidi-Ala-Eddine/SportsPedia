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
    const [athletesCount, setAthletesCount] = useState(0);
    const [coachesCount, setCoachesCount] = useState(0);
    const [refereesCount, setRefereesCount] = useState(0);
    const [teamsCount, setTeamsCount] = useState(0);
    const [competitionsCount, setCompetitionsCount] = useState(0);
    const [teams, setTeams] = useState([]);
    const [competitions, setCompetitions] = useState([]);
    const [performanceCount, setPerformanceCount] = useState(0);
    
    // New entity types
    const [venues, setVenues] = useState([]);
    const [venuesCount, setVenuesCount] = useState(0);
    const [media, setMedia] = useState([]);
    const [mediaCount, setMediaCount] = useState(0);
    const [sports, setSports] = useState([]);
    const [sportsCount, setSportsCount] = useState(0);
    const [equipment, setEquipment] = useState([]);
    const [equipmentCount, setEquipmentCount] = useState(0);
    const [sponsorships, setSponsorships] = useState([]);
    const [sponsorshipsCount, setSponsorshipsCount] = useState(0);
    
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
        fetchCounts();
        
        // Set initial counts
        setAthletesCount(athletes.length);
        setCoachesCount(coaches.length);
        setRefereesCount(referees.length);
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
        if (q) {
            setQuery(q);
            setActiveTab('ai'); // Always switch to AI tab when there's a query
            performAISearch(q);
        }
    }, [searchParams]);

    const performAISearch = async (searchQuery) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/nl-search/search?q=${encodeURIComponent(searchQuery)}`);
            if (response.ok) {
                const data = await response.json();
                const results = data.results || [];
                
                console.log('AI Search Response:', data);
                console.log('Results:', results);
                console.log('Result types:', results.map(r => ({ type: r.type, sportName: r.sportName, teamName: r.teamName })));
                
                // Categorize results by type
                const categorizedResults = {
                    athletes: [],
                    coaches: [],
                    referees: [],
                    teams: [],
                    competitions: [],
                    venues: [],
                    media: [],
                    sports: [],
                    equipment: [],
                    sponsorships: [],
                    performance: []
                };
                
                results.forEach(result => {
                    // Use type field for accurate categorization
                    if (result.type === 'Athlete' || result.athlete || 
                        (result.firstName && result.lastName && (result.position || result.goalsScored !== undefined))) {
                        categorizedResults.athletes.push(result);
                    }
                    else if (result.type === 'Coach' || result.coach || 
                        (result.firstName && result.lastName && (result.experienceYears !== undefined || result.titlesWon !== undefined))) {
                        categorizedResults.coaches.push(result);
                    }
                    else if (result.type === 'Referee' || result.referee || result.matchesOfficiated !== undefined) {
                        categorizedResults.referees.push(result);
                    }
                    else if (result.type === 'Team' || result.teamName || result.teamType || result.team) {
                        categorizedResults.teams.push({
                            ...result,
                            name: result.teamName || result.name || 'Unknown Team'
                        });
                    }
                    else if (result.type === 'Competition' || result.competitionName || result.compType || result.season) {
                        categorizedResults.competitions.push({
                            ...result,
                            name: result.competitionName || result.name || 'Unknown Competition'
                        });
                    }
                    else if (result.type === 'Venue' || result.venueName) {
                        categorizedResults.venues.push({
                            ...result,
                            name: result.venueName || result.name || 'Unknown Venue'
                        });
                    }
                    else if (result.type === 'Media' || result.mediaName) {
                        categorizedResults.media.push({
                            ...result,
                            name: result.mediaName || result.name || 'Unknown Media'
                        });
                    }
                    else if (result.type === 'Sport' || result.sportName) {
                        categorizedResults.sports.push({
                            ...result,
                            name: result.sportName || result.name || 'Unknown Sport'
                        });
                    }
                    else if (result.type === 'Equipment' || result.equipmentName) {
                        categorizedResults.equipment.push({
                            ...result,
                            name: result.equipmentName || result.name || 'Unknown Equipment'
                        });
                    }
                    else if (result.type === 'Sponsorship' || result.sponsorName) {
                        categorizedResults.sponsorships.push({
                            ...result,
                            name: result.sponsorName || result.name || 'Unknown Sponsorship'
                        });
                    }
                    else if (result.type === 'Organization' || result.organizationName || result.orgType || result.headquarters) {
                        categorizedResults.performance.push({
                            ...result,
                            name: result.organizationName || result.name || 'Unknown Organization',
                            type: 'Organization'
                        });
                    }
                    else if (result.achievementType || result.recordType || result.performanceValue) {
                        categorizedResults.performance.push(result);
                    }
                });
                
                console.log('Categorized:', categorizedResults);
                
                // ALWAYS set searchResults first so AI tab shows something
                setSearchResults(results);
                setSparqlQuery(data.sparql_query || data.sparql || (data.metadata && data.metadata.sparql) || '');
                
                // Update state with categorized results
                if (categorizedResults.athletes.length > 0) {
                    setAthletes(categorizedResults.athletes);
                    setAthletesCount(categorizedResults.athletes.length);
                }
                if (categorizedResults.coaches.length > 0) {
                    setCoaches(categorizedResults.coaches);
                    setCoachesCount(categorizedResults.coaches.length);
                }
                if (categorizedResults.referees.length > 0) {
                    setReferees(categorizedResults.referees);
                    setRefereesCount(categorizedResults.referees.length);
                }
                if (categorizedResults.teams.length > 0) {
                    setTeams(categorizedResults.teams);
                    setTeamsCount(categorizedResults.teams.length);
                }
                if (categorizedResults.competitions.length > 0) {
                    setCompetitions(categorizedResults.competitions);
                    setCompetitionsCount(categorizedResults.competitions.length);
                }
                if (categorizedResults.venues.length > 0) {
                    setVenues(categorizedResults.venues);
                    setVenuesCount(categorizedResults.venues.length);
                }
                if (categorizedResults.media.length > 0) {
                    setMedia(categorizedResults.media);
                    setMediaCount(categorizedResults.media.length);
                }
                if (categorizedResults.sports.length > 0) {
                    setSports(categorizedResults.sports);
                    setSportsCount(categorizedResults.sports.length);
                }
                if (categorizedResults.equipment.length > 0) {
                    setEquipment(categorizedResults.equipment);
                    setEquipmentCount(categorizedResults.equipment.length);
                }
                if (categorizedResults.sponsorships.length > 0) {
                    setSponsorships(categorizedResults.sponsorships);
                    setSponsorshipsCount(categorizedResults.sponsorships.length);
                }
                if (categorizedResults.performance.length > 0) {
                    setPerformanceCount(categorizedResults.performance.length);
                }
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
                const athletesList = data.athletes || [];
                setAthletes(athletesList);
                setAthletesCount(athletesList.length);
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
                const coachesList = data.coaches || [];
                setCoaches(coachesList);
                setCoachesCount(coachesList.length);
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
                const refereesList = data.referees || [];
                setReferees(refereesList);
                setRefereesCount(refereesList.length);
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

    // Smart AI suggestion prompts (includes Athletes AND TCO)
    const aiSuggestions = [
        "Show all athletes from Spain",
        "Teams from England",
        "Competitions in 2024",
        "List coaches by experience",
        "Top 10 ranked teams",
        "Federations in Switzerland"
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

    const fetchCounts = async () => {
        try {
            const teamsRes = await fetch('http://localhost:8000/api/teams?limit=100');
            if (teamsRes.ok) {
                const teamsData = await teamsRes.json();
                setTeamsCount(teamsData.teams?.length || 0);
            }
            
            const compsRes = await fetch('http://localhost:8000/api/competitions?limit=100');
            if (compsRes.ok) {
                const compsData = await compsRes.json();
                setCompetitionsCount(compsData.competitions?.length || 0);
            }
        } catch (error) {
            console.error('Error fetching counts:', error);
        }
    };

    const tabs = [
        { id: 'ai', label: '🤖 AI Search', icon: 'fas fa-magic', count: searchResults.length },
        { id: 'athletes', label: '🏃 Athletes', icon: 'fas fa-running', count: athletesCount },
        { id: 'coaches', label: '📋 Coaches', icon: 'fas fa-clipboard', count: coachesCount },
        { id: 'referees', label: '🟨 Referees', icon: 'fas fa-whistle', count: refereesCount },
        { id: 'teams', label: '⚽ Teams', icon: 'fas fa-users', count: teamsCount },
        { id: 'competitions', label: '🏆 Competitions', icon: 'fas fa-trophy', count: competitionsCount },
        { id: 'venues', label: '🏟️ Venues', icon: 'fas fa-map-marker-alt', count: venuesCount },
        { id: 'media', label: '📺 Media', icon: 'fas fa-broadcast-tower', count: mediaCount },
        { id: 'sports', label: '⚽ Sports', icon: 'fas fa-futbol', count: sportsCount },
        { id: 'equipment', label: '🏀 Equipment', icon: 'fas fa-basketball-ball', count: equipmentCount },
        { id: 'sponsorships', label: '🤝 Sponsorships', icon: 'fas fa-handshake', count: sponsorshipsCount },
        { id: 'performance', label: '📊 Performance', icon: 'fas fa-chart-line', count: performanceCount }
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
                                Browse all data: Athletes, Coaches, Referees, Teams, Competitions, and Performance
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
                                        // Extract name based on entity type
                                        const name = result.firstName ? `${result.firstName} ${result.lastName}` : 
                                                    result.teamName || result.competitionName || result.organizationName ||
                                                    result.venueName || result.mediaName || result.sportName || 
                                                    result.equipmentName || result.sponsorName ||
                                                    result.name || result.achievementType || result.recordType || 'Item';
                                        
                                        // Extract ID from URI first (contains type info)
                                        let rawId = result.id || result.athlete || result.coach || result.referee || result.achievement || result.record || '';
                                        const itemId = rawId.includes('#') ? rawId.split('#').pop() : rawId.split('/').pop();
                                        
                                        // Detect type - PRIORITIZE result.type field
                                        let itemType = result.type || 'athlete'; // Use type field if available
                                        let routePath = '#'; // Default no route
                                        
                                        // Determine route based on type
                                        if (itemType === 'Athlete') {
                                            itemType = 'athlete';
                                            routePath = `/person/athlete/${itemId}`;
                                        } else if (itemType === 'Coach') {
                                            itemType = 'coach';
                                            routePath = `/person/coach/${itemId}`;
                                        } else if (itemType === 'Referee') {
                                            itemType = 'referee';
                                            routePath = `/person/referee/${itemId}`;
                                        } else if (itemType === 'Team') {
                                            itemType = 'team';
                                            routePath = `/teams/${itemId}`;
                                        } else if (itemType === 'Competition') {
                                            itemType = 'competition';
                                            routePath = `/competitions/${itemId}`;
                                        } else if (itemType === 'Organization') {
                                            itemType = 'organization';
                                            routePath = `/organizations/${itemId}`;
                                        } else if (itemType === 'Venue') {
                                            itemType = 'venue';
                                            routePath = `/venues`; // List page for now
                                        } else if (itemType === 'Media') {
                                            itemType = 'media';
                                            routePath = `/media`; // List page for now
                                        } else if (itemType === 'Sport') {
                                            itemType = 'sport';
                                            routePath = `/sports`; // List page for now
                                        } else if (itemType === 'Equipment') {
                                            itemType = 'equipment';
                                            routePath = `/equipment`; // List page for now
                                        } else if (itemType === 'Sponsorship') {
                                            itemType = 'sponsorship';
                                            routePath = `/sponsorships`; // List page for now
                                        } else if (itemType === 'Achievement' || result.achievement || result.achievementType) {
                                            itemType = 'achievement';
                                            routePath = `/performance/achievement/${itemId}`;
                                        } else if (itemType === 'Record' || result.record || result.recordType) {
                                            itemType = 'record';
                                            routePath = `/performance/record/${itemId}`;
                                        }
                                        // Fallback legacy detection if no type field
                                        else if (result.referee || rawId.toLowerCase().includes('referee')) {
                                            itemType = 'referee';
                                            routePath = `/person/referee/${itemId}`;
                                        } else if (result.coach || rawId.toLowerCase().includes('coach')) {
                                            itemType = 'coach';
                                            routePath = `/person/coach/${itemId}`;
                                        } else if (result.athlete || rawId.toLowerCase().includes('athlete')) {
                                            itemType = 'athlete';
                                            routePath = `/person/athlete/${itemId}`;
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
                                                    
                                                    {/* Team fields */}
                                                    {result.teamName && result.country && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-flag" style={{ marginRight: '8px', color: '#2563eb' }}></i>{result.country}</p>}
                                                    {result.teamName && result.foundedYear && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-calendar-alt" style={{ marginRight: '8px', color: '#f59e0b' }}></i>Founded: {result.foundedYear}</p>}
                                                    {result.teamName && result.city && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-map-marker-alt" style={{ marginRight: '8px', color: '#dc2626' }}></i>{result.city}</p>}
                                                    
                                                    {/* Competition fields */}
                                                    {result.competitionName && result.season && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-calendar" style={{ marginRight: '8px', color: '#f59e0b' }}></i>Season: {result.season}</p>}
                                                    {result.competitionName && result.country && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-globe" style={{ marginRight: '8px', color: '#2563eb' }}></i>{result.country}</p>}
                                                    {result.competitionName && result.startDate && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-calendar-check" style={{ marginRight: '8px', color: '#16a34a' }}></i>Start: {result.startDate}</p>}
                                                    
                                                    {/* Organization fields */}
                                                    {result.organizationName && result.headquarters && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-building" style={{ marginRight: '8px', color: '#2563eb' }}></i>{result.headquarters}</p>}
                                                    {result.organizationName && result.establishedYear && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-calendar-alt" style={{ marginRight: '8px', color: '#f59e0b' }}></i>Est: {result.establishedYear}</p>}
                                                    
                                                    {/* Achievement fields */}
                                                    {result.year && itemType === 'achievement' && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-calendar" style={{ marginRight: '8px', color: '#f59e0b' }}></i>Year: {result.year}</p>}
                                                    {result.achievedBy && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-user" style={{ marginRight: '8px', color: '#2563eb' }}></i>Achieved by: {result.achievedBy || result.athleteName}</p>}
                                                    
                                                    {/* Record fields */}
                                                    {result.recordValue && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-medal" style={{ marginRight: '8px', color: '#8b5cf6' }}></i>Value: {result.recordValue}</p>}
                                                    {result.setBy && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-user" style={{ marginRight: '8px', color: '#2563eb' }}></i>Set by: {result.setBy || result.athleteName}</p>}
                                                    
                                                    {/* Venue fields */}
                                                    {result.venueName && result.capacity && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-users" style={{ marginRight: '8px', color: '#10b981' }}></i>Capacity: {result.capacity.toLocaleString()}</p>}
                                                    {result.venueName && result.surfaceType && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-layer-group" style={{ marginRight: '8px', color: '#10b981' }}></i>Surface: {result.surfaceType}</p>}
                                                    
                                                    {/* Media fields */}
                                                    {result.mediaName && result.audience && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-users" style={{ marginRight: '8px', color: '#ec4899' }}></i>Audience: {result.audience.toLocaleString()}</p>}
                                                    {result.mediaName && result.launchYear && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-calendar-alt" style={{ marginRight: '8px', color: '#ec4899' }}></i>Launched: {result.launchYear}</p>}
                                                    
                                                    {/* Sport fields */}
                                                    {result.sportName && result.isOlympic !== undefined && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-medal" style={{ marginRight: '8px', color: '#fb923c' }}></i>Olympic: {result.isOlympic ? '✓ Yes' : '✗ No'}</p>}
                                                    {result.sportName && result.originCountry && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-globe" style={{ marginRight: '8px', color: '#fb923c' }}></i>Origin: {result.originCountry}</p>}
                                                    
                                                    {/* Equipment fields */}
                                                    {result.equipmentName && result.brand && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-tag" style={{ marginRight: '8px', color: '#0ea5e9' }}></i>Brand: {result.brand}</p>}
                                                    {result.equipmentName && result.price && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-dollar-sign" style={{ marginRight: '8px', color: '#0ea5e9' }}></i>Price: ${result.price}</p>}
                                                    
                                                    {/* Sponsorship fields */}
                                                    {result.sponsorName && result.dealValue && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-dollar-sign" style={{ marginRight: '8px', color: '#a855f7' }}></i>Deal: ${result.dealValue}M</p>}
                                                    {result.sponsorName && result.industry && <p style={{ marginBottom: '8px', color: '#64748b' }}><i className="fas fa-briefcase" style={{ marginRight: '8px', color: '#a855f7' }}></i>Industry: {result.industry}</p>}
                                                    
                                                    {itemId && routePath !== '#' && (
                                                        <button
                                                            onClick={() => navigate(routePath)}
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

                    {/* Venues Results */}
                    {!loading && activeTab === 'venues' && (
                        <div>
                            <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '25px', color: '#1e293b' }}>
                                <i className="fas fa-map-marker-alt" style={{ marginRight: '10px', color: '#10b981' }}></i>
                                {venues.length} Venues Found
                            </h2>
                            <div className="row">
                                {venues.map((venue, idx) => (
                                    <div key={idx} className="col-lg-4 col-md-6 mb-4">
                                        <div style={{ background: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
                                            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>{venue.name || venue.venueName}</h4>
                                            {venue.city && <p style={{ color: '#64748b', marginBottom: '5px' }}><i className="fas fa-city" style={{ marginRight: '8px' }}></i>{venue.city}</p>}
                                            {venue.country && <p style={{ color: '#64748b', marginBottom: '5px' }}><i className="fas fa-flag" style={{ marginRight: '8px' }}></i>{venue.country}</p>}
                                            {venue.capacity && <p style={{ color: '#64748b', marginBottom: '5px' }}><i className="fas fa-users" style={{ marginRight: '8px' }}></i>Capacity: {venue.capacity.toLocaleString()}</p>}
                                            {venue.surfaceType && <p style={{ color: '#64748b', marginBottom: '5px' }}><i className="fas fa-layer-group" style={{ marginRight: '8px' }}></i>{venue.surfaceType}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Media Results */}
                    {!loading && activeTab === 'media' && (
                        <div>
                            <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '25px', color: '#1e293b' }}>
                                <i className="fas fa-broadcast-tower" style={{ marginRight: '10px', color: '#ec4899' }}></i>
                                {media.length} Media Outlets Found
                            </h2>
                            <div className="row">
                                {media.map((item, idx) => (
                                    <div key={idx} className="col-lg-4 col-md-6 mb-4">
                                        <div style={{ background: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
                                            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>{item.name || item.mediaName}</h4>
                                            {item.audience && <p style={{ color: '#64748b', marginBottom: '5px' }}><i className="fas fa-users" style={{ marginRight: '8px' }}></i>Audience: {item.audience.toLocaleString()}</p>}
                                            {item.launchYear && <p style={{ color: '#64748b', marginBottom: '5px' }}><i className="fas fa-calendar" style={{ marginRight: '8px' }}></i>Launched: {item.launchYear}</p>}
                                            {item.mediaType && <p style={{ color: '#64748b', marginBottom: '5px' }}><i className="fas fa-tag" style={{ marginRight: '8px' }}></i>{item.mediaType}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sports Results */}
                    {!loading && activeTab === 'sports' && (
                        <div>
                            <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '25px', color: '#1e293b' }}>
                                <i className="fas fa-futbol" style={{ marginRight: '10px', color: '#fb923c' }}></i>
                                {sports.length} Sports Found
                            </h2>
                            <div className="row">
                                {sports.map((sport, idx) => (
                                    <div key={idx} className="col-lg-4 col-md-6 mb-4">
                                        <div style={{ background: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
                                            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>{sport.name || sport.sportName}</h4>
                                            {sport.isOlympic !== undefined && <p style={{ color: '#64748b', marginBottom: '5px' }}><i className="fas fa-medal" style={{ marginRight: '8px' }}></i>Olympic: {sport.isOlympic ? '✓ Yes' : '✗ No'}</p>}
                                            {sport.originCountry && <p style={{ color: '#64748b', marginBottom: '5px' }}><i className="fas fa-flag" style={{ marginRight: '8px' }}></i>Origin: {sport.originCountry}</p>}
                                            {sport.globalParticipants && <p style={{ color: '#64748b', marginBottom: '5px' }}><i className="fas fa-users" style={{ marginRight: '8px' }}></i>Participants: {sport.globalParticipants.toLocaleString()}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Equipment Results */}
                    {!loading && activeTab === 'equipment' && (
                        <div>
                            <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '25px', color: '#1e293b' }}>
                                <i className="fas fa-basketball-ball" style={{ marginRight: '10px', color: '#0ea5e9' }}></i>
                                {equipment.length} Equipment Found
                            </h2>
                            <div className="row">
                                {equipment.map((item, idx) => (
                                    <div key={idx} className="col-lg-4 col-md-6 mb-4">
                                        <div style={{ background: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
                                            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>{item.name || item.equipmentName}</h4>
                                            {item.brand && <p style={{ color: '#64748b', marginBottom: '5px' }}><i className="fas fa-tag" style={{ marginRight: '8px' }}></i>Brand: {item.brand}</p>}
                                            {item.model && <p style={{ color: '#64748b', marginBottom: '5px' }}><i className="fas fa-box" style={{ marginRight: '8px' }}></i>Model: {item.model}</p>}
                                            {item.sport && <p style={{ color: '#64748b', marginBottom: '5px' }}><i className="fas fa-futbol" style={{ marginRight: '8px' }}></i>Sport: {item.sport}</p>}
                                            {item.price && <p style={{ color: '#64748b', marginBottom: '5px' }}><i className="fas fa-dollar-sign" style={{ marginRight: '8px' }}></i>Price: ${item.price}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sponsorships Results */}
                    {!loading && activeTab === 'sponsorships' && (
                        <div>
                            <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '25px', color: '#1e293b' }}>
                                <i className="fas fa-handshake" style={{ marginRight: '10px', color: '#a855f7' }}></i>
                                {sponsorships.length} Sponsorships Found
                            </h2>
                            <div className="row">
                                {sponsorships.map((item, idx) => (
                                    <div key={idx} className="col-lg-4 col-md-6 mb-4">
                                        <div style={{ background: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
                                            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>{item.name || item.sponsorName}</h4>
                                            {item.dealValue && <p style={{ color: '#64748b', marginBottom: '5px' }}><i className="fas fa-dollar-sign" style={{ marginRight: '8px' }}></i>Deal: ${item.dealValue}M</p>}
                                            {item.industry && <p style={{ color: '#64748b', marginBottom: '5px' }}><i className="fas fa-briefcase" style={{ marginRight: '8px' }}></i>Industry: {item.industry}</p>}
                                            {item.sponsors && <p style={{ color: '#64748b', marginBottom: '5px' }}><i className="fas fa-building" style={{ marginRight: '8px' }}></i>Sponsor: {item.sponsors}</p>}
                                            {item.endorses && <p style={{ color: '#64748b', marginBottom: '5px' }}><i className="fas fa-user" style={{ marginRight: '8px' }}></i>Endorses: {item.endorses}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </LayoutV1>
    );
};

export default UnifiedSearchPage;
