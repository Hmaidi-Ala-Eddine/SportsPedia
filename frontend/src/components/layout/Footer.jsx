function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 border-t border-purple-300 py-12 mt-auto">
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          {/* Brand */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl shadow-lg">
                🏆
              </div>
              <div>
                <h3 className="text-xl font-black text-white">SportsPedia</h3>
                <p className="text-xs text-purple-300">Semantic Sports Encyclopedia</p>
              </div>
            </div>
            <p className="text-purple-100 leading-relaxed">
              Your comprehensive sports database powered by semantic web technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
            <h4 className="text-lg font-black text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                "Athletes",
                "Teams",
                "Competitions",
                "Venues",
                "Sports",
                "Search",
              ].map((link) => (
                <li key={link}>
                  <a
                    href={`/${link.toLowerCase().replace(/\s+/g, "")}`}
                    className="text-purple-200 hover:text-white font-semibold transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    → {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
            <h4 className="text-lg font-black text-white mb-4">Powered By</h4>
            <div className="flex flex-wrap gap-2">
              {["React", "FastAPI", "SPARQL", "Fuseki"].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-full bg-white/10 backdrop-blur text-sm font-bold text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-purple-700 pt-8 text-center">
          <p className="text-purple-200 font-semibold">
            © 2024 SportsPedia. All rights reserved.
          </p>
          <p className="text-sm text-purple-300 mt-2">
            Built with ❤️ using Semantic Web Technology
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
