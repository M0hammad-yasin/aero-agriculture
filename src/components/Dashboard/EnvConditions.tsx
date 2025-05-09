import { Box, Heading, VStack, Text, useColorModeValue } from '@chakra-ui/react';

const EnvConditions = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const headingColor = useColorModeValue('brand.600', 'brand.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box 
      bg={bgColor} 
      borderRadius="lg" 
      boxShadow="sm" 
      p={4} 
      mb={4}
      borderColor={borderColor}
      borderWidth="1px"
      color={textColor}
    >
      <VStack align="start" spacing={3}>
        <Heading size="md" color={headingColor}>Environmental Conditions</Heading>
        <Text>Current environmental conditions for your crops</Text>
        {/* Add environmental condition metrics here */}
      </VStack>
    </Box>
  );
};

export default EnvConditions;