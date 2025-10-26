/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          50: "#f0f4ff",
          100: "#e0eaff",
          200: "#c7d7fe",
          300: "#a4bcfd",
          400: "#8098fc",
          500: "#667eea",
          600: "#5568d3",
          700: "#4453b8",
          800: "#3a4494",
          900: "#333a78",
          950: "#1e2140",
        },
        secondary: {
          50: "#fef3f2",
          100: "#fee4e2",
          200: "#fecdca",
          300: "#fdaaa4",
          400: "#fb7970",
          500: "#f5576c",
          600: "#e12d3c",
          700: "#be2330",
          800: "#9d202d",
          900: "#82202b",
        },
        accent: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        // Sport-specific colors
        football: {
          DEFAULT: "#16a34a",
          light: "#22c55e",
          dark: "#15803d",
        },
        basketball: {
          DEFAULT: "#ea580c",
          light: "#f97316",
          dark: "#c2410c",
        },
        tennis: {
          DEFAULT: "#fbbf24",
          light: "#fcd34d",
          dark: "#f59e0b",
        },
        swimming: {
          DEFAULT: "#0ea5e9",
          light: "#38bdf8",
          dark: "#0284c7",
        },
        athletics: {
          DEFAULT: "#dc2626",
          light: "#ef4444",
          dark: "#b91c1c",
        },
        // Semantic colors
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",
        // Neutral shades
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "3rem",
      },
      boxShadow: {
        glow: "0 0 20px rgba(99, 102, 241, 0.4)",
        "glow-lg": "0 0 30px rgba(99, 102, 241, 0.6)",
        colored: "0 10px 30px -5px rgba(99, 102, 241, 0.3)",
        "colored-lg": "0 20px 40px -10px rgba(99, 102, 241, 0.4)",
        "inner-glow": "inset 0 0 20px rgba(99, 102, 241, 0.2)",
        soft: "0 2px 15px rgba(0, 0, 0, 0.08)",
        "soft-xl": "0 8px 30px rgba(0, 0, 0, 0.12)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-sport": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        "gradient-success": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        "gradient-gold": "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)",
        "gradient-hero":
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        "gradient-animated":
          "linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-in-left": "slideInLeft 0.6s ease-out",
        "slide-in-right": "slideInRight 0.6s ease-out",
        "slide-in-up": "slideInUp 0.6s ease-out",
        "slide-in-down": "slideInDown 0.6s ease-out",
        "scale-in": "scaleIn 0.4s ease-out",
        float: "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s infinite",
        "gradient-shift": "gradientShift 15s ease infinite",
        "bounce-slow": "bounce 2s infinite",
        "spin-slow": "spin 3s linear infinite",
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInUp: {
          "0%": { opacity: "0", transform: "translateY(50px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInDown: {
          "0%": { opacity: "0", transform: "translateY(-50px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      transitionDuration: {
        2000: "2000ms",
        3000: "3000ms",
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      backdropBlur: {
        xs: "2px",
      },
      scale: {
        102: "1.02",
        103: "1.03",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
      gridTemplateColumns: {
        "auto-fit": "repeat(auto-fit, minmax(280px, 1fr))",
        "auto-fill": "repeat(auto-fill, minmax(280px, 1fr))",
      },
    },
  },
  plugins: [
    // Custom plugin for glassmorphism
    function ({ addComponents }) {
      addComponents({
        ".glass": {
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(12px) saturate(180%)",
          WebkitBackdropFilter: "blur(12px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        },
        ".glass-dark": {
          background: "rgba(30, 41, 59, 0.8)",
          backdropFilter: "blur(12px) saturate(180%)",
          WebkitBackdropFilter: "blur(12px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
        },
      });
    },
    // Custom plugin for text gradients
    function ({ addUtilities }) {
      const newUtilities = {
        ".text-gradient": {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        },
        ".text-gradient-sport": {
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        },
        ".text-gradient-success": {
          background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
