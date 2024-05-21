// SearchPapers.js
import React, { useState } from 'react';

const SearchPapers = ({ onAddConnection }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        fetch(`http://127.0.0.1:8000/api/search/?q=${query}`)
            .then(response => response.json())
            .then(data => setResults(data.nodes))
            .catch(error => console.error('Error fetching search results:', error));
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for papers"
            />
            <button onClick={handleSearch}>Search</button>
            <ul>
                {results.map(paper => (
                    <li key={paper.data.id}>
                        {paper.data.label} ({paper.data.author})
                        <button onClick={() => onAddConnection(paper)}>Add Connection</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchPapers;
