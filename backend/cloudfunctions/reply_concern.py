from google.cloud import firestore, pubsub_v1
from flask import jsonify

# Set up Firestore client
db = firestore.Client()

# Set up Pub/Sub client
publisher = pubsub_v1.PublisherClient()
project_id = 'serverlessproject-427212'
replies_topic = publisher.topic_path(project_id, 'replies-topic')

def reply_concern(request):
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    }

    request_json = request.get_json(silent=True)
    if not request_json or 'concern_id' not in request_json or 'reply' not in request_json:
        return (jsonify({'success': False, 'error': 'Concern ID and reply are required'}), 400, headers)

    concern_id = request_json['concern_id']
    reply = request_json['reply']

    doc_ref = db.collection('concerns').document(concern_id)
    doc = doc_ref.get()

    if not doc.exists:
        return (jsonify({'success': False, 'error': 'Concern not found'}), 404, headers)

    doc_ref.update({
        'reply': reply,
        'status': 'resolved'
    })

    # Publish the reply to the Pub/Sub topic
    future = publisher.publish(replies_topic, reply.encode('utf-8'), concern_id=concern_id)
    future.result()  # Wait for the publish to complete

    return (jsonify({'success': True}), 200, headers)
