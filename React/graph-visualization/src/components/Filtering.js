import React, { useState, useEffect } from 'react';
import CoseGraph from './CoseGraph';

const Filtering = ({ data }) => {
  const [relatedField, setRelatedField] = useState(true);
  const [similarResults, setSimilarResults] = useState(true);
  const [cites, setCites] = useState(true);
  const [similarMethods, setSimilarMethods] = useState(true);
  const [searchTerms, setSearchTerms] = useState([]);
  const [filteredElements, setFilteredElements] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    const filterElements = () => {
      if (!data || !data.nodes || !data.edges) return { nodes: [], edges: [] };

      const filteredEdges = data.edges.filter(edge => {
        if (!relatedField && edge.data.label === 'related field') return false;
        if (!similarResults && edge.data.label === 'similar results') return false;
        if (!cites && edge.data.label === 'cites') return false;
        if (!similarMethods && edge.data.label === 'similar methods') return false;
        return true;
      });

      let filteredNodes = data.nodes;
      searchTerms.forEach(term => {
        filteredNodes = filteredNodes.filter(node =>
          node.data.label.toLowerCase().includes(term.toLowerCase()) ||
          (node.data.author && node.data.author.toLowerCase().includes(term.toLowerCase()))
        );
      });

      const nodeIds = new Set(filteredNodes.map(node => node.data.id));
      const finalFilteredEdges = filteredEdges.filter(edge => nodeIds.has(edge.data.source) && nodeIds.has(edge.data.target));

      return { nodes: filteredNodes, edges: finalFilteredEdges };
    };

    setFilteredElements(filterElements());
  }, [data, relatedField, similarResults, cites, similarMethods, searchTerms]);

  const addSearchTerm = term => {
    setSearchTerms([...searchTerms, term]);
  };

  const removeSearchTerm = index => {
    setSearchTerms(searchTerms.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="legend">
        <label className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#0ff' }}></span>
          <input type="checkbox" checked={relatedField} onChange={() => setRelatedField(!relatedField)} />
          Related Field
        </label>
        <label className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#f00' }}></span>
          <input type="checkbox" checked={similarResults} onChange={() => setSimilarResults(!similarResults)} />
          Similar Results
        </label>
        <label className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#0f0' }}></span>
          <input type="checkbox" checked={cites} onChange={() => setCites(!cites)} />
          Cites
        </label>
        <label className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#00f' }}></span>
          <input type="checkbox" checked={similarMethods} onChange={() => setSimilarMethods(!similarMethods)} />
          Similar Methods
        </label>
      </div>
      <div className="search-terms">
        {searchTerms.map((term, index) => (
          <div key={index} className="search-term">
            {term}
            <button onClick={() => removeSearchTerm(index)}>x</button>
          </div>
        ))}
        <input
          type="text"
          placeholder="Add search term"
          onKeyDown={e => {
            if (e.key === 'Enter' && e.target.value) {
              addSearchTerm(e.target.value);
              e.target.value = '';
            }
          }}
        />
      </div>
      <CoseGraph elements={filteredElements} />
    </div>
  );
};

export default Filtering;