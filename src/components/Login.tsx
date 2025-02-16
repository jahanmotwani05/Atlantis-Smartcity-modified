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
    gsap.from(this.containerRef.current, {
      x: '100%',
      duration: 0.6,
      ease: "power3.out"
    });
  }

  handleInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    this.setState({ [name]: value } as Pick<LoginState, keyof LoginState>);
  }

  handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    this.setState({ isLoading: true, error: null });

    try {
      await signInWithEmailAndPassword(auth, this.state.email, this.state.password);
      this.props.onClose?.();
    } catch (error) {
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
        className="fixed top-0 right-0 w-[450px] h-screen bg-white shadow-2xl z-50"
      >
        <button
          onClick={this.props.onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <form 
          ref={this.formRef}
          onSubmit={this.handleSubmit}
          className="h-full flex flex-col justify-center px-12"
        >
          <div className="space-y-6 w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome Back
              </h2>
              <p className="mt-2 text-gray-600">
                Sign in to continue to Atlantis
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  onChange={this.handleInput}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  placeholder="Enter your password"
                  onChange={this.handleInput}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;