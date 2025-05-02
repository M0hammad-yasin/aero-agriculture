import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  useColorModeValue,
  Container,
  useToast,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const login = useAuthStore((state) => state.login);
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof LoginFormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any well-formed email/password
      // In a real app, this would validate against a backend
      login({
        name: formData.email.split('@')[0], // Use part of email as name for demo
        email: formData.email,
      });
      
      toast({
        title: 'Login successful',
        description: 'Welcome to AeroAgriculture',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        general: error? `${error}`:'Failed to login. Please check your credentials.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Flex minH="100vh" align="center" justify="center" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="lg" py={12} px={{ base: 4, sm: 8 }}>
        <Box
          bg={bgColor}
          p={8}
          borderRadius="lg"
          boxShadow="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <VStack spacing={6} align="stretch">
            <Flex direction="column" align="center" mb={4}>
              <Heading
                as="h1"
                size="xl"
                fontWeight="bold"
                color="brand.500"
                textAlign="center"
                mb={2}
              >
                AeroAgriculture
              </Heading>
              <Text fontSize="md" color={textColor} textAlign="center">
                Sign in to your account
              </Text>
            </Flex>
            
            {errors.general && (
              <Box
                p={3}
                bg="red.100"
                color="red.700"
                borderRadius="md"
                fontSize="sm"
              >
                {errors.general}
              </Box>
            )}
            
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.email} isRequired>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    focusBorderColor="brand.500"
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                
                <FormControl isInvalid={!!errors.password} isRequired>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <InputGroup>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      focusBorderColor="brand.500"
                    />
                    <InputRightElement width="3rem">
                      <Button
                        h="1.5rem"
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                
                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  fontSize="md"
                  isLoading={isLoading}
                  w="full"
                  mt={4}
                >
                  Sign In
                </Button>
              </VStack>
            </form>
            
            <Flex justify="center" mt={4}>
              <Text fontSize="sm">
                Don't have an account?{' '}
                <Button
                  variant="link"
                  colorScheme="brand"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </Text>
            </Flex>
          </VStack>
        </Box>
      </Container>
    </Flex>
  );
};

export default LoginPage;