# Academic Review Writing Aid Platform

This project is a web-based platform designed to assist in the writing of academic reviews by helping users discover and manage connections between academic papers.

## Features

- **Interactive Graph Visualisation**: Visualise connections between academic papers dynamically using Cytoscape.js.
- **User-Driven Connections**: Add and remove connections based on user knowledge and insights.
- **Automated Metadata Retrieval**: Automatically download and integrate metadata from arXiv.
- **Search Functionality**: Quickly find papers and their connections using an efficient search feature.

## Installation

### Prerequisites

- Python 3.x
- Django
- PostgreSQL
- Node.js
- npm

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/academic-review-platform.git
   cd academic-review-platform
2. **Back-end Setup**:
 - Create a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate
 - Install Python dependencies:
   ```bash
   pip install -r requirements.txt
 - Configure PostgreSQL and set up your database.
 - Apply Django migrations:
   ```bash
   python manage.py migrate
 - Start the Django development server:
   ```bash
   python manage.py runserver
3. **Front-end Setup**:
 - Navigate to the frontend directory:
   ```bash
   cd React
 - Install npm dependencies:
   ```bash
   npm install
 - Start the React development server:
   ```bash
   npm start

### Usage
Once both the backend and frontend servers are running, you can access the platform by navigating to http://localhost:3000 in your web browser. Use the interface to explore academic paper connections, add or remove links, and search for specific papers.

### Acknowledgements
This project was developed as part of an Integrated Master's thesis. I would like to thank my supervisor, Dr. D. Goodman, for his valuable feedback.
