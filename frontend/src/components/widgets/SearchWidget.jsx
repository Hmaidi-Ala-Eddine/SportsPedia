const SearchWidget = () => {

    const handleSearch = (event) => {
        event.preventDefault()
        event.target.reset()
    }

    return (
        <>
            <div className="sidebar-item search">
                <div className="sidebar-info">
                    <form onSubmit={handleSearch}>
                        <input type="text" placeholder="Enter Keyword" name="text" className="form-control" autoComplete='off' />
                        <button type="submit"><i className="fas fa-search"></i></button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SearchWidget;