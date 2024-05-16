import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = () => {
  return (
    <nav>
      <Link to="/subject/subject1">Subject1</Link>
      <Link to="/subject/subject2">Subject2</Link>
      <Link to="/subject/subject3">Subject3</Link>
    </nav>
  );
};

export default Navigation;
