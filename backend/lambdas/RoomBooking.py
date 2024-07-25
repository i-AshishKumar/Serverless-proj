import json
import boto3
from datetime import datetime
from boto3.dynamodb.conditions import Key

# Initialize a DynamoDB resource and specify the table
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Room_Bookings')

def check_availability(room_id, from_date, to_date):
    """
    Check if the specified room is available for the given date range.
    
    :param room_id: ID of the room to check.
    :param from_date: Start date of the booking.
    :param to_date: End date of the booking.
    :return: True if room is available, False otherwise.
    """
    # Query the DynamoDB table for existing bookings for the room
    response = table.query(
        KeyConditionExpression=Key('room_id').eq(room_id)
    )
    bookings = response['Items']
    
    # Check for date overlaps with existing bookings
    for booking in bookings:
        booking_from_date = datetime.strptime(booking['from_date'], '%Y-%m-%d')
        booking_to_date = datetime.strptime(booking['to_date'], '%Y-%m-%d')
        if (from_date <= booking_to_date and to_date >= booking_from_date):
            return False
    
    # Room is available if no overlaps were found
    return True

def lambda_handler(event, context):
    """
    Lambda function handler to process booking requests.
    
    :param event: Event data from API Gateway or other sources.
    :param context: Lambda runtime information.
    :return: Response with booking status.
    """
    # Parse the incoming request body
    body = json.loads(event['body'])
    room_id = body['room_id']
    from_date = datetime.strptime(body['from_date'], '%Y-%m-%d')
    to_date = datetime.strptime(body['to_date'], '%Y-%m-%d')
    number_of_people = body['number_of_people']
    comments = body['comments']
    
    # Check if the room is available for the requested dates
    if check_availability(room_id, from_date, to_date):
        # Generate a unique booking ID
        booking_id = str(int(datetime.now().timestamp() * 1000))
        
        # Save the booking information to DynamoDB
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
