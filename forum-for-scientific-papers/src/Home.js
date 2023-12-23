import React, { useState, useEffect } from 'react';
import PaperList from './PaperList';
// import SearchBar from './SearchBar';
import { fetchPapers } from './arxivService';


function Home() {
  const [papers, setPapers] = useState([]);

  // const handleSearch = async (tags) => {
  //   const results = await fetchPapers(tags);
  //   setPapers(results);
  // };
  
  useEffect(() => {
    // Fetch and set the recent papers when the component mounts
    const loadRecentPapers = async () => {
      const results = await fetchPapers();
      setPapers(results);
    };
    loadRecentPapers();
  }, []); // The empty array ensures this effect runs only once after the initial render

  return (
    <div>
      {/* <SearchBar onSearch={handleSearch} /> */}
      <PaperList papers={papers} />
    </div>
  );
}

export default Home;
