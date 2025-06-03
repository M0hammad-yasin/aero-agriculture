import React, { ReactNode } from 'react';
import {
  Box,
  Flex,
  Container,
  useColorModeValue,
} from '@chakra-ui/react';

interface LoginLayoutProps {
  children: ReactNode;
}

export const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Flex 
      align="center" 
      justify="center" 
      bg={useColorModeValue('gray.50', 'gray.900')}
      backgroundImage="url('/background-body.png')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="repeat"
    >
      <Container maxW="2xl" py={12} px={{ base: 10, sm: 16 }}>
        <Box
          bg={bgColor}
          p={8}
          borderRadius="lg"
          boxShadow="lg"
          borderWidth="1px"
          borderColor={borderColor}
          width="100%"
          transition="transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out"
          _hover={{
            transform: 'scale(1.02)',
            boxShadow: 'xl',
          }}
        >
          {children}
        </Box>
      </Container>
    </Flex>
  );
};