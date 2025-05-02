import { IconButton, useColorModeValue } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useLayoutStore } from '../../store/useLayoutStore'; // Import the Zustand store



const CollapsibleButton = () => {
  const collapsed= useLayoutStore((state) =>state.collapsed);
  const toggleSidebar= useLayoutStore((state) =>state.toggleSidebar);
  const buttonBg = useColorModeValue('gray.100', 'gray.800'); // Added for button
  const buttonHoverBg = useColorModeValue('white', 'gray.900'); // Added for button
  return (
  <IconButton
    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    icon={collapsed ? <FiChevronRight /> : <FiChevronLeft />}
    size="sm"
    onClick={toggleSidebar} // Use action from store
    bg={buttonBg} // Use prop for background color
    borderRadius="full"
    boxShadow="md"
    variant="ghost"
    _hover={{
      bg: buttonHoverBg // Use prop for hover background color
    }}
  />
)};

export default CollapsibleButton;