import { useState } from 'react';

const FilterWidget = ({ onFilterChange }) => {
    const [activeFilters, setActiveFilters] = useState([]);

    const categories = [
        { id: 'competition', label: 'Competition', icon: 'fas fa-trophy' },
        { id: 'equipment', label: 'Equipment', icon: 'fas fa-tools' },
        { id: 'media', label: 'Media', icon: 'fas fa-photo-video' },
        { id: 'organization', label: 'Organization', icon: 'fas fa-building' },
        { id: 'performance', label: 'Performance', icon: 'fas fa-chart-line' },
        { id: 'person', label: 'Person', icon: 'fas fa-user' },
        { id: 'sponsorship', label: 'Sponsorship', icon: 'fas fa-handshake' },
        { id: 'sport', label: 'Sport', icon: 'fas fa-futbol' },
        { id: 'team', label: 'Team', icon: 'fas fa-users' },
        { id: 'venue', label: 'Venue', icon: 'fas fa-map-marker-alt' }
    ];

    const handleFilterToggle = (filterId) => {
        let updatedFilters;
        if (activeFilters.includes(filterId)) {
            updatedFilters = activeFilters.filter(f => f !== filterId);
        } else {
            updatedFilters = [...activeFilters, filterId];
        }
        setActiveFilters(updatedFilters);
        if (onFilterChange) {
            onFilterChange(updatedFilters);
        }
    };

    const handleClearAll = () => {
        setActiveFilters([]);
        if (onFilterChange) {
            onFilterChange([]);
        }
    };

    return (
        <>
            <div className="sidebar-item category">
                <div className="title-header">
                    <h4 className="title">Filter Categories</h4>
                    {activeFilters.length > 0 && (
                        <button 
                            className="btn-clear-filters" 
                            onClick={handleClearAll}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: '#ff4444',
                                fontSize: '14px',
                                cursor: 'pointer',
                                padding: '0',
                                textDecoration: 'underline'
                            }}
                        >
                            Clear All
                        </button>
                    )}
                </div>
                <div className="sidebar-info">
                    <ul>
                        {categories.map(category => (
                            <li key={category.id}>
                                <label 
                                    className="filter-checkbox-label"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        padding: '8px 0'
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={activeFilters.includes(category.id)}
                                        onChange={() => handleFilterToggle(category.id)}
                                        style={{ 
                                            marginRight: '12px',
                                            cursor: 'pointer',
                                            width: '18px',
                                            height: '18px',
                                            accentColor: '#ff4444'
                                        }}
                                    />
                                    <i className={category.icon} style={{ marginRight: '10px', width: '20px' }}></i>
                                    <span style={{ flex: 1 }}>{category.label}</span>
                                    {activeFilters.includes(category.id) && (
                                        <span 
                                            className="badge" 
                                            style={{ 
                                                backgroundColor: '#ff4444',
                                                color: 'white',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '11px'
                                            }}
                                        >
                                            Active
                                        </span>
                                    )}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default FilterWidget;
