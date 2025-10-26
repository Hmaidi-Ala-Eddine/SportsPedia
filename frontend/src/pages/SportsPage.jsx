import { useState, useEffect } from "react";
import { sportAPI } from "../services/api";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

function SportsPage() {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSports();
  }, []);

  const loadSports = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await sportAPI.getAll({ limit: 100 });
      setSports(response.data.sports || []);
    } catch (err) {
      setError(err.message || "Failed to load sports");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-pink-500 via-rose-600 to-pink-700 text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">🎯 Sports</h1>
          <p className="text-xl text-pink-100">
            Browse every sport discipline
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-custom py-8">
        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && sports.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {sports.length} Sports
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sports.map((sport, index) => (
                <div
                  key={sport.id || index}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-3xl">
                      🎯
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                        {sport.sportName || sport.id}
                      </h3>
                      <div className="space-y-1">
                        {sport.isOlympic && (
                          <p className="text-sm text-amber-600 font-semibold">
                            🏅 Olympic Sport
                          </p>
                        )}
                        {sport.originCountry && (
                          <p className="text-sm text-gray-600">
                            Origin: {sport.originCountry}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && !error && sports.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No sports found
            </h2>
          </div>
        )}
      </section>
    </div>
  );
}

export default SportsPage;

