import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-purple-200 shadow-xl">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-3xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                🏆
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">SportsPedia</h1>
              <p className="text-xs font-bold text-purple-600">Sports Encyclopedia</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { label: "Home", path: "/" },
              { label: "Athletes", path: "/athletes" },
              { label: "Teams", path: "/teams" },
              { label: "Competitions", path: "/competitions" },
              { label: "Venues", path: "/venues" },
              { label: "Sports", path: "/sports" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-5 py-2 rounded-full font-bold text-gray-700 hover:text-white hover:bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 hover:scale-105"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Button */}
          <Link
            to="/search"
            className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-glow flex items-center gap-2 overflow-hidden"
          >
            <span className="text-xl group-hover:scale-125 transition-transform duration-300">🔍</span>
            <span className="relative z-10">Search</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
