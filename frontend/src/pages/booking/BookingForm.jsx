import React, { useState } from 'react';
import axios from 'axios';

import { Button, Box, Center } from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
  } from '@chakra-ui/react'

import { Input,Textarea  } from '@chakra-ui/react'

const BookingForm = () => {
    const [roomId, setRoomId] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [numberOfPeople, setNumberOfPeople] = useState('');
    const [comments, setComments] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://24fb3brx1a.execute-api.us-east-1.amazonaws.com/dev/book', {
                body: JSON.stringify({
                    room_id: roomId,
                    from_date: fromDate,
                    to_date: toDate,
                    number_of_people: numberOfPeople,
                    comments: comments,
                }),
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            setMessage(response.data.message);
        } catch (error) {
            console.error("Error during fetch:", error);
            setMessage("Failed to book the room. Please try again.");
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
                    <Input  type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel>Number of People</FormLabel>
                    <Input mb={4} type="number" value={numberOfPeople} onChange={(e) => setNumberOfPeople(e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel>Instructions</FormLabel>
                    <Textarea mb={4} value={comments} onChange={(e) => setComments(e.target.value)}></Textarea >
                </FormControl>
                <Button type="submit">Book Room</Button>
            </form>
            {message && <p>{message}</p>}
        </Box>
        </Center>
    );
};

export default BookingForm;
