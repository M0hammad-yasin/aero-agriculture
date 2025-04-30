import { Flex, IconButton, Input, InputGroup, InputLeftElement, Avatar, useColorModeValue, Collapse } from '@chakra-ui/react';
import { FiBell, FiSearch, FiMenu } from 'react-icons/fi';
import CollapsibleButton from './CollapsibleButton';

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void; // Add this prop for the CollapsibleButton component to pass the toggle function t
  onMenuToggle?: () => void;
}

const Header = ({ onMenuToggle,collapsed,onToggle }: HeaderProps) => {
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      w="full"
      px="4"
      bg={bgColor}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
      h="16"
    >
      {!collapsed && <CollapsibleButton collapsed={collapsed} onToggle={onToggle} />}
      <IconButton
        aria-label="Menu"
        display={{ base: 'flex', md: 'none' }}
        onClick={onMenuToggle}
        icon={<FiMenu />}
        size="sm"
      />
      
      <InputGroup w="96" display={{ base: 'none', md: 'flex' }}>
        <InputLeftElement pointerEvents="none">
          <FiSearch color="gray.400" aria-hidden="true" />
        </InputLeftElement>
        <Input placeholder="Search..." variant="filled" aria-label="Search" />
      </InputGroup>

      <Flex align="center">
        <IconButton
          aria-label="Notifications"
          icon={<FiBell />}
          size="sm"
          variant="ghost"
          mr="2"
        />
        <Avatar
          size="sm"
          name="User"
          cursor="pointer"
          aria-label="User avatar"
        />
      </Flex>
    </Flex>
  );
};

export default Header;