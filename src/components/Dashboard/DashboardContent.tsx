import { Flex, Grid, GridItem, Box, useColorModeValue } from '@chakra-ui/react';
import EnvConditions from './EnvConditions';
import EnvFactors from './EnvFactors';
import PlantGrowth from './PlantGrowth';
import Duration from './Duration';
import GrowthStats from './GrowthStats';
import RightSidebar from './RightSidebar';

const DashboardContent = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  
  return (
    <Box as="main" w="full" bg={bgColor} p={{ base: 2, sm: 4, md: 6 }}>
      <Flex direction={{ base: 'column', lg: 'row' }} gap={{ base: 4, md: 6 }}>
        <Box flex="10" maxW={{ lg: '83.33%' }}>
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(12, 1fr)' }}
            gap={{ base: 4, md: 6 }}
          >
            {/* Left column - 4/12 on medium screens and above */}
            <GridItem colSpan={{ base: 12, md: 4 }}>
              <EnvConditions />
              <EnvFactors />
            </GridItem>
            
            {/* Right column - 8/12 on medium screens and above */}
            <GridItem colSpan={{ base: 12, md: 8 }}>
              <PlantGrowth />
              <Duration />
              <GrowthStats />
            </GridItem>
          </Grid>
        </Box>
        
        {/* Right sidebar */}
        <Box flex="2" maxW={{ lg: '16.67%' }}>
          <RightSidebar />
        </Box>
      </Flex>
    </Box>
  );
};
export default DashboardContent;