import React, { useState, useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

const GraphSearch = ({ elements }) => {
  const cyRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cy, setCy] = useState(null);  // State to hold the Cytoscape instance

  useEffect(() => {
    // Check if the container is ready and elements are provided
    if(cyRef.current && elements) {
      const newCy = cytoscape({
        container: cyRef.current,
        elements: elements,
        style: [ /* Define your style here */ ],
        layout: { name: 'grid' }
      });

      setCy(newCy);  // Store the cytoscape instance in state
    }

    // Cleanup function to destroy the cytoscape instance
    return () => {
      if (cy) {
        cy.destroy();
      }
    };
  }, [elements]);

  useEffect(() => {
    // Check if cy is initialized and there's a valid search term
    if (cy) {
      cy.nodes().forEach(node => {
        // Check if the node's label includes the search term and update display style
        node.style('display', node.data('label').toLowerCase().includes(searchTerm.toLowerCase()) ? 'element' : 'none');
      });
    }
  }, [searchTerm, cy]);  // Depend on cy to ensure it's available

  return (
    <div>
      <input type="text" placeholder="Search nodes..." onChange={e => setSearchTerm(e.target.value)} />
      <div ref={cyRef} style={{ width: '800px', height: '600px' }} />
    </div>
  );
};

export default GraphSearch;
