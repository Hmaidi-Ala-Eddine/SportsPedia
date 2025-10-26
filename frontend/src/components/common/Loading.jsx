import { useEffect, useState } from "react";

function Loading({
  message = "Loading...",
  size = "medium",
  variant = "sports",
  fullScreen = false,
}) {
  const [currentIcon, setCurrentIcon] = useState(0);

  const sportIcons = [
    "⚽",
    "🏀",
    "🎾",
    "🏈",
    "⚾",
    "🏐",
    "🏆",
    "⛳",
    "🏓",
    "🥊",
  ];

  useEffect(() => {
    if (variant === "sports") {
      const interval = setInterval(() => {
        setCurrentIcon((prev) => (prev + 1) % sportIcons.length);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [variant]);

  const sizeClasses = {
    small: "w-12 h-12 text-2xl",
    medium: "w-20 h-20 text-4xl",
    large: "w-32 h-32 text-6xl",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-md z-50"
    : "flex items-center justify-center p-8";

  if (variant === "spinner") {
    return (
      <div className={containerClasses}>
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          {message && (
            <p className="text-gray-600 font-medium animate-pulse">{message}</p>
          )}
        </div>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={containerClasses}>
        <div className="text-center">
          <div className="loading-dots justify-center mb-4">
            <span></span>
            <span></span>
            <span></span>
          </div>
          {message && <p className="text-gray-600 font-medium">{message}</p>}
        </div>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={containerClasses}>
        <div className="text-center">
          <div
            className={`${sizeClasses[size]} mx-auto mb-4 rounded-full bg-gradient-primary animate-pulse-slow flex items-center justify-center`}
          >
            <span className="text-white text-4xl">🏆</span>
          </div>
          {message && (
            <p className="text-gray-600 font-medium animate-pulse">{message}</p>
          )}
        </div>
      </div>
    );
  }

  if (variant === "sports") {
    return (
      <div className={containerClasses}>
        <div className="text-center">
          <div
            className={`${sizeClasses[size]} mx-auto mb-6 rounded-2xl bg-gradient-animated bg-[length:400%_400%] shadow-colored-lg flex items-center justify-center animate-bounce-slow relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <span className="relative z-10 animate-float">
              {sportIcons[currentIcon]}
            </span>
          </div>
          {message && (
            <p className="text-gray-700 font-semibold text-lg mb-2 animate-pulse">
              {message}
            </p>
          )}
          <div className="flex justify-center gap-2">
            <span
              className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></span>
            <span
              className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></span>
            <span
              className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "skeleton") {
    return (
      <div className="space-y-4 p-8 animate-fade-in">
        <div className="skeleton h-12 w-3/4 mb-4"></div>
        <div className="skeleton h-8 w-full"></div>
        <div className="skeleton h-8 w-5/6"></div>
        <div className="skeleton h-8 w-4/6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="skeleton h-64 rounded-2xl"></div>
          <div className="skeleton h-64 rounded-2xl"></div>
          <div className="skeleton h-64 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={containerClasses}>
        <div className="flex items-center gap-3 glass px-6 py-4 rounded-full shadow-soft">
          <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          {message && (
            <span className="text-gray-700 font-medium">{message}</span>
          )}
        </div>
      </div>
    );
  }

  // Default: sports variant
  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div
          className={`${sizeClasses[size]} mx-auto mb-6 rounded-2xl bg-gradient-animated bg-[length:400%_400%] shadow-colored-lg flex items-center justify-center animate-bounce-slow relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <span className="relative z-10 animate-float">
            {sportIcons[currentIcon]}
          </span>
        </div>
        {message && (
          <p className="text-gray-700 font-semibold text-lg mb-2 animate-pulse">
            {message}
          </p>
        )}
        <div className="flex justify-center gap-2">
          <span
            className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></span>
          <span
            className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></span>
          <span
            className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></span>
        </div>
      </div>
    </div>
  );
}

// Export variants for easy use
export const LoadingSpinner = (props) => (
  <Loading {...props} variant="spinner" />
);
export const LoadingDots = (props) => <Loading {...props} variant="dots" />;
export const LoadingPulse = (props) => <Loading {...props} variant="pulse" />;
export const LoadingSkeleton = (props) => (
  <Loading {...props} variant="skeleton" />
);
export const LoadingMinimal = (props) => (
  <Loading {...props} variant="minimal" />
);

export default Loading;
