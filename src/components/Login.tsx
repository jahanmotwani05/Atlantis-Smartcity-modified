import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  AuthError 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

interface LoginProps {
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update user's last login time in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        lastLogin: serverTimestamp(),
        email: userCredential.user.email,
      }, { merge: true });

      onClose();
      navigate('/home');
    } catch (err) {
      const authError = err as AuthError;
      switch (authError.code) {
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        default:
          setError('Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Update or create user document in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        lastLogin: serverTimestamp(),
        createdAt: serverTimestamp(),
      }, { merge: true });

      onClose();
      navigate('/home');
    } catch (err) {
      const authError = err as AuthError;
      if (authError.code === 'auth/popup-closed-by-user') {
        setError('Sign in cancelled');
      } else {
        setError('Failed to sign in with Google');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-1/2 z-50">
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors"
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
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-6 py-4 bg-white/5 rounded-full text-white placeholder-white/30 outline-none border border-white/10 focus:border-blue-500/50 transition-colors"
                disabled={isLoading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full px-6 py-4 rounded-full text-white font-light
                transition-all duration-300 
                ${isLoading 
                  ? 'bg-blue-500/30 cursor-not-allowed' 
                  : 'bg-blue-500/50 hover:bg-blue-500/60'
                }
              `}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black text-white/30">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full px-6 py-4 rounded-full text-white font-light bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/30">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;