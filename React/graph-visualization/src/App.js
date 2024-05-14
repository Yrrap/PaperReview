import React, { useState, useEffect } from 'react';
import Graph from './Graph';
import Legend from './Legend';
import ConcGraph from './ConcGraph';

const App = () => {
    const [elements, setElements] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch('http://127.0.0.1:8000/api/graph_data/')
            .then(response => response.json())
            .then(data => {
                setElements(data); 
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    const refreshData = () => {
        fetchData();
    };

    return (
        <div>
            <h1>Network Graph</h1>
            <Graph elements={elements} />
            <ConcGraph elements={elements} />
            <button onClick={refreshData}>Refresh Data</button>
            <Legend />
        </div>
    );
};

export default App;
