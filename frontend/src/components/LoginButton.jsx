import login from '../assets/login.png';

function LoginButton({ user, onLogOut, onShowAuth }) {
  return (
    <>
      {user ? (
        <button
          onClick={onLogOut}
          className="text-white text-sm font-semibold py-[6px] px-[8px] gap-[8px] flex flex-inline items-center rounded-md h-[36px] bg-gradient-to-br from-[#7C82FF] to-[#C355F5]"
        >
          <img src={login} alt="Login icon" className='h-[24px] w-auto' />
          Log out
        </button>
      ) : (
        <button
          onClick={onShowAuth}
          className="text-white text-sm font-semibold py-[6px] px-[8px] gap-[8px] flex flex-inline items-center rounded-md h-[36px] w-[86px] bg-gradient-to-br from-[#7C82FF] to-[#C355F5]"
        >
          <img src={login} alt="Login icon" className='h-[24px] w-auto' />
          Login
        </button>
      )}
    </>
  );
}

export default LoginButton;