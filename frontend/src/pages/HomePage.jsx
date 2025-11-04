import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutV1 from '@/components/layouts/LayoutV1';

const HomePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const exampleQueries = [
        "show all athletes",
        "athletes from France", 
        "list coaches by experience",
        "find Messi achievements"
    ];

    const stats = [
        { icon: "fas fa-running", label: "Athletes", value: 20, color: "#2563eb" },
        { icon: "fas fa-clipboard", label: "Coaches", value: 5, color: "#16a34a" },
        { icon: "fas fa-trophy", label: "Achievements", value: 7, color: "#f59e0b" }
    ];

    return (
        <LayoutV1>
            <div style={{ 
                position: 'relative',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', 
                padding: '120px 0 80px', 
                color: 'white', 
                textAlign: 'center',
                overflow: 'hidden',
                minHeight: '90vh'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.15) 0%, transparent 50%)`,
                    pointerEvents: 'none'
                }}></div>
                
                <div style={{
                    position: 'absolute',
                    width: '400px',
                    height: '400px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    top: '-200px',
                    right: '-100px',
                    filter: 'blur(80px)'
                }}></div>
                <div style={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    bottom: '-150px',
                    left: '-100px',
                    filter: 'blur(80px)'
                }}></div>
                <div className="container">
                    <div style={{ marginBottom: '50px' }}>
                        <h1 style={{ 
                            fontSize: '72px', 
                            fontWeight: '900', 
                            marginBottom: '25px',
                            color: 'white',
                            textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
                            letterSpacing: '-2px'
                        }}>🏆 SportsPedia</h1>
                        <h2 style={{ 
                            fontSize: '28px', 
                            marginBottom: '15px', 
                            color: 'white',
                            fontWeight: '400',
                            letterSpacing: '1px',
                            textShadow: '0 2px 10px rgba(0,0,0,0.4)'
                        }}>AI-Powered Sports Knowledge Graph</h2>
                        <p style={{ 
                            fontSize: '18px', 
                            color: 'rgba(255,255,255,0.95)',
                            maxWidth: '600px',
                            margin: '0 auto',
                            lineHeight: '1.8',
                            textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                        }}>Search 20 athletes, 5 coaches, and 7+ achievements using natural language</p>
                    </div>

                    <form onSubmit={handleSearch}>
                        <div style={{ 
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '60px', 
                            padding: '10px', 
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.3)', 
                            display: 'flex', 
                            maxWidth: '900px', 
                            margin: '0 auto',
                            transition: 'all 0.3s ease',
                            border: '2px solid rgba(255,255,255,0.2)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 30px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.5)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.3)';
                        }}>
                            <input type="text" placeholder="✨ Ask anything... 'show athletes from France'" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', padding: '22px 35px', fontSize: '19px', color: '#1e293b', backgroundColor: 'transparent', fontWeight: '500' }} />
                            <button type="submit" style={{ 
                                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', 
                                color: 'white', 
                                border: 'none', 
                                padding: '20px 45px', 
                                borderRadius: '50px', 
                                fontSize: '18px', 
                                fontWeight: '700', 
                                cursor: 'pointer',
                                boxShadow: '0 10px 30px rgba(37,99,235,0.4)',
                                transition: 'all 0.3s ease',
                                letterSpacing: '0.5px'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                                e.target.style.boxShadow = '0 15px 40px rgba(37,99,235,0.6)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = '0 10px 30px rgba(37,99,235,0.4)';
                            }}>
                                <i className="fas fa-magic" style={{ marginRight: '10px' }}></i>AI Search
                            </button>
                        </div>
                    </form>

                    <div style={{ marginTop: '40px' }}>
                        <p style={{ opacity: 0.9, marginBottom: '20px', fontSize: '16px', fontWeight: '500' }}>🔥 Popular Searches:</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {exampleQueries.map((query, index) => (
                                <button key={index} onClick={() => { setSearchQuery(query); navigate(`/search?q=${encodeURIComponent(query)}`); }} style={{ 
                                    background: 'rgba(255,255,255,0.15)', 
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.3)', 
                                    padding: '10px 20px', 
                                    borderRadius: '25px', 
                                    color: 'white', 
                                    cursor: 'pointer', 
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.background = 'rgba(255,255,255,0.3)';
                                    e.target.style.transform = 'translateY(-3px)';
                                    e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.background = 'rgba(255,255,255,0.15)';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                                }}>
                                    {query}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ padding: '80px 0', backgroundColor: '#f8fafc' }}>
                <div className="container">
                    <div className="row">
                        {stats.map((stat, index) => (
                            <div key={index} className="col-lg-4 col-md-6 mb-30">
                                <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                    <i className={stat.icon} style={{ fontSize: '48px', color: stat.color, marginBottom: '20px' }}></i>
                                    <h3 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>{stat.value}</h3>
                                    <p style={{ fontSize: '18px', color: '#64748b' }}>{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ padding: '80px 0' }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '20px', color: '#1e293b' }}>Natural Language Search</h2>
                            <p style={{ fontSize: '18px', color: '#64748b', lineHeight: '1.8', marginBottom: '30px' }}>Search using plain English. Our AI-powered system converts your questions into SPARQL queries and retrieves accurate results from our sports knowledge graph.</p>
                            <button onClick={() => navigate('/search')} style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: 'white', border: 'none', padding: '15px 35px', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                                Try it Now →
                            </button>
                        </div>
                        <div className="col-lg-6">
                            <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px', color: '#fff', fontFamily: 'monospace' }}>
                                <div style={{ color: '#10b981', marginBottom: '10px' }}>// Natural Language</div>
                                <div style={{ color: '#60a5fa' }}>"show athletes from France"</div>
                                <div style={{ color: '#10b981', margin: '20px 0' }}>// Converts to SPARQL</div>
                                <div style={{ color: '#fbbf24' }}>SELECT ?athlete ?name</div>
                                <div style={{ color: '#fbbf24' }}>WHERE &#123;</div>
                                <div style={{ color: '#fbbf24', paddingLeft: '20px' }}>?athlete a sport:Athlete .</div>
                                <div style={{ color: '#fbbf24', paddingLeft: '20px' }}>?athlete sport:nationality "France" .</div>
                                <div style={{ color: '#fbbf24' }}>&#125;</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutV1>
    );
};

export default HomePage;
