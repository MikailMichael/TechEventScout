import { Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import ResetPassword from './components/ResetPassword';
import Home from './components/Home';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      {/* <Route path='/auth' element={<Auth />} /> */}
      <Route path='/reset-password' element={<ResetPassword />} />
    </Routes>
  );
}