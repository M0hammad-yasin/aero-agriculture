import { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Text,
  useColorModeValue,
  VStack,
  Image,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { UpdateCropModal } from '../../features/growth/components';
import { PlantGrowthData } from '../../models';
import { useGrowth } from '../../features/growth/hooks';

const CropCard = ({ crop, onEdit }: { crop: PlantGrowthData; onEdit: (crop: PlantGrowthData) => void }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={cardBg}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      p={4}
      cursor="pointer"
      onClick={() => onEdit(crop)}
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
    >
      <VStack spacing={3} align="stretch">
        <Box height="200px" borderRadius="md" overflow="hidden" bg="gray.100">
          <Image
            src={crop.imageUrl}
            alt={crop.plantType}
            objectFit="cover"
            width="100%"
            height="100%"
            fallbackSrc="https://via.placeholder.com/200"
          />
        </Box>
        <Text fontSize="xl" fontWeight="semibold">
          {crop.plantType}
        </Text>
        <Flex justify="space-between" fontSize="sm" color="gray.500">
          <Text>Stage: {crop.currentStage}</Text>
          <Text>Health: {crop.health}</Text>
        </Flex>
      </VStack>
    </Box>
  );
};

const CropsPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCrop, setSelectedCrop] = useState<PlantGrowthData>();
  const { plantData } = useGrowth();

  const handleEditCrop = (crop: PlantGrowthData) => {
    setSelectedCrop(crop);
    onOpen();
  };

  return (
    <DashboardLayout>
      <Box p={4}>
        <Flex justify="space-between" align="center" mb={6}>
          <Text fontSize="2xl" fontWeight="bold">
            My Crops
          </Text>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="brand"
            onClick={() => {
              setSelectedCrop(undefined);
              onOpen();
            }}
          >
            Add New Crop
          </Button>
        </Flex>

        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
          gap={6}
        >
          {plantData?.map((crop) => (
            <CropCard key={crop._id} crop={crop} onEdit={handleEditCrop} />
          ))}
        </Grid>

        <UpdateCropModal
          isOpen={isOpen}
          onClose={onClose}
          cropData={selectedCrop}
        />
      </Box>
    </DashboardLayout>
  );
};

export default CropsPage; 