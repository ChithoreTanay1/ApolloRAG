import { Flex, HStack, IconButton, Text, Avatar, Box } from "@chakra-ui/react";
import { MdMenu } from "react-icons/md";

interface NavbarProps {
  title: string;
  onOpenSidebar: () => void;
}

export default function Navbar({ title, onOpenSidebar }: NavbarProps) {
  return (
    <Flex
      as="header"
      position="sticky"
      top="0"
      zIndex="10"
      align="center"
      justify="space-between"
      bg="secondaryGray.300"
      px={{ base: "16px", md: "8" }}
      py="5"
    >
      <HStack spacing="4">
        <IconButton
          aria-label="Open menu"
          icon={<MdMenu />}
          variant="ghost"
          display={{ base: "inline-flex", lg: "none" }}
          onClick={onOpenSidebar}
        />
        <Box>
          <Text fontSize="xs" color="secondaryGray.600" fontWeight="600">
            Apollo RAG
          </Text>
          <Text fontSize="2xl" fontWeight="700" color="navy.700">
            {title}
          </Text>
        </Box>
      </HStack>

      <HStack spacing="4">
        <Avatar size="sm" name="Tanay Chithore" bg="brand.500" color="white" />
      </HStack>
    </Flex>
  );
}
