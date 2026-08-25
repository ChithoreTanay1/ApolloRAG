import {
    Box,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerOverlay,
    Flex,
    HStack,
    Icon,
    Text,
    VStack,
  } from "@chakra-ui/react";
  import { NavLink } from "react-router-dom";
  import { MdAutoAwesome } from "react-icons/md";
  import routes from "./routes";
  
  function NavItems() {
    return (
      <VStack align="stretch" spacing="6px" mt="8">
        {routes.map((route) => (
          <NavLink key={route.path} to={route.path}>
            {({ isActive }) => (
              <HStack
                spacing="14px"
                px="18px"
                py="12px"
                borderRadius="12px"
                bg={isActive ? "brand.50" : "transparent"}
                _hover={{ bg: "brand.50" }}
                transition="background 0.15s ease"
              >
                <Icon
                  as={route.icon}
                  boxSize="20px"
                  color={isActive ? "brand.500" : "secondaryGray.600"}
                />
                <Text
                  fontSize="sm"
                  fontWeight={isActive ? "700" : "500"}
                  color={isActive ? "navy.700" : "secondaryGray.700"}
                >
                  {route.name}
                </Text>
              </HStack>
            )}
          </NavLink>
        ))}
      </VStack>
    );
  }
  
  function Brand() {
    return (
      <HStack spacing="10px" px="18px" pt="28px" pb="4">
        <Flex
          boxSize="36px"
          align="center"
          justify="center"
          borderRadius="10px"
          bgGradient="linear(to-br, brand.400, brand.700)"
        >
          <Icon as={MdAutoAwesome} color="white" boxSize="18px" />
        </Flex>
        <Text fontSize="lg" fontWeight="800" color="navy.700">
          Apollo <Text as="span" color="brand.500">RAG</Text>
        </Text>
      </HStack>
    );
  }
  
  interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    return (
      <>
        <Box
          display={{ base: "none", lg: "block" }}
          position="fixed"
          h="100vh"
          w="290px"
          bg="white"
          borderRight="1px solid"
          borderColor="secondaryGray.200"
        >
          <Brand />
          <NavItems />
        </Box>
  
        <Drawer isOpen={isOpen} onClose={onClose} placement="left">
          <DrawerOverlay />
          <DrawerContent maxW="290px">
            <DrawerBody p="0">
              <Brand />
              <NavItems />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  }
  