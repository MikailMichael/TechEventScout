import { useState, useRef, useEffect } from 'react';
import profileTP from '../assets/profile-transparent.png';
import profile from '../assets/profile.png';

function Profile({ user, onLogOut }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className='relative' ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className='flex items-center h-9 w-full gap-2 text-sm text-white font-semibold px-2 py-1.5 gradient-border'
        >
          <img src={profileTP} alt='Profile icon with trapnsparent background' className='h-6 w-auto' />
          Profile
        </button>
      {open && (
        <div className='absolute right-0 w-70 bg-background-2 border border-border-gray rounded-lg shadow-lg z-50 p-2.5'>
          <div className='pb-2 text-sm text-white flex flex-inline items-center gap-2 border-b border-border-gray'>
            <img src={profile} alt="Profile icon" className='h-6 w-auto' />
            <span>{user?.email || "Email"}</span>
          </div>
          <button
            onClick={() => alert('Password change coming soon')}
            className='w-full text-left px-4 py-2 mt-2 text-sm text-white flex items-center font-semibold hover:bg-gradient-to-br hover:from-grad-purp-start-hover hover:to-grad-purp-end-hover hover:rounded-lg'
          >
            Change Password
          </button>
          <button
            onClick={onLogOut}
            className='w-full text-left px-4 py-2 text-sm text-white flex items-center font-semibold hover:bg-gradient-to-br hover:from-grad-purp-start-hover hover:to-grad-purp-end-hover hover:rounded-lg'
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;