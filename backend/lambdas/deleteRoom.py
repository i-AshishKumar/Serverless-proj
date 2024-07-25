import json
import boto3
from botocore.exceptions import ClientError

# Initialize DynamoDB resource and specify table name
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Rooms') 

def lambda_handler(event, context):
    try:
        # Retrieve query string parameters from the incoming request
        query_params = event.get('queryStringParameters', {})
        room_id = query_params.get('roomId') if query_params else None
        
        # Check if room_id is provided in the query parameters
        if room_id is None:
            # Return a 400 Bad Request response if room_id is not provided
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST'
                },
                'body': json.dumps({'error': 'Room ID not provided'})
            }
        
        # Delete the item from DynamoDB using the provided room_id
        response = table.delete_item(
            Key={'id': room_id}
        )
        
        # Construct a successful response with CORS headers
        response_payload = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': json.dumps({'message': 'Room deleted successfully!'})
        }
        
        return response_payload
    
    except ClientError as e:
        # Handle errors related to DynamoDB or other AWS services
        error_response = {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': json.dumps({'error': str(e)})
        }
        
        return error_response
    
    except Exception as e:
        # Handle unexpected errors that are not related to AWS services
        error_response = {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': json.dumps({'error': str(e)})
        }
        
        return error_response
