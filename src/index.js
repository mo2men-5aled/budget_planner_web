import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { ChakraProvider, Container, theme } from "@chakra-ui/react";

// import theme from "./chakra/theme";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Container maxW="container.xl">
        <App />
      </Container>
    </ChakraProvider>
  </React.StrictMode>
);
