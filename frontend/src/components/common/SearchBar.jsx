import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchAPI } from "../../services/api";

function SearchBar({
  placeholder = "Search athletes, teams, competitions...",
  onSearch,
  autoFocus = false,
  showSuggestions = true,
  size = "medium",
  className = "",
}) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Predefined suggestions (can be replaced with API calls)
  const popularSearches = [
    { icon: "🏃", text: "Lionel Messi", type: "Athlete", category: "athletes" },
    { icon: "⚽", text: "FC Barcelona", type: "Team", category: "teams" },
    { icon: "🏆", text: "UEFA Champions League", type: "Competition", category: "competitions" },
    { icon: "🏟️", text: "Camp Nou", type: "Venue", category: "venues" },
    { icon: "🏃", text: "Cristiano Ronaldo", type: "Athlete", category: "athletes" },
    { icon: "⚽", text: "Real Madrid", type: "Team", category: "teams" },
    { icon: "🏆", text: "FIFA World Cup", type: "Competition", category: "competitions" },
    { icon: "🏀", text: "NBA", type: "Competition", category: "competitions" },
    { icon: "🏃", text: "LeBron James", type: "Athlete", category: "athletes" },
    { icon: "🎾", text: "Wimbledon", type: "Competition", category: "competitions" },
  ];

  const recentSearches = [
    { icon: "🏃", text: "Serena Williams", type: "Athlete" },
    { icon: "🏆", text: "Olympics 2024", type: "Competition" },
    { icon: "⚽", text: "Manchester United", type: "Team" },
  ];

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
    };
    return icons[type?.toLowerCase()] || "🔍";
  };

  const mapTypeToCategory = (type) => {
    const mapping = {
      athlete: "athletes",
      team: "teams",
      competition: "competitions",
      venue: "venues",
      sport: "sports",
    };
    return mapping[type?.toLowerCase()];
  };

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      setSelectedIndex(-1);
      return;
    }

    // Call real API
    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await searchAPI.suggest(query, { limit: 10 });
        const suggestionsData = response.data.suggestions || [];
        
        const formatted = suggestionsData.map((item) => ({
          icon: getIconForType(item.type),
          text: item.name || item.id,
          type: item.type,
          category: mapTypeToCategory(item.type),
          id: item.id,
        }));
        
        setSuggestions(formatted);
      } catch (err) {
        console.error("Search API error:", err);
        // Fallback to filtered popular searches
        const filtered = popularSearches.filter((item) =>
          item.text.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    // Navigate to search page with the query
    navigate(`/search?q=${encodeURIComponent(suggestion.text)}`);
    setIsFocused(false);
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const sizeClasses = {
    small: "h-10 text-sm",
    medium: "h-12 text-base",
    large: "h-14 text-lg",
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative ${sizeClasses[size]} transition-all duration-300 ${
            isFocused
              ? "shadow-glow ring-2 ring-primary-500"
              : "shadow-soft hover:shadow-md"
          }`}
        >
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="text-gray-400">🔍</span>
            )}
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full ${sizeClasses[size]} pl-14 pr-28 rounded-full border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-all duration-300 bg-white font-medium`}
          />

          {/* Action Buttons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200"
                aria-label="Clear search"
              >
                <span className="text-sm">✕</span>
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={!query.trim()}
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl shadow-xl max-h-96 overflow-y-auto z-50 animate-scale-in">
          {query.trim() === "" ? (
            // Show recent and popular searches
            <div className="p-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Recent Searches
                  </h3>
                  <div className="space-y-1">
                    {recentSearches.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(item)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/50 transition-all duration-200 group"
                      >
                        <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                          {item.icon}
                        </span>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-gray-800">
                            {item.text}
                          </div>
                          <div className="text-xs text-gray-500">{item.type}</div>
                        </div>
                        <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
                  Popular Searches
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {popularSearches.slice(0, 6).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(item)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/50 transition-all duration-200 text-left group"
                    >
                      <span className="text-xl group-hover:scale-125 transition-transform duration-300">
                        {item.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">
                          {item.text}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Show search suggestions
            <div className="p-2">
              {suggestions.length > 0 ? (
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                        index === selectedIndex
                          ? "bg-primary-50 ring-2 ring-primary-200"
                          : "hover:bg-white/50"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
                          index === selectedIndex
                            ? "bg-gradient-primary shadow-colored scale-110"
                            : "bg-gray-100 group-hover:bg-gradient-primary group-hover:scale-110"
                        }`}
                      >
                        {suggestion.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-gray-800">
                          {suggestion.text}
                        </div>
                        <div className="text-xs text-gray-500">
                          {suggestion.type}
                        </div>
                      </div>
                      <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-gray-600 font-medium">No results found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try a different search term
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Search Tips */}
          {query.trim() === "" && (
            <div className="border-t border-gray-200 p-4 bg-white/30">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>💡</span>
                <span className="font-medium">
                  Tip: Try searching for athletes, teams, or competitions
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
