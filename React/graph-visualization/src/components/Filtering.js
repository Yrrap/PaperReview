import React, { useState, useEffect } from 'react';
import CoseGraph from './CoseGraph';

const Filtering = ({ elements, searchResults }) => {
  const [relatedField, setRelatedField] = useState(true);
  const [similarResults, setSimilarResults] = useState(true);
  const [cites, setCites] = useState(true);
  const [similarMethods, setSimilarMethods] = useState(true);
  const [filteredElements, setFilteredElements] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    const filterElements = () => {
      if (!elements || !elements.nodes || !elements.edges) return { nodes: [], edges: [] };

      const filteredEdges = elements.edges.filter(edge => {
        if (!relatedField && edge.data.label === 'related field') return false;
        if (!similarResults && edge.data.label === 'similar results') return false;
        if (!cites && edge.data.label === 'cites') return false;
        if (!similarMethods && edge.data.label === 'similar methods') return false;
        return true;
      });

      let filteredNodes = elements.nodes;
      if (searchResults && searchResults.nodes.length > 0) {
        filteredNodes = searchResults.nodes;
      }

      const nodeIds = new Set(filteredNodes.map(node => node.data.id));
      const finalFilteredEdges = filteredEdges.filter(edge => nodeIds.has(edge.data.source) && nodeIds.has(edge.data.target));

      return { nodes: filteredNodes, edges: finalFilteredEdges };
    };

    setFilteredElements(filterElements());
  }, [elements, relatedField, similarResults, cites, similarMethods, searchResults]);

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
      <CoseGraph elements={filteredElements} />
    </div>
  );
};

export default Filtering;
