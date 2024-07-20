import React from 'react'
import { Box } from '@chakra-ui/react'

function DataAnalysis() {
  return (
    <Box 
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={4}
    >
      <iframe
        width="1300"
        height="800"
        src="https://lookerstudio.google.com/embed/reporting/ed588b57-3fa0-45c1-bb2e-bcfd8ee7ce5c/page/aBc6D"
        style={{ border: 0 }}
      ></iframe>
    </Box>
  )
}

export default DataAnalysis
