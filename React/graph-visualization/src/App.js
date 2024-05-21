import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import SubjectPage from './pages/SubjectPage';
import Home from './pages/Home';
import CytoscapeHelp from './pages/CytoscapeHelp';
import AddConnectionPage from './pages/AddConnectionPage';
// import './styles/Global.css';
// import './styles/App.css';
// import './styles/Navigation.css';


const App = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <Navigation />
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/subject/:subject_id" element={<SubjectPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/add-connection" element={<AddConnectionPage />} />
            <Route path="/cytoscape-help" element={<CytoscapeHelp />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
