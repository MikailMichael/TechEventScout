import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub, faDiscord } from '@fortawesome/free-brands-svg-icons';

export default function Auth({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isForgetPassword, setIsForgetPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(null);
        setError(error.message);
      } else {
        setError(null);
        setMessage(null);
        onAuthSuccess(); // Successful Login
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(null);
        setError(error.message);
      } else if (data.user && !data.session) {
        // Confirmation email sent, but account isn't active yet
        setError(null);
        setMessage("A confirmation email has been sent. Please check your inbox.");
      } else {
        setError(null);
        setMessage(null);
        onAuthSuccess(); // In case email confirmation is disabled and signup completes immediately
      }
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/reset-password',
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('A password reset link has been set to your email.');
    }
  };

  const handleSocialLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin } });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-neutral-900 px-4">
      <div className="w-full max-w-sm bg-neutral-800 border border-neutral-400 rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-100 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        {isForgetPassword ? (
          <form onSubmit={handlePasswordReset} className='space-y-4'>
            <input
              type='email'
              placeholder='Enter your email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-2 border border-neutral-400 rounded-md bg-neutral-700 text-gray-100 placeholder-neutral-400 focus:outline-none focus:ring-gray-100 hover:ring-1 transition'
            />

            <button
              type='submit'
              className='w-full font-bold py-2 px-4 bg-neutral-800 border border-neutral-400 text-gray-100 rounded-md hover:ring-1 focus:outline-none transition'
            >Send Reset Link</button>

            <button
              type='button'
              onClick={() => {
                setIsForgetPassword(false);
                setError(null);
                setMessage(null);
                setEmail('');
                setPassword('');
              }}
              className='w-full text-sm text-gray-100 border bg-neutral-800 border-neutral-400 underline hover:ring-1 transition mt-2 text-center'
            >Back to Login</button>
          </form>
        ) : (
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-400 rounded-md bg-neutral-700 text-gray-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-gray-100 hover:ring-1 transition"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-400 rounded-md bg-neutral-700 text-gray-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-gray-100 hover:ring-1 transition"
              />



              <button
                type="submit"
                className="w-full font-bold py-2 px-4 bg-neutral-800 border border-neutral-400 text-gray-100 rounded-md hover:ring-1 focus:outline-none transition"
              >
                {isLogin ? 'Login' : 'Create Account'}
              </button>

              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-sm text-gray-100 border bg-neutral-800 border-neutral-400 underline hover:ring-1 transition text-center"
              >
                {isLogin ? 'Need an account? Sign up' : 'Have an account? Login'}
              </button>

              {isLogin && (
                <button
                  type='button'
                  onClick={() => {
                    setIsForgetPassword(true);
                    setError(null);
                    setMessage(null);
                  }}
                  className='w-full text-sm text-gray-100 bg-transparent underline text-center'
                >Forgot your password?</button>
              )}
            </form>

            <div className='flex items-center my-4'>
              <hr className='flex-grow border-t border-gray-600' />
              <span className='mx-4 text-gray-400 text-sm'>or</span>
              <hr className='flex-grow border-t border-gray-600' />
            </div>

            <div className='flex flex-col gap-2 my-4'>
              <button
                onClick={() => handleSocialLogin('discord')}
                className='w-full font-bold py-2 px-4 bg-neutral-800 border border-neutral-400 text-gray-100 rounded-md hover:ring-1 focus:outline-none transition'>
                <FontAwesomeIcon className="mx-2" icon={faDiscord} />
                Continue with Discord
              </button>
              <button
                onClick={() => handleSocialLogin('github')}
                className='w-full font-bold py-2 px-4 bg-neutral-800 border border-neutral-400 text-gray-100 rounded-md hover:ring-1 focus:outline-none transition'>
                  <FontAwesomeIcon className="mx-2" icon={faGithub} />
                Continue with Github

              </button>
              <button
                onClick={() => handleSocialLogin('google')}
                className='w-full font-bold py-2 px-4 bg-neutral-800 border border-neutral-400 text-gray-100 rounded-md hover:ring-1 focus:outline-none transition'>
                  <FontAwesomeIcon className="mx-2" icon={faGoogle} />
                Continue with Google
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-lg font-semi-bold text-center">{error}</p>}
        {message && <p className='text-green-500 text-lg font-semi-bold text-center'>{message}</p>}
      </div>
    </div>
  );
}