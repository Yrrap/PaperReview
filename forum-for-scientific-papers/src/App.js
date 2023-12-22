import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopicPage from './TopicPage'; // A component for topic-specific pages
import Home from './Home'; // A component for the home page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/topic/:topicId" element={<TopicPage />} />
        // Add other routes as needed
      </Routes>
    </Router>
  );
}

export default App;
