import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Header from "./Header";
import passwordResetIcon from '../assets/password-reset-icon.png';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');

    if (accessToken) {
      supabase.auth.setSession({ access_token: accessToken, refresh_token: '' });
    }
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setError(error.message);
    } else {
      setConfirmed(true);
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  if (confirmed) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <div className="fixed top-0 left-0 w-full z-10"><Header /></div>

        {/* Spacer */}
        <div className="h-17" />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-background-2 shadow-glow-purple p-6 border border-border-gray max-w-sm w-full rounded-[24px] text-center relative space-y-6">
            <h2 className="text-2xl font-bold text-white">Password Reset</h2>
            <p className="text-gray-200">Your password has been reset successfully. <br />You can now log in with your new password.</p>
            <button type="button" onClick={handleBackToLogin} className="w-full font-bold py-1.5 px-2 mt-4 items-center rounded-lg h-12 bg-gradient-to-br from-grad-purp-start to-grad-purp-end hover:from-grad-purp-end hover:to-grad-purp-start">
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 w-full z-10"><Header /></div>

      {/* Spacer */}
      <div className="h-17" />

      <div className="flex-1 flex items-center justify-center px-4">
        <form onSubmit={handleReset} className="bg-background-2 shadow-glow-purple p-6 rounded-[24px] border border-border-gray space-y-4 max-w-md w-full text-white">
          <h2 className="text-xl font-bold text-center">Reset Password</h2>
          <div className='space-y-2'>
            <p className='text-left text-neutral-400 px-2'>Enter new password</p>
            <div className='input-wrapper-login'>
              <img src={passwordResetIcon} alt='Password Reset icon' className='absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-auto' />
              <input
                type="password"
                placeholder="New Password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full pl-11 pr-3.5 py-3 rounded-lg placeholder-neutral-400 bg-transparent focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full font-bold py-1.5 px-2 mt-4 items-center rounded-lg h-12 bg-gradient-to-br from-grad-purp-start to-grad-purp-end hover:from-grad-purp-end hover:to-grad-purp-start"
          >Reset Password</button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>

    </div>
  );
}