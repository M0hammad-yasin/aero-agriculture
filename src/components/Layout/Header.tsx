import {
  Flex,
  IconButton,
  Avatar,
  useColorModeValue,
  useColorMode,
  Box,
  Text,
  HStack,
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
import { FiBell, FiSun, FiMoon, FiUser, FiEdit, FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CollapsibleButton from './CollapsibleButton';

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
  onMenuToggle?: () => void;
  user?: { name: string; image?: string };
}

const Header = ({ collapsed, onToggle, onMenuToggle, user }: HeaderProps) => {
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { colorMode, toggleColorMode } = useColorMode();
  const [time, setTime] = useState(new Date());
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
  const drawerContentBg = useColorModeValue('white', 'gray.800');
  const collapsibleButtonBg = useColorModeValue('white', 'gray.900');
  const collapsibleButtonHoverBg = useColorModeValue('gray.100', 'gray.800');

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date as DD/MM/YYYY
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB');
  };

  // Format time as HH:MM:SS
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB');
  };

  // Placeholder for logout function
  const logoutUser = () => {
    console.log('User logged out');
    onLogoutClose();
  };

  // Placeholder for LED toggle component
  const LEDToggle = ({ className }: { className?: string }) => (
    <Button size="sm" colorScheme="blue" className={className}>
      LED Toggle
    </Button>
  );

  return (
    <Box
      as="nav"
      bg={bgColor}
      boxShadow="sm"
      mb={2}
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
              <CollapsibleButton 
                collapsed={collapsed} 
                onToggle={onToggle} 
                buttonBg={collapsibleButtonBg} 
                buttonHoverBg={collapsibleButtonHoverBg} 
              />
            </Flex>
          )}

          <Flex align="center">
            <Text as="h4" fontWeight="bold">Hello & Welcome</Text>
          </Flex>

          <Flex align="center">
            <Text px={3}>{formatDate(time)}</Text>
            <Text px={3}>{formatTime(time)}</Text>
            
            <Box mx={3}>
              <LEDToggle />
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
                      colorScheme="red"
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

            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              size="sm"
              variant="ghost"
              ml={2}
              onClick={toggleColorMode}
            />
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
            <Button as={Link} to="/" colorScheme="blue" onClick={logoutUser}>
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
            <Button colorScheme="blue">
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Header;