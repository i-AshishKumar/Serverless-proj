import json
import boto3
import uuid

def lambda_handler(event, context):
    # Parse the incoming event body from Dialogflow
    dialog_flow_request = json.loads(event['body'])
    print(dialog_flow_request)
    
    # Extract the intent name from the Dialogflow request
    intent_name = dialog_flow_request['queryResult']['intent']['displayName']
    print(intent_name)
    
    # Route the request based on the detected intent
    if intent_name == 'get_booking_details':
        return get_booking_details(dialog_flow_request)
    elif intent_name == 'support_communication':
        return support_communication(dialog_flow_request)
    else:
        # Handle unsupported intents if necessary
        return {
            "fulfillmentText": "Sorry, I didn't understand that request."
        }

def get_booking_details(request):
    # Initialize DynamoDB resource
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Bookings')
    
    # Extract the booking reference from the request parameters
    booking_ref = str(int(request['queryResult']['parameters']['booking-code']))
    
    # Retrieve the booking details from the DynamoDB table
    response = table.get_item(Key={'booking_code': booking_ref})
    item = response.get('Item', {})
    room_num = item.get('room_number', 'N/A')
    duration = item.get('duration', 'N/A')
    
    print("Retrieved booking details")
    
    # Construct the response for Dialogflow
    result = {
        "fulfillmentText": f"The room with booking reference {booking_ref} is: {room_num} and its duration of stay is {duration}",
        "fulfillmentMessages": [
            {
                "text": {
                    "text": [
                        f"The room with booking reference {booking_ref} is: {room_num} and its duration of stay is {duration}"
                    ]
                }
            }
        ]
    }
    
    return json.dumps(result)

def support_communication(request):
    # Initialize DynamoDB resource
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('CustomerConcerns')
    
    # Generate a unique ID for the concern
    concern_id = str(uuid.uuid4())
    
    # Extract the concern description from the request parameters
    concern_description = request['queryResult']['parameters']['concern']
    
    # Store the concern in the DynamoDB table
    table.put_item(
        Item={
            'concern_id': concern_id,
            'description': concern_description,
        }
    )
    
    # Construct the response for Dialogflow
    result = {
        "fulfillmentText": f"Your concern has been raised with ticket number: {concern_id}. An agent will get in touch with you soon. Please note down the ticket number for your future reference. Thank you.",
        "fulfillmentMessages": [
            {
                "text": {
                    "text": [
                        f"Your concern has been raised with ticket number: {concern_id}. An agent will get in touch with you soon. Please note down the ticket number for your future reference. Thank you."
                    ]
                }
            }
        ]
    }
    
    return json.dumps(result)
