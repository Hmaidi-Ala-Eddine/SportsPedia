import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LayoutV1 from '@/components/layouts/LayoutV1';

const AchievementDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [achievement, setAchievement] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAchievementDetails();
    }, [id]);

    const fetchAchievementDetails = async () => {
        setLoading(true);
        try {
            // Fetch achievement data via SPARQL
            const sparqlQuery = `
                PREFIX sport: <http://example.org/sports-ontology#>
                SELECT ?achievementType ?year ?athlete ?firstName ?lastName ?performanceValue ?unit ?nationality ?position
                WHERE {
                    sport:${id} a sport:Achievement .
                    OPTIONAL { sport:${id} sport:achievementType ?achievementType . }
                    OPTIONAL { sport:${id} sport:year ?year . }
                    OPTIONAL { sport:${id} sport:performanceValue ?performanceValue . }
                    OPTIONAL { sport:${id} sport:unit ?unit . }
                    OPTIONAL { 
                        sport:${id} sport:achievedBy ?athlete .
                        ?athlete sport:firstName ?firstName .
                        ?athlete sport:lastName ?lastName .
                        OPTIONAL { ?athlete sport:nationality ?nationality . }
                        OPTIONAL { ?athlete sport:position ?position . }
                    }
                }
            `;
            
            const response = await fetch('http://localhost:3030/sportspedia/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/sparql-query',
                    'Accept': 'application/sparql-results+json'
                },
                body: sparqlQuery
            });

            if (response.ok) {
                const data = await response.json();
                if (data.results.bindings.length > 0) {
                    const result = data.results.bindings[0];
                    const athleteUri = result.athlete?.value;
                    const athleteId = athleteUri ? athleteUri.split('#')[1] : null;
                    
                    setAchievement({
                        id: id,
                        achievementType: result.achievementType?.value,
                        year: result.year?.value,
                        performanceValue: result.performanceValue?.value,
                        unit: result.unit?.value,
                        achievedBy: result.firstName && result.lastName 
                            ? `${result.firstName.value} ${result.lastName.value}` 
                            : null,
                        athleteId: athleteId,
                        athleteFirstName: result.firstName?.value,
                        athleteLastName: result.lastName?.value,
                        athleteNationality: result.nationality?.value,
                        athletePosition: result.position?.value
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching achievement:', error);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <LayoutV1>
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                    <div style={{ textAlign: 'center' }}>
                        <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#f59e0b' }}></i>
                        <p style={{ marginTop: '20px', color: '#64748b', fontSize: '18px' }}>Loading Achievement...</p>
                    </div>
                </div>
            </LayoutV1>
        );
    }

    if (!achievement) {
        return (
            <LayoutV1>
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                    <div style={{ textAlign: 'center' }}>
                        <i className="fas fa-exclamation-circle" style={{ fontSize: '64px', color: '#ef4444' }}></i>
                        <h2 style={{ marginTop: '20px', color: '#1e293b' }}>Achievement Not Found</h2>
                        <button onClick={() => navigate('/performance')} style={{ marginTop: '20px', padding: '12px 30px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                            Back to Performance
                        </button>
                    </div>
                </div>
            </LayoutV1>
        );
    }

    return (
        <LayoutV1>
            <div style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '60px' }}>
                <div className="container">
                    {/* Back Button */}
                    <button 
                        onClick={() => navigate('/performance')}
                        style={{
                            background: 'white',
                            border: '2px solid #fbbf24',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#f59e0b',
                            cursor: 'pointer',
                            marginBottom: '30px',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = '#f59e0b';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = '#f59e0b';
                        }}
                    >
                        <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
                        Back to Performance
                    </button>

                    {/* Achievement Hero */}
                    <div style={{
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        borderRadius: '25px',
                        padding: '60px 40px',
                        textAlign: 'center',
                        boxShadow: '0 20px 60px rgba(245,158,11,0.3)',
                        marginBottom: '40px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Background Pattern */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                            opacity: 0.3
                        }}></div>

                        {/* Content */}
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 25px',
                                boxShadow: '0 15px 40px rgba(0,0,0,0.2)'
                            }}>
                                <i className="fas fa-trophy" style={{ fontSize: '60px', color: '#f59e0b' }}></i>
                            </div>

                            {achievement.year && (
                                <div style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    padding: '8px 20px',
                                    borderRadius: '25px',
                                    display: 'inline-block',
                                    marginBottom: '20px',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <span style={{ color: 'white', fontSize: '18px', fontWeight: '700' }}>{achievement.year}</span>
                                </div>
                            )}

                            <h1 style={{ fontSize: '48px', fontWeight: '900', color: 'white', marginBottom: '20px', textShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                {achievement.achievementType || 'Achievement'}
                            </h1>

                            {achievement.achievedBy && (
                                <div style={{ fontSize: '24px', color: 'rgba(255,255,255,0.95)', fontWeight: '600' }}>
                                    🏆 Achieved by {achievement.achievedBy}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">
                            <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
                                <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '30px', textAlign: 'center' }}>
                                    <i className="fas fa-info-circle" style={{ marginRight: '12px', color: '#f59e0b' }}></i>
                                    Achievement Details
                                </h2>

                                <div style={{ display: 'grid', gap: '20px' }}>
                                    {achievement.achievementType && (
                                        <div style={{ padding: '20px', background: '#fffbeb', borderRadius: '12px', border: '2px solid #fef3c7' }}>
                                            <div style={{ fontSize: '14px', color: '#92400e', fontWeight: '600', marginBottom: '5px' }}>Type:</div>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#78350f' }}>{achievement.achievementType}</div>
                                        </div>
                                    )}

                                    {achievement.year && (
                                        <div style={{ padding: '20px', background: '#fffbeb', borderRadius: '12px', border: '2px solid #fef3c7' }}>
                                            <div style={{ fontSize: '14px', color: '#92400e', fontWeight: '600', marginBottom: '5px' }}>Year:</div>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#78350f' }}>{achievement.year}</div>
                                        </div>
                                    )}

                                    {achievement.achievedBy && (
                                        <div style={{ padding: '20px', background: '#fffbeb', borderRadius: '12px', border: '2px solid #fef3c7' }}>
                                            <div style={{ fontSize: '14px', color: '#92400e', fontWeight: '600', marginBottom: '5px' }}>Achieved By:</div>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#78350f' }}>{achievement.achievedBy}</div>
                                        </div>
                                    )}

                                    {achievement.performanceValue && (
                                        <div style={{ padding: '20px', background: '#fffbeb', borderRadius: '12px', border: '2px solid #fef3c7' }}>
                                            <div style={{ fontSize: '14px', color: '#92400e', fontWeight: '600', marginBottom: '5px' }}>Value:</div>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#78350f' }}>
                                                {achievement.performanceValue} {achievement.unit || ''}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Relationship Section - Achieved By */}
                        {achievement.athleteId && (
                            <div style={{ marginTop: '40px' }}>
                                <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1e293b', marginBottom: '30px', textAlign: 'center' }}>
                                    <i className="fas fa-link" style={{ marginRight: '12px', color: '#f59e0b' }}></i>
                                    Achieved By
                                </h2>

                                <div style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                                    <div 
                                        onClick={() => navigate(`/person/athlete/${achievement.athleteId}`)}
                                        style={{
                                            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                                            padding: '25px',
                                            borderRadius: '15px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            border: '2px solid transparent'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.borderColor = '#2563eb';
                                            e.currentTarget.style.boxShadow = '0 12px 35px rgba(37,99,235,0.3)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.borderColor = 'transparent';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <div style={{ 
                                                width: '80px', 
                                                height: '80px', 
                                                borderRadius: '50%', 
                                                background: 'white', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                boxShadow: '0 4px 15px rgba(37,99,235,0.2)'
                                            }}>
                                                <i className="fas fa-running" style={{ fontSize: '36px', color: '#2563eb' }}></i>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ 
                                                    display: 'inline-block',
                                                    background: 'rgba(37,99,235,0.1)',
                                                    padding: '4px 12px',
                                                    borderRadius: '15px',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    color: '#2563eb',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px',
                                                    marginBottom: '10px'
                                                }}>
                                                    Athlete
                                                </div>
                                                <div style={{ fontSize: '24px', fontWeight: '900', color: '#1e293b', marginBottom: '8px' }}>
                                                    {achievement.athleteFirstName} {achievement.athleteLastName}
                                                </div>
                                                <div style={{ fontSize: '15px', color: '#64748b', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                                    {achievement.athleteNationality && (
                                                        <span>
                                                            <i className="fas fa-globe" style={{ marginRight: '6px', color: '#2563eb' }}></i>
                                                            {achievement.athleteNationality}
                                                        </span>
                                                    )}
                                                    {achievement.athletePosition && (
                                                        <span>
                                                            <i className="fas fa-futbol" style={{ marginRight: '6px', color: '#2563eb' }}></i>
                                                            {achievement.athletePosition}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <i className="fas fa-chevron-right" style={{ fontSize: '24px', color: '#2563eb' }}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </LayoutV1>
    );
};

export default AchievementDetailPage;
