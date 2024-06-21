import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table('Bookings')

    booking_code = event['currentIntent']['slots']['booking_code']

    try:
        response = table.get_item(Key={'booking_code': booking_code})


        if 'Item' in response:
            item = response['Item']
            duration = item['duration']
            room_number = item['room_number']

            message = f"Your booking details are:\nDuration: {duration} days\nRoom Number: {room_number}"

        else:
            message = "Sorry, no booking found with the provided booking code."

    except ClientError as e:
        print(e.response['Error']['Message'])
        message = "Sorry, there was an error fetching your booking details. Please try again later."

    return {
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': message
            }
        }
    }
