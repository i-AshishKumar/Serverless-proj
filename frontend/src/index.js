import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import Kommunicate from "@kommunicate/kommunicate-chatbot-plugin";

const root = ReactDOM.createRoot(document.getElementById('root'));

// const Guest_bot = "cc9db2f87d7aa41709e04919aeda9ed6"
// const Registered_User_bot = "2111c074267649c15ea5b2bb554cb5093"
// const Property_agent_bot = "3ad8d3daaf9d59029131b722dd3022330"

Kommunicate.init("2111c074267649c15ea5b2bb554cb5093", {
  automaticChatOpenOnNavigation: false,
  popupWidget: false
});

root.render(
  // <React.StrictMode>
  <ChakraProvider>
    <App />
  </ChakraProvider>
  // </React.StrictMode>
);
