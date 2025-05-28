import { Button, Tooltip } from '@chakra-ui/react';

interface LEDToggleProps {
  className?: string;
}

const LEDToggle = ({ className }: LEDToggleProps) => (
  <Tooltip label="Toggle LED Status" placement="bottom">
    <Button 
      size="sm" 
      backgroundColor={'green.700'} 
      color="white"
      _hover={{ backgroundColor: 'green.600' }}
      className={className}
      aria-label="Toggle LED Status"
    >
      LED Toggle
    </Button>
  </Tooltip>
);

export default LEDToggle;