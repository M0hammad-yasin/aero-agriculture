import { IconButton, useColorModeValue } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type CollapsibleButtonProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const CollapsibleButton = ({ collapsed, onToggle }: CollapsibleButtonProps) => (
  <IconButton
    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    icon={collapsed ? <FiChevronRight /> : <FiChevronLeft />}
    size="sm"
    onClick={onToggle}
    bg={useColorModeValue('white', 'gray.900')}
    borderRadius="full"
    boxShadow="md"
    variant="ghost"
    _hover={{
      bg: useColorModeValue('gray.100', 'gray.800')
    }}
  />
);

export default CollapsibleButton;