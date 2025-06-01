import React from 'react';
import {
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

interface LoginHeaderProps {
  title?: string;
  subtitle?: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ 
  title = 'AeroAgriculture', 
  subtitle = 'Sign in to your account' 
}) => {
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Flex direction="column" align="center" mb={4}>
      <Heading
        as="h1"
        size="xl"
        fontWeight="bold"
        color="brand.500"
        textAlign="center"
        mb={2}
      >
        {title}
      </Heading>
      <Text fontSize="md" color={textColor} textAlign="center">
        {subtitle}
      </Text>
    </Flex>
  );
};