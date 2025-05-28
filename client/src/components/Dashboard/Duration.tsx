import { DashboardContainer, DashboardHeading, DashboardSubtitle, DashboardVStack } from '../../config/ChakraStyleConfig';
import { Box, Flex, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text, VStack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useDashboardStyles } from '../../utils/useDashboardStyles';

const Duration = () => {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const styles = useDashboardStyles();

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      setSelectedMonth(currentMonth % 4); // Update selected month based on current date
    }, 86400000);

    return () => clearInterval(interval);
  }, []);

  // Calculate the date based on the selected month
  const calculateDate = (months:number) => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + months);
    return currentDate.toLocaleDateString();
  };

  return (
    <DashboardContainer>
      <DashboardVStack>
        <DashboardHeading>Growth Duration</DashboardHeading>
        <DashboardSubtitle>Track the duration of your plant growth cycle</DashboardSubtitle>
        
        <Box w="full" {...styles.cardStyles}>
          <VStack spacing={4} align="stretch">
            <Text textAlign="center" fontSize="lg" fontWeight="medium" color={styles.headingColor}>
              4 Months Duration
            </Text>
            
            <Flex justify="space-between" align="center" w="full">
              <VStack spacing={1} align="start">
                <Text fontSize="sm" color={styles.subtleTextColor}>Seeding</Text>
                <Text fontSize="sm" color={styles.textColor}>5-21-2024</Text>
              </VStack>
              
              <Box flex={1} mx={4}>
                <Slider
                  value={selectedMonth}
                  min={0}
                  max={3}
                  onChange={(val) => setSelectedMonth(val)}
                  colorScheme="green"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={4} />
                </Slider>
              </Box>
              
              <VStack spacing={1} align="end">
                <Text fontSize="sm" color={styles.subtleTextColor}>Harvesting</Text>
                <Text fontSize="sm" color={styles.textColor}>8-21-2024</Text>
              </VStack>
            </Flex>
            
            <Text textAlign="center" color={styles.textColor}>
              Current Month: {calculateDate(selectedMonth)}
            </Text>
          </VStack>
        </Box>
      </DashboardVStack>
    </DashboardContainer>
  );
};

export default Duration;