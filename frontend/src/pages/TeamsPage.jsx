import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutV1 from '@/components/layouts/LayoutV1';

// Skeleton Loader
const TeamSkeleton = memo(() => (
    <div className="col-lg-4 col-md-6 mb-4">
        <div style={{
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '20px',
            height: '420px'
        }}></div>
    </div>
));

TeamSkeleton.displayName = 'TeamSkeleton';

const TeamsPage = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [teamType, setTeamType] = useState('all');
    const [country, setCountry] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [error, setError] = useState(null);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchTeams();
    }, [teamType]);

    const fetchTeams = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const typeParam = teamType !== 'all' ? `&team_type=${teamType}` : '';
            const response = await fetch(`http://localhost:8000/api/teams?limit=100${typeParam}`);
            if (response.ok) {
                const data = await response.json();
                setTeams(data.teams || []);
            } else {
                throw new Error('Failed to fetch teams');
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [teamType]);

    // Memoized filtering
    const filteredTeams = useMemo(() => {
        return teams.filter(team => {
            const matchesSearch = debouncedQuery === '' || 
                team.teamName?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                team.city?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                team.country?.toLowerCase().includes(debouncedQuery.toLowerCase());
            
            const matchesCountry = country === 'all' || team.country === country;
            
            return matchesSearch && matchesCountry;
        });
    }, [debouncedQuery, country, teams]);

    const countries = useMemo(() => 
        [...new Set(teams.map(t => t.country).filter(Boolean))],
        [teams]
    );

    const teamTypes = useMemo(() => [
        { value: 'all', label: 'All Teams' },
        { value: 'ProfessionalTeam', label: 'Professional Teams' },
        { value: 'NationalTeam', label: 'National Teams' },
        { value: 'AmateurTeam', label: 'Amateur Teams' },
        { value: 'YouthTeam', label: 'Youth Teams' },
        { value: 'WomenTeam', label: 'Women Teams' }
    ], []);

    const handleCardClick = useCallback((id) => {
        navigate(`/teams/${id}`);
    }, [navigate]);

    return (
        <LayoutV1>
            <div style={{ 
                backgroundColor: '#f8fafc', 
                minHeight: '100vh', 
                paddingTop: '100px', 
                paddingBottom: '60px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Animated Background Elements */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    right: '5%',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                    animation: 'float 20s ease-in-out infinite'
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '10%',
                    width: '350px',
                    height: '350px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                    animation: 'float 25s ease-in-out infinite reverse'
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    {/* Header */}
                    <div style={{ 
                        textAlign: 'center', 
                        marginBottom: '50px',
                        animation: 'fadeIn 0.8s ease-out'
                    }}>
                        <h1 style={{ 
                            fontSize: '56px', 
                            fontWeight: '900', 
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 50%, #2563eb 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '15px',
                            letterSpacing: '-1px'
                        }}>⚽ Teams</h1>
                        <p style={{ fontSize: '19px', color: '#64748b', fontWeight: '500' }}>
                            Browse {filteredTeams.length} teams across different categories
                        </p>
                    </div>

                    {/* Filters with Glassmorphism */}
                    <div style={{ 
                        background: 'rgba(255, 255, 255, 0.8)', 
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        padding: '35px', 
                        borderRadius: '20px', 
                        marginBottom: '50px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
                        border: '1px solid rgba(255,255,255,0.5)',
                        animation: 'fadeIn 0.8s ease-out 0.2s both'
                    }}>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label style={{ fontWeight: '600', marginBottom: '10px', display: 'block', color: '#1e293b' }}>
                                    Search Teams
                                </label>
                                <input 
                                    type="text"
                                    placeholder="Search by name, city, or country..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 18px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '10px',
                                        fontSize: '16px',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label style={{ fontWeight: '600', marginBottom: '10px', display: 'block', color: '#1e293b' }}>
                                    Team Type
                                </label>
                                <select 
                                    value={teamType}
                                    onChange={(e) => setTeamType(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 18px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '10px',
                                        fontSize: '16px',
                                        outline: 'none'
                                    }}
                                >
                                    {teamTypes.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label style={{ fontWeight: '600', marginBottom: '10px', display: 'block', color: '#1e293b' }}>
                                    Country
                                </label>
                                <select 
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 18px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '10px',
                                        fontSize: '16px',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="all">All Countries</option>
                                    {countries.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Teams Grid */}
                    {loading ? (
                        <div className="row">
                            {[...Array(6)].map((_, index) => (
                                <TeamSkeleton key={index} />
                            ))}
                        </div>
                    ) : error ? (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '80px 20px',
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '20px',
                            animation: 'fadeIn 0.6s ease-out'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                                boxShadow: '0 10px 30px rgba(239,68,68,0.2)'
                            }}>
                                <i className="fas fa-exclamation-triangle" style={{ fontSize: '36px', color: '#dc2626' }}></i>
                            </div>
                            <h3 style={{ color: '#1e293b', marginBottom: '12px', fontSize: '24px', fontWeight: '800' }}>Unable to Load Teams</h3>
                            <p style={{ color: '#64748b', marginBottom: '24px' }}>{error}</p>
                            <button 
                                onClick={fetchTeams}
                                style={{
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '14px 32px',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 24px rgba(139,92,246,0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 12px 32px rgba(139,92,246,0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 8px 24px rgba(139,92,246,0.3)';
                                }}
                            >
                                <i className="fas fa-redo" style={{ marginRight: '8px' }}></i>
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="row">
                            {filteredTeams.map((team, index) => (
                                <div key={team.id || index} className="col-lg-4 col-md-6 mb-4"
                                    style={{
                                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                    }}>
                                    <div 
                                        onClick={() => handleCardClick(team.id)}
                                        style={{ 
                                            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)', 
                                            borderRadius: '20px', 
                                            padding: '0',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
                                            cursor: 'pointer',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            height: '100%',
                                            border: '1px solid rgba(139,92,246,0.1)',
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                            e.currentTarget.style.boxShadow = '0 20px 60px rgba(139,92,246,0.25), inset 0 1px 0 rgba(255,255,255,1)';
                                            e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                            e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)';
                                            e.currentTarget.style.borderColor = 'rgba(139,92,246,0.1)';
                                        }}
                                    >
                                        {/* Gradient Header */}
                                        <div style={{
                                            background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 50%, #2563eb 100%)',
                                            padding: '25px',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                width: '150px',
                                                height: '150px',
                                                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                                                borderRadius: '50%',
                                                transform: 'translate(30%, -30%)'
                                            }}></div>
                                            <div style={{ position: 'relative', zIndex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                    <span style={{ 
                                                        fontSize: '13px',
                                                        padding: '6px 14px',
                                                        background: 'rgba(255,255,255,0.25)',
                                                        backdropFilter: 'blur(10px)',
                                                        color: 'white',
                                                        borderRadius: '25px',
                                                        fontWeight: '700',
                                                        border: '1px solid rgba(255,255,255,0.3)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        {team.team_type?.replace('Team', '') || 'Team'}
                                                    </span>
                                                    {team.currentRanking && (
                                                        <div style={{
                                                            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                                            padding: '8px 12px',
                                                            borderRadius: '12px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '5px',
                                                            boxShadow: '0 4px 12px rgba(251,191,36,0.4)'
                                                        }}>
                                                            <i className="fas fa-trophy" style={{ color: 'white', fontSize: '14px' }}></i>
                                                            <span style={{ color: 'white', fontWeight: '900', fontSize: '14px' }}>#{team.currentRanking}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <h3 style={{ 
                                                    fontSize: '24px', 
                                                    fontWeight: '900', 
                                                    color: 'white',
                                                    marginBottom: '0',
                                                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                                    lineHeight: '1.3'
                                                }}>{team.teamName}</h3>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div style={{ padding: '25px' }}>
                                        {/* Info Grid */}
                                        <div style={{ 
                                            display: 'grid',
                                            gap: '12px',
                                            marginBottom: '20px'
                                        }}>
                                            {team.city && (
                                                <div style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center',
                                                    padding: '12px 15px',
                                                    background: 'linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(37,99,235,0.05) 100%)',
                                                    borderRadius: '12px',
                                                    border: '1px solid rgba(139,92,246,0.1)'
                                                }}>
                                                    <div style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '10px',
                                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginRight: '12px',
                                                        boxShadow: '0 4px 12px rgba(139,92,246,0.2)'
                                                    }}>
                                                        <i className="fas fa-map-marker-alt" style={{ color: 'white', fontSize: '14px' }}></i>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginBottom: '2px' }}>LOCATION</div>
                                                        <div style={{ color: '#1e293b', fontWeight: '600' }}>{team.city}, {team.country}</div>
                                                    </div>
                                                </div>
                                            )}
                                            {team.foundedYear && (
                                                <div style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center',
                                                    padding: '12px 15px',
                                                    background: 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(37,99,235,0.05) 100%)',
                                                    borderRadius: '12px',
                                                    border: '1px solid rgba(59,130,246,0.1)'
                                                }}>
                                                    <div style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '10px',
                                                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginRight: '12px',
                                                        boxShadow: '0 4px 12px rgba(59,130,246,0.2)'
                                                    }}>
                                                        <i className="fas fa-calendar-alt" style={{ color: 'white', fontSize: '14px' }}></i>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginBottom: '2px' }}>FOUNDED</div>
                                                        <div style={{ color: '#1e293b', fontWeight: '600' }}>{team.foundedYear}</div>
                                                    </div>
                                                </div>
                                            )}
                                            {team.budget && (
                                                <div style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center',
                                                    padding: '12px 15px',
                                                    background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(5,150,105,0.05) 100%)',
                                                    borderRadius: '12px',
                                                    border: '1px solid rgba(16,185,129,0.1)'
                                                }}>
                                                    <div style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '10px',
                                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginRight: '12px',
                                                        boxShadow: '0 4px 12px rgba(16,185,129,0.2)'
                                                    }}>
                                                        <i className="fas fa-sack-dollar" style={{ color: 'white', fontSize: '14px' }}></i>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginBottom: '2px' }}>BUDGET</div>
                                                        <div style={{ color: '#10b981', fontWeight: '700', fontSize: '16px' }}>${team.budget}M</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Stats Section */}
                                        {(team.wins || team.losses || team.draws) && (
                                            <div style={{ 
                                                padding: '20px',
                                                background: 'linear-gradient(135deg, rgba(249,250,251,0.8) 0%, rgba(243,244,246,0.6) 100%)',
                                                borderRadius: '15px',
                                                border: '1px dashed rgba(148,163,184,0.3)'
                                            }}>
                                                <div style={{ 
                                                    fontSize: '11px', 
                                                    fontWeight: '700', 
                                                    color: '#64748b', 
                                                    marginBottom: '15px',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px',
                                                    textAlign: 'center'
                                                }}>⚽ Season Statistics</div>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    {team.wins !== undefined && (
                                                        <div style={{ 
                                                            flex: 1,
                                                            textAlign: 'center',
                                                            padding: '12px 8px',
                                                            background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                                                            borderRadius: '10px',
                                                            border: '1px solid #6ee7b7'
                                                        }}>
                                                            <div style={{ color: '#059669', fontWeight: '900', fontSize: '22px', marginBottom: '4px' }}>{team.wins}</div>
                                                            <div style={{ color: '#047857', fontSize: '11px', fontWeight: '700' }}>WINS</div>
                                                        </div>
                                                    )}
                                                    {team.draws !== undefined && (
                                                        <div style={{ 
                                                            flex: 1,
                                                            textAlign: 'center',
                                                            padding: '12px 8px',
                                                            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                                                            borderRadius: '10px',
                                                            border: '1px solid #fbbf24'
                                                        }}>
                                                            <div style={{ color: '#d97706', fontWeight: '900', fontSize: '22px', marginBottom: '4px' }}>{team.draws}</div>
                                                            <div style={{ color: '#b45309', fontSize: '11px', fontWeight: '700' }}>DRAWS</div>
                                                        </div>
                                                    )}
                                                    {team.losses !== undefined && (
                                                        <div style={{ 
                                                            flex: 1,
                                                            textAlign: 'center',
                                                            padding: '12px 8px',
                                                            background: 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)',
                                                            borderRadius: '10px',
                                                            border: '1px solid #f87171'
                                                        }}>
                                                            <div style={{ color: '#dc2626', fontWeight: '900', fontSize: '22px', marginBottom: '4px' }}>{team.losses}</div>
                                                            <div style={{ color: '#b91c1c', fontSize: '11px', fontWeight: '700' }}>LOSSES</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {filteredTeams.length === 0 && !loading && (
                                <div className="col-12">
                                    <div style={{ 
                                        textAlign: 'center', 
                                        padding: '80px 20px',
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        backdropFilter: 'blur(20px)',
                                        borderRadius: '20px',
                                        animation: 'fadeIn 0.6s ease-out'
                                    }}>
                                        <div style={{
                                            width: '120px',
                                            height: '120px',
                                            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 24px',
                                            boxShadow: '0 10px 40px rgba(59,130,246,0.15)'
                                        }}>
                                            <i className="fas fa-search" style={{ fontSize: '48px', color: '#3b82f6' }}></i>
                                        </div>
                                        <h3 style={{ color: '#1e293b', marginBottom: '12px', fontSize: '24px', fontWeight: '800' }}>No Teams Found</h3>
                                        <p style={{ color: '#64748b', fontSize: '16px' }}>Try adjusting your search or filters</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes shimmer {
                        0% { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                    }
                    @keyframes float {
                        0%, 100% { transform: translate(0, 0); }
                        50% { transform: translate(20px, 20px); }
                    }
                `}</style>
            </div>
        </LayoutV1>
    );
};

export default TeamsPage;
