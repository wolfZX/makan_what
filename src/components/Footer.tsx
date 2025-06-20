import { Box, Text } from "@chakra-ui/react";

const APP_VERSION = "v1.0.0"; // We can update this manually for now

export default function Footer() {
  return (
    <Box
      as="footer"
      position="fixed"
      bottom={0}
      width="100%"
      py={2}
      textAlign="center"
      bg="transparent"
    >
      <Text fontSize="sm" color="gray.500">
        {APP_VERSION}
      </Text>
    </Box>
  );
}
