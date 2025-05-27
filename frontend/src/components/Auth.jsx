import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if(error) {
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

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-neutral-900 px-4">
    <div className="w-full max-w-sm bg-neutral-800 border border-neutral-400 rounded-2xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-100 text-center">
        {isLogin ? 'Login' : 'Sign Up'}
      </h2>

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
          className="w-full text-sm text-gray-100 border bg-neutral-800 border-neutral-400 underline hover:ring-1 transition mt-2 text-center"
        >
          {isLogin ? 'Need an account? Sign up' : 'Have an account? Login'}
        </button>
      </form>

      {error && <p className="text-red-500 text-lg font-semi-bold text-center">{error}</p>}
      {message && <p className='text-green-500 text-lg font-semi-bold text-center'>{message}</p>}
    </div>
  </div>
  );
}