import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import SubjectPage from './pages/SubjectPage';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <Navigation />
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/subject/:subject" element={<SubjectPage />} />
            <Route path="/" element={<h1>Welcome to the Network Graph App</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
