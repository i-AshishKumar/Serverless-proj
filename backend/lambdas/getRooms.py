import json
import boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):
    # Initialize DynamoDB client
    dynamodb = boto3.resource('dynamodb')
    
    # Define the DynamoDB table name
    table_name = 'Rooms'
    table = dynamodb.Table(table_name)
    
    # Get the room ID from query parameters
    query_params = event.get('queryStringParameters', {})
    room_id = query_params.get('roomId') if query_params else None
    print(f"Room ID: {room_id}")
    
    try:
        if room_id:
            # Fetch the specific room by ID
            response = table.get_item(Key={'id': room_id})
            room = response.get('Item', {})
            if not room:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'message': 'Room not found'})
                }
            result = room
        else:
            # Fetch all rooms
            response = table.scan()
            rooms = response.get('Items', [])
            result = rooms

        # Create the response
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result)
        }

    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': 'Error retrieving room(s)'})
        }
