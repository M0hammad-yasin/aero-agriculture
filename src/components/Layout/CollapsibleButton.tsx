import { IconButton } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type CollapsibleButtonProps = {
  collapsed: boolean;
  onToggle: () => void;
  buttonBg: string; // Added prop for background color
  buttonHoverBg: string; // Added prop for hover background color
};

const CollapsibleButton = ({ collapsed, onToggle, buttonBg, buttonHoverBg }: CollapsibleButtonProps) => (
  <IconButton
    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    icon={collapsed ? <FiChevronRight /> : <FiChevronLeft />}
    size="sm"
    onClick={onToggle}
    bg={buttonBg} // Use prop for background color
    borderRadius="full"
    boxShadow="md"
    variant="ghost"
    _hover={{
      bg: buttonHoverBg // Use prop for hover background color
    }}
  />
);

export default CollapsibleButton;