import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Filtering from '../components/Filtering';
import '../styles/App.css';

const SubjectPage = () => {
  const { subject_id } = useParams();
  const [data, setData] = useState({ nodes: [], edges: [] });
  const [subject, setSubject] = useState({});

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/subjects/${subject_id}/`)
      .then(response => response.json())
      .then(data => setSubject(data))
      .catch(error => console.error('Error fetching subject name:', error));

    fetch(`http://127.0.0.1:8000/api/graph_data/${subject_id}/`)
      .then(response => response.json())
      .then(data => {
        const nodeIds = new Set(data.nodes.map(node => node.data.id));
        const validEdges = data.edges.filter(edge => nodeIds.has(edge.data.source) && nodeIds.has(edge.data.target));
        setData({ nodes: data.nodes, edges: validEdges });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [subject_id]);

  const refreshData = () => {
    fetch(`http://127.0.0.1:8000/api/graph_data/${subject_id}/`)
      .then(response => response.json())
      .then(data => {
        const nodeIds = new Set(data.nodes.map(node => node.data.id));
        const validEdges = data.edges.filter(edge => nodeIds.has(edge.data.source) && nodeIds.has(edge.data.target));
        setData({ nodes: data.nodes, edges: validEdges });
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <a href="/">Subjects</a>
      </header>
      <main>
        <h1>Network Graph for {subject.display_name}</h1>
        <Filtering data={data} />
        <button onClick={refreshData}>Refresh Data</button>
      </main>
    </div>
  );
};

export default SubjectPage;
