from google.cloud import firestore
from flask import jsonify

# Set up Firestore client
db = firestore.Client()

def get_published_concern(request):
    """
    Handles GET requests to retrieve concerns assigned to a specific agent from Firestore.

    :param request: The incoming HTTP request object.
    :return: A JSON response with the concerns or an error message.
    """
    # Handle CORS preflight requests (OPTIONS method)
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)  # Return an empty response with CORS headers

    # Set up CORS headers for the response
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    # Parse JSON request body
    request_json = request.get_json(silent=True)

    # Check if request body is valid and contains 'agent_id'
    if not request_json or 'agent_id' not in request_json:
        return (jsonify({'success': False, 'error': 'Agent ID is required'}), 400, headers)

    # Extract 'agent_id' from the request
    agent_id = request_json['agent_id']

    # Query Firestore for concerns assigned to the specified agent
    concerns_query = db.collection('concerns').where('agent_id', '==', agent_id)
    concerns_docs = concerns_query.stream()

    # Collect concern data from the query results
    concerns = []
    for doc in concerns_docs:
        concern_data = doc.to_dict()  # Convert Firestore document to dictionary
        concern_data['id'] = doc.id  # Include the document ID
        concerns.append(concern_data)  # Add the concern to the list

    # Return the concerns in JSON format
    return (jsonify({'success': True, 'concerns': concerns}), 200, headers)
