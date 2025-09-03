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
import { showSuccessToast, showLoadingToast, showErrorToast } from './CustomToast';

export default function Auth({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isForgetPassword, setIsForgetPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = showLoadingToast(isLogin ? 'Logging in...' : 'Creating accont...');
    const redirectTo = `${window.location.origin}/portfolio/project3/dist/`;
    let result;
    try {
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } });
      }

      const { data, error } = result;
      toast.remove('toast-loading');

      if (error) {
        showErrorToast(error.message);
      } else {
        if (!isLogin && data?.user && !data.session) showSuccessToast("Check your email to confirm your account.");
      }
    } catch (err) {
      toast.remove('toast-loading');
      showErrorToast("Something went wrong. Please try again.");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    const toastId = showLoadingToast('Sending reset email...');
    const redirectTo = `${window.location.origin}/portfolio/project3/dist/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    toast.remove('toast-loading');
    if (error) {
      showErrorToast(error.message);
    } else {
      showSuccessToast('A password reset link has been sent to your email.');
    }
  };

  const handleSocialLogin = async (provider) => {
    const toastId = showLoadingToast(isLogin ? 'Logging in...' : 'Creating account...');
    const redirectTo = `${window.location.origin}/portfolio/project3/dist/`;
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
    if (error) showErrorToast(error);
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
          {/* Title */}
          <h2 className="text-2xl font-bold text-center">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>

          {/* Password Reset Form */}
          {isForgetPassword ? (
            <form onSubmit={handlePasswordReset} className='space-y-2'>
              
              {/* Email Input */}
                <div className='space-y-2'>
                  <p className='text-left text-neutral-400 px-2'>Email</p>
                  <div className={`${isLogin ? 'input-wrapper-login' : 'input-wrapper-signup'}`}>
                    <img src={emailIcon} alt='Email icon' className='absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-auto' />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-11 pr-3.5 py-3 rounded-lg placeholder-neutral-400 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

              {/* Submit Button */}
                <button
                  type="submit"
                  className='w-full font-bold py-1.5 px-2 mt-4 items-center rounded-lg h-12 bg-gradient-to-br from-grad-purp-start to-grad-purp-end hover:from-grad-purp-end hover:to-grad-purp-start'
                >Send Reset Link</button>

              {/* Back to Login Button */}
                <button
                  type="button"
                  onClick={() => {
                  setIsForgetPassword(false);
                  setEmail('');
                  setPassword('');
                }}
                  className="w-full underline pt-4 text-center"
                >
                  Back to Login
                </button>
            </form>
          ) : (
            <div>
              <form onSubmit={handleSubmit} className="space-y-1">

                {/* Email Input */}
                <div className='space-y-2'>
                  <p className='text-left text-neutral-400 px-2'>Email</p>
                  <div className={`${isLogin ? 'input-wrapper-login' : 'input-wrapper-signup'}`}>
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

                {/* Password Input */}
                <div className='space-y-2 pt-3'>
                  <p className='text-left text-neutral-400 px-2'>Password</p>
                  <div className={`${isLogin ? 'input-wrapper-login' : 'input-wrapper-signup'}`}>
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

                {/* Forgot password Button */}
                {isLogin ? (
                  <button
                    type='button'
                    onClick={() => {
                      setIsForgetPassword(true);
                    }}
                    className='w-full text-sm text-neutral-400 bg-transparent underline text-right'
                  >Forgot password</button>
                ) : (<button
                  className="w-full text-sm bg-transparent underline text-right invisible"
                  aria-hidden="true"
                >
                  Forgot password
                </button>)}

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`w-full font-bold py-1.5 px-2 mt-4 items-center rounded-lg h-12 bg-gradient-to-br ${isLogin 
                    ? 'from-grad-purp-start to-grad-purp-end hover:from-grad-purp-end hover:to-grad-purp-start'
                    : 'from-grad-blue-start to-grad-blue-end hover:from-grad-blue-end hover:to-grad-blue-start'
                   } `}
                >
                  {isLogin ? 'Login' : 'Create Account'}
                </button>

                {/* OR Divider */}
                <div className='flex items-center my-4'>
                  <hr className='flex-grow border-t border-neutral-400' />
                  <span className='mx-4 text-neutral-500 text-sm'>OR</span>
                  <hr className='flex-grow border-t border-neutral-400' />
                </div>
                
                {/* Social Logins */}
                <div className='flex flex-inline gap-3'>
                  <button
                    type='button'
                    onClick={() => handleSocialLogin('discord')}
                    className={`w-full font-bold py-2 px-4 rounded-lg transition ${isLogin ? 'social-login' : 'social-signup'}`}>
                    <FontAwesomeIcon className="mx-2" icon={faDiscord} />
                  </button>
                  <button
                    type='button'
                    onClick={() => handleSocialLogin('github')}
                    className={`w-full font-bold py-2 px-4 rounded-lg transition ${isLogin ? 'social-login' : 'social-signup'}`}>
                    <FontAwesomeIcon className="mx-2" icon={faGithub} />
                  </button>
                  <button
                    type='button'
                    onClick={() => handleSocialLogin('google')}
                    className={`w-full font-bold py-2 px-4 rounded-lg transition ${isLogin ? 'social-login' : 'social-signup'}`}>
                    <FontAwesomeIcon className="mx-2" icon={faGoogle} />
                  </button>
                </div>

                {/* Toggle Login/Signup Button */}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full underline pt-4 text-center"
                >
                  {isLogin ? 'Need an account? ' : 'Have an account? '}
                  <span className='font-bold'>{isLogin ? 'Sign up' : 'Login'}</span>
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}