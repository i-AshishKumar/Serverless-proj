from google.cloud import firestore, pubsub_v1
from flask import jsonify

# Set up Firestore client
db = firestore.Client()

# Set up Pub/Sub client
publisher = pubsub_v1.PublisherClient()
project_id = 'serverlessproject-427212'
replies_topic = publisher.topic_path(project_id, 'replies-topic')

def reply_concern(request):
    """
    Handles POST requests to update a concern with a reply and publish it to a Pub/Sub topic.

    :param request: The incoming HTTP request object.
    :return: A JSON response indicating the success or failure of the operation.
    """
    # Handle CORS preflight requests (OPTIONS method)
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    
    # Check if the request body contains the required fields
    if not request_json or 'concern_id' not in request_json or 'reply' not in request_json:
        return (jsonify({'success': False, 'error': 'Concern ID and reply are required'}), 400, headers)

    # Extract data from the request
    concern_id = request_json['concern_id']
    reply = request_json['reply']

    # Get the document reference for the specified concern
    doc_ref = db.collection('concerns').document(concern_id)
    doc = doc_ref.get()

    # Check if the concern exists
    if not doc.exists:
        return (jsonify({'success': False, 'error': 'Concern not found'}), 404, headers)

    # Update the concern document with the reply and set the status to 'resolved'
    doc_ref.update({
        'reply': reply,
        'status': 'resolved'
    })

    # Publish the reply to the Pub/Sub topic
    future = publisher.publish(replies_topic, reply.encode('utf-8'), concern_id=concern_id)
    future.result()  # Wait for the publish operation to complete

    # Return a success response
    return (jsonify({'success': True}), 200, headers)
