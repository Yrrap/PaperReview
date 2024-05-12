import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GraphComponent from './GraphComponent';  // Assuming you have a GraphComponent as described previously

function App() {
    const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

    useEffect(() => {
        axios.get('http://localhost:5000/api/graph')
            .then(response => {
                setGraphData(response.data);
            })
            .catch(error => {
                console.error('Error fetching graph data:', error);
            });
    }, []);

    return (
        <div className="App">
            <h1>Interactive Graph Visualisation</h1>
            <GraphComponent elements={graphData} />
        </div>
    );
}

export default App;
