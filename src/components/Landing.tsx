import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import backgroundVideo from '../assets/AdobeStock_303072233.mp4';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState<boolean>(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 min-h-screen w-full object-cover z-0"
      >
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10"></div>

      {/* Content */}
      <div 
        className={`
          relative z-20 
          flex min-h-screen flex-col items-center justify-center 
          transition-transform duration-500 
          ${showLogin ? 'translate-x-[-25%]' : ''}
        `}
      >
        <h1 className="mb-12 text-7xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
          ATLANTIS
          <span className="block text-3xl mt-4 text-center bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text">
            SMART CITY
          </span>
        </h1>

        <div className="flex gap-6">
          <button
            onClick={() => setShowLogin(true)}
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white font-bold tracking-wider hover:scale-105 transition-all duration-300"
          >
            LOGIN
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 rounded-xl"></div>
          </button>
          
          <button
            onClick={() => navigate('/signup')}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-bold tracking-wider hover:scale-105 transition-all duration-300"
          >
            SIGN UP
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 rounded-xl"></div>
          </button>
        </div>
      </div>

      {/* Login Form */}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default Landing;