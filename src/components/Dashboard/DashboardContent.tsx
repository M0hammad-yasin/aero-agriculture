import { Flex, Grid, GridItem, Container } from '@chakra-ui/react';



const DashboardContent = () => {
  return (
    <Container maxW="full" p={{ base: 2, sm: 4, md: 6 }}>
      <Grid
        templateColumns={{ base: "1fr", sm: "1fr", md: "1fr", lg: "1fr" }}
        gap={{ base: 4, sm: 5, md: 6, lg: 8 }}
      >
        <GridItem colSpan={1}>
          <Flex justifyContent="space-between" alignItems="center" mb={6}>
            {/* Placeholder for future content */}
          </Flex>
        </GridItem>
      </Grid>
    </Container>
  );
};
export default DashboardContent;