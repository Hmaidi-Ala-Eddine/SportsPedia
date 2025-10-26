import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchAPI } from "../services/api";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import SearchBar from "../components/common/SearchBar";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchAPI.search(searchTerm, { limit: 50 });
      setResults(response.data.results || []);
    } catch (err) {
      setError(err.message || "Failed to search");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setSearchParams({ q: searchTerm });
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const getIconForType = (type) => {
    const icons = {
      athlete: "🏃",
      team: "⚽",
      competition: "🏆",
      venue: "🏟️",
      sport: "🎯",
      organization: "🏛️",
      equipment: "🎽",
      media: "📺",
      performance: "📊",
      sponsorship: "🤝",
    };
    return icons[type.toLowerCase()] || "🔍";
  };

  const getTypeLabel = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getDetailUrl = (type, id) => {
    const routes = {
      athlete: `/athletes/${id}`,
      team: `/teams/${id}`,
      competition: `/competitions/${id}`,
      venue: `/venues/${id}`,
      sport: `/sports/${id}`,
    };
    return routes[type.toLowerCase()] || "#";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Search Header */}
      <section className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-700 text-white py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black mb-6 text-center">
              Search SportsPedia
            </h1>
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search athletes, teams, competitions..."
              size="large"
              autoFocus
            />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container-custom py-8">
        {loading && <Loading />}
        
        {error && <ErrorMessage message={error} />}

        {!loading && !error && results.length === 0 && query && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No results found
            </h2>
            <p className="text-gray-600 mb-6">
              Try searching with different keywords
            </p>
            <SearchBar onSearch={handleSearch} size="medium" />
          </div>
        )}

        {!loading && !error && !query && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Start Your Search
            </h2>
            <p className="text-gray-600 mb-6">
              Enter a search term to explore our sports database
            </p>
            <SearchBar onSearch={handleSearch} size="medium" />
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Search Results
              </h2>
              <span className="text-gray-600">
                Found {results.length} result{results.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid gap-4">
              {results.map((result, index) => {
                const url = getDetailUrl(result.type, result.id);
                const isClickable = url !== "#";
                
                const ResultCard = isClickable ? "a" : "div";
                
                return (
                  <ResultCard
                    key={index}
                    href={isClickable ? url : undefined}
                    className={`rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                      isClickable ? "cursor-pointer hover:-translate-y-1" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl flex-shrink-0">
                        {getIconForType(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
                          {result.name || result.id}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                            {getIconForType(result.type)}
                            {getTypeLabel(result.type)}
                          </span>
                        </div>
                      </div>
                      {isClickable && (
                        <span className="text-gray-400 text-2xl">→</span>
                      )}
                    </div>
                  </ResultCard>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default SearchPage;

