import { Box, VStack, Icon, Text, Flex, useColorModeValue } from '@chakra-ui/react';
import { FiHome, FiMap, FiBarChart2, FiSettings, FiDatabase } from 'react-icons/fi';
import CollapsibleButton from './CollapsibleButton';

interface NavItemProps {
  icon: React.ElementType;
  children: string;
  isActive?: boolean;
}

const NavItem = ({ icon, children, isActive = false }: NavItemProps) => {
  const activeBg = useColorModeValue('brand.50', 'rgba(112, 199, 36, 0.2)');
  const activeColor = useColorModeValue('brand.600', 'brand.400');
  const inactiveColor = useColorModeValue('gray.600', 'gray.400');
  
  return (
    <Flex
      align="center"
      px="4"
      py="3"
      cursor="pointer"
      role="group"
      fontWeight={isActive ? "semibold" : "normal"}
      color={isActive ? activeColor : inactiveColor}
      bg={isActive ? activeBg : 'transparent'}
      borderRadius="md"
      _hover={{
        bg: activeBg,
        color: activeColor,
      }}
    >
      <Icon
        mr="3"
        fontSize="16"
        as={icon}
      />
      <Text fontSize="sm">{children}</Text>
    </Flex>
  );
};

const Sidebar = ({ collapsed = false, onToggle }: { collapsed?: boolean; onToggle: () => void }) => {
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const collapsibleButtonBg = useColorModeValue('white', 'gray.900'); // Added for button
  const collapsibleButtonHoverBg = useColorModeValue('gray.100', 'gray.800'); // Added for button
  const sidebarWidth = collapsed ? '60px' : '200px';
  const logoFontSize = collapsed ? 'lg' : '2xl';
  const logoText = collapsed ? 'AA' : 'AeroAgriculture';

  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      w={sidebarWidth}
      minW={sidebarWidth}
      maxW={sidebarWidth}
      transition="width 0.2s"
      display={{ base: 'none', md: 'block' }}
    >
     { collapsed ?<Flex justify="center" mt="4" order={1}>
        <CollapsibleButton 
          collapsed={collapsed}
          onToggle={onToggle}
          buttonBg={collapsibleButtonBg} // Pass prop
          buttonHoverBg={collapsibleButtonHoverBg} // Pass prop
        />
      </Flex>:
      <Flex px="4" py="5" align="center" justify={collapsed ? 'center' : 'flex-start'}>
        <Text
          fontSize={logoFontSize}
          fontWeight="semibold"
          color="brand.500"
          transition="font-size 0.2s"
        >
          {logoText}
        </Text>
      </Flex>}

      <VStack spacing="1" align={collapsed ? 'center' : 'stretch'} px={collapsed ? '0' : '2'} mt="6">
        <NavItem icon={FiHome} isActive>
          {!collapsed ? 'Dashboard' : ''}
        </NavItem>
        <NavItem icon={FiMap}>
          {!collapsed ? 'Field Mapping' : ''}
        </NavItem>
        <NavItem icon={FiBarChart2}>
          {!collapsed ? 'Analytics' : ''}
        </NavItem>
        <NavItem icon={FiDatabase}>
          {!collapsed ? 'Crop Data' : ''}
        </NavItem>
        <NavItem icon={FiSettings}>
          {!collapsed ? 'Settings' : ''}
        </NavItem>
      </VStack>
      
    </Box>
  );
};

export default Sidebar;