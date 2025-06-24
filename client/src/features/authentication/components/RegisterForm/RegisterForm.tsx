import { useRef, useState } from 'react';
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
  Avatar,
  Center,
  Box,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiCamera } from 'react-icons/fi';
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
  profileImg?: string;
}

export const RegisterForm: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { register, isLoading, error: authError } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
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

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please select a valid image file (JPEG, PNG, WebP)',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 5MB',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        profileImg: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('confirmPassword', formData.confirmPassword);
      if (formData.profileImg) {
        formDataToSend.append('profileImg', formData.profileImg);
      }

      const result = await register(formDataToSend as unknown as RegisterRequest);

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
          {/* Profile Image Upload */}
          <FormControl>
            <FormLabel>Profile Image</FormLabel>
            <Center>
              <Box position="relative">
                <Avatar
                  size="xl"
                  name={formData.name}
                  src={previewImage || undefined}
                  bg={useColorModeValue('brand.500', 'brand.200')}
                  color={useColorModeValue('white', 'gray.800')}
                />
                <IconButton
                  icon={<FiCamera />}
                  size="sm"
                  colorScheme="brand"
                  borderRadius="full"
                  position="absolute"
                  bottom="0"
                  right="0"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload profile image"
                />
              </Box>
            </Center>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              display="none"
            />
            <Text fontSize="sm" color="gray.500" textAlign="center" mt={2}>
              Click the camera icon to upload a profile picture
            </Text>
          </FormControl>

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