import React from 'react';
import { VStack } from '@chakra-ui/react';
import {
  LoginLayout,
  RegisterHeader,
  RegisterForm
} from '../../features/authentication/components';

const RegisterPage: React.FC = () => {
  return (
    <LoginLayout>
      <VStack spacing={10} align={"stretch"}>
        <RegisterHeader />
        <RegisterForm />
      </VStack>
    </LoginLayout>
  );
};

export default RegisterPage;