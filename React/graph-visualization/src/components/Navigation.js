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

  return (
    <nav>
      {subjects.map(subject => (
        <Link key={subject.subject_id} to={`/subject/${subject.name}`}>
          {subject.name}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
