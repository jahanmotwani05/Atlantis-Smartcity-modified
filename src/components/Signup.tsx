// src/components/Signup.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  AuthError 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });

      navigate('/home');
    } catch (err) {
      const authError = err as AuthError;
      switch (authError.code) {
        case 'auth/email-already-in-use':
          setError('Email already in use');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters');
          break;
        default:
          setError('Failed to create account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });

      navigate('/home');
    } catch (err) {
      const authError = err as AuthError;
      if (authError.code === 'auth/popup-closed-by-user') {
        setError('Sign up cancelled');
      } else {
        setError('Failed to sign up with Google');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md px-8 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-light text-white mb-3">Create Account</h2>
          <p className="text-white/50">Join Atlantis Smart City</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-center text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleEmailSignup} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-6 py-4 bg-white/5 rounded-full text-white placeholder-white/30 outline-none border border-white/10 focus:border-blue-500/50 transition-colors"
            disabled={isLoading}
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-6 py-4 bg-white/5 rounded-full text-white placeholder-white/30 outline-none border border-white/10 focus:border-blue-500/50 transition-colors"
            disabled={isLoading}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-6 py-4 rounded-full text-white font-light transition-all duration-300 ${
              isLoading ? 'bg-blue-500/30 cursor-not-allowed' : 'bg-blue-500/50 hover:bg-blue-500/60'
            }`}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
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
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full px-6 py-4 rounded-full text-white font-light bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Sign up with Google
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/30">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/')}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;