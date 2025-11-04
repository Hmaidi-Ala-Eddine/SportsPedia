import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LayoutV1 from '@/components/layouts/LayoutV1';

const RecordDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecordDetails();
    }, [id]);

    const fetchRecordDetails = async () => {
        setLoading(true);
        try {
            // Fetch record data via SPARQL
            const sparqlQuery = `
                PREFIX sport: <http://example.org/sports-ontology#>
                SELECT ?recordType ?recordValue ?athlete ?firstName ?lastName ?setOn ?sport ?nationality ?position
                WHERE {
                    sport:${id} a sport:Record .
                    OPTIONAL { sport:${id} sport:recordType ?recordType . }
                    OPTIONAL { sport:${id} sport:recordValue ?recordValue . }
                    OPTIONAL { sport:${id} sport:setOn ?setOn . }
                    OPTIONAL { sport:${id} sport:inSport ?sport . }
                    OPTIONAL { 
                        sport:${id} sport:setBy ?athlete .
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
                    
                    setRecord({
                        id: id,
                        recordType: result.recordType?.value,
                        recordValue: result.recordValue?.value,
                        setOn: result.setOn?.value,
                        sport: result.sport?.value,
                        setBy: result.firstName && result.lastName 
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
            console.error('Error fetching record:', error);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <LayoutV1>
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                    <div style={{ textAlign: 'center' }}>
                        <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#8b5cf6' }}></i>
                        <p style={{ marginTop: '20px', color: '#64748b', fontSize: '18px' }}>Loading Record...</p>
                    </div>
                </div>
            </LayoutV1>
        );
    }

    if (!record) {
        return (
            <LayoutV1>
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                    <div style={{ textAlign: 'center' }}>
                        <i className="fas fa-exclamation-circle" style={{ fontSize: '64px', color: '#ef4444' }}></i>
                        <h2 style={{ marginTop: '20px', color: '#1e293b' }}>Record Not Found</h2>
                        <button onClick={() => navigate('/performance')} style={{ marginTop: '20px', padding: '12px 30px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                            Back to Performance
                        </button>
                    </div>
                </div>
            </LayoutV1>
        );
    }

    return (
        <LayoutV1>
            <div style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '60px' }}>
                <div className="container">
                    {/* Back Button */}
                    <button 
                        onClick={() => navigate('/performance')}
                        style={{
                            background: 'white',
                            border: '2px solid #a78bfa',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#8b5cf6',
                            cursor: 'pointer',
                            marginBottom: '30px',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = '#8b5cf6';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = '#8b5cf6';
                        }}
                    >
                        <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
                        Back to Performance
                    </button>

                    {/* Record Hero */}
                    <div style={{
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        borderRadius: '25px',
                        padding: '60px 40px',
                        textAlign: 'center',
                        boxShadow: '0 20px 60px rgba(139,92,246,0.3)',
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
                                <i className="fas fa-medal" style={{ fontSize: '60px', color: '#8b5cf6' }}></i>
                            </div>

                            <h1 style={{ fontSize: '48px', fontWeight: '900', color: 'white', marginBottom: '20px', textShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                {record.recordType || 'Record'}
                            </h1>

                            {record.recordValue && (
                                <div style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    padding: '15px 30px',
                                    borderRadius: '25px',
                                    display: 'inline-block',
                                    marginBottom: '20px',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <span style={{ color: 'white', fontSize: '28px', fontWeight: '900' }}>{record.recordValue}</span>
                                </div>
                            )}

                            {record.setBy && (
                                <div style={{ fontSize: '24px', color: 'rgba(255,255,255,0.95)', fontWeight: '600' }}>
                                    🏅 Record held by {record.setBy}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">
                            <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
                                <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '30px', textAlign: 'center' }}>
                                    <i className="fas fa-info-circle" style={{ marginRight: '12px', color: '#8b5cf6' }}></i>
                                    Record Details
                                </h2>

                                <div style={{ display: 'grid', gap: '20px' }}>
                                    {record.recordType && (
                                        <div style={{ padding: '20px', background: '#f3e8ff', borderRadius: '12px', border: '2px solid #e9d5ff' }}>
                                            <div style={{ fontSize: '14px', color: '#6b21a8', fontWeight: '600', marginBottom: '5px' }}>Record Type:</div>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#581c87' }}>{record.recordType}</div>
                                        </div>
                                    )}

                                    {record.recordValue && (
                                        <div style={{ padding: '20px', background: '#f3e8ff', borderRadius: '12px', border: '2px solid #e9d5ff' }}>
                                            <div style={{ fontSize: '14px', color: '#6b21a8', fontWeight: '600', marginBottom: '5px' }}>Record Value:</div>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#581c87' }}>{record.recordValue}</div>
                                        </div>
                                    )}

                                    {record.setBy && (
                                        <div style={{ padding: '20px', background: '#f3e8ff', borderRadius: '12px', border: '2px solid #e9d5ff' }}>
                                            <div style={{ fontSize: '14px', color: '#6b21a8', fontWeight: '600', marginBottom: '5px' }}>Record Holder:</div>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#581c87' }}>{record.setBy}</div>
                                        </div>
                                    )}

                                    {record.setOn && (
                                        <div style={{ padding: '20px', background: '#f3e8ff', borderRadius: '12px', border: '2px solid #e9d5ff' }}>
                                            <div style={{ fontSize: '14px', color: '#6b21a8', fontWeight: '600', marginBottom: '5px' }}>Date Set:</div>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#581c87' }}>
                                                {new Date(record.setOn).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Relationship Section - Set By */}
                        {record.athleteId && (
                            <div style={{ marginTop: '40px' }}>
                                <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1e293b', marginBottom: '30px', textAlign: 'center' }}>
                                    <i className="fas fa-link" style={{ marginRight: '12px', color: '#8b5cf6' }}></i>
                                    Record Holder
                                </h2>

                                <div style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                                    <div 
                                        onClick={() => navigate(`/person/athlete/${record.athleteId}`)}
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
                                                    {record.athleteFirstName} {record.athleteLastName}
                                                </div>
                                                <div style={{ fontSize: '15px', color: '#64748b', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                                    {record.athleteNationality && (
                                                        <span>
                                                            <i className="fas fa-globe" style={{ marginRight: '6px', color: '#2563eb' }}></i>
                                                            {record.athleteNationality}
                                                        </span>
                                                    )}
                                                    {record.athletePosition && (
                                                        <span>
                                                            <i className="fas fa-futbol" style={{ marginRight: '6px', color: '#2563eb' }}></i>
                                                            {record.athletePosition}
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

export default RecordDetailPage;
