from google.cloud import firestore
from flask import jsonify

# Set up Firestore client
db = firestore.Client()

def get_replied_concern(request):
    """
    Handles POST requests to retrieve concerns that have been replied to by a specific user from Firestore.

    :param request: The incoming HTTP request object.
    :return: A JSON response with the concerns or an error message.
    """
    # Handle CORS preflight requests (OPTIONS method)
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)  # Return an empty response with CORS headers

    # Set up CORS headers for the response
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    }

    # Parse JSON request body
    request_json = request.get_json(silent=True)

    # Check if request body is valid and contains 'user_id'
    if not request_json or 'user_id' not in request_json:
        return (jsonify({'success': False, 'error': 'User ID is required'}), 400, headers)

    # Extract 'user_id' from the request
    user_id = request_json['user_id']

    # Query Firestore for concerns associated with the specified user
    concerns_query = db.collection('concerns').where('user_id', '==', user_id)
    concerns_docs = concerns_query.stream()

    # Collect concern data from the query results
    concerns = [
        {**doc.to_dict(), 'id': doc.id}  # Add document ID to each concern data
        for doc in concerns_docs
    ]

    # Return the concerns in JSON format
    return (jsonify({'success': True, 'concerns': concerns}), 200, headers)
