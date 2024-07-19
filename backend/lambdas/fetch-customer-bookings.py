import json
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Attr

# Initialize a DynamoDB client
dynamodb = boto3.resource('dynamodb')

# Replace 'YourDynamoDBTableName' with the actual name of your DynamoDB table
table_name = 'Room_Bookings'
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        # Extract the email_id from the POST request body
        body = json.loads(event['body'])
        email_id = body['email_id']

        # Query DynamoDB using the GSI for all items with the given email_id
        response = table.query(
            IndexName='email_id',  # Use the name of your GSI here
            KeyConditionExpression=boto3.dynamodb.conditions.Key('email_id').eq(email_id)
        )
        items = response.get('Items', [])
        
        # Return all matching records
        return {
            'statusCode': 200,
            'body': json.dumps(items)
        }
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
    except (KeyError, TypeError, json.JSONDecodeError) as e:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid request format'})
        }
