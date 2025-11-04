import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutV1 from '@/components/layouts/LayoutV1';

const AthletesPage = () => {
    const [athletes, setAthletes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSport, setFilterSport] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchAthletes();
    }, []);

    const fetchAthletes = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/persons/athletes?limit=50');
            if (response.ok) {
                const data = await response.json();
                setAthletes(data.athletes || []);
            }
        } catch (error) {
            console.error('Error fetching athletes:', error);
        } finally {
            setLoading(false);
        }
    };

    const sports = ['all', 'Football', 'Basketball', 'Tennis'];
    
    const filteredAthletes = athletes.filter(athlete => {
        const matchesSearch = !searchTerm || 
            `${athlete.firstName} ${athlete.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSport = filterSport === 'all' || athlete.sport === filterSport;
        return matchesSearch && matchesSport;
    });

    return (
        <LayoutV1>
            <div style={{ padding: '60px 0', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
                <div className="container">
                    <div style={{ marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>
                            <i className="fas fa-running" style={{ color: '#2563eb', marginRight: '15px' }}></i>
                            Athletes
                        </h1>
                        <p style={{ fontSize: '18px', color: '#64748b' }}>Explore our collection of world-class athletes</p>
                    </div>

                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '40px' }}>
                        <div className="row align-items-center">
                            <div className="col-lg-8 mb-3 mb-lg-0">
                                <input
                                    type="text"
                                    placeholder="Search athletes by name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '15px 20px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '10px',
                                        fontSize: '16px',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>
                            <div className="col-lg-4">
                                <select
                                    value={filterSport}
                                    onChange={(e) => setFilterSport(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '15px 20px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '10px',
                                        fontSize: '16px',
                                        outline: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {sports.map(sport => (
                                        <option key={sport} value={sport}>
                                            {sport === 'all' ? 'All Sports' : sport}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#2563eb' }}></i>
                            <p style={{ marginTop: '20px', color: '#64748b' }}>Loading athletes...</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ fontSize: '20px', color: '#64748b' }}>
                                    {filteredAthletes.length} Athletes Found
                                </h3>
                            </div>

                            <div className="row">
                                {filteredAthletes.map((athlete, index) => (
                                    <div key={index} className="col-lg-4 col-md-6 mb-30">
                                        <div
                                            style={{
                                                backgroundColor: 'white',
                                                borderRadius: '15px',
                                                overflow: 'hidden',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                                                transition: 'all 0.3s',
                                                cursor: 'pointer',
                                                border: '2px solid transparent'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-8px)';
                                                e.currentTarget.style.boxShadow = '0 12px 35px rgba(37,99,235,0.15)';
                                                e.currentTarget.style.borderColor = '#2563eb';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                                                e.currentTarget.style.borderColor = 'transparent';
                                            }}
                                            onClick={() => navigate(`/athlete/${athlete.id || index}`)}
                                        >
                                            <div style={{
                                                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                                padding: '40px 20px',
                                                textAlign: 'center'
                                            }}>
                                                <div style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto',
                                                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                                                }}>
                                                    <i className="fas fa-running" style={{ fontSize: '36px', color: '#2563eb' }}></i>
                                                </div>
                                            </div>

                                            <div style={{ padding: '25px' }}>
                                                <h4 style={{
                                                    fontSize: '22px',
                                                    fontWeight: 'bold',
                                                    color: '#1e293b',
                                                    marginBottom: '10px',
                                                    textAlign: 'center'
                                                }}>
                                                    {athlete.firstName} {athlete.lastName}
                                                </h4>

                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    gap: '10px',
                                                    marginBottom: '20px',
                                                    flexWrap: 'wrap'
                                                }}>
                                                    {athlete.nationality && (
                                                        <span style={{
                                                            backgroundColor: '#f1f5f9',
                                                            padding: '5px 12px',
                                                            borderRadius: '20px',
                                                            fontSize: '13px',
                                                            color: '#64748b'
                                                        }}>
                                                            <i className="fas fa-globe" style={{ marginRight: '5px' }}></i>
                                                            {athlete.nationality}
                                                        </span>
                                                    )}
                                                    {athlete.position && (
                                                        <span style={{
                                                            backgroundColor: '#dbeafe',
                                                            padding: '5px 12px',
                                                            borderRadius: '20px',
                                                            fontSize: '13px',
                                                            color: '#2563eb',
                                                            fontWeight: '600'
                                                        }}>
                                                            {athlete.position}
                                                        </span>
                                                    )}
                                                </div>

                                                <div style={{
                                                    borderTop: '1px solid #f1f5f9',
                                                    paddingTop: '15px'
                                                }}>
                                                    {athlete.goalsScored && (
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            marginBottom: '8px',
                                                            fontSize: '14px'
                                                        }}>
                                                            <span style={{ color: '#64748b' }}>Goals:</span>
                                                            <span style={{ fontWeight: '600', color: '#1e293b' }}>
                                                                {athlete.goalsScored}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {athlete.assists && (
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            marginBottom: '8px',
                                                            fontSize: '14px'
                                                        }}>
                                                            <span style={{ color: '#64748b' }}>Assists:</span>
                                                            <span style={{ fontWeight: '600', color: '#1e293b' }}>
                                                                {athlete.assists}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {athlete.jerseyNumber && (
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            fontSize: '14px'
                                                        }}>
                                                            <span style={{ color: '#64748b' }}>Jersey:</span>
                                                            <span style={{ fontWeight: '600', color: '#1e293b' }}>
                                                                #{athlete.jerseyNumber}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    style={{
                                                        width: '100%',
                                                        marginTop: '20px',
                                                        padding: '12px',
                                                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        fontSize: '15px',
                                                        fontWeight: '600',
                                                        cursor: 'pointer',
                                                        transition: 'transform 0.2s'
                                                    }}
                                                    onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                                                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                                >
                                                    View Profile <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredAthletes.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                    <i className="fas fa-search" style={{ fontSize: '64px', color: '#e2e8f0', marginBottom: '20px' }}></i>
                                    <h3 style={{ fontSize: '20px', color: '#64748b', marginBottom: '10px' }}>No athletes found</h3>
                                    <p style={{ color: '#94a3b8' }}>Try adjusting your filters</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </LayoutV1>
    );
};

export default AthletesPage;
