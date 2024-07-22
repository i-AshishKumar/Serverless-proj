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
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    headers = {'Access-Control-Allow-Origin': '*'}
        
    request_json = request.get_json(silent=True)
    required_fields = ['user_id', 'booking_reference', 'message']
    
    if not request_json or not all(field in request_json for field in required_fields):
        return (jsonify({'error': 'User ID, Booking Reference, and Message are required'}), 400, headers)

    user_id = request_json['user_id']
    booking_reference = request_json['booking_reference']
    message = request_json['message']
    assigned_agent = random.choice(['t_admin@yopmail.com'])
    created_at = datetime.utcnow().isoformat() + 'Z'
    
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

    future = publisher.publish(concerns_topic, message.encode('utf-8'), concern_id=concern_id)
    future.result()

    return (jsonify({'success': True, 'agent_id': assigned_agent}), 200, headers)