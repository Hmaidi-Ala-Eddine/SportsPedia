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
      color: "rgba(139, 92, 246, 0.1)",
    },
    {
      title: "Teams",
      description: "Explore professional and national teams",
      icon: "⚽",
      link: "/teams",
      gradient: "from-blue-500 to-cyan-600",
      stats: "5,000+",
      color: "rgba(59, 130, 246, 0.1)",
    },
    {
      title: "Competitions",
      description: "Follow leagues and championship events",
      icon: "🏆",
      link: "/competitions",
      gradient: "from-amber-500 to-orange-600",
      stats: "2,500+",
      color: "rgba(245, 158, 11, 0.1)",
    },
    {
      title: "Venues",
      description: "Visit iconic stadiums worldwide",
      icon: "🏟️",
      link: "/venues",
      gradient: "from-emerald-500 to-teal-600",
      stats: "1,200+",
      color: "rgba(16, 185, 129, 0.1)",
    },
    {
      title: "Sports",
      description: "Browse every sport discipline",
      icon: "🎯",
      link: "/sports",
      gradient: "from-pink-500 to-rose-600",
      stats: "150+",
      color: "rgba(236, 72, 153, 0.1)",
    },
    {
      title: "Records",
      description: "Track world records and statistics",
      icon: "📊",
      link: "/search",
      gradient: "from-indigo-500 to-purple-600",
      stats: "50,000+",
      color: "rgba(99, 102, 241, 0.1)",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section with Gradient Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-16 bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/20 backdrop-blur-lg border-2 border-white/30 mb-8 animate-fade-in shadow-glow">
              <span className="text-3xl animate-bounce">🚀</span>
              <span className="font-bold text-white text-lg drop-shadow-lg">
                Powered by Semantic Web Technology
              </span>
              <span className="text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>🌟</span>
            </div>

            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl font-black mb-6 text-white drop-shadow-2xl animate-scale-in leading-tight">
              Welcome to
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent animate-pulse inline-block">
                SportsPedia
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed font-semibold drop-shadow-lg animate-slide-up">
              Your comprehensive sports encyclopedia powered by semantic web technology.
              <br />
              <span className="text-lg text-white/90">Explore athletes, teams, and competitions with intelligent search.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <Link
                to="/search"
                className="group relative px-10 py-5 bg-white text-purple-700 rounded-2xl font-black text-xl shadow-2xl hover:shadow-glow transition-all duration-300 hover:scale-110 transform overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Start Exploring
                  <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></span>
              </Link>
              <Link
                to="/athletes"
                className="group px-10 py-5 bg-white/20 backdrop-blur-lg border-3 border-white/40 text-white rounded-2xl font-black text-xl hover:bg-white/30 transition-all duration-300 hover:scale-110 transform shadow-2xl flex items-center gap-3"
              >
                <span className="text-2xl">📚</span>
                Learn More
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up" style={{animationDelay: '0.4s'}}>
              {[
                { icon: "📊", value: "50K+", label: "Sports Entities" },
                { icon: "🎯", value: "10+", label: "Main Categories" },
                { icon: "🌐", value: "100%", label: "Semantic Web" },
                { icon: "⚡", value: "24/7", label: "Available" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-lg border-2 border-white/30 rounded-3xl p-6 hover:scale-110 hover:bg-white/30 transition-all duration-300 shadow-2xl hover:shadow-glow cursor-pointer group"
                >
                  <div className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                    {stat.value}
                  </div>
                  <div className="text-purple-100 font-bold text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative py-24 bg-gradient-to-b from-purple-50 to-blue-50">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-gray-900">
              Explore Our
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> Categories</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto glass rounded-full px-8 py-4 inline-block shadow-lg font-semibold">
              Dive into our comprehensive database of sports knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl hover:shadow-2xl transition-all duration-500 animate-slide-up border-2 border-gray-100 hover:border-purple-300"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>

                {/* Content */}
                <div className="relative">
                  {/* Icon */}
                  <div className="mb-6 flex items-center justify-between">
                    <div
                      className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-4xl shadow-2xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`}
                    >
                      {category.icon}
                    </div>
                    <div className="text-3xl text-purple-600 group-hover:translate-x-2 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                      →
                    </div>
                  </div>

                  {/* Text */}
                  <h3 className="text-3xl font-black mb-4 text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-lg font-medium">
                    {category.description}
                  </p>
                  <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
                    <span>📈</span>
                    <span>{category.stats}</span>
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500">
        <div className="container-custom text-center">
          <div className="glass rounded-[3rem] p-16 max-w-4xl mx-auto shadow-2xl animate-pulse border-2 border-white/20">
            <div className="text-7xl mb-6 animate-float">🚀</div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 text-white drop-shadow-2xl">
              Ready to Explore?
            </h2>
            <p className="text-2xl md:text-3xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed font-semibold">
              Start your journey through our comprehensive sports database
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-4 btn btn-lg px-12 py-6 text-xl bg-white text-purple-700 shadow-2xl hover:scale-110 transition-all duration-300 border-0 font-black rounded-full hover:shadow-glow"
            >
              <span className="text-3xl">🔍</span>
              <span>Start Searching Now</span>
              <span className="text-3xl animate-bounce">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
