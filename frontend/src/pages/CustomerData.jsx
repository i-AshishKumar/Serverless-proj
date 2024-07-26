import React from 'react';
import { Box } from '@chakra-ui/react';

function CustomerData() {
  return (
    <Box 
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={4}
      width="full"
      height="full"
    >
      <Box 
        width={{ base: "100%", md: "80%", lg: "70%" }} // Responsive width
        height={{ base: "300px", md: "500px", lg: "600px" }} // Responsive height
        maxW="1300px" // Maximum width to prevent overly large iframes
      >
        <iframe
          width="100%"
          height="100%"
          src="https://lookerstudio.google.com/embed/reporting/c6a3dfd0-5a82-478f-add9-6113298f63b9/page/8Op6D"
          style={{ border: 0 }}
          title="Customer Data Report" // Adding title for accessibility
          aria-label="Customer Data Report"
        ></iframe>
      </Box>
    </Box>
  );
}

export default CustomerData;
