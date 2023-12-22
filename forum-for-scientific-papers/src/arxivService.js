import axios from 'axios';

const BASE_URL = 'http://export.arxiv.org/api/query';

export const fetchPapers = async (searchQuery = 'all:electron', start = 0, maxResults = 10) => {
  const query = `?search_query=${searchQuery}&start=${start}&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;
  
  try {
    const response = await axios.get(`${BASE_URL}${query}`);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "application/xml");
    const entries = xmlDoc.getElementsByTagName('entry');
    let papers = [];

    for (let i = 0; i < entries.length; i++) {
      const title = entries[i].getElementsByTagName('title')[0].textContent;
      const summary = entries[i].getElementsByTagName('summary')[0].textContent;
      // Adjusting to get the correct 'href' attribute from the link element
      const link = entries[i].getElementsByTagName('link')[0].getAttribute('href');
      
      papers.push({ title, summary, link });
    }

    return papers;
  } catch (error) {
    console.error("Error fetching papers from arXiv:", error);
    return [];
  }
};

export const fetchPapersByTopic = async (topicId, start = 0, maxResults = 10) => {
    const searchQuery = `cat:${topicId}`;
    return await fetchPapers(searchQuery, start, maxResults);
    }