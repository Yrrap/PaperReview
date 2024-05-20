import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Global.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to the Paper Review App</h1>
      </header>
      <main className="home-main">
        <p>
          This website is aimed at aiding in the writing of paper reviews. It provides a network graph of papers and their references, which can be filtered by author, year, and keyword. The graph is interactive, allowing you to click on nodes to view paper details and click and drag to move nodes around.
        </p>
        <p>
          To get started, select a subject from the Subjects dropdown in the navigation bar. This will take you to a network graph of papers in that subject. From there, you can filter the graph, refresh the data, and click on nodes to view paper details.
        </p>
        <p>
          To learn more about how to read the Cytoscape.js graph, check out the <Link to="/cytoscape-help">Cytoscape Help</Link> page.
        </p>
      </main>
    </div>
  );
};

export default Home;
