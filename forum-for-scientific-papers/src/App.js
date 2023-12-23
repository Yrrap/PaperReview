import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import TopicPage from './TopicPage';
import './styles.css';

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topic/:topicId" element={<TopicPage />} />
          {/* You can add more routes here */}
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
