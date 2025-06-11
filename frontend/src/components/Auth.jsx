import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub, faDiscord } from '@fortawesome/free-brands-svg-icons';
import toast from 'react-hot-toast';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, motion } from 'framer-motion';

export default function Auth({ onAuthSuccess, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isForgetPassword, setIsForgetPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading(isLogin ? 'Logging in...' : 'Creating accont...');

    let result;
    try {
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }

      const { data, error } = result;
      toast.dismiss(toastId);

      if (error) {
        toast.error(error.message);
      } else {
        if (!isLogin && data?.user && !data.session) {
          toast.success("Check your email to confirm your account.");
        } else {
          toast.success(isLogin ? "Logged in successfully!" : "Account created!");
          onAuthSuccess();
        }
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Sending reset email...');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/reset-password',
    });

    toast.dismiss(toastId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('A password reset link has been sent to your email.');
    }
  };

  const handleSocialLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin } });
    if (error) toast.error(error);
  };

  return (
    <AnimatePresence>
      <motion.div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center"
        initial={{ opacity: 0}}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div 
          onClick={(e) => e.stopPropagation()} 
          className="w-full max-w-sm bg-neutral-900 border border-neutral-400 rounded-xl p-6 space-y-6 text-gray-100 relative"
          initial={{ scale: 0.90, opacity: 0 }}
          animate={{ scale: 1, opacity: 1}}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button onClick={onClose} className='absolute top-4 right-4 text-gray-300 hover:text-white'>
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
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
                  setEmail('');
                  setPassword('');
                }}
                className='w-full py-2 px-4 text-sm text-gray-100 border bg-neutral-800 border-neutral-400 underline hover:ring-1 transition mt-2 text-center'
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
                  className="w-full text-sm py-2 px-4 text-gray-100 border bg-neutral-800 border-neutral-400 underline hover:ring-1 transition text-center"
                >
                  {isLogin ? 'Need an account? Sign up' : 'Have an account? Login'}
                </button>

                {isLogin && (
                  <button
                    type='button'
                    onClick={() => {
                      setIsForgetPassword(true);
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}