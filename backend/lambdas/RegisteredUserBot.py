import json
import boto3
import uuid

def lambda_handler(event, context):
  
  dialog_flow_request = json.loads(event['body'])
  print(dialog_flow_request)
  
  intent_name = dialog_flow_request['queryResult']['intent']['displayName']
  print(intent_name)
  
  if intent_name == 'get_booking_details':
    return get_booking_details(dialog_flow_request)
  elif intent_name == 'support_communication':
    return support_communication(dialog_flow_request)
    
    
    
  # print(type(int(dialog_flow_request['queryResult']['parameters']['booking-code'])))
  

  
def get_booking_details(request):
  dynamodb = boto3.resource('dynamodb')
  table = dynamodb.Table('Bookings')
  
  booking_ref = str(int(request['queryResult']['parameters']['booking-code']))
  response = table.get_item(Key={'booking_code':booking_ref})
  item = response['Item']
  room_num = item['room_number']
  duration = item['duration']
  
  print("hello2")
  
  result ={
    "fulfillmentText" : f"The room with booking refernece {booking_ref} is: {room_num} and its duration of stay is {duration}",
    "fulfillmentMessages": [
        {
            "text": {
                "text": [
                f"The room with booking refernece {booking_ref} is: {room_num} and its duration of stay is {duration}"
                ]
            }
        }
    ]
}
  
  return json.dumps(result)


def support_communication(request):
  dynamodb = boto3.resource('dynamodb')
  table = dynamodb.Table('CustomerConcerns')
  
  concern_id = str(uuid.uuid4())
  concern_description = request['queryResult']['parameters']['concern']
  
  table.put_item(
       Item={
            'concern_id': concern_id,
            'description': concern_description,
        }
    )
  
  result ={
    "fulfillmentText": f"Your Concern has been raised with ticket number:{concern_id}. An agent will get in touch with you soon. Please note down the ticket number for your future refernece. Thank you.",
    "fulfillmentMessages": [
        {
            "text": {
                "text": [
                f"Your Concern has been raised with ticket number:{concern_id}. An agent will get in touch with you soon. Please note down the ticket number for your future refernece. Thank you."
                ]
            }
        }
    ]
}

  
  return json.dumps(result)