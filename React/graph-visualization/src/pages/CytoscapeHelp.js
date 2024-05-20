import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Global.css';
import '../styles/Help.css';

const CytoscapeHelp = () => {
  return (
    <div className="help-container">
      <main className="help-main">
        <section>
          <h2>Introduction</h2>
          <p>Cytoscape.js is a graph theory library for visualizing and analyzing network graphs.</p>
        </section>
        <section>
          <h2>Basic Interactions</h2>
          <ul>
            <li><strong>Click and Drag:</strong> Move nodes around the graph.</li>
            <li><strong>Zoom In/Out:</strong> Use the mouse wheel to zoom in and out.</li>
            <li><strong>Click on Nodes:</strong> View detailed information about the paper.</li>
          </ul>
        </section>
        <section>
          <h2>Filters</h2>
          <p>You can filter the graph by:</p>
          <ul>
            <li>Related Field</li>
            <li>Similar Results</li>
            <li>Citations</li>
            <li>Similar Methods</li>
          </ul>
        </section>
        <section>
          <h2>Search Functionality</h2>
          <p>Use the search bar to find specific papers or authors. You can:</p>
          <ul>
            <li>Enter multiple search terms.</li>
            <li>Combine different filters.</li>
            <li>Lock search results to refine further.</li>
          </ul>
        </section>
        <section>
          <h2>Resources</h2>
          <p>For more detailed information, check out the official <a href="https://js.cytoscape.org/">Cytoscape.js documentation</a>.</p>
        </section>
      </main>
      <footer className="help-footer">
        <Link to="/">Back to Home</Link>
      </footer>
    </div>
  );
};

export default CytoscapeHelp;