import json
import boto3
import uuid

def lambda_handler(event, context):
    """
    Lambda function handler to store customer concerns in DynamoDB and respond to the user.

    :param event: Event data containing customer concern details.
    :param context: Lambda runtime information.
    :return: A response object to be returned to the user.
    """
    # Initialize DynamoDB resource and specify the table
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('CustomerConcerns')

    # Extract concern description from the event object
    concern_description = event['sessionState']['intent']['slots']['concern_description']['value']['originalValue']

    # Generate a unique ID for the concern
    concern_id = str(uuid.uuid4())

    # Store the concern in DynamoDB
    table.put_item(
       Item={
            'concern_id': concern_id,
            'description': concern_description,
        }
    )

    # Prepare the response object to be sent back to the user
    result = {
        "sessionState": {
            "dialogAction": {
                "type": "Close"  # Close the dialog with the user
            },
            "intent": {
                "name": "SupportIntent",  # The name of the intent
                "state": "Fulfilled"  # Mark the intent as fulfilled
            }
        },
        "messages": [
            {
                "contentType": "PlainText",  # Message content type
                "content": f"Your concern with {concern_id} was raised. An agent will review it soon and get back to you."
            }
        ]
    }
    
    return result  # Return the response object
