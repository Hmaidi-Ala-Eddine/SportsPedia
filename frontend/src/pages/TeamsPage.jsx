import { useState, useEffect } from "react";
import { teamAPI } from "../services/api";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await teamAPI.getAll({ limit: 100 });
      setTeams(response.data.teams || []);
    } catch (err) {
      setError(err.message || "Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-500 via-cyan-600 to-blue-700 text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">⚽ Teams</h1>
          <p className="text-xl text-blue-100">
            Explore professional and national teams
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-custom py-8">
        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && teams.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {teams.length} Teams
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team, index) => (
                <div
                  key={team.id || index}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl">
                      ⚽
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                        {team.teamName || team.id}
                      </h3>
                      <div className="space-y-1">
                        {team.foundedYear && (
                          <p className="text-sm text-gray-600">
                            Founded: {team.foundedYear}
                          </p>
                        )}
                        {team.squadSize && (
                          <p className="text-sm text-gray-600">
                            Squad: {team.squadSize} players
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

        {!loading && !error && teams.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚽</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No teams found
            </h2>
          </div>
        )}
      </section>
    </div>
  );
}

export default TeamsPage;

