"use client";
import { Box, Text, Button, HStack, useDisclosure } from "@chakra-ui/react";
import packageJson from "../../package.json";
import AboutModal from "./AboutModal";

export default function Footer() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        as="footer"
        bottom={0}
        width="100%"
        py={3}
        textAlign="center"
        bg="transparent"
      >
        <HStack justify="center" spacing={6}>
          <Button
            variant="ghost"
            size="sm"
            color="gray.500"
            _hover={{ color: "orange.500" }}
            onClick={onOpen}
          >
            About
          </Button>
          <Text fontSize="sm" color="gray.500">
            v{packageJson.version}
          </Text>
        </HStack>
      </Box>

      <AboutModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
