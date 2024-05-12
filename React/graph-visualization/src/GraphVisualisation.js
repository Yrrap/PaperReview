import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { Network } from 'vis-network/standalone';

const GraphVisualisation = () => {
  const networkRef = useRef(null);

  useEffect(() => {
    const container = networkRef.current;

    const fetchGraphData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/graph');
        const { nodes, edges } = response.data;

        const data = {
          nodes: new window.vis.DataSet(nodes),
          edges: new window.vis.DataSet(edges)
        };

        const options = {
          nodes: {
            shape: 'dot',
            size: 15,
            font: {
              size: 16,
              color: '#ffffff'
            },
            borderWidth: 2
          },
          edges: {
            width: 2,
            arrows: 'to'
          },
          layout: {
            improvedLayout: true
          },
          physics: {
            barnesHut: {
              gravitationalConstant: -8000,
              centralGravity: 0.3,
              springLength: 200
            },
            stabilization: {
              enabled: true,
              iterations: 1000
            }
          }
        };

        new Network(container, data, options);
      } catch (error) {
        console.error('Error fetching graph data:', error);
      }
    };

    fetchGraphData();
  }, []);

  return <div ref={networkRef} style={{ height: '600px' }} />;
};

export default GraphVisualisation;
