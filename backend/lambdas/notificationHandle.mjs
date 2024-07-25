import AWS from 'aws-sdk';
import nodemailer from 'nodemailer';

// Initialize SQS client
const sqs = new AWS.SQS();

export const handler = async (event) => {
    // Process each record from the SQS event
    for (const record of event.Records) {
        // Parse the message body from the SQS record
        const message = JSON.parse(record.body);
        console.log("Message body:", message);

        // Extract details from the message
        const { eventType, userEmail, userName, roomName, bookingDate, failureReason } = message;

        // Handle different event types
        switch (eventType) {
            case 'UserLogin':
                await sendLoginEmail(userEmail, userName);
                break;
            case 'UserRegister':
                await sendRegisterEmail(userEmail, userName);
                break;
            case 'RoomBooked':
                await sendRoomBookedEmail(userEmail, userName, roomName, bookingDate);
                break;
            case 'RoomBookingFailed':
                await sendRoomBookingFailedEmail(userEmail, userName, roomName, failureReason);
                break;
            default:
                // Log an error for unsupported event types
                console.error('Unsupported event type:', eventType);
                break;
        }

        // Delete the message from SQS queue after successful processing
        await deleteMessageFromQueue(record.receiptHandle);
    }
};

// Generic function to send email using nodemailer
const sendMail = async (sendTo, subject, msg) => {
    // Create a transporter object using Gmail service
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS
        }
    });

    // Email options
    var mailOptions = {
        from: 'no-reply@dal',
        to: sendTo,
        subject: subject,
        text: msg
    };

    try {
        // Send the email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        // Log any errors encountered while sending the email
        console.log('Error sending email: ' + error);
    }
};

// Function to send login success email
const sendLoginEmail = async (userEmail, userName) => {
    const text = `Hello ${userName},\n\nYou have successfully logged in.`;
    await sendMail(userEmail, 'Login Successful', text);
};

// Function to send registration success email
const sendRegisterEmail = async (userEmail, userName) => {
    const text = `Hello ${userName},\n\nThank you for registering with us.`;
    await sendMail(userEmail, 'Registration Successful', text);
};

// Function to send room booking confirmation email
const sendRoomBookedEmail = async (userEmail, userName, roomName, bookingDate) => {
    const text = `Hello ${userName},\n\nYour booking for ${roomName} on ${bookingDate} is confirmed.`;
    await sendMail(userEmail, 'Room Booking Confirmation', text);
};

// Function to send room booking failure email
const sendRoomBookingFailedEmail = async (userEmail, userName, roomName, failureReason) => {
    const text = `Hello ${userName},\n\nYour booking for ${roomName} has failed due to: ${failureReason}`;
    await sendMail(userEmail, 'Room Booking Failed', text);
};

// Function to delete the message from SQS queue after processing
const deleteMessageFromQueue = async (receiptHandle) => {
    const params = {
        QueueUrl: process.env.SQS_QUEUE_URL, // SQS queue URL from environment variables
        ReceiptHandle: receiptHandle // Receipt handle of the message to be deleted
    };
    await sqs.deleteMessage(params).promise();
};
