import React, { useState, useEffect } from 'react';
import Graph from './Graph';

const App = () => {
    const [elements, setElements] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/graph_data/')
            .then(response => response.json())
            .then(data => {
                setElements(data); // Adjust according to your data structure
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>Network Graph</h1>
            <Graph elements={elements} />
        </div>
    );
};

export default App;
