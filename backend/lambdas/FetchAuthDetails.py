import json
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.types import TypeDeserializer

def lambda_handler(event, context):
    # Initialize a DynamoDB resource
    dynamodb = boto3.resource('dynamodb')
    
    table_name = 'users'  # Name of the DynamoDB table to scan
    
    try:
        # Access the specified DynamoDB table
        table = dynamodb.Table(table_name)
        
        # Perform a scan operation to retrieve all items from the table
        response = table.scan()
        items = response.get('Items', [])  # Get the list of items, defaulting to an empty list
        
        # Deserialize the DynamoDB items into JSON-compatible format
        json_items = [deserialize(item) for item in items]
        
        # Return a successful response with the serialized items
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'  # Set content type to JSON
            },
            'body': json.dumps(json_items)  # Serialize the list of items as JSON
        }
        
    except ClientError as e:
        # Handle errors returned by AWS services
        error_message = f"Error scanning DynamoDB table: {e.response['Error']['Message']}"
        print(error_message)  # Log the error message for debugging
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'  # Set content type to JSON
            },
            'body': json.dumps({'error': error_message})  # Return error message in JSON
        }

def deserialize(dynamo_item):
    # Initialize a deserializer for DynamoDB types
    deserializer = TypeDeserializer()
    json_item = {}
    
    # Deserialize each attribute in the DynamoDB item
    for k, v in dynamo_item.items():
        try:
            # Convert DynamoDB types to native Python types
            json_item[k] = deserializer.deserialize(v)
        except Exception as e:
            # Log and handle any deserialization errors
            print(f"Error deserializing attribute {k}: {e}")
            json_item[k] = str(v)  # Fallback for unhandled cases, converting value to string
    
    return json_item
