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

    concerns_query = db.collection('concerns').where('status', '==', 'pending')
    concerns_docs = concerns_query.stream()

    concerns = []
    for doc in concerns_docs:
        concern_data = doc.to_dict()
        concern_data['id'] = doc.id
        concerns.append(concern_data)

    return (jsonify({'success': True, 'concerns': concerns}), 200, headers)