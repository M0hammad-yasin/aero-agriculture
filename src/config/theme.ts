import { extendTheme, ThemeConfig, withDefaultColorScheme } from '@chakra-ui/react';

const colors = {

  // --pakistan-green: #163607ff;
  // --dark-moss-green: #25590dff;
  // --office-green: #357a15ff;
  // --forest-green: #3b8f14ff;
  // --kelly-green: #43a117ff;
  // --kelly-green-2: #51c41cff;
  // --light-green: #97eb70ff;
  // --tea-green: #bef2a6ff;
  // --tea-green-2: #d8f7c9ff;
  // --nyanza: #e5fadbff;

  brand: {
    50: '#e5fadbff',
    100: '#d8f7c9ff',
    200: '#bef2a6ff',
    300: '#97eb70ff',
    400: '#51c41cff',
    500: '#43a117ff',
    600: '#3b8f14ff',
    700: '#357a15ff',
    800: '#25590dff',
    900: '#163607ff',
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
        'chakra-body-bg': { _light: 'gray.100', _dark: 'brand.900' },
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