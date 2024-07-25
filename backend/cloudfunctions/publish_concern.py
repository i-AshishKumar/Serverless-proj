import random
from google.cloud import firestore, pubsub_v1
from flask import jsonify
from datetime import datetime

# Set up Firestore client
db = firestore.Client()

# Set up Pub/Sub client
publisher = pubsub_v1.PublisherClient()
project_id = 'serverlessproject-427212'
concerns_topic = publisher.topic_path(project_id, 'concerns-topic')

def publish_concern(request):
    """
    Handles POST requests to create a concern in Firestore and publish it to a Pub/Sub topic.

    :param request: The incoming HTTP request object.
    :return: A JSON response indicating the success of the operation and the assigned agent.
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
    headers = {'Access-Control-Allow-Origin': '*'}

    # Parse JSON request body
    request_json = request.get_json(silent=True)
    required_fields = ['user_id', 'booking_reference', 'message']
    
    # Check if the request body contains all required fields
    if not request_json or not all(field in request_json for field in required_fields):
        return (jsonify({'error': 'User ID, Booking Reference, and Message are required'}), 400, headers)

    # Extract data from the request
    user_id = request_json['user_id']
    booking_reference = request_json['booking_reference']
    message = request_json['message']
    
    # Randomly assign an agent (for simplicity, a fixed email is used)
    assigned_agent = random.choice(['t_admin@yopmail.com'])
    
    # Get the current time in UTC
    created_at = datetime.utcnow().isoformat() + 'Z'
    
    # Create a new document in Firestore for the concern
    concern_ref = db.collection('concerns').document()
    concern_ref.set({
        'booking_reference': booking_reference,
        'user_id': user_id,
        'message': message,
        'agent_id': assigned_agent,
        'status': 'pending',
        'created_at': created_at 
    })
    concern_id = concern_ref.id

    # Publish the concern to a Pub/Sub topic
    future = publisher.publish(concerns_topic, message.encode('utf-8'), concern_id=concern_id)
    future.result()  # Wait for the publish operation to complete

    # Return a success response with the assigned agent's email
    return (jsonify({'success': True, 'agent_id': assigned_agent}), 200, headers)
