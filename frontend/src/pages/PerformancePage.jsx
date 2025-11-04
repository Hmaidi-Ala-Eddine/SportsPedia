import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutV1 from '@/components/layouts/LayoutV1';

const PerformancePage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('achievements');
    const [achievements, setAchievements] = useState([]);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterYear, setFilterYear] = useState('');

    useEffect(() => {
        // Clear filters when switching tabs
        setSearchQuery('');
        setFilterType('');
        setFilterYear('');
        
        if (activeTab === 'achievements') fetchAchievements();
        if (activeTab === 'records') fetchRecords();
    }, [activeTab]);

    const fetchAchievements = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/performances/achievements?limit=50');
            if (response.ok) {
                const data = await response.json();
                setAchievements(data.achievements || []);
            }
        } catch (error) {
            console.error('Achievements fetch error:', error);
        }
        setLoading(false);
    };

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/performances/records?limit=50');
            if (response.ok) {
                const data = await response.json();
                setRecords(data.records || []);
            }
        } catch (error) {
            console.error('Records fetch error:', error);
        }
        setLoading(false);
    };

    // Get unique achievement types and years for filters
    const achievementTypes = [...new Set(achievements.map(a => a.achievementType).filter(Boolean))];
    const achievementYears = [...new Set(achievements.map(a => a.year).filter(Boolean))].sort((a, b) => b - a);
    const recordTypes = [...new Set(records.map(r => r.recordType).filter(Boolean))];

    // Filter achievements
    const filteredAchievements = achievements.filter(a => {
        const matchesSearch = !searchQuery || 
            a.achievementType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.achievedBy?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.year?.toString().includes(searchQuery);
        
        const matchesType = !filterType || a.achievementType === filterType;
        const matchesYear = !filterYear || a.year?.toString() === filterYear;
        
        return matchesSearch && matchesType && matchesYear;
    });

    // Filter records
    const filteredRecords = records.filter(r => {
        const matchesSearch = !searchQuery || 
            r.recordType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.achievedBy?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.performanceValue?.toString().includes(searchQuery.toLowerCase());
        
        const matchesType = !filterType || r.recordType === filterType;
        
        return matchesSearch && matchesType;
    });

    return (
        <LayoutV1>
            <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
                <div className="container">
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>
                            🏅 Performance
                        </h1>
                        <p style={{ fontSize: '18px', color: '#64748b' }}>
                            Achievements & Records in Sports
                        </p>
                    </div>

                    {/* Search and Filter Bar */}
                    <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', marginBottom: '35px' }}>
                        {/* Search Input */}
                        <div style={{ marginBottom: '20px' }}>
                            <input
                                type="text"
                                placeholder="🔍 Search by type, athlete name, year..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    border: '2px solid #e2e8f0',
                                    outline: 'none',
                                    padding: '16px 20px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    borderRadius: '12px',
                                    transition: 'all 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        {/* Filter Dropdowns */}
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-filter" style={{ color: '#64748b', fontSize: '16px' }}></i>
                                <span style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Filters:</span>
                            </div>

                            {/* Type Filter */}
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                style={{
                                    padding: '10px 16px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '10px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#1e293b',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                            >
                                <option value="">All Types</option>
                                {activeTab === 'achievements' && achievementTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                                {activeTab === 'records' && recordTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>

                            {/* Year Filter (only for achievements) */}
                            {activeTab === 'achievements' && (
                                <select
                                    value={filterYear}
                                    onChange={(e) => setFilterYear(e.target.value)}
                                    style={{
                                        padding: '10px 16px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '10px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: '#1e293b',
                                        backgroundColor: 'white',
                                        cursor: 'pointer',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="">All Years</option>
                                    {achievementYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            )}

                            {/* Clear Filters Button */}
                            {(searchQuery || filterType || filterYear) && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setFilterType('');
                                        setFilterYear('');
                                    }}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#f1f5f9',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#64748b',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseOver={(e) => e.target.style.background = '#e2e8f0'}
                                    onMouseOut={(e) => e.target.style.background = '#f1f5f9'}
                                >
                                    <i className="fas fa-times" style={{ marginRight: '6px' }}></i>
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            padding: '8px',
                            background: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            justifyContent: 'center'
                        }}>
                            <button
                                onClick={() => setActiveTab('achievements')}
                                style={{
                                    background: activeTab === 'achievements' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                                    color: activeTab === 'achievements' ? 'white' : '#64748b',
                                    border: 'none',
                                    padding: '14px 32px',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    boxShadow: activeTab === 'achievements' ? '0 2px 10px rgba(245,158,11,0.3)' : 'none'
                                }}
                                onMouseOver={(e) => {
                                    if (activeTab !== 'achievements') e.target.style.background = '#f1f5f9';
                                }}
                                onMouseOut={(e) => {
                                    if (activeTab !== 'achievements') e.target.style.background = 'transparent';
                                }}
                            >
                                <i className="fas fa-trophy" style={{ marginRight: '10px' }}></i>
                                Achievements ({filteredAchievements.length})
                            </button>

                            <button
                                onClick={() => setActiveTab('records')}
                                style={{
                                    background: activeTab === 'records' ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'transparent',
                                    color: activeTab === 'records' ? 'white' : '#64748b',
                                    border: 'none',
                                    padding: '14px 32px',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    boxShadow: activeTab === 'records' ? '0 2px 10px rgba(139,92,246,0.3)' : 'none'
                                }}
                                onMouseOver={(e) => {
                                    if (activeTab !== 'records') e.target.style.background = '#f1f5f9';
                                }}
                                onMouseOut={(e) => {
                                    if (activeTab !== 'records') e.target.style.background = 'transparent';
                                }}
                            >
                                <i className="fas fa-medal" style={{ marginRight: '10px' }}></i>
                                Records ({filteredRecords.length})
                            </button>
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#f59e0b' }}></i>
                            <p style={{ marginTop: '20px', color: '#64748b' }}>Loading...</p>
                        </div>
                    )}

                    {/* Achievements Tab */}
                    {!loading && activeTab === 'achievements' && (
                        <div>
                            <h2 style={{ fontSize: '26px', fontWeight: '600', marginBottom: '30px', color: '#1e293b' }}>
                                <i className="fas fa-trophy" style={{ marginRight: '12px', color: '#f59e0b' }}></i>
                                {filteredAchievements.length} Achievements
                            </h2>

                            {filteredAchievements.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                    <i className="fas fa-trophy" style={{ fontSize: '64px', color: '#e2e8f0', marginBottom: '20px' }}></i>
                                    <h3 style={{ fontSize: '20px', color: '#64748b' }}>No achievements found</h3>
                                </div>
                            ) : (
                                <div className="row">
                                    {filteredAchievements.map((achievement, index) => (
                                        <div key={index} className="col-lg-4 col-md-6 mb-4">
                                            <div 
                                                onClick={() => navigate(`/performance/achievement/${achievement.id}`)}
                                                style={{
                                                    background: 'linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)',
                                                    borderRadius: '20px',
                                                    padding: '30px',
                                                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                                                    transition: 'all 0.3s',
                                                    border: '2px solid #fef3c7',
                                                    cursor: 'pointer',
                                                    height: '100%'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(245,158,11,0.2)';
                                                    e.currentTarget.style.borderColor = '#f59e0b';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                                                    e.currentTarget.style.borderColor = '#fef3c7';
                                                }}>
                                                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                                    <div style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        margin: '0 auto 15px',
                                                        boxShadow: '0 8px 20px rgba(245,158,11,0.3)'
                                                    }}>
                                                        <i className="fas fa-trophy" style={{ fontSize: '36px', color: 'white' }}></i>
                                                    </div>
                                                    {achievement.year && (
                                                        <span style={{
                                                            background: '#f59e0b',
                                                            color: 'white',
                                                            padding: '5px 15px',
                                                            borderRadius: '20px',
                                                            fontSize: '14px',
                                                            fontWeight: '700'
                                                        }}>
                                                            {achievement.year}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '15px', textAlign: 'center' }}>
                                                    {achievement.achievementType || 'Achievement'}
                                                </h3>

                                                {achievement.achievedBy && (
                                                    <div style={{ borderTop: '2px solid #fef3c7', paddingTop: '15px', textAlign: 'center' }}>
                                                        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '5px' }}>Achieved by:</p>
                                                        <p style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                                                            {achievement.achievedBy}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Records Tab */}
                    {!loading && activeTab === 'records' && (
                        <div>
                            <h2 style={{ fontSize: '26px', fontWeight: '600', marginBottom: '30px', color: '#1e293b' }}>
                                <i className="fas fa-medal" style={{ marginRight: '12px', color: '#8b5cf6' }}></i>
                                {filteredRecords.length} Records
                            </h2>

                            {filteredRecords.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                    <i className="fas fa-medal" style={{ fontSize: '64px', color: '#e2e8f0', marginBottom: '20px' }}></i>
                                    <h3 style={{ fontSize: '20px', color: '#64748b' }}>No records found</h3>
                                </div>
                            ) : (
                                <div className="row">
                                    {filteredRecords.map((record, index) => (
                                        <div key={index} className="col-lg-6 col-md-6 mb-4">
                                            <div 
                                                onClick={() => navigate(`/performance/record/${record.id}`)}
                                                style={{
                                                    background: 'linear-gradient(135deg, #ffffff 0%, #f3e8ff 100%)',
                                                    borderRadius: '20px',
                                                    padding: '30px',
                                                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                                                    transition: 'all 0.3s',
                                                    border: '2px solid #e9d5ff',
                                                    cursor: 'pointer'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(139,92,246,0.2)';
                                                    e.currentTarget.style.borderColor = '#8b5cf6';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                                                    e.currentTarget.style.borderColor = '#e9d5ff';
                                                }}>
                                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                                    <div style={{
                                                        width: '70px',
                                                        height: '70px',
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginRight: '20px',
                                                        boxShadow: '0 8px 20px rgba(139,92,246,0.3)'
                                                    }}>
                                                        <i className="fas fa-medal" style={{ fontSize: '32px', color: 'white' }}></i>
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '5px' }}>
                                                            {record.recordType || 'Record'}
                                                        </h3>
                                                        {record.performanceValue && (
                                                            <span style={{
                                                                background: '#8b5cf6',
                                                                color: 'white',
                                                                padding: '4px 12px',
                                                                borderRadius: '15px',
                                                                fontSize: '13px',
                                                                fontWeight: '600'
                                                            }}>
                                                                {record.performanceValue}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {record.achievedBy && (
                                                    <div style={{ borderTop: '2px solid #e9d5ff', paddingTop: '15px' }}>
                                                        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '5px' }}>Record holder:</p>
                                                        <p style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                                                            {record.achievedBy}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </LayoutV1>
    );
};

export default PerformancePage;
