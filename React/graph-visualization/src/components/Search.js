import React, { useState } from 'react';

const Search = ({ onSearch, onReset }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim() === '') {
      onReset();
    } else {
      onSearch(query);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search for papers"
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={onReset}>Reset</button>
    </div>
  );
};

export default Search;
