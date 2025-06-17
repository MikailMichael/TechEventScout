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
        <div className='absolute right-0 mt-2 w-48 bg-neutral-800 border border-gray-200 rounded-md shadow-lg z-50'>
          <div className='px-4 py-2 text-sm text-gray-300 border-b border-gray-600 flex flex-inline items-center gap-1'>
            <img src={profile} alt="Profile icon" />
            <span>{user.email}</span>
          </div>
          <button
            onClick={() => alert('Password change coming soon')}
            className='w-full text-left px-4 py-2 text-sm hover:bg-neutral-700 text-gray-100 flex items-center gap-2'
          >
            Change Password
          </button>
          <button
            onClick={onLogOut}
            className='w-full text-left px-4 py-2 text-sm hover:bg-neutral-700 text-gray-100 flex items-center gap-2'
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;