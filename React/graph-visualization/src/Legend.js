const LegendList = [
        { colour: '#0ff', label: 'Related Field', id: 1 },
        { colour: '#f00', label: 'Similar Results', id: 2},
        { colour: '#0f0', label: 'Cites', id: 3},
        { colour: '#00f', label: 'Similar Methods', id: 4}
];

export default function Legend() {
    const listItems = LegendList.map((item, index) => (
        <li key={item.id} style={{ color: item.colour }}>
            {item.label}
        </li>
    ));


    return (
        <ul>{listItems}</ul>
    );
};