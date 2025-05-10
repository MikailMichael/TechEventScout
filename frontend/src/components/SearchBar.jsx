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
      className="form-control mb-3"
      placeholder="Search events"
      value={input}
      onChange={handleChange}
    />
  )
}

export default SearchBar;