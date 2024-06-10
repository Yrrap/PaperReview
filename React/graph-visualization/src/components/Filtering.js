import React, { useState, useEffect } from 'react';
import CoseGraph from './CoseGraph';
import '../styles/App.css';

const Filtering = ({ data }) => {
  const [relatedField, setRelatedField] = useState(true);
  const [similarResults, setSimilarResults] = useState(true);
  const [cites, setCites] = useState(true);
  const [similarMethods, setSimilarMethods] = useState(true);
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

      const nodeIds = new Set(filteredEdges.flatMap(edge => [edge.data.source, edge.data.target]));
      const filteredNodes = data.nodes.filter(node => nodeIds.has(node.data.id));

      return { nodes: filteredNodes, edges: filteredEdges };
    };

    setFilteredElements(filterElements());
  }, [data, relatedField, similarResults, cites, similarMethods]);

  return (
    <div className="filtering-container">
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
