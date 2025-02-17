import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

interface NavbarProps {
  currentUser: string;
}

const navItems = [
  { name: 'Events', path: '/events' },
  { name: 'Emergency', path: '/emergency' },
  { name: 'Announcements', path: '/announcements' },
  { name: 'Transportation', path: '/transport' },
  { name: 'Alerts', path: '/alerts' },
  { name: 'Ambulance', path: '/ambulance' },
];

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      {/* Add required font imports */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap');

          .nav-item {
            position: relative;
            overflow: hidden;
          }

          .nav-item::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0;
            height: 2px;
            background: #60A5FA;
            transition: all 0.3s ease;
            transform: translateX(-50%);
          }

          .nav-item:hover::after {
            width: 100%;
          }

          .profile-dropdown {
            animation: slideDown 0.3s ease;
            transform-origin: top;
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .nav-logo {
            animation: glow 2s ease-in-out infinite alternate;
          }

          @keyframes glow {
            from {
              text-shadow: 0 0 10px rgba(96, 165, 250, 0);
            }
            to {
              text-shadow: 0 0 20px rgba(96, 165, 250, 0.5);
            }
          }

          .nav-appear {
            animation: fadeIn 0.5s ease;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <nav className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-50 backdrop-blur-sm bg-opacity-80 nav-appear">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <span 
                className="nav-logo text-2xl text-white font-medium tracking-wider hover:text-blue-400 transition-colors duration-300 cursor-pointer"
                style={{ fontFamily: 'Syncopate, sans-serif' }}
                onClick={() => navigate('/home')}
              >
                ATLANTIS
              </span>
              
              <div className="hidden md:flex space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className="nav-item text-gray-300 hover:text-blue-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-all duration-300 px-4 py-2 rounded-lg"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center text-blue-400 font-medium">
                  {currentUser.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline">{currentUser}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="profile-dropdown absolute right-0 mt-2 w-48 rounded-lg bg-gray-800 border border-gray-700 shadow-lg py-1">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm text-gray-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Signed in as</p>
                    <p className="text-sm font-medium text-white truncate" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{currentUser}</p>
                  </div>
                  
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition-colors duration-200"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Your Profile
                  </button>
                  
                  <button
                    onClick={() => navigate('/settings')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition-colors duration-200"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Settings
                  </button>
                  
                  <div className="border-t border-gray-700">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-200"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;