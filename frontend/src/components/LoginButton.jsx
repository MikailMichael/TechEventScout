import login from '../assets/login.png';

function LoginButton({ onShowAuth }) {
  return (
        <button
          onClick={onShowAuth}
          className="text-white text-sm font-semibold py-1.5 px-2 gap-2 flex flex-inline items-center rounded-lg h-9 bg-gradient-to-br from-grad-purp-start to-grad-purp-end hover:from-grad-purp-end hover:to-grad-purp-start"
        >
          <img src={login} alt="Login icon" className='h-6 w-auto' />
          Login
        </button>
  );
}

export default LoginButton;