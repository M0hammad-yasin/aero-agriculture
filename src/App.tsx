import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import theme from "./config/theme";
import AppRoutes from "./routes";
function App() {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} storageKey="chakra-ui-color-mode" />
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ChakraProvider>
    </>
  );
}

export default App;
