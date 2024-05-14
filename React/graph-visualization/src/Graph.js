import React, { useEffect, useRef } from 'react';
import Cytoscape from 'cytoscape';


const Graph = ({ elements }) => {
    const cyContainerRef = useRef(null);
    const cyInstanceRef = useRef(null);  // To hold the Cytoscape instance

    // Initialize Cytoscape instance
    useEffect(() => {
        if (!cyContainerRef.current) {
            console.error('Cytoscape container not found');
            return;
        }

        // Create the Cytoscape instance if it doesn't already exist
        if (!cyInstanceRef.current) {
            cyInstanceRef.current = new Cytoscape({
                container: cyContainerRef.current,
                layout: { name: 'cose' },
                style: [
                    {
                        selector: 'node',
                        style: { 
                            'background-color': '#666',
                            'label': 'data(label)', // Use 'label' as per your node data
                            'text-opacity': 0 // Initially hide the label
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'width': 3,
                            'line-color': ele => {
                                switch (ele.data('label')) { // Ensure edge data uses 'label' similarly if applicable
                                    case 'related field': return '#0ff';
                                    case 'similar results': return '#f00';
                                    case 'cites': return '#0f0';
                                    case 'similar methods': return '#00f';
                                    default: return '#fff';
                                }
                            },
                            'target-arrow-color': '#ccc',
                            'target-arrow-shape': 'triangle'
                        }
                    }
                ],
                elements: elements
            });

            // Event handlers for label visibility
            attachEventHandlers();
        }

        // Cleanup function to destroy Cytoscape instance when component unmounts
        return () => {
            if (cyInstanceRef.current) {
                cyInstanceRef.current.destroy();
                cyInstanceRef.current = null;
            }
        };
    }, []);  // Empty dependency array ensures this effect only runs once

    // Update elements whenever the `elements` prop changes
    useEffect(() => {
        if (cyInstanceRef.current) {
            cyInstanceRef.current.elements().remove();  // Remove all current elements
            cyInstanceRef.current.add(elements);  // Add new elements
            cyInstanceRef.current.layout({ name: 'cose' }).run();  // Re-run layout
            attachEventHandlers();  // Re-attach event handlers
        }
    }, [elements]);

    // Function to attach event handlers
    const attachEventHandlers = () => {
        if (!cyInstanceRef.current) return;

        cyInstanceRef.current.on('mouseover', 'node', event => {
            const node = event.target;
            node.style('text-opacity', 1); // Show label
        });

        cyInstanceRef.current.on('mouseout', 'node', event => {
            const node = event.target;
            node.style('text-opacity', 0); // Hide label
        });
    };

    return <div ref={cyContainerRef} style={{ width: '800px', height: '600px' }} />;
};

export default Graph;
