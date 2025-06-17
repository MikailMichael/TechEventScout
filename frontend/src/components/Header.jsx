import logo from '../assets/logo.png';
import LoginButton from './LoginButton';
import FavoritesButton from './FavoritesButton';
import Profile from './Profile';

function Header({ user, onLogOut, onShowAuth, showFavourites }) {
  return (
    <header className="w-full h-17 flex justify-between border-b-2 border-[#181818] px-14.5 py-4">
      <div className='flex flex-inline items-center gap-1'>
        <img src={logo} alt="Logo" className="h-9 w-auto" />
        <h1 className='text-[28px] bg-gradient-to-br from-[#7C82FF] to-[#C355F5] bg-clip-text text-transparent'>London Tech Events</h1>
      </div>

      {user ? (
        <div className='flex flex-inline items-center gap-2'>
          <FavoritesButton onClick={showFavourites} />
          <Profile user={user} onLogOut={onLogOut} />
        </div>
      ) : (
        <div className='flex flex-inline items-center gap-1'>
          <LoginButton onShowAuth={onShowAuth} />
        </div>
      )}
    </header>
  );
}

export default Header;