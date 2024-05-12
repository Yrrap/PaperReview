import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';

// Register the cola layout with cytoscape
cytoscape.use(cola);

const GraphComponent = ({ elements }) => {
    const cyRef = useRef(null);

    useEffect(() => {
        if (!elements) {
            return;
        }

        const cy = cytoscape({
            container: cyRef.current,
            elements: elements,
            style: [
                { selector: 'node', style: { 'background-color': '#11479e', 'label': 'data(label)' }},
                { selector: 'edge', style: { 'width': 3, 'line-color': '#9dbaea', 'curve-style': 'bezier' }}
            ],
            layout: {
                name: 'cola',
                nodeSpacing: 100,
                edgeLengthVal: 45,
                animate: true,
                fit: true,
                padding: 30
            }
        });

        return () => cy.destroy();  // Cleanup on component unmount
    }, [elements]);

    return <div ref={cyRef} style={{ width: '100%', height: '600px' }} />;
};

export default GraphComponent;
