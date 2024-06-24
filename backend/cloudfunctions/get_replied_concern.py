from google.cloud import firestore
from flask import jsonify

# Set up Firestore client
db = firestore.Client()

def get_replied_concern(request):
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)
    
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    }

    request_json = request.get_json(silent=True)

    if not request_json or 'user_id' not in request_json:
        return (jsonify({'success': False, 'error': 'User ID is required'}), 400, headers)

    user_id = request_json['user_id']
    
    concerns_query = db.collection('concerns').where('user_id', '==', user_id)
    concerns_docs = concerns_query.stream()

    concerns = [
        {**doc.to_dict(), 'id': doc.id}
        for doc in concerns_docs
    ]

    return (jsonify({'success': True, 'concerns': concerns}), 200, headers)