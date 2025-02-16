import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/config';

interface LoginProps {
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home'); // Changed to '/home'
    } catch (err: any) {
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        default:
          setError('Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/home'); // Changed to '/home'
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign in cancelled');
      } else {
        setError('Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-1/2 z-50" style={{
      animation: 'slideIn 0.5s ease-out forwards',
    }}>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>

      <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/90 backdrop-blur-xl border-l border-white/10">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-2xl text-white/70 hover:text-white transition-colors"
        >
          ×
        </button>

        <div className="relative w-full max-w-md mx-auto px-12 py-16">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-light text-white mb-3">
              Welcome Back
            </h2>
            <p className="text-white/50">Sign in to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-center text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-6 py-4 bg-white/5 rounded-full text-white placeholder-white/30 outline-none border border-white/10 focus:border-blue-500/50 transition-colors"
                disabled={loading}
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-6 py-4 bg-white/5 rounded-full text-white placeholder-white/30 outline-none border border-white/10 focus:border-blue-500/50 transition-colors"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full px-6 py-4 rounded-full text-white font-light
                transition-all duration-300 
                ${loading 
                  ? 'bg-blue-500/30 cursor-not-allowed' 
                  : 'bg-blue-500/50 hover:bg-blue-500/60'
                }
              `}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full px-6 py-4 rounded-full text-white font-light bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
                className="w-5 h-5"
              />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;