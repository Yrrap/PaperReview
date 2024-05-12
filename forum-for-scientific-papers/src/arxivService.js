import axios from 'axios';

// const BASE_URL = 'https://export.arxiv.org/api/query';

export const fetchPapers = async (searchQuery = 'cat:cs.NE', id_list = 'cs.NE', start = 0, maxResults = 15) => {
  // Ensure that query parameters are correctly added to the URL
  const query = `?search_query=${(searchQuery)}&start=${start}&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;
  const BASE_URL = `https://export.arxiv.org/api/query/`;
  const newQuery = `${BASE_URL}${query}`;
  try {
    const response = await axios.get(newQuery);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "text/xml"); // Use "text/xml" here
    const entries = xmlDoc.getElementsByTagName('entry');
    console.log('xmlDoc: ');
    console.log(xmlDoc);
    console.log('entries: ');
    console.log(entries);
    let papers = [];

    console.log('entries: ');
    console.log(entries);
    for (let i = 0; i < entries.length; i++) {
      // console.log(i);
      // console.log(entries[i]);
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