import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutV1 from '@/components/layouts/LayoutV1';

// Skeleton Loader
const OrgSkeleton = memo(() => (
    <div className="col-lg-4 col-md-6 mb-4">
        <div style={{
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '20px',
            height: '360px'
        }}></div>
    </div>
));

OrgSkeleton.displayName = 'OrgSkeleton';

const OrganizationsPage = () => {
    const navigate = useNavigate();
    const [organizations, setOrganizations] = useState([]);
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
        fetchOrganizations();
    }, []);

    const fetchOrganizations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8000/api/organizations?limit=100');
            if (response.ok) {
                const data = await response.json();
                setOrganizations(data.organizations || []);
            } else {
                throw new Error('Failed to fetch organizations');
            }
        } catch (error) {
            console.error('Error fetching organizations:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const filteredOrgs = useMemo(() => {
        return organizations.filter(org => {
            const matchesSearch = debouncedQuery === '' || 
                org.organizationName?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                org.name?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                org.headquarters?.toLowerCase().includes(debouncedQuery.toLowerCase());
            
            const matchesType = selectedType === 'all' || org.organization_type === selectedType;
            
            return matchesSearch && matchesType;
        });
    }, [debouncedQuery, selectedType, organizations]);

    const types = useMemo(() => 
        [...new Set(organizations.map(o => o.organization_type).filter(Boolean))],
        [organizations]
    );

    const handleCardClick = useCallback((id) => {
        navigate(`/organizations/${id}`);
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
                    background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)',
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
                    background: 'radial-gradient(circle, rgba(8,145,178,0.08) 0%, transparent 70%)',
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
                            background: 'linear-gradient(135deg, #14b8a6 0%, #0891b2 50%, #0e7490 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '15px',
                            letterSpacing: '-1px'
                        }}>🏢 Organizations</h1>
                        <p style={{ fontSize: '19px', color: '#64748b', fontWeight: '500' }}>
                            Explore {filteredOrgs.length} governing bodies and organizations
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
                                <label style={{ fontWeight: '600', marginBottom: '10px', display: 'block', color: '#1e293b' }}>
                                    Search Organizations
                                </label>
                                <input 
                                    type="text"
                                    placeholder="Search by name or headquarters..."
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
                            <div className="col-md-6 mb-3">
                                <label style={{ fontWeight: '600', marginBottom: '10px', display: 'block', color: '#1e293b' }}>
                                    Organization Type
                                </label>
                                <select 
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 18px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '10px',
                                        fontSize: '16px',
                                        outline: 'none'
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

                    {loading ? (
                        <div className="row">
                            {[...Array(6)].map((_, index) => (
                                <OrgSkeleton key={index} />
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
                            <h3 style={{ color: '#1e293b', marginBottom: '12px', fontSize: '24px', fontWeight: '800' }}>Unable to Load Organizations</h3>
                            <p style={{ color: '#64748b', marginBottom: '24px' }}>{error}</p>
                            <button 
                                onClick={fetchOrganizations}
                                style={{
                                    background: 'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '14px 32px',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 24px rgba(20,184,166,0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 12px 32px rgba(20,184,166,0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 8px 24px rgba(20,184,166,0.3)';
                                }}
                            >
                                <i className="fas fa-redo" style={{ marginRight: '8px' }}></i>
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="row">
                            {filteredOrgs.map((org, index) => (
                                <div key={org.id || index} className="col-lg-4 col-md-6 mb-4"
                                    style={{
                                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                    }}>
                                    <div 
                                        onClick={() => handleCardClick(org.id)}
                                        style={{ 
                                            background: 'linear-gradient(145deg, #ffffff 0%, #f0fdfa 100%)', 
                                            borderRadius: '20px', 
                                            padding: '0',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
                                            cursor: 'pointer',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            height: '100%',
                                            border: '1px solid rgba(20,184,166,0.1)',
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                            e.currentTarget.style.boxShadow = '0 20px 60px rgba(20,184,166,0.25), inset 0 1px 0 rgba(255,255,255,1)';
                                            e.currentTarget.style.borderColor = 'rgba(20,184,166,0.3)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                            e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)';
                                            e.currentTarget.style.borderColor = 'rgba(20,184,166,0.1)';
                                        }}
                                    >
                                        {/* Teal Gradient Header */}
                                        <div style={{
                                            background: 'linear-gradient(135deg, #14b8a6 0%, #0891b2 50%, #0e7490 100%)',
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
                                                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                                                borderRadius: '50%'
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
                                                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                                                    }}>
                                                        <i className="fas fa-building" style={{ color: 'white', fontSize: '22px' }}></i>
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
                                                        {org.organization_type || 'Organization'}
                                                    </span>
                                                </div>
                                                <h3 style={{ 
                                                    fontSize: '22px', 
                                                    fontWeight: '900', 
                                                    color: 'white',
                                                    marginBottom: '0',
                                                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                                    lineHeight: '1.3'
                                                }}>{org.name || org.organizationName || 'Unnamed Organization'}</h3>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div style={{ padding: '25px' }}>
                                            <div style={{ display: 'grid', gap: '12px' }}>
                                                {org.headquarters && (
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center',
                                                        padding: '12px 15px',
                                                        background: 'linear-gradient(135deg, rgba(20,184,166,0.05) 0%, rgba(8,145,178,0.05) 100%)',
                                                        borderRadius: '12px',
                                                        border: '1px solid rgba(20,184,166,0.1)'
                                                    }}>
                                                        <div style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            borderRadius: '10px',
                                                            background: 'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginRight: '12px',
                                                            boxShadow: '0 4px 12px rgba(20,184,166,0.2)'
                                                        }}>
                                                            <i className="fas fa-map-marker-alt" style={{ color: 'white', fontSize: '14px' }}></i>
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginBottom: '2px' }}>HEADQUARTERS</div>
                                                            <div style={{ color: '#1e293b', fontWeight: '600' }}>{org.headquarters}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                {org.establishedYear && (
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
                                                            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginBottom: '2px' }}>ESTABLISHED</div>
                                                            <div style={{ color: '#1e293b', fontWeight: '600' }}>{org.establishedYear}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                {org.memberCount && (
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center',
                                                        padding: '12px 15px',
                                                        background: 'linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(124,58,237,0.05) 100%)',
                                                        borderRadius: '12px',
                                                        border: '1px solid rgba(139,92,246,0.1)'
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
                                                            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginBottom: '2px' }}>MEMBERS</div>
                                                            <div style={{ color: '#1e293b', fontWeight: '600' }}>{org.memberCount.toLocaleString()} Members</div>
                                                        </div>
                                                    </div>
                                                )}
                                                {org.president && (
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center',
                                                        padding: '12px 15px',
                                                        background: 'linear-gradient(135deg, rgba(245,158,11,0.05) 0%, rgba(234,88,12,0.05) 100%)',
                                                        borderRadius: '12px',
                                                        border: '1px solid rgba(245,158,11,0.1)'
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
                                                            <i className="fas fa-user-tie" style={{ color: 'white', fontSize: '14px' }}></i>
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginBottom: '2px' }}>PRESIDENT</div>
                                                            <div style={{ color: '#1e293b', fontWeight: '600' }}>{org.president}</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredOrgs.length === 0 && !loading && (
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
                                            background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 24px',
                                            boxShadow: '0 10px 40px rgba(20,184,166,0.15)'
                                        }}>
                                            <i className="fas fa-search" style={{ fontSize: '48px', color: '#14b8a6' }}></i>
                                        </div>
                                        <h3 style={{ color: '#1e293b', marginBottom: '12px', fontSize: '24px', fontWeight: '800' }}>No Organizations Found</h3>
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

export default OrganizationsPage;
