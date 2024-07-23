import React from 'react'
import { Box } from '@chakra-ui/react'

function CustomerData() {
  return (
    <Box 
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={4}
    >
      <iframe
        width="1300"
        height="600"
        src="https://lookerstudio.google.com/embed/reporting/c6a3dfd0-5a82-478f-add9-6113298f63b9/page/8Op6D"
        style={{ border: 0 }}
      ></iframe>
    </Box>
  )
}

export default CustomerData
