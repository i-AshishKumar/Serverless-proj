import json
import boto3
import uuid
from botocore.exceptions import ClientError

# Initialize a DynamoDB resource using Boto3
dynamodb = boto3.resource('dynamodb')

# Reference the specific DynamoDB table for Rooms
table = dynamodb.Table('Rooms')

def lambda_handler(event, context):
    try:
        # Parse the JSON body of the request to extract room data
        body = json.loads(event['body'])
        
        # Generate a unique ID for the new room
        room_id = str(uuid.uuid4())
        
        # Extract room details from the request body
        room_number = body['roomNumber']
        price = body['price']
        rating = body['rating']
        location = body['location']
        beds = body['beds']
        guests = body['guests']
        baths = body['baths']
        
        # Create a new room item to be stored in the DynamoDB table
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
        
        # Insert the new room item into the DynamoDB table
        table.put_item(Item=room_item)
        
        # Construct a successful HTTP response with appropriate CORS headers
        response = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'  # Allow only specified methods
            },
            'body': json.dumps({'message': 'Room added successfully!', 'roomId': room_id})
        }
        
        return response
    
    except ClientError as e:
        # Handle errors related to DynamoDB or other AWS services
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': json.dumps({'error': str(e)})
        }
    
    except Exception as e:
        # Handle unexpected errors that are not related to AWS services
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': json.dumps({'error': str(e)})
        }
