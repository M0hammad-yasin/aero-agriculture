import { Box, useColorModeValue } from '@chakra-ui/react';
import { DashboardContainer, DashboardHeading, DashboardSubtitle, DashboardVStack } from '../../config/ChakraStyleConfig';
import { weeklyData } from '../../data/mockGrowthData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const GrowthStats = () => {
  // Theme-aware colors
  const axisColor = useColorModeValue('gray.600', 'whiteAlpha.800');
  const gridColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const tooltipBg = useColorModeValue('white', 'gray.800');
  const tooltipBorder = useColorModeValue('gray.200', 'gray.600');
  const tooltipText = useColorModeValue('gray.800', 'white');

  const chartData = weeklyData.dates.map((date, index) => ({
    date,
    humidity: weeklyData.humidity[index],
    ph: weeklyData.ph[index],
    ec: weeklyData.ec[index],
    co2: weeklyData.co2[index]
  }));

  return (
    <DashboardContainer>
      <DashboardVStack>
        <DashboardHeading>Growth Statistics</DashboardHeading>
        <DashboardSubtitle>Key statistics about your plant growth</DashboardSubtitle>
        <Box w="100%" h="400px" p={4}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="date"
                stroke={axisColor}
                tick={{ fill: axisColor }}
              />
              <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  color: tooltipText,
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend
                wrapperStyle={{
                  color: axisColor
                }}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                name="Humidity (%)"
                stroke={useColorModeValue('teal', 'teal')}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="ph"
                name="pH Level"
                stroke={useColorModeValue('purple', 'purple')}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="ec"
                name="EC (mS/cm)"
                stroke={useColorModeValue('orange', 'orange')}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="co2"
                name="CO2 (ppm)"
                stroke={useColorModeValue('blue', 'blue')}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </DashboardVStack>
    </DashboardContainer>
  );
};

export default GrowthStats;