import { extendTheme, ThemeConfig, withDefaultColorScheme } from '@chakra-ui/react';

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

const config :ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme(
  {
    config,
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
              bg: 'brand.600', // Example hover background
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
    // Override default gray colors with green
    semanticTokens: {
      colors: {
        // Replace default gray tokens with brand (green) colors
        'chakra-body-bg': { _light: 'green.500', _dark: 'gray.900' },
        'chakra-body-text': { _light: 'gray.800', _dark: 'whiteAlpha.900' },
        'chakra-border-color': { _light: 'brand.200', _dark: 'whiteAlpha.300' },
        'chakra-subtle-bg': { _light: 'brand.50', _dark: 'gray.700' },
        'chakra-subtle-text': { _light: 'brand.600', _dark: 'brand.200' },
        'chakra-placeholder-color': { _light: 'brand.500', _dark: 'whiteAlpha.400' },
      },
    },
  },
  // Apply brand (green) color scheme to all components
  withDefaultColorScheme({ colorScheme: 'brand' })
);

export default theme;