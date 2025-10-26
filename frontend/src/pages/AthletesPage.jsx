import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { athleteAPI, searchAPI } from "../services/api";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import SearchBar from "../components/common/SearchBar";

function AthletesPage() {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadAthletes();
  }, []);

  const loadAthletes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await athleteAPI.getAll({ limit: 100 });
      setAthletes(response.data.athletes || []);
    } catch (err) {
      setError(err.message || "Failed to load athletes");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      loadAthletes();
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await searchAPI.search(query, { limit: 50 });
      // Filter to only show athletes
      const filtered = response.data.results.filter(
        (r) => r.type.toLowerCase() === "athlete"
      );
      setAthletes(filtered);
    } catch (err) {
      setError(err.message || "Failed to search");
    } finally {
      setLoading(false);
    }
  };

  const getFullName = (athlete) => {
    if (athlete.firstName || athlete.lastName) {
      return `${athlete.firstName || ""} ${athlete.lastName || ""}`.trim();
    }
    return athlete.name || `Athlete ${athlete.id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-700 text-white py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-4">🏃 Athletes</h1>
            <p className="text-xl text-purple-100 mb-8">
              Discover legendary athletes and rising stars
            </p>
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search athletes..."
              size="large"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container-custom py-8">
        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && athletes.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {athletes.length} Athletes Found
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {athletes.map((athlete, index) => (
                <Link
                  key={athlete.id || index}
                  to={`/athletes/${athlete.id}`}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl">
                      🏃
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                        {getFullName(athlete)}
                      </h3>
                      <div className="space-y-1">
                        {athlete.nationality && (
                          <p className="text-sm text-gray-600">
                            🌍 {athlete.nationality}
                          </p>
                        )}
                        {athlete.position && (
                          <p className="text-sm text-gray-600">
                            ⚽ Position: {athlete.position}
                          </p>
                        )}
                        {athlete.sport && (
                          <p className="text-sm text-gray-600">
                            🎯 {athlete.sport}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {athlete.goalsScored !== undefined && athlete.goalsScored > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {athlete.goalsScored}
                        </div>
                        <div className="text-xs text-gray-600">Goals</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {athlete.assists || 0}
                        </div>
                        <div className="text-xs text-gray-600">Assists</div>
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </>
        )}

        {!loading && !error && athletes.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No athletes found
            </h2>
            <p className="text-gray-600">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default AthletesPage;

