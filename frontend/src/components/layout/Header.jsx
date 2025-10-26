import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SportsPedia</h1>
              <p className="text-xs text-gray-500">Sports Encyclopedia</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/athletes"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Athletes
            </Link>
            <Link
              to="/teams"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Teams
            </Link>
            <Link
              to="/competitions"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Competitions
            </Link>
            <Link
              to="/venues"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Venues
            </Link>
            <Link
              to="/sports"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Sports
            </Link>
          </nav>

          {/* Search Button */}
          <Link
            to="/search"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Search
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
