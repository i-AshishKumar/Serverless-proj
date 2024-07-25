import json
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key

# Initialize a session using Amazon DynamoDB
dynamodb = boto3.resource('dynamodb')

# Define table and index names
table_name = 'Reviews'  # The DynamoDB table where reviews are stored
index_name = 'room_number-index'  # The name of the secondary index to query reviews by room number

def lambda_handler(event, context):
    print(event)  # Log the incoming event for debugging purposes
    
    # Extract the room_number from query parameters or path parameters
    room_number = event.get('roomNumber')  # Assume room number is passed as a query parameter

    # Return an error response if room_number is not provided
    if not room_number:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                'Content-Type': 'application/json'  # Specify JSON content type
            },
            'body': json.dumps({'message': 'Room number is required'})  # Return error message in JSON
        }

    try:
        # Access the DynamoDB table
        table = dynamodb.Table(table_name)
        
        # Query the secondary index using the room_number
        response = table.query(
            IndexName=index_name,  # Specify the secondary index to use
            KeyConditionExpression=Key('room_number').eq(room_number)  # Filter reviews by room number
        )
        
        # Extract the list of reviews from the response
        reviews = response.get('Items', [])
        
        # Return a 404 response if no reviews are found for the given room number
        if not reviews:
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                    'Content-Type': 'application/json'  # Specify JSON content type
                },
                'body': json.dumps({'message': 'No reviews found for this room number'})  # Return message in JSON
            }
        
        # Return a successful response with the list of reviews
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                'Content-Type': 'application/json'  # Specify JSON content type
            },
            'body': json.dumps(reviews)  # Return reviews in JSON format
        }
        
    except ClientError as e:
        # Handle errors returned by AWS services
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
                'Content-Type': 'application/json'  # Specify JSON content type
            },
            'body': json.dumps({'message': f"Error fetching reviews: {e.response['Error']['Message']}"})  # Return error message
        }
