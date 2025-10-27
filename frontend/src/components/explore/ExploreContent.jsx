import { useState } from 'react';
import FilterWidget from '@/components/widgets/FilterWidget';
import Pagination from 'react-paginate';

const ExploreContent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);

    // Sample data - replace with actual API call
    const sampleResults = [
        { id: 1, title: 'FIFA World Cup 2026', type: 'competition', description: 'The 2026 FIFA World Cup will be the 23rd FIFA World Cup...', image: 'assets/img/blog/1.jpg' },
        { id: 2, title: 'Nike Football Boots', type: 'equipment', description: 'Professional football boots designed for peak performance...', image: 'assets/img/blog/2.jpg' },
        { id: 3, title: 'ESPN Sports Network', type: 'media', description: 'Leading sports media and entertainment company...', image: 'assets/img/blog/3.jpg' },
        { id: 4, title: 'UEFA', type: 'organization', description: 'Union of European Football Associations...', image: 'assets/img/blog/4.jpg' },
        { id: 5, title: 'Player Statistics 2024', type: 'performance', description: 'Comprehensive performance data and analytics...', image: 'assets/img/blog/5.jpg' },
        { id: 6, title: 'Cristiano Ronaldo', type: 'person', description: 'Portuguese professional footballer...', image: 'assets/img/blog/6.jpg' },
        { id: 7, title: 'Adidas Partnership', type: 'sponsorship', description: 'Major sports sponsorship deal announced...', image: 'assets/img/blog/1.jpg' },
        { id: 8, title: 'Basketball', type: 'sport', description: 'Team sport played on a rectangular court...', image: 'assets/img/blog/2.jpg' },
        { id: 9, title: 'Real Madrid', type: 'team', description: 'Spanish professional football club...', image: 'assets/img/blog/3.jpg' },
        { id: 10, title: 'Wembley Stadium', type: 'venue', description: 'Football stadium in London, England...', image: 'assets/img/blog/4.jpg' },
        { id: 11, title: 'Olympics 2024', type: 'competition', description: 'Multi-sport event held in Paris...', image: 'assets/img/blog/5.jpg' },
        { id: 12, title: 'Manchester United', type: 'team', description: 'English professional football club...', image: 'assets/img/blog/6.jpg' },
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
            competition: 'fas fa-trophy',
            equipment: 'fas fa-tools',
            media: 'fas fa-photo-video',
            organization: 'fas fa-building',
            performance: 'fas fa-chart-line',
            person: 'fas fa-user',
            sponsorship: 'fas fa-handshake',
            sport: 'fas fa-futbol',
            team: 'fas fa-users',
            venue: 'fas fa-map-marker-alt'
        };
        return icons[type] || 'fas fa-info-circle';
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
                                            placeholder="Search for sports data, teams, players, venues and more..." 
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
                                                backgroundColor: '#ff4444',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0 40px',
                                                fontSize: '20px',
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            <i className="fas fa-search"></i>
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
                                                <div className="blog-style-one" style={{
                                                    backgroundColor: 'white',
                                                    borderRadius: '10px',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                                    height: '100%'
                                                }}>
                                                    <div className="thumb">
                                                        <img src={result.image} alt={result.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                                        <div className="badge" style={{
                                                            position: 'absolute',
                                                            top: '15px',
                                                            right: '15px',
                                                            backgroundColor: '#ff4444',
                                                            color: 'white',
                                                            padding: '5px 15px',
                                                            borderRadius: '20px',
                                                            fontSize: '12px',
                                                            fontWeight: '600',
                                                            textTransform: 'capitalize'
                                                        }}>
                                                            <i className={getCategoryIcon(result.type)} style={{ marginRight: '5px' }}></i>
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
                                                                color: '#ff4444',
                                                                textDecoration: 'none',
                                                                fontWeight: '600',
                                                                display: 'inline-flex',
                                                                alignItems: 'center'
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
