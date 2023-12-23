
// import Latex from 'react-latex-next';

function Paper({ title, authors, abstract, link }) {
    return (
      <div className="paper">
        <h3>{title}</h3>
        {/* <Latex>{title}</Latex></h3> */}
        <h6>{authors}</h6>
        <p>{abstract}</p>
        <a href={link} target="_blank" rel="noopener noreferrer">Read more</a>
      </div>
    );
  }
  
  export default Paper;
  