import axios from 'axios';

const BASE_URL = 'http://export.arxiv.org/api/query/';

export const fetchPapers = async (searchQuery = 'all:electron', start = 0, maxResults = 15) => {
  const query = `/?search_query=${searchQuery}&start${start}&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;
  console.log('query: ');
  console.log(query);
  try {
    const response = await axios.get(`${BASE_URL}${query}`);
    console.log(response);
    console.log(response.data);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "application/xml");
    console.log('xmlDoc: ');
    console.log(xmlDoc);
    const entries = xmlDoc.querySelectorAll('feed > entry');
    let papers = [];

    console.log('entries: ');
    console.log(entries);
    for (let i = 0; i < entries.length; i++) {
      console.log(i);
      console.log(entries[i]);
      const title = entries[i].getElementsByTagName('title')[0].textContent;
      const summary = entries[i].getElementsByTagName('summary')[0].textContent;
      const authorElements = entries[i].getElementsByTagName('author');
      const authors = Array.from(authorElements).map(author => author.textContent.trim()).join(', ');
      const linkElement = entries[i].getElementsByTagName('link');
      const pdfLink = Array.from(linkElement).find(ele => ele.getAttribute('title') === 'pdf');
      const link = pdfLink ? pdfLink.getAttribute('href') : '';
      
      papers.push({ title, authors, summary, link });
    }

    return papers;
  } catch (error) {
    console.error("Error fetching papers from arXiv:", error);
    return [];
  }
};


export const fetchPapersByTags = async (tags) => {
  const query = tags.split(',').map(tag => `cat:${tag.trim()}`).join('+OR+');
  try {
    return await fetchPapers(query);
  } catch (error) {
    console.error("Error fetching papers by tags from arXiv:", error);
    throw error;
  }
};



// export const fetchPapersByTopic = async (topicId, start = 0, maxResults = 10) => {
//     const searchQuery = `cat:${topicId}`;
//     return await fetchPapers(searchQuery, start, maxResults);
//     }