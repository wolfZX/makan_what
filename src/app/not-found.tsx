"use client";
import {
  Button,
  Center,
  VStack,
  Image,
  Text,
  Box,
  Heading,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <Box position="relative" minH="100vh" bg="brand.soyMilk" overflow="hidden">
      <AnimatedBackground />
      <Center minH="100vh">
        <VStack
          spacing={8}
          w="full"
          maxW="md"
          p={{ base: 4, md: 8 }}
          m={{ base: 2, md: 0 }}
          boxShadow="lg"
          borderRadius="xl"
          bg="white"
          position="relative"
          zIndex={2}
        >
          <Image
            src="/logo.png"
            alt="Makan Where Logo"
            boxSize="150px"
            mb={2}
          />

          <VStack spacing={4} textAlign="center">
            <Heading
              size="2xl"
              color="brand.kopiBrown"
              fontFamily="heading"
              fontWeight="bold"
            >
              404
            </Heading>

            <Heading
              size="lg"
              color="brand.kopiBrown"
              fontFamily="heading"
              fontWeight="semibold"
            >
              Page Not Found
            </Heading>

            <Text
              fontSize="lg"
              color="brand.kopiBrown"
              textAlign="center"
              fontFamily="body"
            >
              Oops! The page you&apos;re looking for doesn&apos;t exist.
              <br />
              Let&apos;s get you back to finding your next meal spot!
            </Text>
          </VStack>

          <VStack spacing={4} w="full">
            <Button
              onClick={handleGoHome}
              colorScheme="orange"
              size="lg"
              fontWeight="semibold"
              fontFamily="cta"
              w="full"
            >
              Go Home
            </Button>
          </VStack>
        </VStack>
      </Center>
    </Box>
  );
}
