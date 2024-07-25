import AWS from 'aws-sdk';

// Initialize SNS client
const sns = new AWS.SNS();

export const handler = async (event) => {
    // Parse the incoming request body
    const body = JSON.parse(event.body);

    // Log the request body for debugging
    console.log("Request body:", body);

    // Variable to hold the message content based on event type
    let messageContent;

    // Log the event type for debugging
    console.log("Event type:", body.eventType);

    // Determine the message content based on the event type
    switch (body.eventType) {
        case 'login':
            messageContent = {
                eventType: 'UserLogin',
                userEmail: body.email,
                userName: body.name
            };
            break;
        case 'register':
            messageContent = {
                eventType: 'UserRegister',
                userEmail: body.email,
                userName: body.name
            };
            break;
        case 'roomBooked':
            messageContent = {
                eventType: 'RoomBooked',
                userEmail: body.email,
                userName: body.name,
                roomName: body.roomName,
                bookingDate: body.bookingDate
            };
            break;
        case 'roomBookingFailed':
            messageContent = {
                eventType: 'RoomBookingFailed',
                userEmail: body.email,
                userName: body.name,
                roomName: body.roomName,
                failureReason: body.failureReason
            };
            break;
        default:
            // Return error response for unknown event types
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid event type.' })
            };
    }

    // Parameters for SNS publish
    const params = {
        TopicArn: process.env.SNS_TOPIC_ARN, // SNS topic ARN from environment variables
        Message: JSON.stringify(messageContent) // Message content in JSON format
    };

    // Log the parameters before publishing
    console.log("Publishing message to SNS:", params);

    try {
        // Publish the message to SNS
        const data = await sns.publish(params).promise();
        console.log("Message published to SNS:", data);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Event published successfully.' })
        };
    } catch (err) {
        // Log error and return failure response
        console.error("Error publishing to SNS:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to publish event.' })
        };
    }
};
