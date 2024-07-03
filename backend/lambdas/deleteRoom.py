import json
import boto3
from botocore.exceptions import ClientError

# Initialize DynamoDB resource and specify table name
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Rooms')  # Replace with your DynamoDB table name

def lambda_handler(event, context):
    try:
        query_params = event.get('queryStringParameters', {})
        room_id = query_params.get('roomId') if query_params else None
        
        if room_id is None:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',  # Adjust origin as needed
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST'
                },
                'body': json.dumps({'error': 'Room ID not provided'})
            }
        
        # Delete the item from DynamoDB
        response = table.delete_item(
            Key={'id': room_id}
        )
        
        # Construct a successful response
        response_payload = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Adjust origin as needed
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': json.dumps({'message': 'Room deleted successfully!'})
        }
        
        return response_payload
    
    except ClientError as e:
        # Handle DynamoDB or other service errors
        error_response = {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Adjust origin as needed
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': json.dumps({'error': str(e)})
        }
        
        return error_response
    
    except Exception as e:
        # Handle unexpected errors
        error_response = {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Adjust origin as needed
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': json.dumps({'error': str(e)})
        }
        
        return error_response
