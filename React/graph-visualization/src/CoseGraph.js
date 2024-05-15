import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';

cytoscape.use(fcose);

const CoseGraph = ({ elements }) => {
  const cyContainerRef = useRef(null);
  const [cy, setCy] = useState(null);  // Keep the cytoscape instance in the state
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!Array.isArray(elements.nodes) || !Array.isArray(elements.edges)) {
      console.error('Invalid elements structure:', elements);
      return;
    }
    
    const combinedElements = [...elements.nodes, ...elements.edges];

    // Initialize the Cytoscape instance only once and update it via setCy
    if (!cy) {
      const newCy = new cytoscape({
        container: cyContainerRef.current,
        elements: combinedElements,
        layout: {
          name: 'fcose',
          idealEdgeLength: 100,
          nodeRepulsion: 4500,
          animate: true,
        },
        style: [
          {
            selector: 'node',
            style: {
              'background-color': '#666',
              'label': 'data(label)',
              'text-valign': 'center',
              'color': '#fff',
              'width': '20px',
              'height': '20px',
              'font-size': '8px',
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 2,
              'line-color': ele => {
                switch (ele.data('label')) {
                  case 'related field': return '#66c2a5';
                  case 'similar results': return '#fc8d62';
                  case 'cites': return '#8da0cb';
                  case 'similar methods': return '#e78ac3';
                  default: return '#888';
                }
              },
            }
          }
        ],
      });

      setCy(newCy);  // Store the Cytoscape instance in state

      // Set up event handlers
      newCy.on('mouseover', 'node', (event) => {
        const nodeData = event.target.data();
        const tooltipContent = `Title: ${nodeData.title}, Author: ${nodeData.author}`;
        showTooltip(event.renderedPosition, tooltipContent);
      });

      newCy.on('mouseout', 'node', (event) => {
        hideTooltip();
      });
    }

    return () => {
      if (cy) {
        cy.destroy();
      }
    };
  }, [elements]);

  useEffect(() => {
    // Update visibility based on search term
    if (cy) {
      cy.nodes().forEach(node => {
        const isVisible = node.data('label').toLowerCase().includes(searchTerm.toLowerCase());
        node.style('display', isVisible ? 'element' : 'none');
      });
    }
  }, [searchTerm, cy]);  // React only on search term changes

  function showTooltip(position, content) {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.left = `${position.x}px`;
    tooltip.style.top = `${position.y}px`;
    tooltip.innerHTML = content;
    tooltip.style.display = 'block';
  }

  function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search nodes..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <div ref={cyContainerRef} style={{ width: '800px', height: '600px' }} />
      <div id="tooltip" style={{ position: 'absolute', display: 'none', backgroundColor: 'white', border: '1px solid black', padding: '10px' }}></div>
    </div>
  );
};

export default CoseGraph;
