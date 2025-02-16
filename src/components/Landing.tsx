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
        style={{ filter: 'brightness(0.9)' }}
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>

      {/* Content */}
      <div 
        className={`
          relative z-20 
          flex min-h-screen flex-col items-center justify-center 
          transition-all duration-500 ease-in-out
          ${showLogin ? 'translate-x-[-25%]' : ''}
        `}
      >
        {/* Title Section */}
        <div 
          className="text-center mb-16 transform transition-all duration-500 hover:scale-105"
          style={{
            textShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)',
            animation: 'fadeIn 1.5s ease-out',
          }}
        >
          <h1 
            className="text-8xl font-extrabold tracking-widest text-white"
            style={{
              letterSpacing: '0.15em',
            }}
          >
            ATLANTIS
            <span 
              className="block text-3xl mt-6 font-light text-blue-200"
              style={{
                letterSpacing: '0.3em',
              }}
            >
              SMART CITY OF THE FUTURE
            </span>
          </h1>
        </div>

        {/* Buttons */}
        <div className="flex gap-8" style={{ animation: 'fadeIn 2s ease-out' }}>
          <button
            onClick={() => setShowLogin(true)}
            className="
              relative px-12 py-5
              text-white text-lg font-light
              rounded-full
              transition-all duration-500
              hover:scale-105
              focus:outline-none
            "
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              letterSpacing: '0.2em',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            }}
          >
            EXPLORE
          </button>
          
          <button
            onClick={() => navigate('/signup')}
            className="
              relative px-12 py-5
              text-white text-lg font-light
              rounded-full
              transition-all duration-500
              hover:scale-105
              focus:outline-none
            "
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(147, 197, 253, 0.3)',
              letterSpacing: '0.2em',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            }}
          >
            JOIN US
          </button>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          style={{ animation: 'bounce 2s infinite' }}
        >
          <div className="w-[30px] h-[50px] border-2 border-white/50 rounded-full p-2">
            <div className="w-1 h-3 bg-white/70 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Login Form */}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}

      {/* Inline Styles for Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0) translateX(-50%);
            }
            50% {
              transform: translateY(-20px) translateX(-50%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Landing;