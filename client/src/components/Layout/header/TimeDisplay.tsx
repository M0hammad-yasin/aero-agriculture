import { Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
const TimeDisplay = () => {
  const [time, setTime] = useState(new Date());

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

  return (
    <>
      <Text px={3}>{formatDate(time)}</Text>
      <Text px={3}>{formatTime(time)}</Text>
    </>
  );
};

export default TimeDisplay;