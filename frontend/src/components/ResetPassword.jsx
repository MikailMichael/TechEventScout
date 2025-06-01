import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

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
      <div className="min-h-screen w-screen flex items-center justify-center bg-neutral-900 x-4">
        <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-400 max-w-sm w-full text-center space-y-6">
          <h2 className="text-2xl font-bold text-white">Password Reset</h2>
          <p className="text-gray-200">Your password has been reset successfully. You can now log in with your new password.</p>
          <button type="button" onClick={handleBackToLogin} className="w-full font-bold py-2 px-4 bg-neutral-700 border border-neutral-400 text-white rounded-md hover:ring-1 transition">
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-neutral-900">
      <form onSubmit={handleReset} className="bg-neutral-800 p-6 rounded-md border border-neutral-400 space-y-4 max-w-md w-full text-white">
        <h2 className="text-xl font-bold text-center">Reset Password</h2>
        <input
          type="password"
          required
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-400 rounded-md bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-gray-100"
        />
        <button
          type="submit"
          className="w-full font-bold py-2 px-4 bg-neutral-700 border border-neutral-400 text-white rounded-md hover:ring-1 transition"
        >Set New Password</button>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
}