"use client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  Box,
  Heading,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { FaLightbulb, FaRobot, FaPalette, FaCode } from "react-icons/fa";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="md" color="orange.500">
            About Makan What
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            <Box>
              <Text fontSize="lg" fontWeight="medium" mb={3}>
                What is Makan What?
              </Text>
              <Text color="gray.600" lineHeight="tall">
                Makan What is a smart restaurant recommendation tool that helps
                you decide where to eat when you&apos;re feeling indecisive.
                Simply add your favorite restaurants, set your preferences, and
                let the wheel spin to find your next dining destination!
              </Text>
            </Box>

            <Divider />

            <Box>
              <Text fontSize="lg" fontWeight="medium" mb={3}>
                Why I Built This
              </Text>
              <Text color="gray.600" lineHeight="tall">
                This project was created entirely using AI assistance to test
                the limits of what&apos;s possible with current AI technology.
                From coding and design to art elements, every aspect was
                developed with AI collaboration.
              </Text>
            </Box>

            <Divider />

            <Box>
              <Text fontSize="lg" fontWeight="medium" mb={3}>
                AI-Powered Development
              </Text>
              <VStack spacing={3} align="stretch">
                <Box display="flex" alignItems="center" gap={3}>
                  <Icon as={FaCode} color="blue.500" />
                  <Text color="gray.600">
                    Code generation and implementation
                  </Text>
                </Box>
                <Box display="flex" alignItems="center" gap={3}>
                  <Icon as={FaPalette} color="purple.500" />
                  <Text color="gray.600">UI/UX design and mockups</Text>
                </Box>
                <Box display="flex" alignItems="center" gap={3}>
                  <Icon as={FaRobot} color="green.500" />
                  <Text color="gray.600">AI-assisted development workflow</Text>
                </Box>
                <Box display="flex" alignItems="center" gap={3}>
                  <Icon as={FaLightbulb} color="yellow.500" />
                  <Text color="gray.600">Creative problem solving</Text>
                </Box>
              </VStack>
            </Box>

            <Box
              bg="orange.50"
              p={4}
              borderRadius="md"
              border="1px"
              borderColor="orange.200"
            >
              <Text fontSize="sm" color="orange.800" fontWeight="medium">
                🎯 This project demonstrates the potential of AI-human
                collaboration in software development, showing how AI can
                accelerate the creative and technical aspects of building modern
                web applications.
              </Text>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="orange" onClick={onClose}>
            Got it!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
