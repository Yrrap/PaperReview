import psycopg2
import networkx as nx
import matplotlib.pyplot as plt
from networkx.algorithms import community

# PostgreSQL connection parameters
DB_HOST = 'localhost'
DB_NAME = 'papersdb'
DB_USER = 'postgres'
DB_PASSWORD = ''

# Function to fetch data from PostgreSQL
def fetch_data_from_db():
    connection = None
    cursor = None
    papers = {}
    relationships = []

    try:
        connection = psycopg2.connect(
            host=DB_HOST,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = connection.cursor()

        # Fetch all papers
        cursor.execute('SELECT paper_id, title FROM papers')
        for row in cursor.fetchall():
            papers[row[0]] = row[1]

        # Fetch all relationships
        cursor.execute('SELECT paper_id, related_paper_id, relationship_type FROM links')
        relationships = cursor.fetchall()

    except Exception as e:
        print(f'Error: {e}')
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

    return papers, relationships

# Function to detect communities
def detect_communities(G):
    return community.greedy_modularity_communities(G)

# Function to assign colors to nodes based on communities
def assign_colors_by_communities(G, communities):
    color_map = {}
    color_palette = plt.get_cmap('Set1')

    for i, community_nodes in enumerate(communities):
        color = color_palette(i)
        for node in community_nodes:
            color_map[node] = color

    return [color_map.get(node) for node in G.nodes()]

# Function to visualize graph using NetworkX and Matplotlib
def visualize_graph(papers, relationships):
    G = nx.DiGraph()  # Directed graph

    # Add nodes (papers)
    for paper_id, title in papers.items():
        G.add_node(paper_id, label=title)

    # Add edges (relationships)
    for paper_id, related_paper_id, relationship_type in relationships:
        G.add_edge(paper_id, related_paper_id, label=relationship_type)

    # Detect communities and assign colors
    communities = detect_communities(G)
    node_colors = assign_colors_by_communities(G, communities)

    # Draw the graph
    pos = nx.spring_layout(G, k=0.3, iterations=50)
    plt.figure(figsize=(18, 18))

    nx.draw_networkx_nodes(G, pos, node_size=700, node_color=node_colors, alpha=0.8)
    nx.draw_networkx_edges(G, pos, arrowstyle='->', arrowsize=15, edge_color='gray', alpha=0.5)
    nx.draw_networkx_labels(G, pos, labels={node: data['label'] for node, data in G.nodes(data=True)}, font_size=8)

    edge_labels = {(u, v): d['label'] for u, v, d in G.edges(data=True)}
    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels, font_size=7)

    plt.title('Papers and Their Relationships', fontsize=20)
    plt.axis('off')
    plt.show()

# Main script execution
if __name__ == '__main__':
    papers, relationships = fetch_data_from_db()
    visualize_graph(papers, relationships)
