import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import Kommunicate from "@kommunicate/kommunicate-chatbot-plugin";

const root = ReactDOM.createRoot(document.getElementById('root'));
Kommunicate.init("cc9db2f87d7aa41709e04919aeda9ed6", {
  automaticChatOpenOnNavigation: true,
  popupWidget: true
});
root.render(
  // <React.StrictMode>
  <ChakraProvider>
    <App />
  </ChakraProvider>
  // </React.StrictMode>
);
