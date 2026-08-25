import { Box, BoxProps } from "@chakra-ui/react";

export default function Card(props: BoxProps) {
  const { children, ...rest } = props;
  return (
    <Box
      bg="white"
      borderRadius="20px"
      boxShadow="0 18px 40px rgba(112, 144, 176, 0.12)"
      p="20px"
      {...rest}
    >
      {children}
    </Box>
  );
}
