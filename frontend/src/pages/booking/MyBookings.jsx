import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, Thead, Tbody, Tr, Th, Td, Container, Heading, Box, useToast,
  Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, FormControl, FormLabel, Textarea, Select, Text
} from '@chakra-ui/react';

function MyBookings() {
  // State to manage bookings data, modal visibility, selected booking, rating, review, and toast notifications
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const toast = useToast(); // Hook to show notifications

  // Fetch bookings when component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // POST request to fetch customer bookings
        const response = await axios.post('https://24fb3brx1a.execute-api.us-east-1.amazonaws.com/dev/view-customer-bookings', {
          body: JSON.stringify({
            email_id: localStorage.getItem('email') // Pass the email ID from localStorage
          })
        });

        let result = JSON.parse(response.data.body); // Parse response data
        setBookings(result); // Update state with the bookings data
      } catch (error) {
        console.error('Error fetching bookings:', error); // Log errors
        toast({
          title: "Error fetching bookings.",
          description: "There was an issue retrieving your bookings.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchBookings(); // Call fetch function
  }, [toast]);

  // Handle click on a table row to show booking details in a toast
  const handleRowClick = (booking) => {
    toast({
      title: `Booking ID: ${booking.booking_id}`,
      description: `Room Number: ${booking.room_number}\nFrom: ${booking.from_date}\nTo: ${booking.to_date}`,
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  // Open modal to add a review for the selected booking
  const handleAddReviewClick = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  // Close the modal and reset form fields
  const handleModalClose = () => {
    setIsModalOpen(false);
    setRating('');
    setReview('');
  };

  // Handle review submission
  const handleReviewSubmit = async () => {
    try {
      // POST request to submit the review
      await axios.post('https://24fb3brx1a.execute-api.us-east-1.amazonaws.com/dev/reviews', {
        body: JSON.stringify({
          booking_id: selectedBooking.booking_id,
          room_number: selectedBooking.room_number,
          email_id: localStorage.getItem("email"),
          rating,
          review
        })
      });

      toast({
        title: "Review submitted.",
        description: "Thank you for your feedback!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      handleModalClose(); // Close the modal on success
    } catch (error) {
      console.error('Error submitting review:', error); // Log errors
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
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookings.map((booking) => (
              <Tr
                key={booking.booking_id}
                _hover={{ bg: 'gray.100', cursor: 'pointer' }} // Hover effect
                onClick={() => handleRowClick(booking)} // Click handler to show details
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
            {/* Form for adding a review */}
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