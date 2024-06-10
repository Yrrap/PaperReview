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
    const category = subject.overarching_subject || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(subject);
    return acc;
  }, {});

  // Sort subjects within each category alphabetically
  Object.keys(categorizedSubjects).forEach(category => {
    categorizedSubjects[category].sort((a, b) => a.display_name.localeCompare(b.display_name));
  });

  return (
    <nav className="nav-bar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li className="dropdown">
          <span className="dropbtn">Subjects</span>
          <div className="dropdown-content">
            {Object.keys(categorizedSubjects).map(category => (
              <div key={category} className="category">
                <span className="category-title">{category}</span>
                <div className="nested-dropdown">
                  {categorizedSubjects[category].map(subject => (
                    <Link key={subject.subject_id} to={`/subject/${subject.subject_id}`}>
                      {subject.display_name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </li>
        <li><Link to="/add-connection">Add Connection</Link></li>
        <li><Link to="/cytoscape-help">Cytoscape Help</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;
