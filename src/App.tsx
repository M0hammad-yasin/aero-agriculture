import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import DashboardLayout from "./components/Layout/DashboardLayout";
import DashboardContent from "./components/Dashboard/DashboardContent";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ChakraProvider>
  );
}

export default App;
