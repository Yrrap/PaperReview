import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
// import PaperList from './PaperList';
import { fetchPapers } from './arxivService';


function Header() {
  const [/*papers, */setPapers] = useState([]);

  const handleSearch = async (tags) => {
    const results = await fetchPapers(tags);
    setPapers(results);
  };
  return (
    <header>
      <nav>
        <Link to="/" style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/topic/neuroscience" style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}>Neuroscience</Link>
        {/* Add additional links as needed */}
      </nav>
      <SearchBar onSearch={handleSearch} />
    </header>
  );
}

export default Header;
