import AWS from 'aws-sdk';
import nodemailer from 'nodemailer';

const sqs = new AWS.SQS();

export const handler = async (event) => {
    for (const record of event.Records) {
        const message = JSON.parse(record.body);
        console.log("message body  ", message);
        const { eventType, userEmail, userName, roomName, bookingDate, failureReason } = message;

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
                console.error('Unsupported event type:', eventType);
                break;
        }

        // Delete the message from SQS queue after successful processing
        await deleteMessageFromQueue(record.receiptHandle);
    }
};

const sendMail = async (sendTo, subject, msg) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS
        }
      });      

    var mailOptions = {
        from: 'no-reply@dal',
        to: sendTo,
        subject: subject,
        text: msg
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
      } catch (error) {
        console.log('Error sending email: ' + error);
      }
    

}
const sendLoginEmail = async (userEmail, userName) => {

    const text= `Hello ${userName},\n\nYou have successfully logged in.`
    await sendMail(userEmail, 'Login Successful', text);

};

const sendRegisterEmail = async (userEmail, userName) => {

    const text= `Hello ${userName},\n\nThank you for registering with us.`
    await sendMail(userEmail, 'Registration Successful', text);
};

const sendRoomBookedEmail = async (userEmail, userName, roomName, bookingDate) => {

    const text= `Hello ${userName},\n\nYour booking for ${roomName} on ${bookingDate} is confirmed.`
    await sendMail(userEmail, 'Room Booking Confirmation', text);

};

const sendRoomBookingFailedEmail = async (userEmail, userName, roomName, failureReason) => {

    const text= `Hello ${userName},\n\nYour booking for ${roomName} has failed due to: ${failureReason}`
    await sendMail(userEmail, 'Room Booking Failed', text);

};

const deleteMessageFromQueue = async (receiptHandle) => {
    const params = {
        QueueUrl: process.env.SQS_QUEUE_URL,
        ReceiptHandle: receiptHandle
    };
    await sqs.deleteMessage(params).promise();
};