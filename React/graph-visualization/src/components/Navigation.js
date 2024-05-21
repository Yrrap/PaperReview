import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = () => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/subjects/')
      .then(response => response.json())
      .then(data => setSubjects(data))
      .catch(error => console.error('Error fetching subjects:', error));
  }, []);

  const categorizedSubjects = subjects.reduce((acc, subject) => {
    const category = subject.overarching_subject || 'Other'; // Assuming each subject has a 'overarching_subject' field
    if (!acc[category]) acc[category] = [];
    acc[category].push(subject);
    return acc;
  }, {});

  return (
    <nav>
      <div className="home">
        <Link to="/">Home</Link>
      </div>
      <div className="dropdown">
        <button className="dropbtn">Subjects</button>
        <div className="dropdown-content">
          {Object.keys(categorizedSubjects).map(category => (
            <div key={category} className="category">
              <h4>{category}</h4>
              {categorizedSubjects[category].map(subject => (
                <Link key={subject.subject_id} to={`/subject/${subject.subject_id}`}>
                  {subject.display_name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="add-connection">
        <Link to="/add-connection">Add Connection</Link>
      </div>
      <div className="cytoscape-help">
        <Link to="/cytoscape-help">Cytoscape Help</Link>
      </div>
    </nav>
  );
};

export default Navigation;
