import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let response;
    if (isLogin) {
      response = await supabase.auth.signInWithPassword({ email, password });
    } else {
      response = await supabase.auth.signUp({ email, password });
    }

    if (response.error) {
      setError(response.error.message);
    } else {
      setError(null);
      onAuthSuccess();
    }
  };

  return (
    <div className='auth-form'>
      <h2 className='text-xl font-semibold'>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-2 mt-4'>
        <input type='email' placeholder='Email' required value={email} onChange={e => setEmail(e.target.value)} />
        <input type='password' placeholder='Password' required value={password} onChange={e => setPassword(e.target.value)} />
        <button className='bg-blue-500 text-white py-2 rounded hover:bg-blue-600' type='submit'>
          {isLogin ? 'Login' : 'Create Account'}
        </button>
        {error && <p className='text-red-500'>{error}</p>}
        <button type='button' className='text-sm underline mt-2' onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign up' : 'Have an account? Login'}
        </button>
      </form>
    </div>
  );
}