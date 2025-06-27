import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub, faDiscord } from '@fortawesome/free-brands-svg-icons';
import toast from 'react-hot-toast';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, motion } from 'framer-motion';
import successIcon from '../assets/toast-success.png';
import errorIcon from '../assets/toast-error.png';
import emailIcon from '../assets/mail-icon.png';
import passwordIcon from '../assets/password-icon.png';

export default function Auth({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isForgetPassword, setIsForgetPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading(isLogin ? 'Logging in...' : 'Creating accont...', { className: "toast-loading" });

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
        toast.error(error.message, { className: "toast-error", icon: <img src={errorIcon} alt="Error" className="h-5 w-5" /> });
      } else {
        if (!isLogin && data?.user && !data.session) toast.success("Check your email to confirm your account.", { className: "toast-success", icon: <img src={successIcon} alt="Success" className="h-5 w-5" /> });
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Something went wrong. Please try again.", { className: "toast-error", icon: <img src={errorIcon} alt="Error" className="h-5 w-5" /> });
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Sending reset email...', { className: "toast-loading" });
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/reset-password',
    });

    toast.dismiss(toastId);
    if (error) {
      toast.error(error.message, { className: "toast-error", icon: <img src={errorIcon} alt="Error" className="h-5 w-5" /> });
    } else {
      toast.success('A password reset link has been sent to your email.', { className: "toast-success", icon: <img src={successIcon} alt="Success" className="h-5 w-5" /> });
    }
  };

  const handleSocialLogin = async (provider) => {
    const toastId = toast.loading(isLogin ? 'Logging in...' : 'Creating accont...', { className: "toast-loading" });
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/?socialLogin=1` } });
    if (error) toast.error(error, { className: "toast-error", icon: <img src={errorIcon} alt="Error" className="h-5 w-5" /> });
  };

  return (
    <AnimatePresence>
      <motion.div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-background border border-border-gray rounded-[24px] p-6 space-y-6 text-gray-100 relative"
          initial={{ scale: 0.90, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button onClick={onClose} className='absolute top-4 right-4 text-gray-300 hover:text-white'>
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
          <h2 className="text-2xl font-bold text-center">
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
              <form onSubmit={handleSubmit} className="space-y-1">
                <div className='space-y-2'>
                  <p className='text-left text-neutral-400 px-2'>Email</p>
                  <div className='input-wrapper'>
                    <img src={emailIcon} alt='Email icon' className='absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-auto' />
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-11 pr-3.5 py-3 rounded-lg placeholder-neutral-400 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                <div className='space-y-2 pt-3'>
                  <p className='text-left text-neutral-400 px-2'>Password</p>
                  <div className='input-wrapper'>
                    <img src={passwordIcon} alt='Password icon' className='absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-auto' />
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-11 pr-3.5 py-3 rounded-lg placeholder-neutral-400 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                {isLogin && (
                  <button
                    type='button'
                    onClick={() => {
                      setIsForgetPassword(true);
                    }}
                    className='w-full text-sm text-neutral-400 bg-transparent underline text-right'
                  >Forgot password</button>
                )}

                <button
                  type="submit"
                  className="w-full font-bold py-1.5 px-2 mt-4 items-center rounded-lg h-12 bg-gradient-to-br from-grad-purp-start to-grad-purp-end hover:from-grad-purp-end hover:to-grad-purp-start"
                >
                  {isLogin ? 'Login' : 'Create Account'}
                </button>

                <div className='flex items-center my-4'>
                  <hr className='flex-grow border-t border-neutral-400' />
                  <span className='mx-4 text-neutral-500 text-sm'>OR</span>
                  <hr className='flex-grow border-t border-neutral-400' />
                </div>

                <div className='flex flex-inline gap-3'>
                  <button
                    type='button'
                    onClick={() => handleSocialLogin('discord')}
                    className='w-full font-bold py-2 px-4 rounded-lg transition social-login'>
                    <FontAwesomeIcon className="mx-2" icon={faDiscord} />
                  </button>
                  <button
                    type='button'
                    onClick={() => handleSocialLogin('github')}
                    className='w-full font-bold py-2 px-4 rounded-lg transition social-login'>
                    <FontAwesomeIcon className="mx-2" icon={faGithub} />
                  </button>
                  <button
                    type='button'
                    onClick={() => handleSocialLogin('google')}
                    className='w-full font-bold py-2 px-4 rounded-lg transition social-login'>
                    <FontAwesomeIcon className="mx-2" icon={faGoogle} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full underline pt-4 text-center"
                >
                  {isLogin ? 'Need an account? ' : 'Have an account? Login'}
                  <span className='font-bold'>Sign up</span>
                </button>
              </form>




            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}