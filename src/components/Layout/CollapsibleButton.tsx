import { IconButton } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useLayoutStore } from '../../store/useLayoutStore'; // Import the Zustand store



const CollapsibleButton = () => {
  const collapsed= useLayoutStore((state) =>state.collapsed);
  const toggleSidebar= useLayoutStore((state) =>state.toggleSidebar);
  
  return (
  <IconButton
    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    icon={collapsed ? <FiChevronRight /> : <FiChevronLeft />}
    size="sm"
    onClick={toggleSidebar} // Use action from store
    borderRadius="full"
    boxShadow="md"
    variant="ghost"
  />
)};

export default CollapsibleButton;