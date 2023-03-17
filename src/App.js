import { ChakraProvider, theme } from '@chakra-ui/react'
import Map from './pages/Map/Map';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Map />
    </ChakraProvider>
  );
}

export default App;
