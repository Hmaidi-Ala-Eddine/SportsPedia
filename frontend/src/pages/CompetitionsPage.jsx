import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutV1 from '@/components/layouts/LayoutV1';

// Skeleton Loader Component
const CompetitionSkeleton = memo(() => (
    <div className="col-lg-4 col-md-6 mb-4">
        <div style={{
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '20px',
            height: '400px'
        }}></div>
        <style>{`
            @keyframes shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `}</style>
    </div>
));

CompetitionSkeleton.displayName = 'CompetitionSkeleton';

// Competition Card Component (Memoized)
const CompetitionCard = memo(({ comp, onClick, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <div 
            className="col-lg-4 col-md-6 mb-4"
            style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
            }}
        >
            <div 
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ 
                    background: 'linear-gradient(145deg, #ffffff 0%, #fefce8 100%)', 
                    borderRadius: '20px', 
                    padding: '0',
                    boxShadow: isHovered 
                        ? '0 25px 70px rgba(245,158,11,0.35), inset 0 1px 0 rgba(255,255,255,1)'
                        : '0 10px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
                    cursor: 'pointer',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    height: '100%',
                    border: isHovered ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(245,158,11,0.1)',
                    overflow: 'hidden',
                    position: 'relative',
                    transform: isHovered ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
                    willChange: 'transform, box-shadow'
                }}
            >
                {/* Trophy Header with Gradient */}
                <div style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #dc2626 100%)',
                    padding: '30px 25px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-50px',
                        right: '-50px',
                        width: '200px',
                        height: '200px',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                        borderRadius: '50%',
                        transition: 'transform 0.6s ease',
                        transform: isHovered ? 'scale(1.3) translate(-10px, 10px)' : 'scale(1)'
                    }}></div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '15px',
                                background: 'rgba(255,255,255,0.25)',
                                backdropFilter: 'blur(10px)',
                                border: '2px solid rgba(255,255,255,0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                                transition: 'transform 0.3s ease',
                                transform: isHovered ? 'rotate(12deg) scale(1.1)' : 'rotate(0deg) scale(1)'
                            }}>
                                <i className="fas fa-trophy" style={{ color: 'white', fontSize: '22px' }}></i>
                            </div>
                            <span style={{ 
                                fontSize: '12px',
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
                                {comp.type || 'Competition'}
                            </span>
                        </div>
                        <h3 style={{ 
                            fontSize: '22px', 
                            fontWeight: '900', 
                            color: 'white',
                            marginBottom: '0',
                            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                            lineHeight: '1.3'
                        }}>{comp.name || comp.competitionName || 'Unnamed Competition'}</h3>
                    </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '25px' }}>
                    <div style={{ display: 'grid', gap: '12px', marginBottom: comp.prizeMoney ? '20px' : '0' }}>
                        {comp.season && (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                padding: '12px 15px',
                                background: 'linear-gradient(135deg, rgba(245,158,11,0.05) 0%, rgba(234,88,12,0.05) 100%)',
                                borderRadius: '12px',
                                border: '1px solid rgba(245,158,11,0.1)',
                                transition: 'all 0.3s ease',
                                transform: isHovered ? 'translateX(5px)' : 'translateX(0)'
                            }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '12px',
                                    boxShadow: '0 4px 12px rgba(245,158,11,0.2)'
                                }}>
                                    <i className="fas fa-calendar-week" style={{ color: 'white', fontSize: '14px' }}></i>
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginBottom: '2px' }}>SEASON</div>
                                    <div style={{ color: '#1e293b', fontWeight: '600' }}>{comp.season}</div>
                                </div>
                            </div>
                        )}
                        {comp.startDate && (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                padding: '12px 15px',
                                background: 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(37,99,235,0.05) 100%)',
                                borderRadius: '12px',
                                border: '1px solid rgba(59,130,246,0.1)',
                                transition: 'all 0.3s ease',
                                transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
                                transitionDelay: '0.05s'
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
                                    <i className="fas fa-calendar-day" style={{ color: 'white', fontSize: '14px' }}></i>
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginBottom: '2px' }}>START DATE</div>
                                    <div style={{ color: '#1e293b', fontWeight: '600' }}>{comp.startDate}</div>
                                </div>
                            </div>
                        )}
                        {comp.numberOfTeams && (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                padding: '12px 15px',
                                background: 'linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(124,58,237,0.05) 100%)',
                                borderRadius: '12px',
                                border: '1px solid rgba(139,92,246,0.1)',
                                transition: 'all 0.3s ease',
                                transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
                                transitionDelay: '0.1s'
                            }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '12px',
                                    boxShadow: '0 4px 12px rgba(139,92,246,0.2)'
                                }}>
                                    <i className="fas fa-users" style={{ color: 'white', fontSize: '14px' }}></i>
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginBottom: '2px' }}>TEAMS</div>
                                    <div style={{ color: '#1e293b', fontWeight: '600' }}>{comp.numberOfTeams} Teams</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Prize Money Highlight */}
                    {comp.prizeMoney && (
                        <div style={{ 
                            padding: '20px',
                            background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.1) 100%)',
                            borderRadius: '15px',
                            border: '2px solid rgba(16,185,129,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.3s ease',
                            transform: isHovered ? 'scale(1.03)' : 'scale(1)'
                        }}>
                            <div>
                                <div style={{ fontSize: '11px', color: '#059669', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>💎 Prize Pool</div>
                                <div style={{ color: '#10b981', fontWeight: '900', fontSize: '24px' }}>${comp.prizeMoney}M</div>
                            </div>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '15px',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 20px rgba(16,185,129,0.3)',
                                transition: 'transform 0.3s ease',
                                transform: isHovered ? 'rotate(12deg) scale(1.1)' : 'rotate(0) scale(1)'
                            }}>
                                <i className="fas fa-sack-dollar" style={{ color: 'white', fontSize: '22px' }}></i>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
});

CompetitionCard.displayName = 'CompetitionCard';

const CompetitionsPage = () => {
    const navigate = useNavigate();
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [error, setError] = useState(null);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchCompetitions();
    }, []);

    const fetchCompetitions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8000/api/competitions?limit=100');
            if (response.ok) {
                const data = await response.json();
                setCompetitions(data.competitions || []);
            } else {
                throw new Error('Failed to fetch competitions');
            }
        } catch (error) {
            console.error('Error fetching competitions:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Memoized filtering logic
    const filteredComps = useMemo(() => {
        return competitions.filter(comp => {
            const matchesSearch = debouncedQuery === '' || 
                comp.competitionName?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                comp.name?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                comp.country?.toLowerCase().includes(debouncedQuery.toLowerCase());
            
            const matchesType = selectedType === 'all' || comp.type === selectedType;
            
            return matchesSearch && matchesType;
        });
    }, [debouncedQuery, selectedType, competitions]);

    // Memoized types array
    const types = useMemo(() => 
        [...new Set(competitions.map(c => c.type).filter(Boolean))],
        [competitions]
    );

    // Memoized navigation handler
    const handleCardClick = useCallback((id) => {
        navigate(`/competitions/${id}`);
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
                    background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
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
                    background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                    animation: 'float 25s ease-in-out infinite reverse'
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ 
                        textAlign: 'center', 
                        marginBottom: '50px',
                        animation: 'fadeIn 0.8s ease-out'
                    }}>
                        <h1 style={{ 
                            fontSize: '56px', 
                            fontWeight: '900', 
                            background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #dc2626 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '15px',
                            letterSpacing: '-1px'
                        }}>🏆 Competitions</h1>
                        <p style={{ fontSize: '19px', color: '#64748b', fontWeight: '500' }}>
                            Discover {filteredComps.length} world-class competitions
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
                            <div className="col-md-6 mb-3">
                                <label style={{ fontWeight: '700', marginBottom: '12px', display: 'block', color: '#1e293b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    🔍 Search Competitions
                                </label>
                                <input 
                                    type="text"
                                    placeholder="Search by name or country..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '14px 20px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        outline: 'none',
                                        transition: 'all 0.3s ease',
                                        background: 'white'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#f59e0b';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e2e8f0';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label style={{ fontWeight: '700', marginBottom: '12px', display: 'block', color: '#1e293b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    🏅 Competition Type
                                </label>
                                <select 
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '14px 20px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        background: 'white'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#f59e0b';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e2e8f0';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    <option value="all">All Types</option>
                                    {types.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Loading State with Skeletons */}
                    {loading ? (
                        <div className="row">
                            {[...Array(6)].map((_, index) => (
                                <CompetitionSkeleton key={index} />
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
                            <h3 style={{ color: '#1e293b', marginBottom: '12px', fontSize: '24px', fontWeight: '800' }}>Unable to Load Competitions</h3>
                            <p style={{ color: '#64748b', marginBottom: '24px' }}>{error}</p>
                            <button 
                                onClick={fetchCompetitions}
                                style={{
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '14px 32px',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 24px rgba(245,158,11,0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 12px 32px rgba(245,158,11,0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 8px 24px rgba(245,158,11,0.3)';
                                }}
                            >
                                <i className="fas fa-redo" style={{ marginRight: '8px' }}></i>
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="row">
                            {filteredComps.map((comp, index) => (
                                <CompetitionCard 
                                    key={comp.id || index} 
                                    comp={comp} 
                                    onClick={() => handleCardClick(comp.id)}
                                    index={index}
                                />
                            ))}

                            {filteredComps.length === 0 && !loading && (
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
                                        <h3 style={{ color: '#1e293b', marginBottom: '12px', fontSize: '24px', fontWeight: '800' }}>No Competitions Found</h3>
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
                    @keyframes float {
                        0%, 100% { transform: translate(0, 0); }
                        50% { transform: translate(20px, 20px); }
                    }
                `}</style>
            </div>
        </LayoutV1>
    );
};

export default CompetitionsPage;
