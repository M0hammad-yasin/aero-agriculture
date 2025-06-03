import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Alert,
  AlertIcon,
  Flex,
  Text,
  Link,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { useAuth } from '../../hooks/auth.hook';
import { PasswordInput } from '../PasswordInput';
import { RegisterRequest } from '../../../../models/auth-model';

interface RegisterFormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const RegisterForm: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { register, isLoading, error: authError } = useAuth();
  
  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  
  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    if (errors[name as keyof RegisterFormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (result.success) {
        toast({
          title: 'Registration successful',
          description: 'Please login to your account',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/login');
      } else {
        toast({
          title: 'Registration failed',
          description: result.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <>
      {authError && (
        <Alert status="error" borderRadius="md" mb={4}>
          <AlertIcon />
          {authError}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.name} isRequired>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              focusBorderColor="brand.500"
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

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
          
          <PasswordInput
            value={formData.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
            error={errors.password}
          />
          
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            isInvalid={!!errors.confirmPassword}
            error={errors.confirmPassword}
          />
          
          <Button
            type="submit"
            colorScheme="brand"
            size="lg"
            fontSize="md"
            isLoading={isLoading}
            w="full"
            mt={4}
          >
            Sign Up
          </Button>
        </VStack>
      </form>
      
      <Flex justify="center" mt={4}>
        <Text fontSize="sm">
          Already have an account?{' '}
          <Link as={RouterLink} to="/login" color="brand.500" fontWeight="semibold">
            Sign In
          </Link>
        </Text>
      </Flex>
    </>
  );
};