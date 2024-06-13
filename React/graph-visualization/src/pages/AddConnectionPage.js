import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/AddConnectionPage.css';

const AddConnectionPage = () => {
    const { subjectId } = useParams();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [connections, setConnections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [connectionTypes, setConnectionTypes] = useState([]);
    const [selectedConnectionType, setSelectedConnectionType] = useState('');
    const [existingConnections, setExistingConnections] = useState([]);
    const [originalPaper, setOriginalPaper] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/subjects/')
            .then(response => response.json())
            .then(data => setSubjects(data))
            .catch(error => console.error('Error fetching subjects:', error));
    }, []);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/connection_types/')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched connection types:', data); // Add logging
                setConnectionTypes(data);
            })
            .catch(error => console.error('Error fetching connection types:', error));
    }, []);

    const fetchExistingConnections = (paperId) => {
      fetch(`http://127.0.0.1:8000/api/connections/${paperId}`)
          .then(response => response.json())
          .then(data => {
              console.log('Fetched existing connections:', data); // Log fetched data
              if (Array.isArray(data)) {
                  setExistingConnections(data);
              } else {
                  setExistingConnections([]);
              }
          })
          .catch(error => {
              console.error('Error fetching existing connections:', error);
              setExistingConnections([]);
          });
  };

    const handleSearch = () => {
        if (!query || !selectedSubject) {
            console.error('Query or selected subject is missing');
            return;
        }

        fetch(`http://127.0.0.1:8000/api/search/?q=${query}&subject_id=${selectedSubject}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.nodes) {
                    setResults(data.nodes);
                } else {
                    console.error('No nodes found in the response');
                }
            })
            .catch(error => console.error('Error fetching search results:', error));
    };

    const handleSelectOriginalPaper = (paper) => {
        setOriginalPaper(paper);
        fetchExistingConnections(paper.data.id);
    };

    const handleAddConnection = (paper) => {
      console.log('Selected Connection Type:', selectedConnectionType);
      console.log('Connection Types:', connectionTypes);
  
      if (!selectedConnectionType) {
          console.error('Connection type is missing');
          return;
      }
  
      const selectedTypeObject = connectionTypes.find(type => type.id === parseInt(selectedConnectionType));
      if (!selectedTypeObject) {
          console.error('Selected connection type not found');
          return;
      }
  
      const connection = {
          originalPaper,
          relatedPaper: paper,
          connectionType: selectedTypeObject
      };
  
      console.log('Adding connection:', connection);
      setConnections([...connections, connection]);
      setSelectedConnectionType('');
  };
  
  const handleRemoveConnection = (index) => {
    const newConnections = connections.slice();
    newConnections.splice(index, 1);
    setConnections(newConnections);
};

const handleRemoveExistingConnection = (connectionId) => {
  console.log('Removing connection with ID:', connectionId); // Log connection ID
  fetch(`http://127.0.0.1:8000/api/remove_connection/${connectionId}`, {
      method: 'DELETE',
  })
      .then(response => {
          if (response.ok) {
              setExistingConnections(existingConnections.filter(conn => conn.id !== connectionId));
              fetchExistingConnections(originalPaper.data.id);
          } else {
              throw new Error('Failed to remove connection');
          }
      })
      .catch(error => console.error('Error removing connection:', error));
};


    const handleSaveConnections = () => {
        const formattedConnections = connections.map(conn => ({
            originalPaper: conn.originalPaper,
            relatedPaper: conn.relatedPaper,
            connectionType: { id: conn.connectionType.id, name: conn.connectionType.name }
        }));

        console.log('Sending data:', { connections: formattedConnections, subjectId: selectedSubject });

        fetch(`http://127.0.0.1:8000/api/add_connections/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ connections: formattedConnections, subjectId: selectedSubject })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Connections saved:', data);
            setConnections([]);
            fetchExistingConnections(originalPaper.data.id);
        })
        .catch(error => console.error('Error saving connections:', error));
    };

    const handleDeselectOriginalPaper = () => {
      setOriginalPaper(null);
      setExistingConnections([]);
    };

    const categorisedSubjects = subjects.reduce((acc, subject) => {
        const category = subject.overarching_subject || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(subject);
        return acc;
    }, {});

    // Sort subjects within each category alphabetically
    Object.keys(categorisedSubjects).forEach(category => {
        categorisedSubjects[category].sort((a, b) => a.display_name.localeCompare(b.display_name));
    });

    return (
        <div className="container">
            <h1>Add Connections</h1>
            <div className="content">
                <div className="left-side">
                    <div className="search-box">
                        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                            <option value="">Select Subject</option>
                            {Object.keys(categorisedSubjects).map(category => (
                                <optgroup key={category} label={category}>
                                    {categorisedSubjects[category].map(subject => (
                                        <option key={subject.subject_id} value={subject.subject_id}>
                                            {subject.display_name}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for papers"
                            onKeyDown={e => {
                                if (e.key === 'Enter' && e.target.value) {
                                    handleSearch(e.target.value);
                                }
                            }}
                        />
                        <button onClick={handleSearch}>Search</button>
                        {originalPaper && (
                            <button onClick={handleDeselectOriginalPaper}>Deselect Original Paper</button>
                        )}
                    </div>
                    {originalPaper && (
                        <div className="original-paper">
                            <h2>Original Paper</h2>
                            <div>
                                <strong>Title:</strong> {originalPaper.data.label} <br />
                                <strong>Author:</strong> {originalPaper.data.author}
                            </div>
                        </div>
                    )}
                    <div className="existing-connections">
                        <h2>Existing Connections</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Source</th>
                                    <th>Target</th>
                                    <th>Type</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {existingConnections.length > 0 ? (
                                    existingConnections.map((conn, index) => (
                                        <tr key={index}>
                                            <td>{conn.source.title}</td>
                                            <td>{conn.target.title}</td>
                                            <td>{conn.type.name}</td>
                                            <td><button onClick={() => handleRemoveExistingConnection(conn.id)}>Remove</button></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No existing connections</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="right-side">
                    <div className="results">
                        <h2>Search Results</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.length > 0 ? (
                                    results.map(paper => (
                                        <tr key={paper.data.id}>
                                            <td>{paper.data.label}</td>
                                            <td>{paper.data.author}</td>
                                            <td>
                                                {originalPaper ? (
                                                    <>
                                                        <select onChange={(e) => setSelectedConnectionType(e.target.value)} value={selectedConnectionType}>
                                                            <option value="">Select Connection Type</option>
                                                            {connectionTypes.map(type => (
                                                                <option key={type.id} value={type.id}>
                                                                    {type.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <button onClick={() => handleAddConnection(paper)}>Add Connection</button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => handleSelectOriginalPaper(paper)}>Select as Original Paper</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3">No results found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="connections">
                        <h2>Selected Connections</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Original Paper</th>
                                    <th>Author</th>
                                    <th>Related Paper</th>
                                    <th>Author</th>
                                    <th>Connection Type</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {connections.map((paper, index) => (
                                    <tr key={index}>
                                        <td>{paper.originalPaper.data.label}</td>
                                        <td>{paper.originalPaper.data.author}</td>
                                        <td>{paper.relatedPaper.data.label}</td>
                                        <td>{paper.relatedPaper.data.author}</td>
                                        <td>{connectionTypes.find(type => type.id === paper.connectionType.id)?.name || "N/A"}</td>
                                        <td><button onClick={() => handleRemoveConnection(index)}>Remove</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={handleSaveConnections}>Save Connections</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddConnectionPage;
