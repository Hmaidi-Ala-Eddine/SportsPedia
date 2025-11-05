import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LayoutV1 from '@/components/layouts/LayoutV1';

const TeamDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeamDetails();
    }, [id]);

    const fetchTeamDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/teams/${id}`);
            if (response.ok) {
                const data = await response.json();
                setTeam(data);
            }
        } catch (error) {
            console.error('Error fetching team:', error);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <LayoutV1>
                <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
                    <div className="container">
                        <div style={{
                            background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite',
                            borderRadius: '20px',
                            height: '350px',
                            marginBottom: '40px'
                        }}></div>
                        
                        <div className="row">
                            <div className="col-lg-8">
                                <div style={{
                                    background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'shimmer 1.5s infinite',
                                    borderRadius: '15px',
                                    height: '250px',
                                    marginBottom: '30px'
                                }}></div>
                            </div>
                            <div className="col-lg-4">
                                <div style={{
                                    background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'shimmer 1.5s infinite',
                                    borderRadius: '15px',
                                    height: '400px'
                                }}></div>
                            </div>
                        </div>

                        <style>{`
                            @keyframes shimmer {
                                0% { background-position: 200% 0; }
                                100% { background-position: -200% 0; }
                            }
                        `}</style>
                    </div>
                </div>
            </LayoutV1>
        );
    }

    if (!team) {
        return (
            <LayoutV1>
                <div style={{ 
                    backgroundColor: '#f8fafc', 
                    minHeight: '100vh', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    paddingTop: '100px'
                }}>
                    <div style={{ textAlign: 'center', animation: 'fadeIn 0.6s ease-out' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 30px',
                            boxShadow: '0 20px 60px rgba(239,68,68,0.25)'
                        }}>
                            <i className="fas fa-shield-alt" style={{ fontSize: '56px', color: '#dc2626', opacity: 0.6 }}></i>
                        </div>
                        <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1e293b', marginBottom: '16px' }}>Team Not Found</h2>
                        <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px' }}>The team you're looking for doesn't exist</p>
                        <button onClick={() => navigate('/teams')} style={{
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '14px 32px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '700',
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
                        }}>
                            <i className="fas fa-arrow-left" style={{ marginRight: '10px' }}></i>
                            Back to Teams
                        </button>
                    </div>
                </div>
            </LayoutV1>
        );
    }

    const totalGames = (team.wins || 0) + (team.draws || 0) + (team.losses || 0);
    const winRate = totalGames > 0 ? ((team.wins || 0) / totalGames * 100).toFixed(1) : 0;

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
                {/* Animated Background */}
                <div style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    pointerEvents: 'none',
                    animation: 'float 25s ease-in-out infinite'
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    {/* Premium Hero Section */}
                    <div style={{ 
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 50%, #2563eb 100%)',
                        borderRadius: '24px',
                        padding: '0',
                        marginBottom: '50px',
                        color: 'white',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: '0 20px 60px rgba(139,92,246,0.3)',
                        animation: 'fadeIn 0.8s ease-out'
                    }}>
                        {/* Decorative Elements */}
                        <div style={{
                            position: 'absolute',
                            top: '-100px',
                            right: '-100px',
                            width: '400px',
                            height: '400px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                        }}></div>
                        
                        <div style={{ padding: '60px 50px', position: 'relative', zIndex: 1 }}>
                            <button 
                                onClick={() => navigate('/teams')}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    color: 'white',
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    marginBottom: '30px',
                                    cursor: 'pointer',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.background = 'rgba(255,255,255,0.3)';
                                    e.target.style.transform = 'translateX(-4px)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.background = 'rgba(255,255,255,0.2)';
                                    e.target.style.transform = 'translateX(0)';
                                }}
                            >
                                <i className="fas fa-arrow-left"></i>
                                Back to Teams
                            </button>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                                <div style={{
                                    width: '110px',
                                    height: '110px',
                                    borderRadius: '22px',
                                    background: team.primaryColor || 'rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    border: '3px solid rgba(255,255,255,0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
                                    animation: 'pulse 3s ease-in-out infinite'
                                }}>
                                    <i className="fas fa-shield-alt" style={{ fontSize: '52px', color: team.primaryColor ? '#fff' : '#1e293b' }}></i>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h1 style={{ 
                                        fontSize: '52px', 
                                        fontWeight: '900', 
                                        marginBottom: '15px',
                                        lineHeight: '1.2',
                                        textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                        letterSpacing: '-1px'
                                    }}>
                                        {team.teamName || 'Team Name'}
                                    </h1>
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                        <span style={{ 
                                            background: 'rgba(255,255,255,0.2)',
                                            backdropFilter: 'blur(10px)',
                                            padding: '10px 20px',
                                            borderRadius: '25px',
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {team.team_type?.replace('Team', '') || 'Team'}
                                        </span>
                                        {team.city && (
                                            <span style={{ 
                                                background: 'rgba(255,255,255,0.2)',
                                                backdropFilter: 'blur(10px)',
                                                padding: '10px 20px',
                                                borderRadius: '25px',
                                                fontSize: '15px',
                                                fontWeight: '600',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                                <i className="fas fa-map-marker-alt"></i>
                                                {team.city}, {team.country}
                                            </span>
                                        )}
                                        {team.foundedYear && (
                                            <span style={{ 
                                                background: 'rgba(255,255,255,0.2)',
                                                backdropFilter: 'blur(10px)',
                                                padding: '10px 20px',
                                                borderRadius: '25px',
                                                fontSize: '15px',
                                                fontWeight: '600',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                                <i className="fas fa-calendar-alt"></i>
                                                Founded {team.foundedYear}
                                            </span>
                                        )}
                                        {team.currentRanking && (
                                            <span style={{ 
                                                background: 'linear-gradient(135deg, rgba(251,191,36,0.3) 0%, rgba(245,158,11,0.3) 100%)',
                                                backdropFilter: 'blur(10px)',
                                                padding: '10px 20px',
                                                borderRadius: '25px',
                                                fontSize: '15px',
                                                fontWeight: '700',
                                                border: '2px solid rgba(251,191,36,0.5)',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                                <i className="fas fa-trophy"></i>
                                                Rank #{team.currentRanking}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Main Info */}
                        <div className="col-lg-8">
                            {/* Premium Stats Card with Animated Progress */}
                            {(team.wins !== undefined || team.losses !== undefined || team.draws !== undefined) && (
                                <div style={{ 
                                    background: 'rgba(255, 255, 255, 0.9)', 
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '20px', 
                                    padding: '40px', 
                                    marginBottom: '30px', 
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                    border: '1px solid rgba(255,255,255,0.5)',
                                    animation: 'fadeIn 0.8s ease-out 0.2s both'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                                        <div style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 6px 16px rgba(139,92,246,0.3)'
                                        }}>
                                            <i className="fas fa-chart-bar" style={{ color: 'white', fontSize: '20px' }}></i>
                                        </div>
                                        <h3 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: '#1e293b' }}>Season Statistics</h3>
                                    </div>

                                    {/* Win Rate Display */}
                                    {totalGames > 0 && (
                                        <div style={{ 
                                            marginBottom: '35px',
                                            padding: '24px',
                                            background: 'linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(109,40,217,0.05) 100%)',
                                            borderRadius: '16px',
                                            border: '2px solid rgba(139,92,246,0.1)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                <span style={{ fontSize: '15px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Win Rate</span>
                                                <span style={{ fontSize: '32px', fontWeight: '900', color: '#8b5cf6' }}>{winRate}%</span>
                                            </div>
                                            <div style={{ 
                                                width: '100%', 
                                                height: '12px', 
                                                background: '#e2e8f0', 
                                                borderRadius: '10px',
                                                overflow: 'hidden',
                                                position: 'relative'
                                            }}>
                                                <div style={{ 
                                                    width: `${winRate}%`, 
                                                    height: '100%', 
                                                    background: 'linear-gradient(90deg, #8b5cf6 0%, #6d28d9 100%)',
                                                    borderRadius: '10px',
                                                    animation: 'progressFill 1.5s ease-out',
                                                    boxShadow: '0 0 10px rgba(139,92,246,0.5)'
                                                }}></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Stats Grid */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px' }}>
                                        {team.wins !== undefined && (
                                            <div style={{ 
                                                textAlign: 'center',
                                                padding: '24px',
                                                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                                                borderRadius: '16px',
                                                border: '2px solid #6ee7b7',
                                                transition: 'transform 0.3s ease',
                                                cursor: 'default'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
                                            >
                                                <div style={{ fontSize: '48px', fontWeight: '900', color: '#059669', marginBottom: '8px', lineHeight: 1 }}>{team.wins}</div>
                                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#047857', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Wins</div>
                                            </div>
                                        )}
                                        {team.draws !== undefined && (
                                            <div style={{ 
                                                textAlign: 'center',
                                                padding: '24px',
                                                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                                                borderRadius: '16px',
                                                border: '2px solid #fbbf24',
                                                transition: 'transform 0.3s ease',
                                                cursor: 'default'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
                                            >
                                                <div style={{ fontSize: '48px', fontWeight: '900', color: '#d97706', marginBottom: '8px', lineHeight: 1 }}>{team.draws}</div>
                                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Draws</div>
                                            </div>
                                        )}
                                        {team.losses !== undefined && (
                                            <div style={{ 
                                                textAlign: 'center',
                                                padding: '24px',
                                                background: 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)',
                                                borderRadius: '16px',
                                                border: '2px solid #f87171',
                                                transition: 'transform 0.3s ease',
                                                cursor: 'default'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
                                            >
                                                <div style={{ fontSize: '48px', fontWeight: '900', color: '#dc2626', marginBottom: '8px', lineHeight: 1 }}>{team.losses}</div>
                                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Losses</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {team.description && (
                                <div style={{ background: 'white', borderRadius: '15px', padding: '30px', marginBottom: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                                    <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '15px' }}>📝 About</h3>
                                    <p style={{ color: '#64748b', lineHeight: '1.8', fontSize: '16px' }}>{team.description}</p>
                                </div>
                            )}

                            {/* Major Achievements */}
                            {team.majorAchievements && (
                                <div style={{ background: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                                    <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '15px' }}>🏆 Major Achievements</h3>
                                    <p style={{ color: '#64748b', lineHeight: '1.8', fontSize: '16px' }}>{team.majorAchievements}</p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="col-lg-4">
                            <div style={{ background: 'white', borderRadius: '15px', padding: '30px', position: 'sticky', top: '100px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Team Details</h3>
                                
                                {team.budget && (
                                    <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
                                        <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '5px' }}>💰 Budget</div>
                                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>${team.budget}M</div>
                                    </div>
                                )}

                                {team.currentRanking && (
                                    <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
                                        <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '5px' }}>⭐ Current Ranking</div>
                                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>#{team.currentRanking}</div>
                                    </div>
                                )}

                                {team.primaryColor && (
                                    <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
                                        <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px' }}>🎨 Team Colors</div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '8px',
                                                background: team.primaryColor,
                                                border: '2px solid #e2e8f0'
                                            }}></div>
                                            {team.secondaryColor && (
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '8px',
                                                    background: team.secondaryColor,
                                                    border: '2px solid #e2e8f0'
                                                }}></div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {team.estimatedFans && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '5px' }}>👥 Estimated Fans</div>
                                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#8b5cf6' }}>{team.estimatedFans}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                    @keyframes float {
                        0%, 100% { transform: translate(0, 0); }
                        50% { transform: translate(30px, 30px); }
                    }
                    @keyframes progressFill {
                        from { width: 0%; }
                    }
                `}</style>
            </div>
        </LayoutV1>
    );
};

export default TeamDetailPage;
