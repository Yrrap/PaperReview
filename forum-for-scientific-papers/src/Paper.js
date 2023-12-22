function Paper({ title, abstract, link }) {
    return (
      <div className="paper">
        <h3>{title}</h3>
        <p>{abstract}</p>
        <a href={link} target="_blank" rel="noopener noreferrer">Read more</a>
      </div>
    );
  }
  
  export default Paper;
  