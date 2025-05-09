import { Box, VStack, Heading, Text, useColorModeValue } from '@chakra-ui/react';

const RightSidebar = () => {
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
      h="full"
      borderColor={borderColor}
      borderWidth="1px"
      color={textColor}
    >
      <VStack align="start" spacing={4}>
        <Heading size="md" color={headingColor}>Quick Actions</Heading>
        <Text>Access frequently used features</Text>
        {/* Add quick action buttons or links here */}
      </VStack>
    </Box>
  );
};

export default RightSidebar;