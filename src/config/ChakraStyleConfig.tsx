import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  BoxProps,
  HeadingProps,
  TextProps,
  StackProps,
} from '@chakra-ui/react';
import { useDashboardStyles } from '../utils/useDashboardStyles';

// Styled Box component for dashboard containers
export const DashboardContainer: React.FC<BoxProps> = ({ children, ...props }) => {
  const { containerStyles } = useDashboardStyles();
  return (
    <Box {...containerStyles} {...props}>
      {children}
    </Box>
  );
};

// Styled Heading component for dashboard headings
export const DashboardHeading: React.FC<HeadingProps> = ({ children, ...props }) => {
  const { headingColor } = useDashboardStyles();
  return (
    <Heading size="md" color={headingColor} {...props}>
      {children}
    </Heading>
  );
};

// Styled Text component for dashboard subtitles
export const DashboardSubtitle: React.FC<TextProps> = ({ children, ...props }) => {
  const { subtitleStyles } = useDashboardStyles();
  return (
    <Text {...subtitleStyles} {...props}>
      {children}
    </Text>
  );
};

// Styled VStack for dashboard content layout
export const DashboardVStack: React.FC<StackProps> = ({ children, ...props }) => {
  return (
    <VStack align="start" spacing={3} {...props}>
      {children}
    </VStack>
  );
};

// Styled Card component
export const DashboardCard: React.FC<BoxProps> = ({ children, ...props }) => {
  const { cardStyles } = useDashboardStyles();
  return (
    <Box {...cardStyles} {...props}>
      {children}
    </Box>
  );
};