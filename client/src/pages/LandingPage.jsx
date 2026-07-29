import Navbar from "../components/landing/Navbar";
import { Link } from "react-router-dom";
import HeroMockup from "../components/landing/HeroMockup";
import Features from "../components/landing/Features";
import TechStack from "../components/landing/TechStack";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
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
          <rect width="30" height="20" rx="4" fill="gray" />
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
    <div className="relative overflow-hidden min-h-screen bg-white dark:bg-[#111B21] dark:text-white">
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="absolute top-96 -right-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6">
        <section className="min-h-[85vh] grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium">
              Real-Time Chat Application
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold mt-6 leading-tight">
              Connect Instantly.
              <br />
              Chat Securely.
            </h1>

            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-8">
              A modern real-time messaging application built with React,
              Express, MongoDB and Socket.IO featuring live presence, typing
              indicators, profile customization, dark mode and PIN-protected
              private chats.
            </p>

            <div className="mt-10 flex gap-4">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold transition"
              >
                Get Started
              </Link>

              <a
                href="https://github.com/mxnrxjj/chatroom"
                target="_blank"
                rel="noreferrer"
                className="border px-7 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1B2A33]"
              >
                GitHub
              </a>
            </div>
          </div>
          {/* Right */}
          <div className="hidden lg:flex justify-center">
            <MascotHero />
          </div>
        </section>
        <HeroMockup />
        <Features />
        <TechStack />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
