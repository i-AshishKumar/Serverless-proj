import json
import boto3

# Initialize a DynamoDB resource using Boto3
dynamodb = boto3.resource('dynamodb')

# Reference the specific DynamoDB table
table = dynamodb.Table('Reviews')

def lambda_handler(event, context):
    # Log the received event for debugging purposes
    print(event)
    
    # Parse the JSON body of the incoming event
    body = json.loads(event['body'])
    
    # Extract fields from the parsed JSON body
    print(body['room_number'])  # Log the room number for debugging
    booking_id = body['booking_id']
    room_number = body['room_number']
    email_id = body['email_id']
    rating = body['rating']
    review = body['review']
    
    # Try to add a new item (review) to the DynamoDB table
    try:
        table.put_item(
            Item={
                'booking_id': booking_id,
                'email_id': email_id,
                'room_number': room_number,
                'rating': rating,
                'review': review
            }
        )
        # Return a successful response if the item is added successfully
        return {
            'statusCode': 200,
            'body': json.dumps('Review Added Successfully')
        }

    except Exception as e:
        # Log the exception for debugging
        print(e)
        
        # Return an error response if there is an exception
        return {
            'statusCode': 500,
            'body': json.dumps('There was some error adding the review. Try again!')
        }
