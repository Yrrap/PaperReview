// SubjectPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Filtering from '../components/Filtering';
import '../styles/SubjectPage.css';

const SubjectPage = () => {
  const { subject_id } = useParams(); // Ensure the param name matches the URL pattern in your routes
  const [data, setData] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/graph_data/${subject_id}`)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [subject_id]);

  const refreshData = () => {
    fetch(`http://127.0.0.1:8000/api/graph_data/${subject_id}`)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  return (
    <div className="subject-page">
      <h1>Network Graph for {subject_id}</h1>
      <Filtering data={data} />
      <button className="refresh-button" onClick={refreshData}>Refresh Data</button>
    </div>
  );
};

export default SubjectPage;
