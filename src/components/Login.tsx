import React, { Component, ChangeEvent, FormEvent, JSX } from 'react';
import gsap from 'gsap';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

interface LoginState {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
}

class Login extends Component<{ onClose?: () => void }, LoginState> {
  private formRef = React.createRef<HTMLFormElement>();
  private containerRef = React.createRef<HTMLDivElement>();
  private inputRefs: React.RefObject<HTMLDivElement | null>[] = Array(2).fill(null).map(() => React.createRef());

  constructor(props: { onClose?: () => void }) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLoading: false,
      error: null
    };
  }

  componentDidMount() {
    // Initial animation
    gsap.set(this.containerRef.current, {
      x: '100%',
      opacity: 0
    });

    gsap.to(this.containerRef.current, {
      x: '0%',
      opacity: 1,
      duration: 0.8,
      ease: "power3.inOut"
    });

    // Animate form elements
    gsap.from(this.formRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      delay: 0.4,
      ease: "back.out(1.7)"
    });

    // Animate input fields
    this.inputRefs.forEach((ref, index) => {
      gsap.from(ref.current, {
        x: -30,
        opacity: 0,
        duration: 0.5,
        delay: 0.6 + index * 0.1,
        ease: "power2.out"
      });
    });
  }

  handleInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    this.setState({ [name]: value } as unknown as Pick<LoginState, keyof LoginState>);

    // Input animation
    gsap.to(e.target, {
      keyframes: [
        { scale: 1.02, duration: 0.1 },
        { scale: 1, duration: 0.1 }
      ]
    });
  }

  handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    this.setState({ isLoading: true, error: null });

    // Animate form submission
    gsap.to(this.formRef.current, {
      keyframes: [
        { scale: 0.95, duration: 0.1 },
        { scale: 1, duration: 0.1 }
      ]
    });

    try {
      // Attempt to sign in with Firebase
      await signInWithEmailAndPassword(
        auth,
        this.state.email,
        this.state.password
      );

      // Success animation
      gsap.to(this.formRef.current, {
        keyframes: [
          { boxShadow: '0 0 30px rgba(6,182,212,0.5)', duration: 0.3 },
          { boxShadow: 'none', duration: 0.3 }
        ]
      });

      // Close login form after successful authentication
      setTimeout(() => {
        this.props.onClose?.();
      }, 1000);

    } catch (error) {
      // Error animation
      gsap.to(this.formRef.current, {
        keyframes: [
          { x: -10, duration: 0.1 },
          { x: 10, duration: 0.1 },
          { x: -5, duration: 0.1 },
          { x: 5, duration: 0.1 },
          { x: 0, duration: 0.1 }
        ]
      });

      this.setState({ 
        error: 'Invalid credentials. Please try again.',
        isLoading: false 
      });
    }
  }

  render(): JSX.Element {
    const { isLoading, error } = this.state;

    return (
      <div 
        ref={this.containerRef}
        className="fixed top-0 right-0 w-1/2 h-screen bg-black/80 backdrop-blur-xl border-l border-cyan-500/30 z-30"
      >
        <button
          onClick={this.props.onClose}
          className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <form 
          ref={this.formRef}
          onSubmit={this.handleSubmit}
          className="h-full flex flex-col justify-center px-16"
        >
          <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Welcome Back
          </h2>

          {error && (
            <div className="mb-6 py-3 px-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-8">
            {['email', 'password'].map((field, index) => (
              <div 
                key={field} 
                ref={this.inputRefs[index]}
                className="group relative"
              >
                <input
                  type={field === 'password' ? 'password' : 'text'}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  onChange={this.handleInput}
                  className="w-full px-6 py-4 bg-white/5 border-2 border-blue-500/20 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="group relative mt-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white font-bold tracking-wider transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-400/30 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="tracking-widest">AUTHENTICATING</span>
                </>
              ) : (
                <span className="tracking-widest">LOGIN</span>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
          </button>
        </form>
      </div>
    );
  }
}

export default Login;