import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // Pass the query to parent component
  };

  return (
    <input
      type="text"
      placeholder="Search..."
      value={query}
      onChange={handleChange}
      style={{ padding: '8px', width: '200px' }}
    />
  );
};

export default SearchBar;
