import json
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.types import TypeDeserializer

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    
    table_name = 'users'
    
    try:
        table = dynamodb.Table(table_name)
        
        response = table.scan()
        items = response.get('Items', [])
        
        json_items = [deserialize(item) for item in items]
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps(json_items)
        }
        
    except ClientError as e:
        error_message = f"Error scanning DynamoDB table: {e.response['Error']['Message']}"
        print(error_message)
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': error_message})
        }

def deserialize(dynamo_item):
    deserializer = TypeDeserializer()
    json_item = {}
    
    for k, v in dynamo_item.items():
        try:
            json_item[k] = deserializer.deserialize(v)
        except Exception as e:
            print(f"Error deserializing attribute {k}: {e}")
            json_item[k] = str(v)  # Fallback for unhandled cases
    
    return json_item

