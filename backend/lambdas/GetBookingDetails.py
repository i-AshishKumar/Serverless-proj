import json
import boto3

def lambda_handler(event, context):
    # Initialize a DynamoDB resource
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Bookings')  # Specify the DynamoDB table name

    # Extract booking code from the event's session state
    booking_ref = event['sessionState']['intent']['slots']['booking_code']['value']['originalValue']
    
    try:
        # Retrieve the booking item from DynamoDB using the booking code
        response = table.get_item(Key={'booking_code': booking_ref})
        item = response.get('Item')  # Get the item from the response
        
        # Check if the item exists
        if not item:
            return {
                "sessionState": {
                    "dialogAction": {
                        "type": "Close",
                    },
                    "intent": {
                        "name": "BookingDetailsIntent",
                        "state": "Fulfilled"
                    }
                },
                "messages": [
                    {
                        "contentType": "PlainText",
                        "content": f"No booking found with code {booking_ref}."
                    }
                ]
            }
        
        # Extract relevant details from the booking item
        room_num = item.get('room_number')
        duration = item.get('duration')
        
        # Print the item for debugging purposes
        print(item)
        
        # Construct the response with booking details
        result = {
            "sessionState": {
                "dialogAction": {
                    "type": "Close",
                },
                "intent": {
                    "name": "BookingDetailsIntent",
                    "state": "Fulfilled"
                }
            },
            "messages": [
                {
                    "contentType": "PlainText",
                    "content": f"The room with booking code {booking_ref} is room number {room_num} and the duration of stay is {duration}."
                }
            ]
        }
        
        return result
    
    except Exception as e:
        # Handle unexpected errors and return an error message
        print(f"Error retrieving booking details: {e}")
        return {
            "sessionState": {
                "dialogAction": {
                    "type": "Close",
                },
                "intent": {
                    "name": "BookingDetailsIntent",
                    "state": "Fulfilled"
                }
            },
            "messages": [
                {
                    "contentType": "PlainText",
                    "content": "There was an error retrieving the booking details. Please try again later."
                }
            ]
        }
