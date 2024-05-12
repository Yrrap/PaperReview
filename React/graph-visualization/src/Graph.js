import React, { useEffect, useRef } from 'react';
import Cytoscape from 'cytoscape';

const Graph = ({ elements }) => {
    const cyContainerRef = useRef(null);

    useEffect(() => {
        const container = cyContainerRef.current;
        if (!container) {
            console.error('Cytoscape container not found');
            return;
        }
    
        const cy = Cytoscape({
            container: container,
            layout: { name: 'cose' },
            elements: elements,
            style: [
                {
                    selector: 'node',
                    style: { 'background-color': '#666', 'label': '' }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': (ele) => {
                            // Simplified switch statement for color based on label
                            switch (ele.data('label')) {
                                case 'related field': return '#0ff';
                                case 'similar results': return '#f00';
                                case 'cites': return '#0f0';
                                case 'similar methods': return '#00f';
                                default: return '#00f'; // Default color
                            }
                        },
                        'target-arrow-color': '#ccc',
                        'target-arrow-shape': 'triangle'
                    }
                }
            ]
        });
    
        cy.on('mouseover', 'node', function(evt) {
            const node = evt.target;
            if (node && node.isNode() && node.data()) {
                node.style('label', node.data('label'));
            }
        });
    
        cy.on('mouseout', 'node', function(evt) {
            const node = evt.target;
            if (node && node.isNode()) {
                node.style('label', '');
            }
        });
    
        return () => cy.destroy();
    }, [elements]);
    

    return <div ref={cyContainerRef} style={{ width: '800px', height: '600px' }}/>;
};

export default Graph;
