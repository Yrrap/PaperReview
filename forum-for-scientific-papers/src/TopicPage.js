import React, { useState } from 'react';
// import { fetchPapersByTags } from './arxivService';
import PaperList from './PaperList';

function TopicPage() {
  const [papers/*, setPapers*/] = useState([]);
  
  // const handleSearch = async (tags) => {
  //   const results = await fetchPapersByTags(tags);
  //   setPapers(results);
  // };
  return (
    <div>
      {/* <SearchBar onSearch={handleSearch} /> */}
      <PaperList papers={papers} />
    </div>
  );
}

export default TopicPage;
