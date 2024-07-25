import json
import boto3
from botocore.exceptions import ClientError

# Initialize a DynamoDB resource and specify the table
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('users')

def lambda_handler(event, context):
    """
    Lambda function handler to update the authentication count for a user.
    
    :param event: Event data containing user attributes.
    :param context: Lambda runtime information.
    :return: The event object, unchanged.
    """
    try:
        # Extract the user's email from the event object
        email = event['request']['userAttributes']['email']

        # Update the auth_count for the user in DynamoDB
        response = table.update_item(
            Key={'email': email},
            UpdateExpression="SET auth_count = if_not_exists(auth_count, :start) + :inc",
            ExpressionAttributeValues={
                ':inc': 1,       # Increment the auth_count by 1
                ':start': 0      # Initialize auth_count to 0 if it does not exist
            },
            ReturnValues="UPDATED_NEW"  # Return the updated attributes
        )

        print(f"Successfully incremented auth_count for email: {email}")
        return event  # Return the event object as is

    except KeyError as e:
        # Handle cases where 'email' is not found in the event object
        print(f"Error extracting user email: {e}")
        return event  # Return the event object as is, despite the error

    except ClientError as e:
        # Handle DynamoDB client errors, such as issues with updating the item
        print(f"Error updating data in DynamoDB: {e}")
        return event  # Return the event object as is, despite the error
