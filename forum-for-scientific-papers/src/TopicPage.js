import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPapersByTopic } from './arxivService';
import Paper from './Paper';

function TopicPage() {
  const [papers, setPapers] = useState([]);
  const { topicId } = useParams(); // This will get the topicId from the URL

  useEffect(() => {
    const getPapers = async () => {
      const data = await fetchPapersByTopic(topicId);
      setPapers(data);
    };
    getPapers();
  }, [topicId]);

  return (
    <div>
      {papers.map((paper, index) => (
        <Paper key={index} paper={paper} />
      ))}
    </div>
  );
}

export default TopicPage;
