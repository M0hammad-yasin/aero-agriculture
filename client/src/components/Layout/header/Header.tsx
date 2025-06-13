import {
  Flex,
  IconButton,
  Avatar,
  useColorModeValue,
  Box,
  Text,
  Container,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Center,
  FormErrorMessage,
} from '@chakra-ui/react';
import { FiBell, FiUser, FiEdit, FiLogOut, FiPower, FiCamera } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useLayoutStore } from '../../../store/useLayoutStore';
import CollapsibleButton from '../CollapsibleButton';
import ColorModeSwitch from './ColorModeSwitch';
import LEDToggle from './LEDToggle';
import TimeDisplay from './TimeDisplay';
import { ProfileUpdateRequest } from '../../../models/auth-model';
import { useAuth } from '../../../features/authentication';
const Header = () => {
  const {updateProfile ,isLoading,logout,user}=useAuth();
  const collapsed = useLayoutStore((state) => state.collapsed);
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast();
  
  // Mock notifications for demonstration
  const [notifications, setNotifications] = useState<string[]>([
    'New drone data available',
    'Field analysis complete',
    'System update required'
  ]);
  
  // Modal for logout confirmation
  const { isOpen: isLogoutOpen, onOpen: onLogoutOpen, onClose: onLogoutClose } = useDisclosure();
  
  // Drawer for user profile
  const { isOpen: isProfileOpen, onOpen: onProfileOpen, onClose: onProfileClose } = useDisclosure();
  
  // Modal for profile update
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
  
  // Profile update form state
  const [profileData, setProfileData] = useState<ProfileUpdateRequest>({
    name: user?.name ?? '',
    id:user?.id ?? '',
    email: user?.email ?? '',
  });
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);  
  const [errors, setErrors] = useState<Partial<ProfileUpdateRequest>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const menuListBg = useColorModeValue('white', 'gray.900');
  const notificationMenuListBg = useColorModeValue('white', 'gray.900');
  const modalContentBg = useColorModeValue('white', 'gray.800');
  const bg = useColorModeValue('green.400', 'gray.900');
  const drawerContentBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    setNotifications((prevNotifications) => {
      const newNotifications = [...prevNotifications, 'New notification!'];
      return newNotifications;
    });
  }, []);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name ?? '',
        email: user.email ?? '',
      }));
    }
  }, [user]);

  const logoutUser = () => {
    logout();
    onLogoutClose();
  };

  // Handle input changes
  const handleInputChange = (field: keyof ProfileUpdateRequest, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Handle file upload
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

      setProfileData(prev => ({
        ...prev,
        profileImg: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileUpdateRequest> = {};

    if (!profileData?.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!profileData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleUpdateProfile = async () => {
    if (!validateForm()) {
      return;
    }
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('id', user?.id || '');
      if(profileData.name)formData.append('name', profileData.name);
      if(profileData.email) formData.append('email', profileData.email);
      if (profileData.profileImg) {
        formData.append('profileImg', profileData.profileImg);
      }
      try{
     const response= await updateProfile(formData as unknown as ProfileUpdateRequest)
       if(response.success){
      toast({
        title: 'Profile updated successfully',
        description: 'Your profile has been updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setProfileData(prev => ({
        ...prev,
        password: '',
      }));
    }else
      toast({
        title: 'Update failed',
        description: response.error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }catch(error){
      console.log(error);
    };
  };

  // Reset form when modal closes
  const handleUpdateClose = () => {
    setProfileData({
      id: user?.id??'',
      name: user?.name || '',
      email: user?.email || '',
      profileImg: null,
    });
    setPreviewImage(null);
    setErrors({});
    onUpdateClose();
  };

  return (
    <Box
      margin={3}
      marginLeft={5}
      borderRadius={"md"}
      as="nav"
      boxShadow="sm"
      mb={2}
      bg={bg}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
    >
      <Container maxW="container.xl">
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          h="16"
        >
          {!collapsed && (
            <Flex justify="center" align="center" mt="4" order={0}>
              <CollapsibleButton />
            </Flex>
          )}

          <Flex align="center">
            <Text as="h4" fontWeight="bold">Hello & Welcome</Text>
          </Flex>

          <Flex align="center">
            <TimeDisplay />
            
            <Box mx={3}>
              <LEDToggle />
            </Box>
            
            <Box ml={2}>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Notifications"
                  icon={<FiBell />}
                  variant="ghost"
                  position="relative"
                >
                  {notifications.length > 0 && (
                    <Badge
                      colorScheme="brand"
                      borderRadius="full"
                      position="absolute"
                      top="0"
                      right="0"
                    >
                      {notifications.length}
                    </Badge>
                  )}
                </MenuButton>
                <MenuList bg={notificationMenuListBg}>
                  {notifications.length === 0 ? (
                    <MenuItem>No notifications</MenuItem>
                  ) : (
                    notifications.map((notification, index) => (
                      <MenuItem key={index}>{notification}</MenuItem>
                    ))
                  )}
                </MenuList>
              </Menu>
            </Box>

            {user && <Text mr={3}>{user.name}</Text>}

            {user && (
              <Menu>
                <MenuButton>
                  <Avatar
                    size="sm"
                    name={user.name}
                    src={user.image || "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp"}
                    cursor="pointer"
                  />
                </MenuButton>
                <MenuList bg={menuListBg}>
                  <MenuItem icon={<FiUser />} onClick={onProfileOpen}>
                    My profile
                  </MenuItem>
                  <MenuItem icon={<FiEdit />} onClick={onUpdateOpen}>
                    Update Profile
                  </MenuItem>
                  <MenuItem icon={<FiLogOut />} onClick={onLogoutOpen}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            )}

            <ColorModeSwitch />
          </Flex>
        </Flex>
      </Container>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={isLogoutOpen} onClose={onLogoutClose}>
        <ModalOverlay />
        <ModalContent bg={modalContentBg}>
          <ModalHeader>Logout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to logout?</ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onLogoutClose}>
              Cancel
            </Button>
            <Button as={Link} to="/login" colorScheme="brand" onClick={logoutUser} leftIcon={<FiPower />}>
              Logout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* User Profile Drawer */}
      <Drawer isOpen={isProfileOpen} placement="right" onClose={onProfileClose}>
        <DrawerOverlay />
        <DrawerContent bg={drawerContentBg}>
          <DrawerCloseButton />
          <DrawerHeader>My Profile</DrawerHeader>
          <DrawerBody>
            {user && (
              <Flex direction="column" align="center" gap={4}>
                <Avatar
                  size="xl"
                  name={user.name}
                  src={user.image || "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp"}
                  mb={4}
                />
                <Text fontSize="xl" fontWeight="bold">{user.name}</Text>
                <Box w="full">
                  <Flex direction="column" gap={2}>
                    <Flex justify="space-between">
                      <Text fontWeight="medium">Email:</Text>
                      <Text>{user.email}</Text>
                    </Flex>
                    
                    <Flex justify="space-between">
                      <Text fontWeight="medium">Status:</Text>
                      <Badge colorScheme="green">Active</Badge>
                    </Flex>
                  </Flex>
                </Box>
                <Button
                  leftIcon={<FiEdit />}
                  colorScheme="brand"
                  variant="solid"
                  w="full"
                  onClick={onUpdateOpen}
                >
                  Update Profile
                </Button>
              </Flex>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Update Profile Modal */}
      <Modal isOpen={isUpdateOpen} onClose={handleUpdateClose} size="lg">
        <ModalOverlay />
        <ModalContent bg={modalContentBg}>
          <ModalHeader>Update Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {/* Profile Image Upload */}
              <FormControl>
                <FormLabel>Profile Image</FormLabel>
                <Center>
                  <Box position="relative">
                    <Avatar
                      size="xl"
                      name={profileData.name}
                      src={previewImage || user?.image || "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp"}
                    />
                    <IconButton
                      icon={<FiCamera />}
                      size="sm"
                      colorScheme="brand"
                      borderRadius="full"
                      position="absolute"
                      bottom="0"
                      right="0"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Upload profile image"
                    />
                  </Box>
                </Center>
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  display="none"
                />
                <Text fontSize="sm" color="gray.500" textAlign="center" mt={2}>
                  Click the camera icon to upload a new profile image
                </Text>
              </FormControl>

              {/* Name Field */}
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Name</FormLabel>
                <Input
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your name"
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              {/* Email Field */}
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleUpdateClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="brand" 
              onClick={handleUpdateProfile}
              isLoading={isLoading}
              loadingText="Updating..."
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Header;