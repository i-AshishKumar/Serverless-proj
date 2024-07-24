import json
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key

# Initialize a session using Amazon DynamoDB
dynamodb = boto3.resource('dynamodb')
table_name = 'Reviews'
index_name = 'room_number-index'

def lambda_handler(event, context):
    print(event)
    
    # Extract the room_number from query parameters or path parameters
    room_number = event.get('roomNumber')  # Check for query parameters

    if not room_number:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'message': 'Room number is required'})
        }

    try:
        table = dynamodb.Table(table_name)
        
        # Query the secondary index using the room_number
        response = table.query(
            IndexName=index_name,
            KeyConditionExpression=Key('room_number').eq(room_number)
        )
        
        reviews = response.get('Items', [])
        
        if not reviews:
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'message': 'No reviews found for this room number'})
            }
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps(reviews)
        }
        
    except ClientError as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'message': f"Error fetching reviews: {e.response['Error']['Message']}"})
        }
