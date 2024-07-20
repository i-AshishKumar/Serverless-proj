import json
import boto3


dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Reviews')

def lambda_handler(event, context):
    print(event)
    body = json.loads(event['body'])
    print(body['room_number'])
    booking_id = body['booking_id']
    room_number = body['room_number']
    email_id = body['email_id']
    rating = body['rating']
    review = body['review']
    # TODO implement
    
    try:
        table.put_item(
                Item={
                    'booking_id': booking_id,
                    'email_id':email_id,
                    'room_number':room_number,
                    'rating':rating,
                    'review':review
                }
        )        
        return {
            'statusCode': 200,
            'body': json.dumps('Review Added Successfully')
        }

    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps('There was some error adding the review. Try again!')
        }