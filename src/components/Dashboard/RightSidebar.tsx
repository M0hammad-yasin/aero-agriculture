import { DashboardContainer, DashboardHeading, DashboardSubtitle, DashboardVStack } from '../../config/ChakraStyleConfig';
import { Box, Image, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import clockIcon from '../../assets/icons/clock.png';
import sprinklerIcon from '../../assets/icons/sprinkler.png';
import solutionIcon from '../../assets/icons/solution.png';

interface CountdownTimerProps {
  onTimerComplete: () => void;
}

const CountdownTimer = ({ onTimerComplete }: CountdownTimerProps) => {
  const initialTime = 4 * 60;
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimerComplete();
      setTimeLeft(initialTime);
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimerComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Text fontSize="lg" fontWeight="medium">
      {`${minutes}:${seconds.toString().padStart(2, "0")}`}
    </Text>
  );
};

const RightSidebar = () => {
  const [timerComplete, setTimerComplete] = useState(0);
  const [sprinklerRun, setSprinklerRun] = useState(0);
  const [solutionLevel, setSolutionLevel] = useState(75); // Mockup value

  const handleTimerComplete = () => {
    setTimerComplete(prev => prev + 1);
    setSprinklerRun(prev => prev + 1);
  };

  const textColor = useColorModeValue('gray.600', 'gray.300');
  const notificationColor = useColorModeValue('blue.500', 'blue.300');

  return (
    <DashboardContainer h="full" mb={0}>
      <DashboardVStack spacing={8}>
        <Box w="full">
          <VStack spacing={4} align="center">
            <Image src={clockIcon} alt="clock" boxSize="60px" />
            <Text fontSize="lg" color={textColor}>Timer</Text>
            <CountdownTimer onTimerComplete={handleTimerComplete} />
            <Text color={textColor}>
              Timer Complete: <Text as="span" color={notificationColor}>{timerComplete}</Text>
            </Text>
          </VStack>
        </Box>

        <Box w="full">
          <VStack spacing={4} align="center">
            <Image src={sprinklerIcon} alt="sprinkler" boxSize="70px" />
            <Text color={textColor}>
              Sprinkler Run: <Text as="span" color={notificationColor}>{sprinklerRun}</Text>
            </Text>
          </VStack>
        </Box>

        <Box w="full">
          <VStack spacing={4} align="center">
            <Image src={solutionIcon} alt="solution" boxSize="70px" />
            <Text color={textColor}>
              Solution Level: <Text as="span" color={notificationColor}>{solutionLevel} ml</Text>
            </Text>
          </VStack>
        </Box>
      </DashboardVStack>
    </DashboardContainer>
  );
};

export default RightSidebar;