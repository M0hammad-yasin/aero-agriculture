import React from 'react';
import { VStack } from '@chakra-ui/react';
import {
  LoginLayout,
  LoginHeader,
  LoginForm
} from '../../features/authentication/components';

const LoginPage: React.FC = () => {
  return (
    <LoginLayout>
      <VStack spacing={6} align="stretch">
        <LoginHeader />
        <LoginForm />
      </VStack>
    </LoginLayout>
  );
};

export default LoginPage;