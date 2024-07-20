import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td, Container, Heading, Box, useToast, Text } from '@chakra-ui/react';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const toast = useToast(); // To show notifications

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.post('https://24fb3brx1a.execute-api.us-east-1.amazonaws.com/dev/view-customer-bookings', {
          body: JSON.stringify({
            email_id: localStorage.getItem('email')
          })
        });

        let result = JSON.parse(response.data.body);
        setBookings(result); // Update the state with the bookings data
      } catch (error) {
        console.error('Error fetching bookings:', error); // Log any errors
        toast({
          title: "Error fetching bookings.",
          description: "There was an issue retrieving your bookings.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchBookings();
  }, [toast]);

  const handleRowClick = (booking) => {
    toast({
      title: `Booking ID: ${booking.booking_id}`,
      description: `Room Number: ${booking.room_number}\nFrom: ${booking.from_date}\nTo: ${booking.to_date}`,
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" p={4}>
      <Heading mb={2}>My Bookings</Heading>
      <Text fontSize="lg" mb={4}>This is your booking history </Text>
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Room Number</Th>
              <Th>Booking ID</Th>
              <Th>Your Instructions</Th>
              <Th>Number of People</Th>
              <Th>From Date</Th>
              <Th>To Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookings.map((booking) => (
              <Tr
                key={booking.booking_id}
                _hover={{ bg: 'gray.100', cursor: 'pointer' }} // Hover effect
                onClick={() => handleRowClick(booking)} // Click handler
              >
                <Td>{booking.room_number}</Td>
                <Td>{booking.booking_id}</Td>
                <Td>{booking.comments}</Td>
                <Td>{booking.number_of_people}</Td>
                <Td>{booking.from_date}</Td>
                <Td>{booking.to_date}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
}

export default MyBookings;
