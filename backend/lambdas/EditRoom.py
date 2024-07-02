import json
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Rooms')

def lambda_handler(event, context):
    try:
        # Parse the JSON body of the request
        body = json.loads(event['body'])
        
        query_params = event.get('queryStringParameters', {})
        room_id = query_params.get('roomId') if query_params else None
        
        if room_id is None:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',  # Adjust origin as needed
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS, POST'
                },
                'body': json.dumps({'error': 'Room ID not provided'})
            }
        
        # Update room details based on request body
        room_updates = {
            'roomNumber': body.get('roomNumber'),
            'price': body.get('price'),
            'rating': body.get('rating'),
            '#loc': body.get('location'),  # Use alias for 'location'
            'beds': body.get('beds'),
            'guests': body.get('guests'),
            'baths': body.get('baths')
        }
        
        # Update the item in DynamoDB
        response = table.update_item(
            Key={'id': room_id},
            UpdateExpression='SET roomNumber = :roomNumber, price = :price, rating = :rating, '
                             '#location = :location, beds = :beds, guests = :guests, baths = :baths',  # Use alias in UpdateExpression
            ExpressionAttributeValues={
                ':roomNumber': room_updates['roomNumber'],
                ':price': room_updates['price'],
                ':rating': room_updates['rating'],
                ':location': room_updates['#loc'],  # Use alias in ExpressionAttributeValues
                ':beds': room_updates['beds'],
                ':guests': room_updates['guests'],
                ':baths': room_updates['baths']
            },
            ExpressionAttributeNames={'#location': 'location'},  # Define alias for 'location'
            ReturnValues='UPDATED_NEW'
        )
        
        # Construct a successful response
        response_payload = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Adjust origin as needed
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'  # Allow only required methods
            },
            'body': json.dumps({'message': 'Room updated successfully!', 'updatedRoom': response['Attributes']})
        }
        
        return response_payload
    
    except ClientError as e:
        # Handle DynamoDB or other service errors
        error_response = {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Adjust origin as needed
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': json.dumps({'error': str(e)})
        }
        
        return error_response
    
    except Exception as e:
        # Handle unexpected errors
        error_response = {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Adjust origin as needed
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'body': json.dumps({'error': str(e)})
        }
        
        return error_response
