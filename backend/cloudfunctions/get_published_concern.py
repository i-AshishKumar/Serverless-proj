from google.cloud import firestore
from flask import jsonify

# Set up Firestore client
db = firestore.Client()

def get_published_concern(request):
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    request_json = request.get_json(silent=True)

    if not request_json or 'agent_id' not in request_json:
        return (jsonify({'success': False, 'error': 'Agent ID is required'}), 400, headers)

    agent_id = request_json['agent_id']

    concerns_query = db.collection('concerns').where('agent_id', '==', agent_id)
    concerns_docs = concerns_query.stream()

    concerns = []
    for doc in concerns_docs:
        concern_data = doc.to_dict()
        concern_data['id'] = doc.id
        concerns.append(concern_data)

    return (jsonify({'success': True, 'concerns': concerns}), 200, headers)