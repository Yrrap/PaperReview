import React, { useState, useEffect } from 'react';
import CoseGraph from './CoseGraph';

const Filtering = ({ data }) => {
  const [relatedField, setRelatedField] = useState(true);
  const [similarResults, setSimilarResults] = useState(true);
  const [cites, setCites] = useState(true);
  const [similarMethods, setSimilarMethods] = useState(true);
  const [filteredElements, setFilteredElements] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    const filterElements = () => {
      if (!data || !data.nodes || !data.edges) {
        // If data or data.edges is not available, return default empty structure
        return { nodes: [], edges: [] };
      }

      const filteredEdges = data.edges.filter(edge => {
        if (!relatedField && edge.data.label === 'related field') return false;
        if (!similarResults && edge.data.label === 'similar results') return false;
        if (!cites && edge.data.label === 'cites') return false;
        if (!similarMethods && edge.data.label === 'similar methods') return false;
        return true;
      });

      return { nodes: data.nodes, edges: filteredEdges };
    };

    setFilteredElements(filterElements());
  }, [data, relatedField, similarResults, cites, similarMethods]); // Re-calculate when any of these dependencies change

  return (
    <div>
      <div>
        <label>
          Related Field
          <input type="checkbox" checked={relatedField} onChange={() => setRelatedField(!relatedField)} />
        </label>
        <label>
          Similar Results
          <input type="checkbox" checked={similarResults} onChange={() => setSimilarResults(!similarResults)} />
        </label>
        <label>
          Cites
          <input type="checkbox" checked={cites} onChange={() => setCites(!cites)} />
        </label>
        <label>
          Similar Methods
          <input type="checkbox" checked={similarMethods} onChange={() => setSimilarMethods(!similarMethods)} />
        </label>
      </div>
      <CoseGraph elements={filteredElements} />
    </div>
  );
};

export default Filtering;
