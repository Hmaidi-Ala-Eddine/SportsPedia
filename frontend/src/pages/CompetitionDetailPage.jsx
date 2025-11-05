import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LayoutV1 from '@/components/layouts/LayoutV1';

const CompetitionDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [competition, setCompetition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        fetchCompetitionDetails();
    }, [id]);

    const fetchCompetitionDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/competitions/${id}`);
            if (response.ok) {
                const data = await response.json();
                setCompetition(data);
            }
        } catch (error) {
            console.error('Error fetching competition:', error);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <LayoutV1>
                <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
                    <div className="container">
                        {/* Skeleton for Header */}
                        <div style={{
                            background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite',
                            borderRadius: '20px',
                            height: '300px',
                            marginBottom: '40px'
                        }}></div>
                        
                        <div className="row">
                            <div className="col-lg-8">
                                <div style={{
                                    background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'shimmer 1.5s infinite',
                                    borderRadius: '15px',
                                    height: '200px',
                                    marginBottom: '30px'
                                }}></div>
                            </div>
                            <div className="col-lg-4">
                                <div style={{
                                    background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'shimmer 1.5s infinite',
                                    borderRadius: '15px',
                                    height: '350px'
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

    if (!competition) {
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
                    <div style={{ 
                        textAlign: 'center',
                        animation: 'fadeIn 0.6s ease-out'
                    }}>
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
                            <i className="fas fa-trophy" style={{ fontSize: '56px', color: '#dc2626', opacity: 0.6 }}></i>
                        </div>
                        <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1e293b', marginBottom: '16px' }}>Competition Not Found</h2>
                        <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px' }}>The competition you're looking for doesn't exist</p>
                        <button onClick={() => navigate('/competitions')} style={{
                            background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '14px 32px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '700',
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
                        }}>
                            <i className="fas fa-arrow-left" style={{ marginRight: '10px' }}></i>
                            Back to Competitions
                        </button>
                    </div>
                </div>
            </LayoutV1>
        );
    }

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
                    background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    pointerEvents: 'none',
                    animation: 'float 25s ease-in-out infinite'
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    {/* Hero Section with Glassmorphism */}
                    <div style={{ 
                        background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #dc2626 100%)',
                        borderRadius: '24px',
                        padding: '0',
                        marginBottom: '50px',
                        color: 'white',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: '0 20px 60px rgba(245,158,11,0.3)',
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
                        <div style={{
                            position: 'absolute',
                            bottom: '-80px',
                            left: '-80px',
                            width: '300px',
                            height: '300px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                        }}></div>

                        <div style={{ padding: '60px 50px', position: 'relative', zIndex: 1 }}>
                            <button 
                                onClick={() => navigate('/competitions')}
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
                                Back to Competitions
                            </button>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '25px' }}>
                                <div style={{
                                    width: '90px',
                                    height: '90px',
                                    borderRadius: '20px',
                                    background: 'rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    border: '2px solid rgba(255,255,255,0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                    animation: 'pulse 3s ease-in-out infinite'
                                }}>
                                    <i className="fas fa-trophy" style={{ fontSize: '42px', color: 'white' }}></i>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h1 style={{ 
                                        fontSize: '52px', 
                                        fontWeight: '900', 
                                        marginBottom: '12px',
                                        lineHeight: '1.2',
                                        textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                        letterSpacing: '-1px'
                                    }}>
                                        {competition.competitionName || competition.name || 'Competition'}
                                    </h1>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {competition.season && (
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
                                        <i className="fas fa-calendar-week"></i>
                                        {competition.season}
                                    </span>
                                )}
                                {competition.country && (
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
                                        {competition.country}
                                    </span>
                                )}
                                {competition.type && (
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
                                        gap: '8px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        <i className="fas fa-tag"></i>
                                        {competition.type}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-8">
                            {competition.description && (
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
                                        }}>
                                            <i className="fas fa-align-left" style={{ color: 'white', fontSize: '18px' }}></i>
                                        </div>
                                        <h3 style={{ fontSize: '26px', fontWeight: '800', margin: 0, color: '#1e293b' }}>About</h3>
                                    </div>
                                    <p style={{ color: '#475569', lineHeight: '1.9', fontSize: '17px', margin: 0 }}>{competition.description}</p>
                                </div>
                            )}
                        </div>

                        <div className="col-lg-4">
                            <div style={{ 
                                background: 'rgba(255, 255, 255, 0.9)', 
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px', 
                                padding: '35px', 
                                position: 'sticky', 
                                top: '100px', 
                                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                border: '1px solid rgba(255,255,255,0.5)',
                                animation: 'fadeIn 0.8s ease-out 0.3s both'
                            }}>
                                <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '28px', color: '#1e293b' }}>Competition Details</h3>
                                
                                {competition.prizeMoney && (
                                    <div style={{ 
                                        marginBottom: '24px', 
                                        paddingBottom: '24px', 
                                        borderBottom: '2px solid #f1f5f9',
                                        transition: 'transform 0.3s ease'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                                    >
                                        <div style={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            marginBottom: '8px'
                                        }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '8px',
                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <i className="fas fa-sack-dollar" style={{ color: 'white', fontSize: '14px' }}></i>
                                            </div>
                                            <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Prize Money</div>
                                        </div>
                                        <div style={{ fontSize: '32px', fontWeight: '900', color: '#10b981', marginLeft: '42px' }}>${competition.prizeMoney}M</div>
                                    </div>
                                )}

                                {competition.numberOfTeams && (
                                    <div style={{ 
                                        marginBottom: '24px', 
                                        paddingBottom: '24px', 
                                        borderBottom: '2px solid #f1f5f9',
                                        transition: 'transform 0.3s ease'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                                    >
                                        <div style={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            marginBottom: '8px'
                                        }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '8px',
                                                background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <i className="fas fa-users" style={{ color: 'white', fontSize: '14px' }}></i>
                                            </div>
                                            <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Number of Teams</div>
                                        </div>
                                        <div style={{ fontSize: '32px', fontWeight: '900', color: '#f59e0b', marginLeft: '42px' }}>{competition.numberOfTeams}</div>
                                    </div>
                                )}

                                {competition.competitionFormat && (
                                    <div style={{ 
                                        transition: 'transform 0.3s ease'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                                    >
                                        <div style={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            marginBottom: '8px'
                                        }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '8px',
                                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <i className="fas fa-list-ul" style={{ color: 'white', fontSize: '14px' }}></i>
                                            </div>
                                            <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Format</div>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginLeft: '42px' }}>{competition.competitionFormat}</div>
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
                `}</style>
            </div>
        </LayoutV1>
    );
};

export default CompetitionDetailPage;
