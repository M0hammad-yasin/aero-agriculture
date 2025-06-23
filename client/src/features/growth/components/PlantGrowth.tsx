import { useState, useEffect } from 'react';
import carrotImage from '../../../assets/dashboard/carrot.png';
import {
  Box,
  Flex,
  Image,
  Text,
  HStack,
  VStack,
  IconButton,
  Spacer,
  Tabs,      
  TabList,   
  Tab,
  Spinner,
  Center,
} from '@chakra-ui/react';
import {
  DashboardContainer,
  DashboardHeading,
  DashboardVStack,
} from '../../../config/ChakraStyleConfig';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { useGrowth } from '../hooks';
import { PlantStage } from '../../../models';
const plantStageIcons = {
  Seed: '🌱',
  Sprout: '🌿',
  Veg: '🌳',
  Flower: '🌸',
  Harvest: '🧺',
};

const PlantGrowth = () => {
  const { plantData, isLoading, error, updatePlantStage } = useGrowth();
  
  const [selectedPlantIndex, setSelectedPlantIndex] = useState<number>(0);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);

  // Get current plant data
  const currentPlant = plantData?.[selectedPlantIndex];
  const plantKeys = plantData || [];

  // Update currentStageIndex when selectedPlantIndex changes
  useEffect(() => {
    if (currentPlant) {
      const stages = ['Seed', 'Sprout', 'Veg', 'Flower', 'Harvest'];
      const stageIndex = stages.indexOf(currentPlant.currentStage);
      setCurrentStageIndex(stageIndex >= 0 ? stageIndex : 0);
    }
  }, [currentPlant]);

  const handleTabChange = (index: number) => {
    setSelectedPlantIndex(index);
  };

  const handlePrevStage = async () => {
    if (!currentPlant) return;
    
    const stages = ['Seed', 'Sprout', 'Veg', 'Flower', 'Harvest'];
    const newStageIndex = Math.max(0, currentStageIndex - 1);
    const newStage = stages[newStageIndex] as PlantStage;
    try {
      await updatePlantStage(currentPlant._id, newStage);
      setCurrentStageIndex(newStageIndex);
    } catch (error) {
      console.error('Failed to update plant stage:', error);
    }
  };

  const handleNextStage = async () => {
    if (!currentPlant) return;
    
    const stages = ['Seed', 'Sprout', 'Veg', 'Flower', 'Harvest'];
    const newStageIndex = Math.min(stages.length - 1, currentStageIndex + 1);
    const newStage = stages[newStageIndex] as PlantStage;
    
    try {
      await updatePlantStage(currentPlant._id, newStage);
      setCurrentStageIndex(newStageIndex);
    } catch (error) {
      console.error('Failed to update plant stage:', error);
    }
  };

  if (isLoading && !plantData) {
    return (
      <DashboardContainer>
        <DashboardVStack spacing={6} align="stretch">
          <Flex align="center">
            <DashboardHeading>Crop Performance</DashboardHeading>
            <Spacer />
          </Flex>
          <Center h="400px">
            <Spinner size="lg" color="brand.500" />
          </Center>
        </DashboardVStack>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <DashboardVStack spacing={6} align="stretch">
          <Flex align="center">
            <DashboardHeading>Crop Performance</DashboardHeading>
            <Spacer />
          </Flex>
          <Center h="400px">
            <Text color="red.500">Error loading plant data: {error}</Text>
          </Center>
        </DashboardVStack>
      </DashboardContainer>
    );
  }

  if (!plantData || plantData.length === 0) {
    return (
      <DashboardContainer>
        <DashboardVStack spacing={6} align="stretch">
          <Flex align="center">
            <DashboardHeading>Crop Performance</DashboardHeading>
            <Spacer />
          </Flex>
          <Center h="400px">
            <Text color="gray.500">No plants found. Add some plants to get started.</Text>
          </Center>
        </DashboardVStack>
      </DashboardContainer>
    );
  }

  const stages = ['Seed', 'Sprout', 'Veg', 'Flower', 'Harvest'];

  return (
    <DashboardContainer>
      <DashboardVStack spacing={6} align="stretch">
        <Flex align="center">
          <DashboardHeading>Crop Performance</DashboardHeading>
          <Spacer />
        </Flex>

        <Tabs 
          index={selectedPlantIndex} 
          onChange={handleTabChange} 
          variant="enclosed" 
          p={2}
        >
          <TabList>
            {plantKeys.map((plant, index) => (
              <Tab 
                key={plant._id} 
                _selected={{ color: 'white', bg: 'brand.600' }} 
              >
                {plant.plantType}
              </Tab>
            ))}
          </TabList>
        </Tabs>

        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-around"
          p={5}
          borderRadius="lg"
        >
          <Image
            src={currentPlant?.imageUrl || carrotImage}
            alt={currentPlant?.plantType || 'Plant'}
            boxSize={{ base: '150px', md: '180px' }}
            objectFit="fill"
            borderRadius="md"
            mb={{ base: 4, md: 0 }}
          />
          <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="bold" color="white">
            {currentPlant?.health || 'Unknown'}
          </Text>
        </Flex>

        <Box p={5} borderRadius="lg">
          <HStack justify="space-between" align="center" mb={4}>
            {stages.map((stage, index) => (
              <Text
                key={stage}
                fontSize="sm"
                color={index === currentStageIndex ? 'green.300' : 'gray.400'}
                fontWeight={index === currentStageIndex ? 'bold' : 'normal'}
              >
                {stage}
              </Text>
            ))}
          </HStack>

          <Flex align="center" justify="space-between">
            <IconButton
              aria-label="Previous stage"
              icon={<ArrowBackIcon />}
              onClick={handlePrevStage}
              isDisabled={currentStageIndex === 0}
              variant="ghost"
              colorScheme="teal"
            />
            <HStack spacing={{ base: 2, md: 4 }} flexGrow={1} justify="space-around">
              {stages.map((stage, index) => (
                <VStack
                  key={stage + '-icon'}
                  align="center"
                  opacity={index === currentStageIndex ? 1 : 0.5}
                  transform={index === currentStageIndex ? 'scale(1.1)' : 'scale(0.9)'}
                  transition="all 0.2s ease-in-out"
                >
                  <Text fontSize={{ base: '2xl', md: '3xl' }}>
                    {plantStageIcons[stage as keyof typeof plantStageIcons]}
                  </Text>
                  <Text
                    fontSize="xs"
                    color={index === currentStageIndex ? 'green.300' : 'gray.400'}
                  >
                    {stage}
                  </Text>
                </VStack>
              ))}
            </HStack>
            <IconButton
              aria-label="Next stage"
              icon={<ArrowForwardIcon />}
              onClick={handleNextStage}
              isDisabled={currentStageIndex === stages.length - 1}
              variant="ghost"
              colorScheme="teal"
            />
          </Flex>
        </Box>
      </DashboardVStack>
    </DashboardContainer>
  );
};

export default PlantGrowth; 