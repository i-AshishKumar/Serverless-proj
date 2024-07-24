import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Image, 
  Text, 
  SimpleGrid, 
  Heading, 
  Spinner, 
  Button, 
  Stack,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null); // Use an object to store selected room details
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [comments, setComments] = useState('');
  const [reviews, setReviews] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isReviewsOpen, onOpen: onReviewsOpen, onClose: onReviewsClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://w18ghvf5ge.execute-api.us-east-1.amazonaws.com/test/get-rooms')
      .then(response => {
        setRooms(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
        setLoading(false);
      });
  }, []);

  const handleBookNow = (room) => {
    setSelectedRoom(room); // Set the entire room object
    setFromDate('');
    setToDate('');
    setNumberOfPeople('');
    setComments('');
    onOpen();
  };

  const handleShowReviews = (room) => {
    axios.post('https://24fb3brx1a.execute-api.us-east-1.amazonaws.com/dev/each-room-reviews', {
        roomNumber: room.roomNumber // Send room number in the request body
      })
      .then(response => {
        const reviewsData = JSON.parse(response.data.body); // Parse the JSON string
        setReviews(reviewsData); // Set reviews to the parsed data
        console.log(reviews)
        onReviewsOpen();
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
        toast({
          title: "Error",
          description: "There was an error fetching reviews. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };
  
  
  const handleSubmit = () => {
    if (!selectedRoom) return;

    const bookingDetails = {
        body: JSON.stringify({
            email: localStorage.getItem('email'),
            room_id: selectedRoom.id,
            room_number: selectedRoom.roomNumber, // Include room number
            from_date: fromDate,
            to_date: toDate,
            number_of_people: numberOfPeople,
            comments: comments,
        })
    };

    axios.post('https://24fb3brx1a.execute-api.us-east-1.amazonaws.com/dev/book', bookingDetails, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      // Notification API call
      const email = localStorage.getItem('email');
      const name = email.split('@')[0];

      axios.post('https://ehnhrawf3e.execute-api.us-east-1.amazonaws.com/dev/loginnotification', {
        body: JSON.stringify({
          eventType: 'roomBooked',
          email: localStorage.getItem('email'),
          name: name, // Replace with actual user name if available
          roomName: selectedRoom.roomNumber, // Use room number or another identifier
          bookingDate: fromDate // Use fromDate or another date related to booking
        })
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        toast({
          title: "Booking Successful",
          description: "Your room has been booked successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
        navigate('/customer/bookings');
      })
      .catch(error => {
        console.error('Error sending notification:', error);
        toast({
          title: "Booking Successful, but notification failed",
          description: "Your room has been booked, but we couldn't send the notification email.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        onClose();
        navigate('/customer/bookings');
      });
    })
    .catch(error => {
      toast({
        title: "Booking Failed",
        description: "There was an error booking the room. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error('Error booking room:', error);
    });
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box p={4}>
      <Heading as="h1" mb={6}>List of Rooms</Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={8}>
        {rooms.map(room => (
          <Box
            key={room.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
            transition="0.3s ease"
          >
            <Image 
              src="https://via.placeholder.com/300x200" 
              alt={`Room ${room.roomNumber}`} 
              objectFit="cover" 
              w="100%" 
              h="200px" 
            />
            <Box p="6">
              <Stack spacing={3}>
                <Text fontSize="xl" fontWeight="bold">Room {room.roomNumber}</Text>
                <Text>Location: {room.location}</Text>
                <Badge colorScheme="green" borderRadius="full" px="2">Rating: {room.rating}</Badge>
                <Text>Beds: {room.beds}</Text>
                <Text>Baths: {room.baths}</Text>
                <Text fontSize="lg" fontWeight="semibold" color="teal.600">Price: ${room.price}</Text>
                <Button 
                  colorScheme="teal" 
                  variant="solid" 
                  size="md" 
                  onClick={() => handleBookNow(room)}
                >
                  Book Now
                </Button>
                <Button 
                  colorScheme="blue" 
                  variant="outline" 
                  size="md" 
                  onClick={() => handleShowReviews(room)}
                >
                  Show Reviews
                </Button>
              </Stack>
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Book Room</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isReadOnly>
              <FormLabel>Room ID</FormLabel>
              <Input value={selectedRoom?.id || ''} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>From Date</FormLabel>
              <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>To Date</FormLabel>
              <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Number of People</FormLabel>
              <Input type="number" value={numberOfPeople} onChange={(e) => setNumberOfPeople(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Instructions</FormLabel>
              <Textarea placeholder="Any special instructions" value={comments} onChange={(e) => setComments(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isReviewsOpen} onClose={onReviewsClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Room Reviews</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <Box key={index} mb={4} p={3} borderWidth="1px" borderRadius="md">
            <Text fontWeight="bold">Reviewer: {review.email_id.split('@')[0]}</Text>
            <Text>Rating: {review.rating}</Text>
            <Text mt={2}>{review.review}</Text>
          </Box>
        ))
      ) : (
        <Text>No reviews available for this room.</Text>
      )}
    </ModalBody>
    <ModalFooter>
      <Button variant="ghost" onClick={onReviewsClose}>Close</Button>
    </ModalFooter>
  </ModalContent>
</Modal>

    </Box>
  );
}

export default Rooms;
