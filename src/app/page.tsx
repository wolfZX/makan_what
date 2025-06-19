"use client";
import { useState } from "react";
import {
  Button,
  Center,
  Input,
  VStack,
  Image,
  Text,
  Box,
  FormControl,
  FormHelperText,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function LandingPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      router.push(`/app?name=${encodeURIComponent(name.trim())}`);
    }
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
            boxSize="200px"
            mb={2}
          />
          <Text fontSize="lg" color="brand.kopiBrown" textAlign="center">
            Find your next meal spot!
            <br />
            Let us help you or your company decide.
          </Text>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <VStack spacing={4} w="full">
              <FormControl>
                <Input
                  placeholder="Enter your company or username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  size="lg"
                  bg="brand.soyMilk"
                  borderColor="brand.kopiBrown"
                  fontFamily="body"
                />
                <FormHelperText fontSize="xs" color="gray.500">
                  Note: Your restaurant list will be saved and retrieved based
                  on the name you enter
                </FormHelperText>
              </FormControl>
              <Button
                type="submit"
                colorScheme="orange"
                size="lg"
                fontWeight="semibold"
                fontFamily="cta"
                w="full"
                disabled={!name.trim()}
              >
                Let&apos;s Go!
              </Button>
            </VStack>
          </form>
        </VStack>
      </Center>
    </Box>
  );
}
