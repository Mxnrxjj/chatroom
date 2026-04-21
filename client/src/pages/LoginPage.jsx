import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../api/auth";
import socket from "../socket/socket";
import { useAuth } from "../context/AuthContext";
import { setAuth } from "../utils/auth";
import {
  Mail,
  Lock,
  User,
  MessageSquare,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

const App = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    if (isLogin) {
      try {
        const res = await loginUser(formData);

        if (res?.token) {
          // Store token in localStorage and update auth context
          // Very important tp set both auth and user context to ensure the app recognizes the logged-in state
          setAuth(res);
          setUser(res);
          console.log("Login successful, token stored:", res.token);

          // Connect socket after successful login
          socket.auth = {
            token: res.token,
          };
          if (!socket.connected) {
            socket.connect();
          }

          // Navigate to chat page
          navigate("/chat");
        }
      } catch (error) {
        console.error("Login error:", error);
      }
    } else {
      try {
        await registerUser(formData);

        alert("Registration successful! Please login.");
        setIsLogin(true);
      } catch (error) {
        console.error("Register error:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // SVG Pigeon Mascot Component
  const MascotHero = () => (
    <div className="relative w-64 h-64 md:w-80 md:h-80 animate-bob">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
        {/* Legs */}
        <line
          x1="85"
          y1="150"
          x2="80"
          y2="170"
          stroke="#f97316"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="115"
          y1="150"
          x2="120"
          y2="170"
          stroke="#f97316"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Tail */}
        <path d="M40 120 Q30 130 20 120 L30 100 Z" fill="#94a3b8" />

        {/* Body */}
        <ellipse cx="100" cy="115" rx="60" ry="45" fill="#cbd5e1" />
        <path d="M40 115 Q40 70 100 70 Q160 70 160 115 Z" fill="#e2e8f0" />

        {/* Iridescent Neck Gradient */}
        <defs>
          <linearGradient id="neckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Head & Neck */}
        <path
          d="M120 115 Q140 115 140 70 Q140 40 115 40 Q90 40 90 70 L100 115 Z"
          fill="#94a3b8"
        />
        <rect
          x="110"
          y="65"
          width="30"
          height="15"
          fill="url(#neckGrad)"
          opacity="0.6"
        />

        {/* Eye */}
        <circle cx="125" cy="55" r="5" fill="white" />
        <circle cx="127" cy="55" r="2.5" fill="black" />

        {/* Beak */}
        <path d="M140 60 L155 65 L140 70 Z" fill="#fde047" />

        {/* Wing */}
        <path
          d="M60 110 Q80 80 130 110 Q110 140 60 110"
          fill="#94a3b8"
          stroke="#f8fafc"
          strokeWidth="2"
        />

        {/* Message Icon near beak (Delivery vibe) */}
        <g transform="translate(155, 45) scale(0.6)" className="animate-pulse">
          <rect width="30" height="20" rx="4" fill="white" />
          <path
            d="M0 0 L15 10 L30 0"
            fill="none"
            stroke="#2dd4bf"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 font-sans selection:bg-teal-200">
      {/* Left Section (60%) - Hero & Branding */}
      <div className="w-full md:w-[60%] bg-gradient-to-br from-teal-500 to-blue-600 flex flex-col items-center justify-center p-8 md:p-12 relative overflow-hidden">
        {/* Decorative Background Circles */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-400/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <MascotHero />

          <div className="mt-8 space-y-4 max-w-md">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md border border-white/30">
                <MessageSquare className="text-white w-8 h-8" />
              </div>
              <h1 className="text-5xl font-black text-white tracking-tighter">
                Pigeon
              </h1>
            </div>
            <h2 className="text-2xl font-semibold text-teal-50">
              Fast. Light. Everywhere.
            </h2>
            <p className="text-teal-100 text-lg">
              The world's most agile messaging platform. Deliver your thoughts
              instantly across the globe.
            </p>
          </div>

          <div className="mt-12 flex gap-4">
            <div className="flex -space-x-3 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-teal-500 bg-teal-200 flex items-center justify-center text-teal-700 font-bold text-xs border border-white/20"
                >
                  {String.fromCharCode(80 + i)}
                </div>
              ))}
            </div>
            <p className="text-teal-50 text-sm mt-2 font-medium">
              Flying with 10k+ friends
            </p>
          </div>
        </div>
      </div>

      {/* Right Section (40%) - Form */}
      <div className="w-full md:w-[40%] flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
              {isLogin ? "Welcome Back!" : "Join the Flock"}
            </h3>
            <p className="text-slate-500 mt-2">
              {isLogin
                ? "Sign in to check your nest"
                : "Create an account to start messaging"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    name="username"
                    required
                    placeholder="pigeon_traveler"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@pigeon.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                  Lost your key?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-teal-200 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLogin ? "Sign In" : "Start Flying"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              {/* <span className="px-2 bg-white text-slate-500 uppercase font-bold tracking-wider text-[10px]">
                Or continue with
              </span> */}
            </div>
          </div>
          {/*       <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700">
              <Chrome className="w-5 h-5 text-red-500" /> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700">
              <Github className="w-5 h-5 text-slate-900" /> GitHub
            </button>
          </div> */}

          <p className="text-center text-slate-600 font-medium">
            {isLogin ? "Not a Pigeon yet?" : "Already part of the nest?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-teal-600 hover:text-teal-700 font-bold transition-colors underline decoration-teal-200 underline-offset-4"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(-2deg); }
          75% { transform: translateY(-5px) rotate(2deg); }
        }
        .animate-bob {
          animation: bob 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
