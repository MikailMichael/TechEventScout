import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);
    onSearch(val);
  }

  return (
    <input
      id="searchInp"
      className="form-control w-[300px] flex-1 max-w-[400px] py-2 px-2 border border-gray rounded-md focus:outline-none focus:ring-2 hover:ring-1"
      placeholder="Search events"
      value={input}
      onChange={handleChange}
    />
  )
}

export default SearchBar;