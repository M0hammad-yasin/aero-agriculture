import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    50: '#f0f9eb',
    100: '#d7efc4',
    200: '#bde59c',
    300: '#a3db74',
    400: '#89d14c',
    500: '#70c724',
    600: '#5aa01d',
    700: '#437916',
    800: '#2d520f',
    900: '#162b07',
  },
  secondary: {
    50: '#e6f2ff',
    100: '#bdd9ff',
    200: '#94bfff',
    300: '#6ba6ff',
    400: '#428cff',
    500: '#1973ff',
    600: '#145cc9',
    700: '#0f4494',
    800: '#0a2d5f',
    900: '#05162f',
  },
};

const theme = extendTheme({
  colors,
  fonts: {
    heading: '"Inter", sans-serif',
    body: '"Inter", sans-serif',
  },
  components: {
    Button: {
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        outline: {
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
          },
        },
      },
    },
  },
});

export default theme;