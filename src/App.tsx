import { Box, Heading, Text } from "@chakra-ui/react";

function App() {
  return (
    <Box p={5}>
      <Heading as="h1" size="xl" mb={4}>
        Welcome to AeroAgriculture
      </Heading>
      <Text fontSize="lg">
        This is the starting point for your application using Chakra UI.
      </Text>
    </Box>
  );
}

export default App;
