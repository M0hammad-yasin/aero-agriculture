import { Box, Grid, GridItem, useColorModeValue } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useLayoutStore } from '../../store/useLayoutStore'; // Import the Zustand store

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const collapsed = useLayoutStore((state) => state.collapsed);
  const user = useLayoutStore((state) => state.user);
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const sidebarWidth = collapsed ? '60px' : '200px';

  return (
    <Grid
      h="100vh"
      templateAreas={{ base: '"main"', md: '"sidebar main"' }}
      templateColumns={{ base: '1fr', md: `${sidebarWidth} 1fr` }}
    >
      <GridItem
        area="sidebar"
        display={{ base: 'none', md: 'block' }}
        position="relative"
        zIndex={2}
        transition="width 0.2s"
        w={sidebarWidth}
        minW={sidebarWidth}
        maxW={sidebarWidth}
      >
        <Sidebar />
      </GridItem>
      <GridItem
        area="main"
        bg={bgColor}
        position="relative"
        zIndex={1}
      >
        <Header user={user} /> {/* Pass user from store */}
        <Box as="main" p={4} minH="calc(100vh - 64px)">
          {children}
        </Box>
      </GridItem>
    </Grid>
  );
};

export default DashboardLayout;