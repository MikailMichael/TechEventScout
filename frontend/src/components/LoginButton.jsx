import login from '../assets/login.png';

function LoginButton({ onShowAuth }) {
  return (
        <button
          onClick={onShowAuth}
          className="text-white text-sm font-semibold py-1.5 px-2 gap-2 flex flex-inline items-center rounded-lg h-9 bg-gradient-to-br from-[#7C82FF] to-[#C355F5]"
        >
          <img src={login} alt="Login icon" className='h-6 w-auto' />
          Login
        </button>
  );
}

export default LoginButton;