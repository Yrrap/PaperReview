import React from 'react';
import '../styles/Legend.css';

const LegendList = [
  { colour: '#0ff', label: 'Related Field', id: 1 },
  { colour: '#f00', label: 'Similar Results', id: 2 },
  { colour: '#0f0', label: 'Cites', id: 3 },
  { colour: '#00f', label: 'Similar Methods', id: 4 }
];

export default function Legend() {
  const listItems = LegendList.map((item) => (
    <div key={item.id} className="legend-item" style={{ backgroundColor: item.colour }}>
      {item.label}
    </div>
  ));

  return (
    <div className="legend-container">
      {listItems}
    </div>
  );
}
