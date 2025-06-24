import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Select,
  Textarea,
  useToast,
  Box,
  Text,
  Image,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiCamera, FiTrash2 } from 'react-icons/fi';
import { useRef, useState, useEffect } from 'react';
import { PlantGrowthData, PlantStage } from '../../../models';
import { useGrowth } from '../hooks';

interface UpdateCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  cropData?: PlantGrowthData;
}

export const UpdateCropModal = ({ isOpen, onClose, cropData }: UpdateCropModalProps) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updatePlantData, deletePlantData } = useGrowth();
  const modalContentBg = useColorModeValue('white', 'gray.800');

  const [formData, setFormData] = useState({
    plantType: '',
    plantedDate: '',
    expectedHarvestDate: '',
    currentStage: 'Seed' as PlantStage,
    expectedYield: 0,
    yieldUnit: 'g',
    nutrientSolution: '',
    notes: '',
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (cropData) {
      setFormData({
        plantType: cropData.plantType || '',
        plantedDate: cropData.plantedDate ? new Date(cropData.plantedDate).toISOString().split('T')[0] : '',
        expectedHarvestDate: cropData.expectedHarvestDate ? new Date(cropData.expectedHarvestDate).toISOString().split('T')[0] : '',
        currentStage: cropData.currentStage,
        expectedYield: 0, // Set default if not in cropData
        yieldUnit: 'g',
        nutrientSolution: '', // Set default if not in cropData
        notes: '', // Set default if not in cropData
      });
      setPreviewImage(cropData.imageUrl || null);
    }
  }, [cropData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please select a valid image file (JPEG, PNG, WebP)',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 5MB',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.plantType.trim()) {
      newErrors.plantType = 'Crop name is required';
    }
    if (!formData.plantedDate) {
      newErrors.plantedDate = 'Start date is required';
    }
    if (!formData.expectedHarvestDate) {
      newErrors.expectedHarvestDate = 'Expected harvest date is required';
    }
    if (new Date(formData.expectedHarvestDate) <= new Date(formData.plantedDate)) {
      newErrors.expectedHarvestDate = 'Harvest date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !cropData?._id) return;

    setIsSubmitting(true);
    try {
      const response = await updatePlantData(cropData._id, {
        plantType: formData.plantType,
        plantedDate: formData.plantedDate,
        expectedHarvestDate: formData.expectedHarvestDate,
        currentStage: formData.currentStage,
        // Add other fields as needed
      });

      if (response.isSuccess) {
        toast({
          title: 'Success',
          description: 'Crop details updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to update crop details',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!cropData?._id) return;

    setIsSubmitting(true);
    try {
      const response = await deletePlantData(cropData._id);
      if (response.isSuccess) {
        toast({
          title: 'Success',
          description: 'Crop deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to delete crop',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg={modalContentBg}>
        <ModalHeader>Update Crop Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {/* Image Upload */}
            <FormControl>
              <FormLabel>Crop Image</FormLabel>
              <Box position="relative" width="full">
                <Box
                  width="full"
                  height="200px"
                  borderRadius="md"
                  overflow="hidden"
                  bg="gray.100"
                >
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Crop preview"
                      objectFit="cover"
                      width="full"
                      height="full"
                    />
                  ) : (
                    <Box
                      width="full"
                      height="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text color="gray.500">No image uploaded</Text>
                    </Box>
                  )}
                </Box>
                <IconButton
                  icon={<FiCamera />}
                  aria-label="Upload image"
                  position="absolute"
                  bottom="2"
                  right="2"
                  colorScheme="brand"
                  onClick={() => fileInputRef.current?.click()}
                />
                <Input
                  type="file"
                  ref={fileInputRef}
                  display="none"
                  onChange={handleFileChange}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                />
              </Box>
            </FormControl>

            {/* Crop Name */}
            <FormControl isInvalid={!!errors.plantType}>
              <FormLabel>Crop Name</FormLabel>
              <Input
                value={formData.plantType}
                onChange={(e) => setFormData({ ...formData, plantType: e.target.value })}
                placeholder="Enter crop name"
              />
              <FormErrorMessage>{errors.plantType}</FormErrorMessage>
            </FormControl>

            {/* Dates */}
            <HStack spacing={4} width="full">
              <FormControl isInvalid={!!errors.plantedDate}>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  value={formData.plantedDate}
                  onChange={(e) => setFormData({ ...formData, plantedDate: e.target.value })}
                />
                <FormErrorMessage>{errors.plantedDate}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.expectedHarvestDate}>
                <FormLabel>Expected Harvest Date</FormLabel>
                <Input
                  type="date"
                  value={formData.expectedHarvestDate}
                  onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
                />
                <FormErrorMessage>{errors.expectedHarvestDate}</FormErrorMessage>
              </FormControl>
            </HStack>

            {/* Growth Stage */}
            <FormControl>
              <FormLabel>Growth Stage</FormLabel>
              <Select
                value={formData.currentStage}
                onChange={(e) => setFormData({ ...formData, currentStage: e.target.value as PlantStage })}
              >
                <option value="Seed">Seed</option>
                <option value="Sprout">Sprout</option>
                <option value="Veg">Vegetative</option>
                <option value="Flower">Flower</option>
                <option value="Harvest">Harvest</option>
              </Select>
            </FormControl>

            {/* Expected Yield */}
            <FormControl>
              <FormLabel>Expected Yield</FormLabel>
              <HStack>
                <NumberInput
                  value={formData.expectedYield}
                  onChange={(_, value) => setFormData({ ...formData, expectedYield: value })}
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Select
                  value={formData.yieldUnit}
                  onChange={(e) => setFormData({ ...formData, yieldUnit: e.target.value })}
                  width="100px"
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                </Select>
              </HStack>
            </FormControl>

            {/* Nutrient Solution */}
            <FormControl>
              <FormLabel>Nutrient Solution</FormLabel>
              <Textarea
                value={formData.nutrientSolution}
                onChange={(e) => setFormData({ ...formData, nutrientSolution: e.target.value })}
                placeholder="Enter nutrient solution details"
              />
            </FormControl>

            {/* Notes */}
            <FormControl>
              <FormLabel>Notes / Observations</FormLabel>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Enter any additional notes or observations"
              />
            </FormControl>

            {/* Last Updated */}
            {cropData?.updatedAt && (
              <Text fontSize="sm" color="gray.500" alignSelf="flex-start">
                Last updated: {new Date(cropData.updatedAt).toLocaleString()}
              </Text>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={4}>
            <Button
              leftIcon={<FiTrash2 />}
              variant="ghost"
              colorScheme="red"
              onClick={() => setShowDeleteConfirm(true)}
              isLoading={isSubmitting}
            >
              Delete Crop
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleSubmit}
              isLoading={isSubmitting}
            >
              Save Changes
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} isCentered size="sm">
        <ModalOverlay />
        <ModalContent bg={modalContentBg}>
          <ModalHeader>Delete Crop</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this crop? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDelete} isLoading={isSubmitting}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Modal>
  );
};

export default UpdateCropModal; 