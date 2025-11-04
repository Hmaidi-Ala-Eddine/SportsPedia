import { useState } from 'react';

const FilterWidget = ({ onFilterChange }) => {
    const [activeFilters, setActiveFilters] = useState([]);

    // Updated categories for Ahmed's classes (Person & Performance)
    const categories = [
        { id: 'athlete', label: 'Athletes', icon: 'fas fa-running', color: '#2563eb', description: 'Players & competitors' },
        { id: 'coach', label: 'Coaches', icon: 'fas fa-clipboard', color: '#16a34a', description: 'Team managers & trainers' },
        { id: 'referee', label: 'Referees', icon: 'fas fa-whistle', color: '#dc2626', description: 'Match officials' },
        { id: 'achievement', label: 'Achievements', icon: 'fas fa-trophy', color: '#f59e0b', description: 'Awards & titles' },
        { id: 'record', label: 'Records', icon: 'fas fa-medal', color: '#8b5cf6', description: 'Performance records' }
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
                                            width: '20px',
                                            height: '20px',
                                            accentColor: category.color
                                        }}
                                    />
                                    <i 
                                        className={category.icon} 
                                        style={{ 
                                            marginRight: '10px', 
                                            width: '24px',
                                            color: activeFilters.includes(category.id) ? category.color : '#666',
                                            transition: 'color 0.3s'
                                        }}
                                    ></i>
                                    <span style={{ 
                                        flex: 1,
                                        fontWeight: activeFilters.includes(category.id) ? '600' : '400',
                                        color: activeFilters.includes(category.id) ? category.color : '#333'
                                    }}>
                                        {category.label}
                                    </span>
                                    {activeFilters.includes(category.id) && (
                                        <span 
                                            className="badge" 
                                            style={{ 
                                                backgroundColor: category.color,
                                                color: 'white',
                                                padding: '4px 10px',
                                                borderRadius: '15px',
                                                fontSize: '11px',
                                                fontWeight: '600'
                                            }}
                                        >
                                            ✓
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
