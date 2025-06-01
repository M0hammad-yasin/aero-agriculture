import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface PasswordInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  isInvalid?: boolean;
  error?: string;
  isRequired?: boolean;
  label?: string;
  focusBorderColor?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id = 'password',
  name = 'password',
  value,
  onChange,
  placeholder = 'Enter your password',
  isInvalid = false,
  error,
  isRequired = true,
  label = 'Password',
  focusBorderColor = 'brand.500',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl isInvalid={isInvalid} isRequired={isRequired}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <InputGroup>
        <Input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          focusBorderColor={focusBorderColor}
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
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};