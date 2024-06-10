import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CoseGraph from '../components/CoseGraph';
import '../styles/App.css';

const SubjectPage = () => {
  const { subject_id } = useParams();
  const [data, setData] = useState({ nodes: [], edges: [] });
  const [subject, setSubject] = useState({});
  const [searchMode, setSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState({ nodes: [], edges: [] });
  const [error, setError] = useState(null);
  const [relatedField, setRelatedField] = useState(true);
  const [similarResults, setSimilarResults] = useState(true);
  const [cites, setCites] = useState(true);
  const [similarMethods, setSimilarMethods] = useState(true);
  const [filteredElements, setFilteredElements] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/subjects/${subject_id}`)
      .then(response => response.json())
      .then(data => setSubject(data))
      .catch(error => console.error('Error fetching subject name:', error));

    fetchGraphData();
  }, [subject_id]);

  const fetchGraphData = () => {
    fetch(`http://127.0.0.1:8000/api/graph_data/${subject_id}`)
      .then(response => response.json())
      .then(data => {
        const nodeIds = new Set(data.nodes.map(node => node.data.id));
        const validEdges = data.edges.filter(edge => nodeIds.has(edge.data.source) && nodeIds.has(edge.data.target));
        setData({ nodes: data.nodes, edges: validEdges });
        setFilteredElements({ nodes: data.nodes, edges: validEdges });
      })
      .catch(error => console.error('Error fetching data:', error));
  };

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
    fetchGraphData();
  };

  useEffect(() => {
    const filterElements = () => {
      const elementsToFilter = searchMode ? searchResults : data;
      if (!elementsToFilter || !elementsToFilter.nodes || !elementsToFilter.edges) return { nodes: [], edges: [] };

      const filteredEdges = elementsToFilter.edges.filter(edge => {
        if (!relatedField && edge.data.label === 'related field') return false;
        if (!similarResults && edge.data.label === 'similar results') return false;
        if (!cites && edge.data.label === 'cites') return false;
        if (!similarMethods && edge.data.label === 'similar methods') return false;
        return true;
      });

      const nodeIds = new Set(filteredEdges.flatMap(edge => [edge.data.source, edge.data.target]));
      const filteredNodes = elementsToFilter.nodes.filter(node => nodeIds.has(node.data.id));

      return { nodes: filteredNodes, edges: filteredEdges };
    };

    setFilteredElements(filterElements());
  }, [data, searchResults, relatedField, similarResults, cites, similarMethods, searchMode]);

  return (
    <div className="app-container">
      <main className="subject-page">
        <h1>Network Graph for {subject.display_name}</h1>
        {error && <div className="error">{`Error fetching search results: ${error.message}`}</div>}
        <div className="content">
          <div className="left-side">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search for papers"
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.target.value) {
                    handleSearch(e.target.value);
                  }
                }}
              />
              <div className="button-container">
                <button onClick={() => handleSearch(document.querySelector('.search-box input').value)}>Search</button>
                <button onClick={resetSearch}>Reset</button>
              </div>
            </div>
            <div className="legend">
              <button
                className="legend-item"
                style={{ backgroundColor: '#0ff' }}
                onClick={() => setRelatedField(!relatedField)}
              >
                {relatedField ? 'Hide' : 'Show'} Related Field
              </button>
              <button
                className="legend-item"
                style={{ backgroundColor: '#f00' }}
                onClick={() => setSimilarResults(!similarResults)}
              >
                {similarResults ? 'Hide' : 'Show'} Similar Results
              </button>
              <button
                className="legend-item"
                style={{ backgroundColor: '#0f0' }}
                onClick={() => setCites(!cites)}
              >
                {cites ? 'Hide' : 'Show'} Cites
              </button>
              <button
                className="legend-item"
                style={{ backgroundColor: '#00f' }}
                onClick={() => setSimilarMethods(!similarMethods)}
              >
                {similarMethods ? 'Hide' : 'Show'} Similar Methods
              </button>
            </div>
          </div>
          <div className="right-side">
            <CoseGraph elements={filteredElements} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubjectPage;
