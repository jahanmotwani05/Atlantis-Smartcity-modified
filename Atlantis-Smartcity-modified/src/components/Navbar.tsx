import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

interface NavbarProps {
  currentTime: string;
  currentUser: string;
}

const navItems = [
  { name: 'Events', icon: '🎉', path: '/events' },
  { name: 'Emergency', icon: '🚨', path: '/emergency' },
  { name: 'Announcements', icon: '📢', path: '/announcements' },
  { name: 'Transportation', icon: '🚗', path: '/transport' },
  { name: 'Alerts', icon: '⚠️', path: '/alerts' },
  { name: 'Ambulance', icon: '🚑', path: '/ambulance' },
];

const Navbar: React.FC<NavbarProps> = ({ currentTime, currentUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <span className="text-2xl text-white font-light">Atlantis</span>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <span className="text-gray-400 text-sm">{currentTime} UTC</span>
              <span className="text-gray-400 text-sm ml-4">{currentUser}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;