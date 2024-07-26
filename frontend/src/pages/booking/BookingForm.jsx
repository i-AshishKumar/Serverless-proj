import React, { useState } from 'react';
import axios from 'axios';
import {
    Button,
    Box,
    Center,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const BookingForm = () => {
    const navigate = useNavigate();
    const toast = useToast();

    // State to manage form fields and response messages
    const [roomId, setRoomId] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [numberOfPeople, setNumberOfPeople] = useState('');
    const [comments, setComments] = useState('');
    const [message, setMessage] = useState('');

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            const response = await axios.post('https://24fb3brx1a.execute-api.us-east-1.amazonaws.com/dev/book', {
                body: JSON.stringify({
                    room_id: roomId,
                    from_date: fromDate,
                    to_date: toDate,
                    number_of_people: numberOfPeople,
                    comments: comments,
                })
            });

            const result = JSON.parse(response.data.body);
            console.log(response);
            setMessage(response.data.message);

            if (response.data.statusCode === 200) {
                // On successful booking, navigate to customer page and show success toast
                navigate('/customer', { replace: true });
                toast({
                    title: `Room Booked Successfully, Your Booking id is ${result.booking_id}`,
                    status: 'success',
                    duration: 6000,
                    isClosable: true,
                });
            } else {
                // If room is already booked, show error toast
                toast({
                    title: 'Room Already Booked',
                    description: 'Please choose different dates.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error("Error during fetch:", error);
            setMessage("Failed to book the room. Please try again."); // Set error message if request fails
        }
    };

    return (
        <Center>
            <Box width={400}>
                <form onSubmit={handleSubmit}>
                    <FormControl>
                        <FormLabel>Room ID</FormLabel>
                        <Input mb={4} type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>From Date</FormLabel>
                        <Input mb={4} type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>To Date</FormLabel>
                        <Input mb={4} type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Number of People</FormLabel>
                        <Input mb={4} type="number" value={numberOfPeople} onChange={(e) => setNumberOfPeople(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Instructions</FormLabel>
                        <Textarea mb={4} value={comments} onChange={(e) => setComments(e.target.value)}></Textarea>
                    </FormControl>
                    <Button type="submit">Book Room</Button>
                </form>
                {message && <p>{message}</p>}
            </Box>
        </Center>
    );
};

export default BookingForm;