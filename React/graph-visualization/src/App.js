import React, { useState, useEffect } from 'react';
import Graph from './Graph';
import Legend from './Legend';
import ConcGraph from './ConcGraph';
import CoseGraph from './CoseGraph';
import ErrorBoundary from './ErrorBoundary';
import Filtering from './Filtering';
import GraphSearch from './GraphSearch';

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
            {/* <Graph elements={elements} />
            <ErrorBoundary>
                <ConcGraph elements={elements} />
            </ErrorBoundary> */}
            <ErrorBoundary>
                <GraphSearch elements={elements} />
                <CoseGraph elements={elements} />
            </ErrorBoundary>
            <Filtering data={elements} />
            <button onClick={refreshData}>Refresh Data</button>
            <Legend />
        </div>
    );
};

export default App;
