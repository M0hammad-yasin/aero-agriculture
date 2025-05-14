import { useColorModeValue } from '@chakra-ui/react';

/**
 * Custom hook that provides consistent styling for dashboard components
 * Centralizes color mode values to maintain consistency and ease future updates
 */
export const useDashboardStyles = () => {
  // Common color mode values used across dashboard components
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const headingColor = useColorModeValue('brand.600', 'brand.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const subtleTextColor = useColorModeValue('gray.600', 'gray.400');
  const accentColor = useColorModeValue('brand.500', 'brand.300');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  
  // Return all style values as an object
  return {
    // Base colors
    bgColor,
    textColor,
    headingColor,
    borderColor,
    subtleTextColor,
    accentColor,
    hoverBgColor,
    
    // Common component styles
    containerStyles: {
      bg: bgColor,
      borderRadius: "lg",
      boxShadow: "md",
      p: 4,
      mb: 4,
      borderColor: borderColor,
      borderWidth: "1px",
      color: textColor
    },
    
    // Heading styles
    headingStyles: {
      size: "md",
      color: headingColor,
      mb: 2
    },
    
    // Text styles
    textStyles: {
      color: textColor,
      fontSize: "sm"
    },
    
    // Subtitle styles
    subtitleStyles: {
      color: subtleTextColor,
      fontSize: "sm",
      mb: 3
    },
    
    // Card styles
    cardStyles: {
      bg: bgColor,
      borderRadius: "md",
      boxShadow: "xs",
      p: 3,
      borderColor: borderColor,
      borderWidth: "1px",
      color: textColor,
      transition: "all 0.2s",
      _hover: {
        boxShadow: "md",
        borderColor: accentColor,
      }
    },
    
    // Button styles
    buttonStyles: {
      bg: accentColor,
      color: "white",
      _hover: {
        bg: headingColor,
        transform: "translateY(-2px)",
        boxShadow: "sm"
      }
    },
    
    // Sidebar specific styles
    sidebarStyles: {
      bg: bgColor,
      borderRadius: "lg",
      boxShadow: "sm",
      p: 4,
      borderColor: borderColor,
      borderWidth: "1px",
      color: textColor,
      h: "full"
    }
  };
};