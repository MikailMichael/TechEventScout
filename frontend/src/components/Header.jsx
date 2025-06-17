import logo from '../assets/logo.png';
import LoginButton from './LoginButton';

function Header({ user, onLogOut, onShowAuth }) {
  return (
    <header className="w-full h-[68px] flex justify-between border-b-2 border-[#181818] px-[58px] py-[16px]">
      <div className='flex flex-inline items-center gap-1'>
        <img src={logo} alt="Logo" className="h-[36px] w-auto" />
        <h1 className='text-[28px] leading-[100%] bg-gradient-to-br from-[#7C82FF] to-[#C355F5] bg-clip-text text-transparent'>London Tech Events</h1>
      </div>

      <LoginButton user={user} onLogOut={onLogOut} onShowAuth={onShowAuth} />
    </header>
  );
}

export default Header;