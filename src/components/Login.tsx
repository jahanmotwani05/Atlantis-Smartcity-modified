import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

interface LoginProps {
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-1/2 z-50 flex items-center justify-center">
      {/* Semi-transparent backdrop for login section */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          animation: 'slideIn 0.6s ease-out'
        }}
      ></div>

      {/* Login Content */}
      <div className="relative w-full max-w-md px-12 py-16">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors"
          style={{ 
            fontSize: '1.5rem',
            animation: 'fadeIn 0.8s ease-out' 
          }}
        >
          ×
        </button>

        {/* Title Section */}
        <div 
          className="mb-12 text-center"
          style={{ animation: 'fadeIn 0.8s ease-out' }}
        >
          <h2 
            className="text-4xl font-light text-white mb-3"
            style={{
              letterSpacing: '0.3em',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.2)'
            }}
          >
            LOGIN
          </h2>
          <p 
            className="text-white/50 font-light"
            style={{ letterSpacing: '0.2em' }}
          >
            Welcome Back to Atlantis
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" style={{ animation: 'fadeIn 1s ease-out' }}>
          {/* Email Input */}
          <div className="space-y-2">
            <label 
              htmlFor="email" 
              className="block text-white/70 text-sm pl-4"
              style={{ letterSpacing: '0.1em' }}
            >
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-white/5 rounded-full text-white placeholder-white/30 outline-none border border-white/10 transition-all duration-300 focus:border-white/30 focus:bg-white/10"
              style={{ letterSpacing: '0.05em' }}
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label 
              htmlFor="password" 
              className="block text-white/70 text-sm pl-4"
              style={{ letterSpacing: '0.1em' }}
            >
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-white/5 rounded-full text-white placeholder-white/30 outline-none border border-white/10 transition-all duration-300 focus:border-white/30 focus:bg-white/10"
              style={{ letterSpacing: '0.05em' }}
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div 
              className="text-red-300 text-center text-sm px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20"
              style={{ animation: 'fadeIn 0.3s ease-out' }}
            >
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-4 mt-6 rounded-full text-white font-light transition-all duration-300 hover:scale-[1.02] focus:outline-none"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.5))',
              letterSpacing: '0.2em',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
            SIGN IN
          </button>

          {/* Footer Links */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <a
              href="#"
              className="text-white/50 text-sm hover:text-white transition-colors"
              style={{ letterSpacing: '0.1em' }}
            >
              Forgot Password?
            </a>
            <div className="text-white/30 text-sm" style={{ letterSpacing: '0.1em' }}>
              Don't have an account? 
              <a href="#" className="text-white/70 hover:text-white ml-2 transition-colors">
                Sign Up
              </a>
            </div>
          </div>
        </form>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Login;