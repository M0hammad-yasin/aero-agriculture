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
} from '@chakra-ui/react';
import { FiBell,FiUser, FiEdit, FiLogOut, FiPower } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useLayoutStore } from '../../../store/useLayoutStore';
import CollapsibleButton from '../CollapsibleButton';
import ColorModeSwitch from './ColorModeSwitch';
import LEDToggle from './LEDToggle';
import TimeDisplay from './TimeDisplay';

interface HeaderProps {
  onMenuToggle?: () => void;
  user?: { name: string; image?: string } | null; // User can be null initially
}

const Header = ({  user }: HeaderProps) => {
  const collapsed = useLayoutStore((state) => state.collapsed); // Get state from store
  // const toggleSidebar = useLayoutStore((state) => state.toggleSidebar); // Get action from store
  const borderColor = useColorModeValue('gray.200', 'gray.700');
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
  const menuListBg = useColorModeValue('white', 'gray.900');
  const notificationMenuListBg = useColorModeValue('white', 'gray.900');
  const modalContentBg = useColorModeValue('white', 'gray.800');
  const bg = useColorModeValue('green.400', 'gray.900');
  const drawerContentBg = useColorModeValue('white', 'gray.800');
  useEffect(() => {
    setNotifications((prevNotifications) => {
      // Simulate new notifications
      const newNotifications = [...prevNotifications, 'New notification!'];
      return newNotifications;
    });
    // Time update logic is now in TimeDisplay.tsx
  }, []);

  // Use the logout function from auth store
  const logout = useAuthStore((state) => state.logout);
console.log("header bg : " , bg  );
  const logoutUser = () => {
    logout();
    onLogoutClose();
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
              {/* CollapsibleButton now gets state and toggle from store directly */}
              <CollapsibleButton 
              />
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

            <ColorModeSwitch/>

            
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
              <Flex direction="column" align="center">
                <Avatar
                  size="xl"
                  name={user.name}
                  src={user.image || "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp"}
                  mb={4}
                />
                <Text fontSize="xl" fontWeight="bold">{user.name}</Text>
              </Flex>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Update Profile Modal */}
      <Modal isOpen={isUpdateOpen} onClose={onUpdateClose}>
        <ModalOverlay />
        <ModalContent bg={modalContentBg}>
          <ModalHeader>Update Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Profile update form would go here</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onUpdateClose}>
              Cancel
            </Button>
            <Button colorScheme="brand">
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Header;