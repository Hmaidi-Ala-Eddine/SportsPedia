import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutV1 from '@/components/layouts/LayoutV1';

// Skeleton Loader
const EquipmentSkeleton = memo(() => (
    <div className="col-lg-4 col-md-6 mb-4">
        <div style={{
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '20px',
            height: '300px'
        }}></div>
    </div>
));

EquipmentSkeleton.displayName = 'EquipmentSkeleton';

const EquipmentPage = () => {
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [equipmentType, setEquipmentType] = useState('all');
    const [sportFilter, setSportFilter] = useState('all');
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
        fetchEquipment();
    }, []);

    const fetchEquipment = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8000/api/equipment?limit=100`);
            if (response.ok) {
                const data = await response.json();
                setEquipment(data.equipment || []);
            } else {
                throw new Error('Failed to fetch equipment');
            }
        } catch (error) {
            console.error('Error fetching equipment:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Memoized filtering
    const filteredEquipment = useMemo(() => {
        return equipment.filter(item => {
            const matchesSearch = debouncedQuery === '' || 
                item.name?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                item.sport?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                item.type?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                item.manufacturer?.toLowerCase().includes(debouncedQuery.toLowerCase());
            
            const matchesType = equipmentType === 'all' || item.type === equipmentType;
            const matchesSport = sportFilter === 'all' || item.sport === sportFilter;
            
            return matchesSearch && matchesType && matchesSport;
        });
    }, [debouncedQuery, equipmentType, sportFilter, equipment]);

    const types = useMemo(() => 
        [...new Set(equipment.map(e => e.type).filter(Boolean))],
        [equipment]
    );

    const sports = useMemo(() => 
        [...new Set(equipment.map(e => e.sport).filter(Boolean))],
        [equipment]
    );

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
                    background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)',
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
                    background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
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
                            background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #0284c7 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '15px',
                            letterSpacing: '-1px'
                        }}>🏀 Sports Equipment</h1>
                        <p style={{ fontSize: '19px', color: '#64748b', fontWeight: '500' }}>
                            Explore {filteredEquipment.length} pieces of sports equipment and gear
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
                                    Search Equipment
                                </label>
                                <input 
                                    type="text"
                                    placeholder="Search by name, type, or manufacturer..."
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
                                    Equipment Type
                                </label>
                                <select 
                                    value={equipmentType}
                                    onChange={(e) => setEquipmentType(e.target.value)}
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
                                    {types.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label style={{ fontWeight: '600', marginBottom: '10px', display: 'block', color: '#1e293b' }}>
                                    Sport
                                </label>
                                <select 
                                    value={sportFilter}
                                    onChange={(e) => setSportFilter(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 18px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '10px',
                                        fontSize: '16px',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="all">All Sports</option>
                                    {sports.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Equipment Grid */}
                    {loading ? (
                        <div className="row">
                            {[...Array(6)].map((_, index) => (
                                <EquipmentSkeleton key={index} />
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
                            <h3 style={{ color: '#1e293b', marginBottom: '12px', fontSize: '24px', fontWeight: '800' }}>Unable to Load Equipment</h3>
                            <p style={{ color: '#64748b', marginBottom: '24px' }}>{error}</p>
                            <button 
                                onClick={fetchEquipment}
                                style={{
                                    background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '14px 32px',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 24px rgba(14,165,233,0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 12px 32px rgba(14,165,233,0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 8px 24px rgba(14,165,233,0.3)';
                                }}
                            >
                                <i className="fas fa-redo" style={{ marginRight: '8px' }}></i>
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="row">
                            {filteredEquipment.map((item, index) => (
                                <div key={item.id || index} className="col-lg-4 col-md-6 mb-4"
                                    style={{
                                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                    }}>
                                    <div 
                                        style={{ 
                                            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)', 
                                            borderRadius: '20px', 
                                            padding: '0',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
                                            cursor: 'pointer',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            height: '100%',
                                            border: '1px solid rgba(14,165,233,0.1)',
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                            e.currentTarget.style.boxShadow = '0 20px 60px rgba(14,165,233,0.25), inset 0 1px 0 rgba(255,255,255,1)';
                                            e.currentTarget.style.borderColor = 'rgba(14,165,233,0.3)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                            e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)';
                                            e.currentTarget.style.borderColor = 'rgba(14,165,233,0.1)';
                                        }}
                                    >
                                        {/* Gradient Header */}
                                        <div style={{
                                            background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #0284c7 100%)',
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
                                                    {item.type && (
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
                                                            {item.type}
                                                        </span>
                                                    )}
                                                    {item.isRequired && (
                                                        <div style={{
                                                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                                            padding: '6px 12px',
                                                            borderRadius: '12px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '5px',
                                                            boxShadow: '0 4px 12px rgba(239,68,68,0.4)'
                                                        }}>
                                                            <i className="fas fa-exclamation-circle" style={{ color: 'white', fontSize: '12px' }}></i>
                                                            <span style={{ color: 'white', fontWeight: '700', fontSize: '11px' }}>REQUIRED</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <h3 style={{ 
                                                    fontSize: '22px', 
                                                    fontWeight: '900', 
                                                    color: 'white',
                                                    marginBottom: '0',
                                                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                                    lineHeight: '1.3'
                                                }}>{item.name}</h3>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div style={{ padding: '25px' }}>
                                            {/* Info Grid */}
                                            <div style={{ 
                                                display: 'grid',
                                                gap: '12px'
                                            }}>
                                                {item.sport && (
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center',
                                                        padding: '12px 15px',
                                                        background: 'linear-gradient(135deg, rgba(14,165,233,0.05) 0%, rgba(6,182,212,0.05) 100%)',
                                                        borderRadius: '12px',
                                                        border: '1px solid rgba(14,165,233,0.1)'
                                                    }}>
                                                        <div style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            borderRadius: '10px',
                                                            background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginRight: '12px',
                                                            boxShadow: '0 4px 12px rgba(14,165,233,0.2)'
                                                        }}>
                                                            <i className="fas fa-running" style={{ color: 'white', fontSize: '14px' }}></i>
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginBottom: '2px' }}>SPORT</div>
                                                            <div style={{ color: '#1e293b', fontWeight: '600' }}>{item.sport}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                {item.manufacturer && (
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center',
                                                        padding: '12px 15px',
                                                        background: 'linear-gradient(135deg, rgba(6,182,212,0.05) 0%, rgba(8,145,178,0.05) 100%)',
                                                        borderRadius: '12px',
                                                        border: '1px solid rgba(6,182,212,0.1)'
                                                    }}>
                                                        <div style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            borderRadius: '10px',
                                                            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginRight: '12px',
                                                            boxShadow: '0 4px 12px rgba(6,182,212,0.2)'
                                                        }}>
                                                            <i className="fas fa-industry" style={{ color: 'white', fontSize: '14px' }}></i>
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginBottom: '2px' }}>MANUFACTURER</div>
                                                            <div style={{ color: '#1e293b', fontWeight: '600' }}>{item.manufacturer}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                {item.description && (
                                                    <div style={{ 
                                                        padding: '12px 15px',
                                                        background: 'linear-gradient(135deg, rgba(148,163,184,0.05) 0%, rgba(203,213,225,0.05) 100%)',
                                                        borderRadius: '12px',
                                                        border: '1px dashed rgba(148,163,184,0.2)'
                                                    }}>
                                                        <p style={{ 
                                                            color: '#475569', 
                                                            fontSize: '13px', 
                                                            lineHeight: '1.6',
                                                            margin: 0
                                                        }}>
                                                            {item.description.length > 100 
                                                                ? item.description.substring(0, 100) + '...' 
                                                                : item.description}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {filteredEquipment.length === 0 && !loading && (
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
                                            boxShadow: '0 10px 40px rgba(14,165,233,0.15)'
                                        }}>
                                            <i className="fas fa-search" style={{ fontSize: '48px', color: '#0ea5e9' }}></i>
                                        </div>
                                        <h3 style={{ color: '#1e293b', marginBottom: '12px', fontSize: '24px', fontWeight: '800' }}>No Equipment Found</h3>
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

export default EquipmentPage;
