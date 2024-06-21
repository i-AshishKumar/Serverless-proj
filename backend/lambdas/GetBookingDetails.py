import json
import boto3


def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Bookings')
    booking_ref = event['sessionState']['intent']['slots']['booking_code']['value']['originalValue']
    
    response = table.get_item(Key={'booking_code':booking_ref})
    item = response['Item']
    room_num = item['room_number']
    duration = item['duration']
    
    print(item)
    # return item
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
                "content": f"The room with {booking_ref} is room mumber:{room_num} and the duration of stay is {duration}"
            }
        ]
    }
    
    return result
