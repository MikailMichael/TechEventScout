import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState(null);

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

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
        <p>Your password has been reset. You can now log in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex-items-center justify-center bg-neutral-900">
      <form onSubmit={handleReset} className="bg-neutral-800 p-6 rounded-md border border-neutral-400 space-y-4 max-w-md w-full text-white">
        <h2 className="text-xl font-bold text-center">Reset Password</h2>
        <input 
          type="password"
          required
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4- py-2 border border-neutral-400 rounded-md bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-gray-100"
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