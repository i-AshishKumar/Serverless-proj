import json
import boto3
from datetime import datetime
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Room_Bookings')

def check_availability(room_id, from_date, to_date):
    response = table.query(
        KeyConditionExpression=Key('room_id').eq(room_id)
    )
    bookings = response['Items']
    for booking in bookings:
        booking_from_date = datetime.strptime(booking['from_date'], '%Y-%m-%d')
        booking_to_date = datetime.strptime(booking['to_date'], '%Y-%m-%d')
        if (from_date <= booking_to_date and to_date >= booking_from_date):
            return False
    return True

def lambda_handler(event, context):
    body = json.loads(event['body'])
    room_id = body['room_id']
    from_date = datetime.strptime(body['from_date'], '%Y-%m-%d')
    to_date = datetime.strptime(body['to_date'], '%Y-%m-%d')
    number_of_people = body['number_of_people']
    comments = body['comments']
    
    if check_availability(room_id, from_date, to_date):
        booking_id = str(int(datetime.now().timestamp() * 1000))
        table.put_item(
            Item={
                'room_id': room_id,
                'booking_id': booking_id,
                'from_date': body['from_date'],
                'to_date': body['to_date'],
                'number_of_people': number_of_people,
                'comments': comments
            }
        )
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Room booked successfully'})
        }
    else:
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Room is already booked for the given dates'})
        }

