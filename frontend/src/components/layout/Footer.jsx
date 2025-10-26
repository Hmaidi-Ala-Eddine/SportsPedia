import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>🏆</span>
              <span>SportsPedia</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your comprehensive sports encyclopedia powered by semantic web
              technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/athletes"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Athletes
                </Link>
              </li>
              <li>
                <Link
                  to="/teams"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Teams
                </Link>
              </li>
              <li>
                <Link
                  to="/competitions"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Competitions
                </Link>
              </li>
              <li>
                <Link
                  to="/venues"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Venues
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/api"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  API Docs
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} SportsPedia. Powered by Apache Jena
            Fuseki & Semantic Web Technology.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
