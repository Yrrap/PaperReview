import React, { useState, useEffect } from 'react';
import { fetchPapers } from './arxivService';
import Paper from './Paper';

function PaperList() {
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    const getPapers = async () => {
      const data = await fetchPapers();
      setPapers(data);
    };
    getPapers();
  }, []);

  return (
    <div>
      {papers.map((paper, index) => (
        <Paper key={index} title={paper.title} authors={paper.authors} abstract={paper.summary} link={paper.link} />
      ))}
    </div>
  );
}

export default PaperList;
