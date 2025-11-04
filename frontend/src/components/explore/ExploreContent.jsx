import { useState } from 'react';
import FilterWidget from '@/components/widgets/FilterWidget';
import Pagination from 'react-paginate';

const ExploreContent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);

    // Sample data - focused on Ahmed's classes (Person & Performance)
    const sampleResults = [
        { id: 1, title: 'Lionel Messi', type: 'athlete', subtype: 'Person', description: 'Argentine professional footballer, 8x Ballon d\'Or winner', image: 'assets/img/blog/1.jpg', sport: 'Football', nationality: 'Argentina', position: 'Forward', goals: 807 },
        { id: 2, title: 'Cristiano Ronaldo', type: 'athlete', subtype: 'Person', description: 'Portuguese footballer, 5x Champions League winner', image: 'assets/img/blog/2.jpg', sport: 'Football', nationality: 'Portugal', position: 'Forward', goals: 890 },
        { id: 3, title: 'LeBron James', type: 'athlete', subtype: 'Person', description: 'American basketball player, 4x NBA Champion', image: 'assets/img/blog/3.jpg', sport: 'Basketball', nationality: 'USA', position: 'Small Forward', points: 40000 },
        { id: 4, title: 'Pep Guardiola', type: 'coach', subtype: 'Person', description: 'Spanish football manager, Manchester City coach', image: 'assets/img/blog/4.jpg', sport: 'Football', experience: 17, titles: 35 },
        { id: 5, title: 'Carlo Ancelotti', type: 'coach', subtype: 'Person', description: 'Italian football manager, Real Madrid coach', image: 'assets/img/blog/5.jpg', sport: 'Football', experience: 28, titles: 28 },
        { id: 6, title: 'Ballon d\'Or 2023', type: 'achievement', subtype: 'Performance', description: 'Messi wins record 8th Ballon d\'Or', image: 'assets/img/blog/6.jpg', winner: 'Lionel Messi', date: '2023-10-30' },
        { id: 7, title: 'World Cup 2022', type: 'achievement', subtype: 'Performance', description: 'Argentina wins FIFA World Cup in Qatar', image: 'assets/img/blog/1.jpg', winner: 'Argentina', date: '2022-12-18' },
        { id: 8, title: 'Most Career Goals', type: 'record', subtype: 'Performance', description: 'Ronaldo holds record with 890 career goals', image: 'assets/img/blog/2.jpg', holder: 'Cristiano Ronaldo', value: 890 },
        { id: 9, title: 'Pierluigi Collina', type: 'referee', subtype: 'Person', description: 'Italian football referee, FIFA referee', image: 'assets/img/blog/3.jpg', sport: 'Football', level: 'International', matches: 200 },
        { id: 10, title: 'Rafael Nadal', type: 'athlete', subtype: 'Person', description: 'Spanish tennis player, 22 Grand Slam titles', image: 'assets/img/blog/4.jpg', sport: 'Tennis', nationality: 'Spain', grandSlams: 22 },
        { id: 11, title: 'Stephen Curry', type: 'athlete', subtype: 'Person', description: 'American basketball player, Golden State Warriors', image: 'assets/img/blog/5.jpg', sport: 'Basketball', nationality: 'USA', position: 'Point Guard', points: 23000 },
        { id: 12, title: 'NBA Championship 2023', type: 'achievement', subtype: 'Performance', description: 'Denver Nuggets win first NBA title', image: 'assets/img/blog/6.jpg', winner: 'Denver Nuggets', date: '2023-06-12' },
    ];

    const handleSearch = (event) => {
        event.preventDefault();
        // Implement search logic here
        console.log('Searching for:', searchQuery);
    };

    const handleFilterChange = (filters) => {
        setActiveFilters(filters);
        setCurrentPage(1); // Reset to first page when filters change
    };

    // Filter results based on active filters and search query
    const filteredResults = sampleResults.filter(result => {
        const matchesFilter = activeFilters.length === 0 || activeFilters.includes(result.type);
        const matchesSearch = searchQuery === '' || 
            result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            result.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentResults = filteredResults.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

    const handlePageClick = (data) => {
        const selectedPage = data.selected + 1;
        setCurrentPage(selectedPage);
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 200);
    };

    const getCategoryIcon = (type) => {
        const icons = {
            athlete: 'fas fa-running',
            coach: 'fas fa-clipboard',
            referee: 'fas fa-whistle',
            achievement: 'fas fa-trophy',
            record: 'fas fa-medal',
            person: 'fas fa-user',
            performance: 'fas fa-chart-line'
        };
        return icons[type] || 'fas fa-user-circle';
    };

    const getCategoryColor = (type) => {
        const colors = {
            athlete: '#2563eb',    // Blue
            coach: '#16a34a',      // Green
            referee: '#dc2626',    // Red
            achievement: '#f59e0b', // Amber
            record: '#8b5cf6',     // Purple
            person: '#06b6d4',     // Cyan
            performance: '#ec4899'  // Pink
        };
        return colors[type] || '#6b7280';
    };

    return (
        <>
            <div className="blog-area full-blog default-padding">
                <div className="container">
                    {/* Search Bar Section */}
                    <div className="row mb-50">
                        <div className="col-lg-12">
                            <div className="search-bar-large">
                                <form onSubmit={handleSearch}>
                                    <div className="input-group" style={{ 
                                        boxShadow: '0 5px 30px rgba(0,0,0,0.1)',
                                        borderRadius: '50px',
                                        overflow: 'hidden',
                                        backgroundColor: 'white'
                                    }}>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Search athletes, coaches, achievements, records and more..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            style={{
                                                border: 'none',
                                                padding: '25px 30px',
                                                fontSize: '18px',
                                                boxShadow: 'none'
                                            }}
                                        />
                                        <button 
                                            className="btn" 
                                            type="submit"
                                            style={{
                                                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0 45px',
                                                fontSize: '20px',
                                                transition: 'all 0.3s',
                                                cursor: 'pointer',
                                                fontWeight: '600'
                                            }}
                                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                        >
                                            <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
                                            Search
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="blog-items">
                        <div className="row">
                            {/* Sidebar */}
                            <div className="sidebar col-xl-4 col-lg-5 col-md-12 mb-md-50 mb-xs-50">
                                <aside>
                                    <FilterWidget onFilterChange={handleFilterChange} />
                                </aside>
                            </div>

                            {/* Main Content */}
                            <div className="blog-content col-xl-8 col-lg-7 col-md-12 pl-35 pl-md-15 pr-md-15 pl-xs-15 pr-xs-15">
                                {/* Results Header */}
                                <div className="results-header mb-30">
                                    <h4>
                                        {filteredResults.length} Results Found
                                        {activeFilters.length > 0 && (
                                            <span style={{ fontSize: '16px', color: '#666', marginLeft: '10px' }}>
                                                (Filtered by {activeFilters.length} {activeFilters.length === 1 ? 'category' : 'categories'})
                                            </span>
                                        )}
                                    </h4>
                                </div>

                                {/* Results Grid */}
                                <div className="row">
                                    {currentResults.length > 0 ? (
                                        currentResults.map(result => (
                                            <div className="col-lg-6 col-md-6 mb-30" key={result.id}>
                                                <div 
                                                    className="blog-style-one" 
                                                    style={{
                                                        backgroundColor: 'white',
                                                        borderRadius: '15px',
                                                        overflow: 'hidden',
                                                        boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                                                        transition: 'all 0.3s ease',
                                                        height: '100%',
                                                        border: '2px solid transparent',
                                                        cursor: 'pointer'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-8px)';
                                                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
                                                        e.currentTarget.style.borderColor = getCategoryColor(result.type);
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)';
                                                        e.currentTarget.style.borderColor = 'transparent';
                                                    }}
                                                >
                                                    <div className="thumb">
                                                        <img src={result.image} alt={result.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                                        <div className="badge" style={{
                                                            position: 'absolute',
                                                            top: '15px',
                                                            right: '15px',
                                                            backgroundColor: getCategoryColor(result.type),
                                                            color: 'white',
                                                            padding: '8px 16px',
                                                            borderRadius: '25px',
                                                            fontSize: '13px',
                                                            fontWeight: '700',
                                                            textTransform: 'capitalize',
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                            backdropFilter: 'blur(10px)'
                                                        }}>
                                                            <i className={getCategoryIcon(result.type)} style={{ marginRight: '6px' }}></i>
                                                            {result.type}
                                                        </div>
                                                    </div>
                                                    <div className="info" style={{ padding: '25px' }}>
                                                        <h4 style={{ marginBottom: '15px', fontSize: '20px' }}>
                                                            <a href="#" style={{ color: '#232323', textDecoration: 'none' }}>
                                                                {result.title}
                                                            </a>
                                                        </h4>
                                                        <p style={{ color: '#666', marginBottom: '15px', lineHeight: '1.6' }}>
                                                            {result.description}
                                                        </p>
                                                        <a 
                                                            href="#" 
                                                            className="btn-simple"
                                                            style={{
                                                                color: getCategoryColor(result.type),
                                                                textDecoration: 'none',
                                                                fontWeight: '700',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                transition: 'all 0.3s',
                                                                fontSize: '15px'
                                                            }}
                                                            onMouseOver={(e) => {
                                                                e.target.style.color = '#000';
                                                                e.target.style.transform = 'translateX(5px)';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.target.style.color = getCategoryColor(result.type);
                                                                e.target.style.transform = 'translateX(0)';
                                                            }}
                                                        >
                                                            View Details <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-lg-12">
                                            <div className="no-results text-center" style={{ padding: '60px 20px' }}>
                                                <i className="fas fa-search" style={{ fontSize: '64px', color: '#ddd', marginBottom: '20px' }}></i>
                                                <h3 style={{ marginBottom: '15px' }}>No Results Found</h3>
                                                <p style={{ color: '#666' }}>
                                                    Try adjusting your filters or search query
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="row mt-30">
                                        <div className="col-md-12 pagi-area text-center">
                                            <Pagination
                                                previousLabel={currentPage === 1 ? <i className='fas fa-ban'></i> : <i className='fas fa-angle-double-left'></i>}
                                                nextLabel={currentPage === totalPages ? <i className='fas fa-ban'></i> : <i className='fas fa-angle-double-right'></i>}
                                                breakLabel={'...'}
                                                pageCount={totalPages}
                                                marginPagesDisplayed={2}
                                                pageRangeDisplayed={5}
                                                onPageChange={handlePageClick}
                                                containerClassName={'pagination text-center'}
                                                activeClassName={'active'}
                                                pageClassName={'page-item'}
                                                pageLinkClassName={'page-link'}
                                                previousLinkClassName={'page-link'}
                                                nextLinkClassName={'page-link'}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExploreContent;
