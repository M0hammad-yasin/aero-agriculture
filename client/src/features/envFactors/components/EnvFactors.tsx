import { DashboardContainer, DashboardHeading, DashboardSubtitle, DashboardVStack } from '../../../config/ChakraStyleConfig';
import { Grid, GridItem, Box, Text, Icon, Center, Spinner } from '@chakra-ui/react';
import { WiHumidity, WiBarometer } from 'react-icons/wi'; // Example icons, replace with actual ones
// import { FaTemperatureHigh, FaSeedling } from 'react-icons/fa'; // Example icons
import { GiFertilizerBag } from 'react-icons/gi'; // Example for EC
import { MdCo2 } from 'react-icons/md'; // Example for CO2
import { useEnvFactors } from '../hooks';

const EnvFactors = () => {
  const { latestReadings, isLoading, error } = useEnvFactors();

  const sensorConfig = [
    { 
      key: 'humidity' as const, 
      icon: WiHumidity, 
      label: 'Humidity', 
      color: 'orange.400',
      unit: '%'
    },
    { 
      key: 'ec' as const, 
      icon: GiFertilizerBag, 
      label: 'EC', 
      color: 'blue.400',
      unit: 'mS/cm'
    },
    { 
      key: 'ph' as const, 
      icon: WiBarometer, 
      label: 'PH', 
      color: 'blue.300',
      unit: 'pH'
    },
    { 
      key: 'co2' as const, 
      icon: MdCo2, 
      label: 'CO2', 
      color: 'orange.300',
      unit: 'ppm'
    },
  ];

  if (isLoading && !latestReadings) {
    return (
      <DashboardContainer>
        <DashboardVStack>
          <DashboardHeading>Environmental Factors</DashboardHeading>
          <DashboardSubtitle>Key factors affecting plant growth</DashboardSubtitle>
          <Center h="200px">
            <Spinner size="lg" color="brand.500" />
          </Center>
        </DashboardVStack>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <DashboardVStack>
          <DashboardHeading>Environmental Factors</DashboardHeading>
          <DashboardSubtitle>Key factors affecting plant growth</DashboardSubtitle>
          <Center h="200px">
            <Text color="red.500">Error loading environmental data: {error}</Text>
          </Center>
        </DashboardVStack>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardVStack>
        <DashboardHeading>Environmental Factors</DashboardHeading>
        <DashboardSubtitle>Key factors affecting plant growth</DashboardSubtitle>
        <Grid templateColumns='repeat(2, 1fr)' gap={6} w="100%" mt={4}>
          {sensorConfig.map((sensor) => {
            const reading = latestReadings?.[sensor.key];
            const value = reading ? `${reading.value} ${sensor.unit}` : 'N/A';
            
            return (
              <GridItem key={sensor.key} w='100%'>
                <Box textAlign="center">
                  <Center
                    bg={sensor.color}
                    borderRadius="full"
                    w="50px"
                    h="50px"
                    mx="auto"
                    mb={2}
                  >
                    <Icon as={sensor.icon} w={6} h={6} color="white" />
                  </Center>
                  <Text fontSize="sm" color="gray.500">{sensor.label}</Text>
                  <Text fontSize="lg" fontWeight="bold">{value}</Text>
                </Box>
              </GridItem>
            );
          })}
        </Grid>
      </DashboardVStack>
    </DashboardContainer>
  );
};

export default EnvFactors; 