import { useState, useEffect } from "react";
import { venueAPI } from "../services/api";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await venueAPI.getAll({ limit: 100 });
      setVenues(response.data.venues || []);
    } catch (err) {
      setError(err.message || "Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">🏟️ Venues</h1>
          <p className="text-xl text-emerald-100">
            Visit iconic stadiums worldwide
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-custom py-8">
        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && venues.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {venues.length} Venues
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue, index) => (
                <div
                  key={venue.id || index}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-3xl">
                      🏟️
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                        {venue.venueName || venue.id}
                      </h3>
                      <div className="space-y-1">
                        {venue.capacity && (
                          <p className="text-sm text-gray-600">
                            Capacity: {venue.capacity.toLocaleString()}
                          </p>
                        )}
                        {venue.city && (
                          <p className="text-sm text-gray-600">
                            📍 {venue.city}
                            {venue.country && `, ${venue.country}`}
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

        {!loading && !error && venues.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏟️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No venues found
            </h2>
          </div>
        )}
      </section>
    </div>
  );
}

export default VenuesPage;

