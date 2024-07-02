import json
import boto3
import uuid
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Rooms')

def lambda_handler(event, context):
    try:
        # Parse the JSON body of the request
        body = json.loads(event['body'])
        
        # Generate a random ID for the room
        room_id = str(uuid.uuid4())
        
        # Extract the room details from the request body
        room_number = body['roomNumber']
        price = body['price']
        rating = body['rating']
        location = body['location']
        beds = body['beds']
        guests = body['guests']
        baths = body['baths']
        
        # Create a new room item
        room_item = {
            'id': room_id,
            'roomNumber': room_number,
            'price': price,
            'rating': rating,
            'location': location,
            'beds': beds,
            'guests': guests,
            'baths': baths
        }
        
        # Put the item into the DynamoDB table
        table.put_item(Item=room_item)
        
        # Construct a successful response with CORS headers
        response = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Adjust origin as needed
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'  # Allow only required methods
            },
            'body': json.dumps({'message': 'Room added successfully!', 'roomId': room_id})
        }
        
        return response
    
    except ClientError as e:
        # Handle DynamoDB or other service errors
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Adjust origin as needed
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': json.dumps({'error': str(e)})
        }
    
    except Exception as e:
        # Handle unexpected errors
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Adjust origin as needed
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': json.dumps({'error': str(e)})
        }