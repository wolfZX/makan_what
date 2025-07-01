"use client";
import { Box, Text } from "@chakra-ui/react";
import packageJson from "../../package.json";

export default function Footer() {
  return (
    <Box
      as="footer"
      bottom={0}
      width="100%"
      py={2}
      textAlign="center"
      bg="transparent"
    >
      <Text fontSize="sm" color="gray.500">
        v{packageJson.version}
      </Text>
    </Box>
  );
}
