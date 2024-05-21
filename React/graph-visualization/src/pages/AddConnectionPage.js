// AddConnectionPage.js
import React, { useState } from 'react';

const AddConnectionPage = ({ subjectId }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [connections, setConnections] = useState([]);
  
  const handleSearch = () => {
    fetch(`http://127.0.0.1:8000/api/search/?q=${query}&subject_id=${subjectId}`)
      .then(response => response.json())
      .then(data => setResults(data.nodes))
      .catch(error => console.error('Error fetching search results:', error));
  };

  const handleAddConnection = (paper) => {
    setConnections([...connections, paper]);
  };

  const handleSaveConnections = () => {
    // Implement the logic to save connections to the backend
    console.log('Save connections:', connections);
    // Example API call to save connections
    fetch(`http://127.0.0.1:8000/api/add_connections/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connections, subjectId })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Connections saved:', data);
        setConnections([]);
      })
      .catch(error => console.error('Error saving connections:', error));
  };

  return (
    <div>
      <h1>Add Connections</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for papers"
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map(paper => (
          <li key={paper.data.id}>
            {paper.data.label} ({paper.data.author})
            <button onClick={() => handleAddConnection(paper)}>Add Connection</button>
          </li>
        ))}
      </ul>
      <h2>Selected Connections</h2>
      <ul>
        {connections.map((paper, index) => (
          <li key={index}>
            {paper.data.label} ({paper.data.author})
          </li>
        ))}
      </ul>
      <button onClick={handleSaveConnections}>Save Connections</button>
    </div>
  );
};

export default AddConnectionPage;
