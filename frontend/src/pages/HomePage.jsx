import { Link } from "react-router-dom";

function HomePage() {
  const categories = [
    {
      title: "Athletes",
      description: "Discover legendary athletes and rising stars",
      icon: "🏃",
      link: "/athletes",
      gradient: "from-violet-500 to-purple-600",
      stats: "10,000+",
    },
    {
      title: "Teams",
      description: "Explore professional and national teams",
      icon: "⚽",
      link: "/teams",
      gradient: "from-blue-500 to-cyan-600",
      stats: "5,000+",
    },
    {
      title: "Competitions",
      description: "Follow leagues and championship events",
      icon: "🏆",
      link: "/competitions",
      gradient: "from-amber-500 to-orange-600",
      stats: "2,500+",
    },
    {
      title: "Venues",
      description: "Visit iconic stadiums worldwide",
      icon: "🏟️",
      link: "/venues",
      gradient: "from-emerald-500 to-teal-600",
      stats: "1,200+",
    },
    {
      title: "Sports",
      description: "Browse every sport discipline",
      icon: "🎯",
      link: "/sports",
      gradient: "from-pink-500 to-rose-600",
      stats: "150+",
    },
    {
      title: "Records",
      description: "Track world records and statistics",
      icon: "📊",
      link: "/records",
      gradient: "from-indigo-500 to-purple-600",
      stats: "50,000+",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 text-white py-32">
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
              <span className="text-2xl">🏆</span>
              <span className="font-semibold">
                Powered by Semantic Web Technology
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 text-white animate-scale-in">
              Welcome to
              <br />
              <span className="bg-gradient-to-r from-pink-300 to-yellow-300 bg-clip-text text-transparent">
                SportsPedia
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Your comprehensive sports encyclopedia powered by semantic web
              technology. Explore athletes, teams, and competitions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/search"
                className="btn btn-primary btn-lg px-8 py-4 text-lg"
              >
                Start Exploring →
              </Link>
              <Link
                to="/about"
                className="btn btn-secondary btn-lg px-8 py-4 text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-2">📊</div>
              <div className="text-4xl font-black text-gradient mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Sports Entities</div>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">🎯</div>
              <div className="text-4xl font-black text-gradient mb-2">10+</div>
              <div className="text-gray-600 font-medium">Main Categories</div>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">🌐</div>
              <div className="text-4xl font-black text-gradient mb-2">100%</div>
              <div className="text-gray-600 font-medium">Semantic Web</div>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">⚡</div>
              <div className="text-4xl font-black text-gradient mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gradient">
              Explore Our Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dive into our comprehensive database of sports knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                ></div>

                <div className="relative mb-6">
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-4xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                  >
                    {category.icon}
                  </div>
                </div>

                <div className="relative">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">
                    <span>{category.stats}</span>
                  </div>
                </div>

                <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <span className="text-xl">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Ready to Explore?
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-white/90">
            Start your journey through our comprehensive sports database
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-3 btn btn-lg glass px-10 py-5 text-lg border-white/30 hover:border-white"
          >
            <span>🔍</span>
            <span>Start Searching</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
