import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LayoutV1 from '@/components/layouts/LayoutV1';

const PersonDetailPage = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relationships, setRelationships] = useState({
        coaches: [],
        achievements: [],
        records: [],
        athletes: []
    });

    useEffect(() => {
        fetchPersonDetails();
        fetchRelationships();
    }, [type, id]);

    const fetchPersonDetails = async () => {
        setLoading(true);
        try {
            let endpoint = '';
            if (type === 'athlete') endpoint = `http://localhost:8000/api/persons/athletes/${id}`;
            else if (type === 'coach') endpoint = `http://localhost:8000/api/persons/coaches/${id}`;
            else if (type === 'referee') endpoint = `http://localhost:8000/api/persons/referees/${id}`;

            const response = await fetch(endpoint);
            if (response.ok) {
                const data = await response.json();
                setPerson({ ...data, type });
            }
        } catch (error) {
            console.error('Error fetching person:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelationships = async () => {
        try {
            if (type === 'athlete') {
                // Fetch coaches, achievements, and records for athlete
                const [coachesRes, achievementsRes, recordsRes] = await Promise.all([
                    fetch(`http://localhost:8000/api/persons/athletes/${id}/coaches`),
                    fetch(`http://localhost:8000/api/persons/athletes/${id}/achievements`),
                    fetch(`http://localhost:8000/api/persons/athletes/${id}/records`)
                ]);
                
                const coachesData = coachesRes.ok ? await coachesRes.json() : { coaches: [] };
                const achievementsData = achievementsRes.ok ? await achievementsRes.json() : { achievements: [] };
                const recordsData = recordsRes.ok ? await recordsRes.json() : { records: [] };
                
                setRelationships({
                    coaches: coachesData.coaches || [],
                    achievements: achievementsData.achievements || [],
                    records: recordsData.records || [],
                    athletes: []
                });
            } else if (type === 'coach') {
                // Fetch athletes for coach
                const athletesRes = await fetch(`http://localhost:8000/api/persons/coaches/${id}/athletes`);
                const athletesData = athletesRes.ok ? await athletesRes.json() : { athletes: [] };
                
                setRelationships({
                    coaches: [],
                    achievements: [],
                    records: [],
                    athletes: athletesData.athletes || []
                });
            }
        } catch (error) {
            console.error('Error fetching relationships:', error);
        }
    };

    const getTypeConfig = () => {
        if (type === 'athlete') return {
            color: '#2563eb',
            gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            icon: 'fa-running',
            label: 'Athlete',
            bg: '#dbeafe'
        };
        if (type === 'coach') return {
            color: '#16a34a',
            gradient: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            icon: 'fa-clipboard',
            label: 'Coach',
            bg: '#dcfce7'
        };
        return {
            color: '#dc2626',
            gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            icon: 'fa-whistle',
            label: 'Referee',
            bg: '#fee2e2'
        };
    };

    if (loading) {
        return (
            <LayoutV1>
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                    <div style={{ textAlign: 'center' }}>
                        <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#2563eb' }}></i>
                        <p style={{ marginTop: '20px', color: '#64748b', fontSize: '18px' }}>Loading...</p>
                    </div>
                </div>
            </LayoutV1>
        );
    }

    if (!person) {
        return (
            <LayoutV1>
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                    <div style={{ textAlign: 'center' }}>
                        <i className="fas fa-exclamation-circle" style={{ fontSize: '64px', color: '#ef4444' }}></i>
                        <h2 style={{ marginTop: '20px', color: '#1e293b' }}>Person Not Found</h2>
                        <button onClick={() => navigate('/search')} style={{ marginTop: '20px', padding: '12px 30px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                            Back to Search
                        </button>
                    </div>
                </div>
            </LayoutV1>
        );
    }

    const config = getTypeConfig();

    return (
        <LayoutV1>
            <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '60px' }}>
                <div className="container">
                    {/* Back Button */}
                    <button 
                        onClick={() => navigate('/search')}
                        style={{
                            background: 'white',
                            border: '2px solid #e2e8f0',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#64748b',
                            cursor: 'pointer',
                            marginBottom: '30px',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = config.color;
                            e.currentTarget.style.color = config.color;
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.color = '#64748b';
                        }}
                    >
                        <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
                        Back to Search
                    </button>

                    {/* Hero Section */}
                    <div style={{
                        background: 'white',
                        borderRadius: '25px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                        marginBottom: '40px'
                    }}>
                        <div style={{ background: config.gradient, padding: '60px 40px', textAlign: 'center', position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                top: '20px',
                                right: '30px',
                                background: 'rgba(255,255,255,0.25)',
                                padding: '8px 20px',
                                borderRadius: '25px',
                                backdropFilter: 'blur(10px)',
                                border: '2px solid rgba(255,255,255,0.3)'
                            }}>
                                <span style={{ color: 'white', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {config.label}
                                </span>
                            </div>
                            
                            <div style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 25px auto',
                                boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
                                border: '5px solid rgba(255,255,255,0.3)'
                            }}>
                                <i className={`fas ${config.icon}`} style={{ fontSize: '70px', color: config.color }}></i>
                            </div>

                            <h1 style={{ fontSize: '48px', fontWeight: '900', color: 'white', marginBottom: '15px', textShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                {person.firstName} {person.lastName}
                            </h1>

                            {person.nationality && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                                    <div style={{
                                        background: 'rgba(255,255,255,0.9)',
                                        padding: '10px 25px',
                                        borderRadius: '25px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                    }}>
                                        <i className="fas fa-globe" style={{ fontSize: '18px', color: config.color }}></i>
                                        <span style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>{person.nationality}</span>
                                    </div>
                                    {person.position && (
                                        <div style={{
                                            background: 'rgba(255,255,255,0.9)',
                                            padding: '10px 25px',
                                            borderRadius: '25px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                        }}>
                                            <i className="fas fa-futbol" style={{ fontSize: '18px', color: config.color }}></i>
                                            <span style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>{person.position}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Stats Section */}
                        <div style={{ padding: '50px 40px' }}>
                            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '30px', textAlign: 'center' }}>
                                <i className="fas fa-chart-bar" style={{ marginRight: '12px', color: config.color }}></i>
                                Statistics & Information
                            </h3>

                            <div className="row">
                                {/* Athlete Stats */}
                                {type === 'athlete' && (
                                    <>
                                        {person.jerseyNumber && (
                                            <div className="col-md-4 mb-4">
                                                <div style={{ background: config.bg, padding: '30px', borderRadius: '15px', textAlign: 'center', height: '100%' }}>
                                                    <i className="fas fa-tshirt" style={{ fontSize: '36px', color: config.color, marginBottom: '15px' }}></i>
                                                    <div style={{ fontSize: '42px', fontWeight: '900', color: config.color, marginBottom: '8px' }}>#{person.jerseyNumber}</div>
                                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Jersey Number</div>
                                                </div>
                                            </div>
                                        )}
                                        {person.goalsScored !== null && person.goalsScored !== undefined && (
                                            <div className="col-md-4 mb-4">
                                                <div style={{ background: config.bg, padding: '30px', borderRadius: '15px', textAlign: 'center', height: '100%' }}>
                                                    <i className="fas fa-futbol" style={{ fontSize: '36px', color: config.color, marginBottom: '15px' }}></i>
                                                    <div style={{ fontSize: '42px', fontWeight: '900', color: config.color, marginBottom: '8px' }}>{person.goalsScored}</div>
                                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Goals Scored</div>
                                                </div>
                                            </div>
                                        )}
                                        {person.assists !== null && person.assists !== undefined && (
                                            <div className="col-md-4 mb-4">
                                                <div style={{ background: config.bg, padding: '30px', borderRadius: '15px', textAlign: 'center', height: '100%' }}>
                                                    <i className="fas fa-hands-helping" style={{ fontSize: '36px', color: config.color, marginBottom: '15px' }}></i>
                                                    <div style={{ fontSize: '42px', fontWeight: '900', color: config.color, marginBottom: '8px' }}>{person.assists}</div>
                                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assists</div>
                                                </div>
                                            </div>
                                        )}
                                        {person.matchesPlayed !== null && person.matchesPlayed !== undefined && (
                                            <div className="col-md-4 mb-4">
                                                <div style={{ background: config.bg, padding: '30px', borderRadius: '15px', textAlign: 'center', height: '100%' }}>
                                                    <i className="fas fa-gamepad" style={{ fontSize: '36px', color: config.color, marginBottom: '15px' }}></i>
                                                    <div style={{ fontSize: '42px', fontWeight: '900', color: config.color, marginBottom: '8px' }}>{person.matchesPlayed}</div>
                                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Matches Played</div>
                                                </div>
                                            </div>
                                        )}
                                        {person.isCaptain && (
                                            <div className="col-md-4 mb-4">
                                                <div style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', padding: '30px', borderRadius: '15px', textAlign: 'center', height: '100%', color: 'white' }}>
                                                    <i className="fas fa-crown" style={{ fontSize: '36px', marginBottom: '15px' }}></i>
                                                    <div style={{ fontSize: '24px', fontWeight: '900', marginBottom: '8px' }}>CAPTAIN</div>
                                                    <div style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Team Leader</div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Coach Stats */}
                                {type === 'coach' && (
                                    <>
                                        {person.experienceYears && (
                                            <div className="col-md-6 mb-4">
                                                <div style={{ background: config.bg, padding: '30px', borderRadius: '15px', textAlign: 'center', height: '100%' }}>
                                                    <i className="fas fa-calendar-alt" style={{ fontSize: '36px', color: config.color, marginBottom: '15px' }}></i>
                                                    <div style={{ fontSize: '42px', fontWeight: '900', color: config.color, marginBottom: '8px' }}>{person.experienceYears}</div>
                                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Years Experience</div>
                                                </div>
                                            </div>
                                        )}
                                        {person.titlesWon && (
                                            <div className="col-md-6 mb-4">
                                                <div style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', padding: '30px', borderRadius: '15px', textAlign: 'center', height: '100%', color: 'white' }}>
                                                    <i className="fas fa-trophy" style={{ fontSize: '36px', marginBottom: '15px' }}></i>
                                                    <div style={{ fontSize: '42px', fontWeight: '900', marginBottom: '8px' }}>{person.titlesWon}</div>
                                                    <div style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Titles Won</div>
                                                </div>
                                            </div>
                                        )}
                                        {person.coachingStyle && (
                                            <div className="col-12 mb-4">
                                                <div style={{ background: config.bg, padding: '30px', borderRadius: '15px' }}>
                                                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: config.color, marginBottom: '15px' }}>
                                                        <i className="fas fa-lightbulb" style={{ marginRight: '10px' }}></i>
                                                        Coaching Style
                                                    </h4>
                                                    <p style={{ fontSize: '16px', color: '#1e293b', lineHeight: '1.6', margin: 0 }}>{person.coachingStyle}</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Referee Stats */}
                                {type === 'referee' && (
                                    <>
                                        {person.experienceYears && (
                                            <div className="col-md-6 mb-4">
                                                <div style={{ background: config.bg, padding: '30px', borderRadius: '15px', textAlign: 'center', height: '100%' }}>
                                                    <i className="fas fa-calendar-alt" style={{ fontSize: '36px', color: config.color, marginBottom: '15px' }}></i>
                                                    <div style={{ fontSize: '42px', fontWeight: '900', color: config.color, marginBottom: '8px' }}>{person.experienceYears}</div>
                                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Years Experience</div>
                                                </div>
                                            </div>
                                        )}
                                        {person.matchesOfficiated && (
                                            <div className="col-md-6 mb-4">
                                                <div style={{ background: config.bg, padding: '30px', borderRadius: '15px', textAlign: 'center', height: '100%' }}>
                                                    <i className="fas fa-flag" style={{ fontSize: '36px', color: config.color, marginBottom: '15px' }}></i>
                                                    <div style={{ fontSize: '42px', fontWeight: '900', color: config.color, marginBottom: '8px' }}>{person.matchesOfficiated}</div>
                                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Matches Officiated</div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Additional Info */}
                            {(person.birthDate || person.height || person.weight || person.gender) && (
                                <div style={{ marginTop: '40px', background: '#f8fafc', padding: '30px', borderRadius: '15px' }}>
                                    <h4 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>
                                        <i className="fas fa-info-circle" style={{ marginRight: '10px', color: config.color }}></i>
                                        Additional Information
                                    </h4>
                                    <div className="row">
                                        {person.birthDate && (
                                            <div className="col-md-6 mb-3">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <i className="fas fa-birthday-cake" style={{ fontSize: '20px', color: config.color }}></i>
                                                    <div>
                                                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Birth Date</div>
                                                        <div style={{ fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>{person.birthDate}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {person.height && (
                                            <div className="col-md-6 mb-3">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <i className="fas fa-ruler-vertical" style={{ fontSize: '20px', color: config.color }}></i>
                                                    <div>
                                                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Height</div>
                                                        <div style={{ fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>{person.height} cm</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {person.weight && (
                                            <div className="col-md-6 mb-3">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <i className="fas fa-weight" style={{ fontSize: '20px', color: config.color }}></i>
                                                    <div>
                                                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Weight</div>
                                                        <div style={{ fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>{person.weight} kg</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {person.gender && (
                                            <div className="col-md-6 mb-3">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <i className="fas fa-venus-mars" style={{ fontSize: '20px', color: config.color }}></i>
                                                    <div>
                                                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Gender</div>
                                                        <div style={{ fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>{person.gender}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Relationships Section */}
                    {(relationships.coaches.length > 0 || relationships.achievements.length > 0 || relationships.records.length > 0 || relationships.athletes.length > 0) && (
                        <div style={{ marginTop: '40px' }}>
                            <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1e293b', marginBottom: '30px', textAlign: 'center' }}>
                                <i className="fas fa-link" style={{ marginRight: '12px', color: config.color }}></i>
                                Related Information
                            </h2>

                            {/* Coaches for Athlete */}
                            {type === 'athlete' && relationships.coaches.length > 0 && (
                                <div style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                                    <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#16a34a', marginBottom: '25px' }}>
                                        <i className="fas fa-clipboard" style={{ marginRight: '10px' }}></i>
                                        Coaches ({relationships.coaches.length})
                                    </h3>
                                    <div className="row">
                                        {relationships.coaches.map((coach) => (
                                            <div key={coach.id} className="col-md-6 mb-3">
                                                <div 
                                                    onClick={() => navigate(`/person/coach/${coach.id}`)}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)',
                                                        padding: '20px',
                                                        borderRadius: '12px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s',
                                                        border: '2px solid transparent'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                                        e.currentTarget.style.borderColor = '#16a34a';
                                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(22,163,74,0.2)';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.borderColor = 'transparent';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <i className="fas fa-clipboard" style={{ fontSize: '22px', color: '#16a34a' }}></i>
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                                                                {coach.firstName} {coach.lastName}
                                                            </div>
                                                            <div style={{ fontSize: '14px', color: '#64748b', marginTop: '3px' }}>
                                                                {coach.nationality && `🌍 ${coach.nationality}`}
                                                                {coach.titlesWon && ` • 🏆 ${coach.titlesWon} titles`}
                                                            </div>
                                                        </div>
                                                        <i className="fas fa-chevron-right" style={{ color: '#16a34a' }}></i>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Achievements for Athlete */}
                            {type === 'athlete' && relationships.achievements.length > 0 && (
                                <div style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                                    <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#fbbf24', marginBottom: '25px' }}>
                                        <i className="fas fa-trophy" style={{ marginRight: '10px' }}></i>
                                        Achievements ({relationships.achievements.length})
                                    </h3>
                                    <div className="row">
                                        {relationships.achievements.map((achievement) => (
                                            <div key={achievement.id} className="col-md-6 mb-3">
                                                <div 
                                                    onClick={() => navigate(`/performance/achievement/${achievement.id}`)}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                                                        padding: '20px',
                                                        borderRadius: '12px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s',
                                                        border: '2px solid transparent'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                                        e.currentTarget.style.borderColor = '#fbbf24';
                                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(251,191,36,0.3)';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.borderColor = 'transparent';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <i className="fas fa-trophy" style={{ fontSize: '22px', color: '#fbbf24' }}></i>
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                                                                {achievement.achievementType}
                                                            </div>
                                                            <div style={{ fontSize: '14px', color: '#64748b', marginTop: '3px' }}>
                                                                {achievement.year && `📅 ${achievement.year}`}
                                                                {achievement.performanceValue && ` • ${achievement.performanceValue} ${achievement.unit || ''}`}
                                                            </div>
                                                        </div>
                                                        <i className="fas fa-chevron-right" style={{ color: '#fbbf24' }}></i>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Records for Athlete */}
                            {type === 'athlete' && relationships.records.length > 0 && (
                                <div style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                                    <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#a855f7', marginBottom: '25px' }}>
                                        <i className="fas fa-medal" style={{ marginRight: '10px' }}></i>
                                        Records ({relationships.records.length})
                                    </h3>
                                    <div className="row">
                                        {relationships.records.map((record) => (
                                            <div key={record.id} className="col-md-6 mb-3">
                                                <div 
                                                    onClick={() => navigate(`/performance/record/${record.id}`)}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                                                        padding: '20px',
                                                        borderRadius: '12px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s',
                                                        border: '2px solid transparent'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                                        e.currentTarget.style.borderColor = '#a855f7';
                                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(168,85,247,0.3)';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.borderColor = 'transparent';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <i className="fas fa-medal" style={{ fontSize: '22px', color: '#a855f7' }}></i>
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                                                                {record.recordType}
                                                            </div>
                                                            <div style={{ fontSize: '14px', color: '#64748b', marginTop: '3px' }}>
                                                                {record.recordValue}
                                                                {record.setOn && ` • ${new Date(record.setOn).toLocaleDateString()}`}
                                                            </div>
                                                        </div>
                                                        <i className="fas fa-chevron-right" style={{ color: '#a855f7' }}></i>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Athletes for Coach */}
                            {type === 'coach' && relationships.athletes.length > 0 && (
                                <div style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                                    <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#2563eb', marginBottom: '25px' }}>
                                        <i className="fas fa-running" style={{ marginRight: '10px' }}></i>
                                        Athletes Trained ({relationships.athletes.length})
                                    </h3>
                                    <div className="row">
                                        {relationships.athletes.map((athlete) => (
                                            <div key={athlete.id} className="col-md-6 mb-3">
                                                <div 
                                                    onClick={() => navigate(`/person/athlete/${athlete.id}`)}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                                                        padding: '20px',
                                                        borderRadius: '12px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s',
                                                        border: '2px solid transparent'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                                        e.currentTarget.style.borderColor = '#2563eb';
                                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(37,99,235,0.2)';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.borderColor = 'transparent';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <i className="fas fa-running" style={{ fontSize: '22px', color: '#2563eb' }}></i>
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                                                                {athlete.firstName} {athlete.lastName}
                                                            </div>
                                                            <div style={{ fontSize: '14px', color: '#64748b', marginTop: '3px' }}>
                                                                {athlete.nationality && `🌍 ${athlete.nationality}`}
                                                                {athlete.position && ` • ${athlete.position}`}
                                                                {athlete.goalsScored && ` • ⚽ ${athlete.goalsScored} goals`}
                                                            </div>
                                                        </div>
                                                        <i className="fas fa-chevron-right" style={{ color: '#2563eb' }}></i>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </LayoutV1>
    );
};

export default PersonDetailPage;
