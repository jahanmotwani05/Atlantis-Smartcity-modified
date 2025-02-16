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
            animation: 'fadeIn 1.5s ease-out',
          }}
        >
          {/* Main Title */}
          <div className="relative">
            <h1 
              style={{
                fontFamily: 'Poiret One, cursive',
                fontSize: 'clamp(5rem, 15vw, 9rem)',
                letterSpacing: '0.1em',
                fontWeight: '400',
                lineHeight: '1',
                background: 'linear-gradient(to right, #fff, #a5f3fc, #fff)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 0 40px rgba(255, 255, 255, 0.3)',
                transform: 'translateZ(0)',  // For better text rendering
              }}
              className="relative z-10"
            >
              Atlantis
            </h1>
            {/* Echo effect */}
            <div 
              style={{
                fontFamily: 'Poiret One, cursive',
                fontSize: 'clamp(5rem, 15vw, 9rem)',
                letterSpacing: '0.1em',
                fontWeight: '400',
                lineHeight: '1',
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                color: 'rgba(165, 243, 252, 0.1)',
                filter: 'blur(8px)',
                transform: 'translateZ(-1px)',
                animation: 'glowPulse 3s infinite',
              }}
            >
              Atlantis
            </div>
          </div>

          {/* Subtitle */}
          <div 
            style={{
              fontFamily: 'Michroma, sans-serif',
              fontSize: 'clamp(0.8rem, 2vw, 1.2rem)',
              letterSpacing: '0.8em',
              fontWeight: '400',
              marginTop: '2rem',
              background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
            className="uppercase"
          >
            Smart City
          </div>
        </div>

        {/* Buttons */}
        <div 
          className="flex gap-8" 
          style={{ 
            animation: 'fadeIn 2s ease-out',
            fontFamily: 'Orbitron, sans-serif',
          }}
        >
          <button
            onClick={() => setShowLogin(true)}
            className="
              relative px-12 py-5
              text-white text-base
              rounded-full
              transition-all duration-500
              hover:scale-105
              focus:outline-none
              uppercase
            "
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              letterSpacing: '0.3em',
              fontWeight: '400',
            }}
          >
            Explore
          </button>
          
          <button
            onClick={() => navigate('/signup')}
            className="
              relative px-12 py-5
              text-white text-base
              rounded-full
              transition-all duration-500
              hover:scale-105
              focus:outline-none
              uppercase
            "
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(147, 197, 253, 0.3)',
              letterSpacing: '0.3em',
              fontWeight: '400',
            }}
          >
            Join Us
          </button>
        </div>
      </div>

      {/* Login Form */}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}

      {/* Animations */}
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

          @keyframes glowPulse {
            0% {
              opacity: 0.3;
              filter: blur(8px);
            }
            50% {
              opacity: 0.6;
              filter: blur(12px);
            }
            100% {
              opacity: 0.3;
              filter: blur(8px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Landing;