import json
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('users')

def lambda_handler(event, context):
    try:
        user_attributes = event['request']['userAttributes']
        email = user_attributes['email']
        phone_number = user_attributes['phone_number']
        given_name = user_attributes['given_name']
        family_name = user_attributes['family_name']
        role = user_attributes['custom:role']

        item = {
            'email': email,
            'phone_number': phone_number,
            'given_name': given_name,
            'family_name': family_name,
            'role': role,
            'auth_count': 0
        }

        table.put_item(Item=item)
        print(f"Successfully stored data for email: {email}")
        return event

    except KeyError as e:
        print(f"Error extracting user attributes: {e}")
        return event

    except ClientError as e:
        print(f"Error storing data in DynamoDB: {e}")
        return event

