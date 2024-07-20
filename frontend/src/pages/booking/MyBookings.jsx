import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, Thead, Tbody, Tr, Th, Td, Container, Heading, Box, useToast,
  Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Textarea, Select
} from '@chakra-ui/react';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
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

  const handleAddReviewClick = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setRating('');
    setReview('');
  };

  const handleReviewSubmit = async () => {
    try {
      await axios.post('https://your-api-endpoint/reviews', {
        booking_id: selectedBooking.booking_id,
        email: localStorage.getItem("email"),
        rating,
        review
      });

      toast({
        title: "Review submitted.",
        description: "Thank you for your feedback!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      handleModalClose();
    } catch (error) {
      console.error('Error submitting review:', error); // Log any errors
      toast({
        title: "Error submitting review.",
        description: "There was an issue submitting your review.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" p={4}>
      <Heading mb={4}>My Bookings</Heading>
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
              <Th>Actions</Th>
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
                <Td>
                  <Button onClick={() => handleAddReviewClick(booking)}>Add Review</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a Review</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Rating</FormLabel>
              <Select value={rating} onChange={(e) => setRating(e.target.value)}>
                <option value="">Select rating</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Review</FormLabel>
              <Textarea value={review} onChange={(e) => setReview(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleReviewSubmit}>
              Submit
            </Button>
            <Button variant="ghost" onClick={handleModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default MyBookings;
