import json
import boto3
import uuid

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('CustomerConcerns')
    concern_description = event['sessionState']['intent']['slots']['concern_description']['value']['originalValue']
    concern_id = str(uuid.uuid4())
    table.put_item(
       Item={
            'concern_id': concern_id,
            'description': concern_description,
        }
    )

    # return item
    result = {
        "sessionState": {
            "dialogAction": {
                "type": "Close",
            },
            "intent": {
                "name": "SupportIntent",
                "state": "Fulfilled"
            }
        },
        "messages": [
            {
                "contentType": "PlainText",
                "content": f"Your concern with {concern_id} was raised. An agent will review it soon and get back to you."
            }
        ]
    }
    
    return result
