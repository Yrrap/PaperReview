import React, { useEffect, useRef, useState, useCallback } from 'react';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import '../styles/CoseGraph.css';

cytoscape.use(fcose);

const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const CoseGraph = ({ elements }) => {
  const cyContainerRef = useRef(null);
  const [cy, setCy] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize or update Cytoscape instance with throttle
  const updateCytoscape = useCallback(
    throttle((combinedElements) => {
      if (!cyContainerRef.current) {
        console.error('Cytoscape container is not set');
        return;
      }

      if (combinedElements.length > 0) {
        if (!cy) {
          console.log('CoseGraph useEffect - initializing new Cytoscape instance');
          const newCy = cytoscape({
            container: cyContainerRef.current,
            elements: combinedElements,
            layout: {
              name: 'fcose',
              idealEdgeLength: 100,
              nodeRepulsion: 4500,
              animate: false,
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
                },
              },
              {
                selector: 'edge',
                style: {
                  'width': 2,
                  'line-color': ele => {
                    switch (ele.data('label')) {
                      case 'related field': return '#0ff';
                      case 'similar results': return '#f00';
                      case 'cites': return '#0f0';
                      case 'similar methods': return '#00f';
                      default: return '#888';
                    }
                  },
                },
              },
            ],
          });

          newCy.on('mouseover', 'node', (event) => {
            const nodeData = event.target.data();
            const tooltipContent = `Title: ${nodeData.label}, Author: ${nodeData.author || 'undefined'}`;
            showTooltip(event.renderedPosition, tooltipContent);
          });

          newCy.on('mouseout', 'node', hideTooltip);

          setCy(newCy);
        } else {
          // Update existing instance with new elements
          console.log('CoseGraph useEffect - updating Cytoscape instance');
          try {
            cy.batch(() => {
              cy.elements().remove();
              cy.add(combinedElements);
              cy.layout({ name: 'fcose', idealEdgeLength: 100, nodeRepulsion: 4500, animate: false }).run();
            });
          } catch (error) {
            console.error('Error running layout:', error);
          }
        }
      }
    }, 500), [cy, cyContainerRef]
  );

  useEffect(() => {
    console.log('CoseGraph useEffect - elements:', elements);

    if (!elements || !Array.isArray(elements.nodes) || !Array.isArray(elements.edges)) {
      console.error('Invalid elements structure:', elements);
      return;
    }

    const combinedElements = [...elements.nodes, ...elements.edges];
    console.log('CoseGraph useEffect - combinedElements:', combinedElements);

    updateCytoscape(combinedElements);

    return () => {
      if (cy) {
        console.log('CoseGraph useEffect - cleaning up Cytoscape instance');
        cy.removeListener('mouseover', 'node');
        cy.removeListener('mouseout', 'node');
        cy.destroy();
        setCy(null); // Ensure to reset the state to avoid stale references
      }
    };
  }, [elements, updateCytoscape]);

  useEffect(() => {
    console.log('CoseGraph useEffect - searchTerm:', searchTerm);
    if (cy) {
      cy.batch(() => {
        cy.nodes().forEach(node => {
          node.style('display', node.data('label').toLowerCase().includes(searchTerm.toLowerCase()) ? 'element' : 'none');
        });
      });
    }
  }, [searchTerm, cy]);

  function showTooltip(position, content) {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.left = `${position.x + 20}px`;
    tooltip.style.top = `${position.y + 20}px`;
    tooltip.innerHTML = content;
    tooltip.style.display = 'block';
  }

  function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
  }

  return (
    <div className="cose-graph-wrapper">
      <div
        className="cose-graph-container"
        ref={cyContainerRef}
      />
      <div id="tooltip" className="tooltip"></div>
    </div>
  );
};

export default CoseGraph;
