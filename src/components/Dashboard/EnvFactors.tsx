import { DashboardContainer, DashboardHeading, DashboardSubtitle, DashboardVStack } from '../../config/ChakraStyleConfig';
import { Grid, GridItem, Box, Text, Icon, Center } from '@chakra-ui/react';
import { WiHumidity, WiBarometer } from 'react-icons/wi'; // Example icons, replace with actual ones
// import { FaTemperatureHigh, FaSeedling } from 'react-icons/fa'; // Example icons
import { GiFertilizerBag } from 'react-icons/gi'; // Example for EC
import { MdCo2 } from 'react-icons/md'; // Example for CO2

const EnvFactors = () => {
  return (
    <DashboardContainer>
      <DashboardVStack>
        <DashboardHeading>Environmental Factors</DashboardHeading>
        <DashboardSubtitle>Key factors affecting plant growth</DashboardSubtitle>
        <Grid templateColumns='repeat(2, 1fr)' gap={6} w="100%" mt={4}>
          {[
            { icon: WiHumidity, label: 'Humidity', value: '75.3 %', color: 'orange.400' },
            { icon: GiFertilizerBag, label: 'EC', value: '676.7 MV', color: 'blue.400' },
            { icon: WiBarometer, label: 'PH', value: '7.3', color: 'blue.300' }, // Using WiBarometer as a placeholder for PH icon
            { icon: MdCo2, label: 'CO2', value: '475.1 M', color: 'orange.300' }, // Using FaSeedling as a placeholder for CO2 icon
          ].map((factor, index) => (
            <GridItem key={index} w='100%'>
              <Box textAlign="center">
                <Center
                  bg={factor.color}
                  borderRadius="full"
                  w="50px"
                  h="50px"
                  mx="auto"
                  mb={2}
                >
                  <Icon as={factor.icon} w={6} h={6} color="white" />
                </Center>
                <Text fontSize="sm" color="gray.500">{factor.label}</Text>
                <Text fontSize="lg" fontWeight="bold">{factor.value}</Text>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </DashboardVStack>
    </DashboardContainer>
  );
};

export default EnvFactors;