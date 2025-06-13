import { useState, useEffect } from 'react';
import carrotImage from '../../assets/dashboard/carrot.png';
import {
  Box,
  Flex,
  // Select, <--- Remove Select
  Image,
  Text,
  HStack,
  VStack,
  IconButton,
  Spacer,
  Tabs,      
  TabList,   
  Tab,       
} from '@chakra-ui/react';
import {
  DashboardContainer,
  DashboardHeading,
  DashboardVStack,
} from '../../config/ChakraStyleConfig';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';

const plantData = {
  carrot: {
    name: 'Carrot',
    image: carrotImage,
    stages: ['Seed', 'Sprout', 'Veg', 'Flower', 'Harvest'],
    currentStageIndex: 2, // Veg
    health: 'good',
  },
  strawberry: {
    name: 'Strawberry',
    image: 'https://via.placeholder.com/150/FF6347/FFFFFF?Text=Strawberry',
    stages: ['Seed', 'Sprout', 'Veg', 'Flower', 'Harvest'],
    currentStageIndex: 3, // Flower
    health: 'Good',
  },
};

const plantStageIcons = {
  Seed: '🌱',
  Sprout: '🌿',
  Veg: '🌳',
  Flower: '🌸',
  Harvest: '🧺',
};

const PlantGrowth = () => {
  const plantKeys = Object.keys(plantData);
  const [selectedPlantKey, setSelectedPlantKey] = useState<string>(
    plantKeys[0]
  );

  const currentPlant = plantData[selectedPlantKey as keyof typeof plantData];
  const [currentStageIndex, setCurrentStageIndex] = useState(
    currentPlant.currentStageIndex
  );

  // Update currentStageIndex when selectedPlantKey changes
  useEffect(() => {
    const newPlant = plantData[selectedPlantKey as keyof typeof plantData];
    setCurrentStageIndex(newPlant.currentStageIndex);
  }, [selectedPlantKey]);

  const handleTabChange = (index: number) => {
    const newPlantKey = plantKeys[index];
    setSelectedPlantKey(newPlantKey);
    // No need to set currentStageIndex here, useEffect will handle it
  };

  const handlePrevStage = () => {
    setCurrentStageIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextStage = () => {
    setCurrentStageIndex((prev) =>
      Math.min(currentPlant.stages.length - 1, prev + 1)
    );
  };

  return (
    <DashboardContainer>
      <DashboardVStack spacing={6} align="stretch">
        <Flex align="center">
          <DashboardHeading>Crop Performance</DashboardHeading>
          <Spacer />
        </Flex>

        <Tabs 
          index={plantKeys.indexOf(selectedPlantKey)} 
          onChange={handleTabChange} 
          variant="enclosed" 
          p={2}
        >
          <TabList>
            {plantKeys.map((key) => (
              <Tab 
                key={key} 
                _selected={{ color: 'white', bg: 'brand.600' }} 
              >
                {plantData[key as keyof typeof plantData].name}
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
            src={currentPlant.image}
            alt={currentPlant.name}
            boxSize={{ base: '150px', md: '180px' }}
            objectFit="fill"
            borderRadius="md"
            mb={{ base: 4, md: 0 }}
          />
          <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="bold" color="white">
            {currentPlant.health}
          </Text>
        </Flex>

        <Box  p={5} borderRadius="lg">
          <HStack justify="space-between" align="center" mb={4}>
            {currentPlant.stages.map((stage, index) => (
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
              {currentPlant.stages.map((stage, index) => (
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
              isDisabled={currentStageIndex === currentPlant.stages.length - 1}
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