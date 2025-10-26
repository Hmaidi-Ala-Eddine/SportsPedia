import { useState, useEffect } from "react";
import { competitionAPI } from "../services/api";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

function CompetitionsPage() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCompetitions();
  }, []);

  const loadCompetitions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await competitionAPI.getAll({ limit: 100 });
      setCompetitions(response.data.competitions || []);
    } catch (err) {
      setError(err.message || "Failed to load competitions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-amber-500 via-orange-600 to-amber-700 text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">🏆 Competitions</h1>
          <p className="text-xl text-amber-100">
            Follow leagues and championship events
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-custom py-8">
        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && competitions.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {competitions.length} Competitions
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {competitions.map((competition, index) => (
                <div
                  key={competition.id || index}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-3xl">
                      🏆
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                        {competition.competitionName || competition.id}
                      </h3>
                      <div className="space-y-1">
                        {competition.season && (
                          <p className="text-sm text-gray-600">
                            Season: {competition.season}
                          </p>
                        )}
                        {competition.numberOfTeams && (
                          <p className="text-sm text-gray-600">
                            Teams: {competition.numberOfTeams}
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

        {!loading && !error && competitions.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No competitions found
            </h2>
          </div>
        )}
      </section>
    </div>
  );
}

export default CompetitionsPage;

