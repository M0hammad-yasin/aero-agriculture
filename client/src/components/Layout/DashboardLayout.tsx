import { Box, Grid, GridItem,  } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import Header from "./header/Header";
import { useLayoutStore } from "../../store/useLayoutStore"; // Import the Zustand store

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const collapsed = useLayoutStore((state) => state.collapsed);
  const user = useLayoutStore((state) => state.user);
  const sidebarWidth = collapsed ? "60px" : "200px";

  return (
    <Grid
      background={"inherit"}
      h="100vh"
      templateAreas={{ base: '"main"', md: '"sidebar main"' }}
      templateColumns={{ base: "1fr", md: `${sidebarWidth} 1fr` }}
    >
      <GridItem
        area="sidebar"
        display={{ base: "none", md: "block" }}
        position="relative"
        zIndex={2}
        transition="width 0.2s"
        w={sidebarWidth}
        minW={sidebarWidth}
        maxW={sidebarWidth}
      >
        <Sidebar />
      </GridItem>
      <GridItem area="main"position="relative" zIndex={1}>
        <Header user={user} /> {/* Pass user from store */}
        <Box as="main" p={4} minH="calc(100vh - 64px)">
          {children}
        </Box>
      </GridItem>
    </Grid>
  );
};

export default DashboardLayout;
