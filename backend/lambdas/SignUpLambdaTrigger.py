import json
import boto3
from botocore.exceptions import ClientError

# Initialize a DynamoDB resource and specify the table
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('users')

def lambda_handler(event, context):
    """
    Lambda function handler to store user data in DynamoDB.
    
    :param event: Event data containing user attributes.
    :param context: Lambda runtime information.
    :return: The event object, unchanged.
    """
    try:
        # Extract user attributes from the event object
        user_attributes = event['request']['userAttributes']
        email = user_attributes['email']
        phone_number = user_attributes['phone_number']
        given_name = user_attributes['given_name']
        family_name = user_attributes['family_name']
        role = user_attributes['custom:role']

        # Prepare the item to be stored in DynamoDB
        item = {
            'email': email,
            'phone_number': phone_number,
            'given_name': given_name,
            'family_name': family_name,
            'role': role,
            'auth_count': 0  # Initialize auth_count to 0
        }

        # Store the item in DynamoDB
        table.put_item(Item=item)
        print(f"Successfully stored data for email: {email}")
        return event  # Return the event object as is

    except KeyError as e:
        # Handle cases where expected user attributes are missing
        print(f"Error extracting user attributes: {e}")
        return event  # Return the event object as is, despite the error

    except ClientError as e:
        # Handle DynamoDB client errors, such as issues with storing the item
        print(f"Error storing data in DynamoDB: {e}")
        return event  # Return the event object as is, despite the error
