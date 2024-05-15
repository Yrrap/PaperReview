import React, { useEffect, useRef, useState } from 'react';
import Cytoscape from 'cytoscape';

const ConcGraph = ({ elements }) => {
    const cyContainerRef = useRef(null);
    const cyInstanceRef = useRef(null);
    const [weights, setWeights] = useState({
        "related field": 1,
        "similar results": 2,
        "cites": 3,
        "similar methods": 4
    });

    const calculateScores = () => {
        
        const scores = {};
        if (!elements || !elements.nodes || !elements.edges) {
            console.error('Invalid elements structure:', elements);
            return scores;
        }

        elements.nodes.forEach(node => {
            scores[node.data.id] = 0;
        });

        elements.edges.forEach(edge => {
            const weight = weights[edge.data.label] || 0;
            scores[edge.data.source] += weight;
            scores[edge.data.target] += weight;
        });

        return scores;
    };

    useEffect(() => {
        if (!cyContainerRef.current) {
            console.error('Cytoscape container not found');
            return;
        }

        const scores = calculateScores();

        if (!cyInstanceRef.current) {
            cyInstanceRef.current = new Cytoscape({
                container: cyContainerRef.current,
                elements: elements,
                style: [
                    {
                        selector: 'node',
                        style: {
                            'background-color': '#666',
                            'label': 'data(label)',
                            'text-valign': 'center',
                            'color': '#fff',
                            'text-outline-width': 2,
                            'text-outline-color': '#666',
                            'width': '60px',
                            'height': '60px',
                            'font-size': '10px'
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'width': 3,
                            'line-color': ele => {
                                switch (ele.data('label')) {
                                    case 'related field': return '#0ff';
                                    case 'similar results': return '#f00';
                                    case 'cites': return '#0f0';
                                    case 'similar methods': return '#00f';
                                    default: return '#888';
                                }
                            },
                            'target-arrow-color': ele => ele.style('line-color'),
                            'target-arrow-shape': 'triangle'
                        }
                    }
                ],
                layout: {
                    name: 'concentric',
                    concentric: node => scores[node.id()],
                    levelWidth: () => 1
                }
            });
        } else {
            cyInstanceRef.current.elements().remove();
            cyInstanceRef.current.add(elements);
            cyInstanceRef.current.style().update();
            cyInstanceRef.current.layout({
                name: 'concentric',
                concentric: node => scores[node.id()],
                levelWidth: () => 1
            }).run();
        }

        return () => {
            if (cyInstanceRef.current) {
                cyInstanceRef.current.destroy();
                cyInstanceRef.current = null;
            }
        };
    }, [elements, weights]);

    return (
        <div>
            <div ref={cyContainerRef} style={{ width: '800px', height: '600px' }} />
            <div>
                {Object.keys(weights).map(type => (
                    <div key={type}>
                        <label>
                            {type}: 
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={weights[type]}
                                onChange={(e) => setWeights({...weights, [type]: parseInt(e.target.value, 10)})}
                            />
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConcGraph;
