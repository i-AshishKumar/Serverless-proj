import json
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('users')

def lambda_handler(event, context):
    try:
        email = event['request']['userAttributes']['email']

        response = table.update_item(
            Key={'email': email},
            UpdateExpression="SET auth_count = if_not_exists(auth_count, :start) + :inc",
            ExpressionAttributeValues={
                ':inc': 1,
                ':start': 0
            },
            ReturnValues="UPDATED_NEW"
        )

        print(f"Successfully incremented auth_count for email: {email}")
        return event

    except KeyError as e:
        print(f"Error extracting user email: {e}")
        return event

    except ClientError as e:
        print(f"Error updating data in DynamoDB: {e}")
        return event

