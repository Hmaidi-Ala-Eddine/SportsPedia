import { useState, useEffect } from 'react';
import LayoutV1 from '@/components/layouts/LayoutV1';

const CoachesPage = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCoaches();
    }, []);

    const fetchCoaches = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/persons/coaches?limit=20');
            if (response.ok) {
                const data = await response.json();
                setCoaches(data.coaches || []);
            }
        } catch (error) {
            console.error('Error fetching coaches:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCoaches = coaches.filter(coach =>
        !searchTerm || `${coach.firstName} ${coach.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <LayoutV1>
            <div style={{ padding: '60px 0', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
                <div className="container">
                    <div style={{ marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>
                            <i className="fas fa-clipboard" style={{ color: '#16a34a', marginRight: '15px' }}></i>
                            Coaches
                        </h1>
                        <p style={{ fontSize: '18px', color: '#64748b' }}>Meet the masterminds behind championship teams</p>
                    </div>

                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '40px' }}>
                        <input
                            type="text"
                            placeholder="Search coaches by name..."
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
                            onFocus={(e) => e.target.style.borderColor = '#16a34a'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#16a34a' }}></i>
                            <p style={{ marginTop: '20px', color: '#64748b' }}>Loading coaches...</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ fontSize: '20px', color: '#64748b' }}>
                                    {filteredCoaches.length} Coaches Found
                                </h3>
                            </div>

                            <div className="row">
                                {filteredCoaches.map((coach, index) => (
                                    <div key={index} className="col-lg-12 mb-30">
                                        <div
                                            style={{
                                                backgroundColor: 'white',
                                                borderRadius: '15px',
                                                padding: '30px',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                                                transition: 'all 0.3s',
                                                border: '2px solid transparent',
                                                cursor: 'pointer'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = '0 12px 35px rgba(22,163,74,0.15)';
                                                e.currentTarget.style.borderColor = '#16a34a';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                                                e.currentTarget.style.borderColor = 'transparent';
                                            }}
                                        >
                                            <div className="row align-items-center">
                                                <div className="col-lg-2 col-md-3 text-center mb-3 mb-md-0">
                                                    <div style={{
                                                        width: '100px',
                                                        height: '100px',
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        margin: '0 auto',
                                                        boxShadow: '0 8px 20px rgba(22,163,74,0.2)'
                                                    }}>
                                                        <i className="fas fa-clipboard" style={{ fontSize: '42px', color: 'white' }}></i>
                                                    </div>
                                                </div>

                                                <div className="col-lg-7 col-md-6">
                                                    <h3 style={{
                                                        fontSize: '26px',
                                                        fontWeight: 'bold',
                                                        color: '#1e293b',
                                                        marginBottom: '10px'
                                                    }}>
                                                        {coach.firstName} {coach.lastName}
                                                    </h3>
                                                    
                                                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
                                                        {coach.experienceYears && (
                                                            <span style={{
                                                                backgroundColor: '#dcfce7',
                                                                color: '#16a34a',
                                                                padding: '6px 14px',
                                                                borderRadius: '20px',
                                                                fontSize: '14px',
                                                                fontWeight: '600'
                                                            }}>
                                                                <i className="fas fa-calendar" style={{ marginRight: '6px' }}></i>
                                                                {coach.experienceYears} years exp
                                                            </span>
                                                        )}
                                                        {coach.titlesWon && (
                                                            <span style={{
                                                                backgroundColor: '#fef3c7',
                                                                color: '#d97706',
                                                                padding: '6px 14px',
                                                                borderRadius: '20px',
                                                                fontSize: '14px',
                                                                fontWeight: '600'
                                                            }}>
                                                                <i className="fas fa-trophy" style={{ marginRight: '6px' }}></i>
                                                                {coach.titlesWon} titles
                                                            </span>
                                                        )}
                                                        {coach.nationality && (
                                                            <span style={{
                                                                backgroundColor: '#f1f5f9',
                                                                color: '#64748b',
                                                                padding: '6px 14px',
                                                                borderRadius: '20px',
                                                                fontSize: '14px'
                                                            }}>
                                                                <i className="fas fa-globe" style={{ marginRight: '6px' }}></i>
                                                                {coach.nationality}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {coach.coachingStyle && (
                                                        <p style={{ color: '#64748b', marginBottom: '0', fontSize: '15px' }}>
                                                            <strong style={{ color: '#1e293b' }}>Style:</strong> {coach.coachingStyle}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="col-lg-3 col-md-3 text-center text-md-end mt-3 mt-md-0">
                                                    <button
                                                        style={{
                                                            padding: '12px 28px',
                                                            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            fontSize: '15px',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                            transition: 'transform 0.2s'
                                                        }}
                                                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredCoaches.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                    <i className="fas fa-search" style={{ fontSize: '64px', color: '#e2e8f0', marginBottom: '20px' }}></i>
                                    <h3 style={{ fontSize: '20px', color: '#64748b', marginBottom: '10px' }}>No coaches found</h3>
                                    <p style={{ color: '#94a3b8' }}>Try a different search term</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </LayoutV1>
    );
};

export default CoachesPage;
