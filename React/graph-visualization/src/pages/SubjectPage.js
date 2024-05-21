import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Filtering from '../components/Filtering';
import Search from '../components/Search';
import '../styles/App.css';

const SubjectPage = () => {
  const { subject_id } = useParams();
  const [data, setData] = useState({ nodes: [], edges: [] });
  const [subject, setSubject] = useState({});
  const [searchMode, setSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState({ nodes: [], edges: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/subjects/${subject_id}`)
      .then(response => response.json())
      .then(data => setSubject(data))
      .catch(error => console.error('Error fetching subject name:', error));

    fetch(`http://127.0.0.1:8000/api/graph_data/${subject_id}`)
      .then(response => response.json())
      .then(data => {
        const nodeIds = new Set(data.nodes.map(node => node.data.id));
        const validEdges = data.edges.filter(edge => nodeIds.has(edge.data.source) && nodeIds.has(edge.data.target));
        setData({ nodes: data.nodes, edges: validEdges });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [subject_id]);

  const handleSearch = (query) => {
    fetch(`http://127.0.0.1:8000/api/search/?q=${query}&subject_id=${subject_id}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(results => {
        setSearchResults(results);
        setSearchMode(true);
      })
      .catch(error => {
        setError(error);
        setSearchMode(false);
      });
  };

  const resetSearch = () => {
    setSearchMode(false);
    setSearchResults({ nodes: [], edges: [] });
    setError(null);
    fetch(`http://127.0.0.1:8000/api/graph_data/${subject_id}`)
      .then(response => response.json())
      .then(data => {
        const nodeIds = new Set(data.nodes.map(node => node.data.id));
        const validEdges = data.edges.filter(edge => nodeIds.has(edge.data        .source) && nodeIds.has(edge.data.target));
        setData({ nodes: data.nodes, edges: validEdges });
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  return (
    <div className="app-container">
      <main>
        <h1>Network Graph for {subject.display_name}</h1>
        {error && <div className="error">{`Error fetching search results: ${error.message}`}</div>}
        <Search onSearch={handleSearch} onReset={resetSearch} />
        {searchMode ? (
          <Filtering data={searchResults} />
        ) : (
          <Filtering data={data} />
        )}
        <button onClick={resetSearch}>Reset Search</button>
      </main>
    </div>
  );
};

export default SubjectPage;