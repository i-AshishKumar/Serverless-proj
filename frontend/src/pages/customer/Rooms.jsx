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

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [comments, setComments] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

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

  const handleBookNow = (roomId) => {
    setSelectedRoomId(roomId);
    setFromDate('');
    setToDate('');
    setNumberOfPeople('');
    setComments('');
    onOpen();
  };

  const handleSubmit = () => {
    const bookingDetails = {
        body:JSON.stringify({
            room_id: selectedRoomId,
            from_date: fromDate,
            to_date: toDate,
            number_of_people: numberOfPeople,
            comments: comments,
        })
    }

    axios.post('https://24fb3brx1a.execute-api.us-east-1.amazonaws.com/dev/book', JSON.stringify(bookingDetails), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      toast({
        title: "Booking Successful",
        description: "Your room has been booked successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
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
                  onClick={() => handleBookNow(room.id)}
                >
                  Book Now
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
              <Input value={selectedRoomId || ''} />
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
    </Box>
  );
}

export default Rooms;
