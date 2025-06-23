import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import theme from "./config/theme";
import AppRoutes from "./routes";
import { setNavigate } from "./utils/navigation";

// Wrapper component to set up navigation
const NavigationSetup = () => {
  const navigate = useNavigate();
  setNavigate(navigate);
  return <AppRoutes />;
};

function App() {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} storageKey="chakra-ui-color-mode" />
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <NavigationSetup />
        </BrowserRouter>
      </ChakraProvider>
    </>
  );
}

export default App;
