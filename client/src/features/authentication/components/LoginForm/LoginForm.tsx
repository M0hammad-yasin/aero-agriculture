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
import { LoginRequest } from '../../../../models/auth-model';



interface LoginFormErrors {
  email?: string;
  password?: string;
}

export const LoginForm: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { login, isLoading, error: authError } = useAuth();
  
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<LoginFormErrors>({});
  
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
    
    try {
      const loginn = await login({
        email: formData.email,
        password: formData.password,
      });
      if(loginn.success )
     { toast({
        title: 'Login successful',
        description: 'Welcome to AeroAgriculture',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    }
      else{
        toast({
          title: 'Login failed',
          description: loginn.error,
          status:'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
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
          <Link as={RouterLink} to="/register" color="brand.500" fontWeight="semibold">
            Sign Up
          </Link>
        </Text>
      </Flex>
    </>
  );
};