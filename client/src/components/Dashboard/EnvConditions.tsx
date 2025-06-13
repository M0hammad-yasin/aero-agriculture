import { DashboardContainer, DashboardHeading, DashboardSubtitle, DashboardVStack } from '../../config/ChakraStyleConfig';
import { Box, Center, Text, VStack, useColorModeValue } from '@chakra-ui/react';

const EnvConditions = () => {
  const temperature = 20;
  const numTicks = 45; // Updated: Requirement for 40 ticks
  const gaugeSize = 200; // px
  const tickHeight = 15; // px
  const tickWidth = 3; // px

  // Define temperature scale and arc properties
  const minDisplayTemp = 0;    // Minimum temperature on the gauge scale
  const maxDisplayTemp = 40;   // Maximum temperature on the gauge scale (e.g., 40°C)
  // Calculate angles based on temperature (0 degrees is at the top, clockwise)
  const tempRange = maxDisplayTemp - minDisplayTemp;
  // Ensure degreesPerTempUnit is well-defined, prevent division by zero if tempRange is 0
  const degreesPerTempUnit = tempRange > 0 ? 360 / tempRange : 0; 
  
  // Calculate the angle for the current temperature, clamped between 0 and 360
  const valueAngleDeg = Math.max(0, Math.min(360, (temperature - minDisplayTemp) * degreesPerTempUnit));
  // Unused constants for previous arc coloring logic (actualArcStartAngleDeg, blueSegmentAngularWidth, greenSegmentAngularWidth) removed

  const indicatorColor = useColorModeValue('red.500', 'red.400');
  const tickActiveColor = useColorModeValue('green', 'blue');
  const tickInactiveColor = useColorModeValue('gray', 'white'); // Color for inactive ticks
  const indicatorStrokeColor = useColorModeValue('white', 'gray.800');

  const centerX = gaugeSize / 2;
  const centerY = gaugeSize / 2;
  const tickOuterRadius = gaugeSize / 2 - 8; // Outer edge of ticks
  const tickInnerRadius = tickOuterRadius - tickHeight;
  return (
    <DashboardContainer>
      <DashboardVStack>
        <DashboardHeading>Environmental Conditions</DashboardHeading>
        <DashboardSubtitle>Current environmental conditions for your crops</DashboardSubtitle>
        <Center mt={8} w="100%" h={`${gaugeSize + 20}px`}> {/* Added some vertical space for indicator */} 
          <Box position="relative" w={`${gaugeSize}px`} h={`${gaugeSize}px`}>
            <svg width={gaugeSize} height={gaugeSize} viewBox={`0 0 ${gaugeSize} ${gaugeSize}`} style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
              {/* Ticks as SVG lines */}
              {Array.from({ length: numTicks }).map((_, i) => {
                const tickAngleRatio = i / numTicks;
                const tickAngleRad = tickAngleRatio * 2 * Math.PI - Math.PI / 2; // -PI/2 to start from top
                // currentTickAngleDeg, isTickBeforeOrAtValue and related logic removed for new tick coloring

                const x1 = centerX + tickInnerRadius * Math.cos(tickAngleRad);
                const y1 = centerY + tickInnerRadius * Math.sin(tickAngleRad);
                const x2 = centerX + tickOuterRadius * Math.cos(tickAngleRad);
                const y2 = centerY + tickOuterRadius * Math.sin(tickAngleRad);

                // New stroke color logic: color ticks from 0 up to (numTicks / temperature)
                const ticksPerTemp = temperature > 0 ? numTicks / 30 : 0; // Avoid division by zero if temperature is 0 or negative
                const activeTickThreshold = ticksPerTemp * temperature;
                let strokeColor;

                if (i < activeTickThreshold) {
                  strokeColor = tickActiveColor;
                } else {
                  strokeColor = tickInactiveColor;
                }

                return (
                  <line
                    key={i}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={strokeColor}
                    strokeWidth={tickWidth}
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Red Indicator Dot */}
              {(() => {
                const indicatorAngleRad = (valueAngleDeg - 90) * Math.PI / 180; // Convert to math angle (0 is right)
                // Place indicator just outside the main tick radius, aligned with tick centers
                const indicatorCenterRadius = tickOuterRadius + tickWidth / 2 + 2; 
                const cx = centerX + indicatorCenterRadius * Math.cos(indicatorAngleRad);
                const cy = centerY + indicatorCenterRadius * Math.sin(indicatorAngleRad);
                const dotRadius = tickWidth + 1; // Make dot slightly larger than tick width
                return <circle cx={cx} cy={cy} r={dotRadius} fill={indicatorColor} stroke={indicatorStrokeColor} strokeWidth="1.5" />;
              })()}
            </svg>

            {/* Central Text */}
            <VStack position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" spacing={-0.5}>
              <Text fontSize="xs" color={useColorModeValue("gray.600", "gray.400")}>Room</Text>
              <Text fontSize="xs" color={useColorModeValue("gray.600", "gray.400")}>Temperature</Text>
              <Text fontSize="4xl" fontWeight="bold" lineHeight="1.2" color={useColorModeValue("gray.800", "white")}>
                {Math.round(temperature)}°C
              </Text>
            </VStack>
          </Box>
        </Center>
      </DashboardVStack>
    </DashboardContainer>
  );
};

export default EnvConditions;