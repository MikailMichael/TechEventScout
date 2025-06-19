import React, { useState } from 'react';
import searchIcon from '../assets/search.png';

function SearchBar({ onSearch }) {
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);
    onSearch(val);
  }

  return (
    <div className='relative my-6 px-14.5'>
      <input
        id="searchInp"
        className="form-control pl-12 pr-3 py-3 w-full border border-border-gray bg-background-2 placeholder-neutral-400 rounded-lg focus:outline-none focus:ring-2 hover:ring-1 transition"
        placeholder="Search events by title, description, location or tags..."
        value={input}
        onChange={handleChange}
      />

      <img src={searchIcon} alt="Search icon" className='pointer-events-none absolute left-17.5 top-1/2 transform -translate-y-1/2 h-6 w-auto' />
    </div>

  )
}

export default SearchBar;