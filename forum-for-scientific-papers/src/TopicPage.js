import React, { useState } from 'react';
import { useEffect } from 'react';
import { fetchPapers } from './arxivService';
import PaperList from './PaperList';

function TopicPage() {
  const [papers, setPapers] = useState([]);  
  useEffect(() => {
    // console.log('useEffect');
    // Fetch and set the recent papers when the component mounts
    const loadRecentPapers = async () => {
      const results = await fetchPapers();
      // console.log(results);
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

export default TopicPage;
