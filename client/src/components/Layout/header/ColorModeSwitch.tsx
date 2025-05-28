import { IconButton, useColorMode } from "@chakra-ui/react"
import { FiMoon, FiSun } from "react-icons/fi"

const ColorModeSwitch = () => {
  const {toggleColorMode, colorMode} = useColorMode();

  return (
    <IconButton
    aria-label="Toggle color mode"
    icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
    size="sm"
    variant="ghost"
    ml={2}
    onClick={toggleColorMode}
  />
  )
}
export default ColorModeSwitch



// const ColorModeSwitch = () => {

//   return (
//     <HStack>
//       <Switch colorScheme='green' isChecked={colorMode === 'dark'} onChange={toggleColorMode} />
//       <Text whiteSpace='nowrap'>Dark Mode</Text>
//     </HStack>
//   )
// }

// export default ColorModeSwitch