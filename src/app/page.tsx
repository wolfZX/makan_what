"use client";
import { useState, useEffect } from "react";
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
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import AnimatedBackground from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";
import { isAuthorizedUserAsync } from "@/lib/config";

export default function LandingPage() {
  const [name, setName] = useState("");
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check authorization when name changes
  useEffect(() => {
    const checkAuth = async () => {
      if (name.trim()) {
        setIsLoading(true);
        try {
          const authorized = await isAuthorizedUserAsync(name.trim());
          setIsAuthorized(authorized);
        } catch (error) {
          console.error("Authorization check failed:", error);
          setIsAuthorized(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsAuthorized(null);
      }
    };

    // Debounce the authorization check
    const timeoutId = setTimeout(checkAuth, 300);
    return () => clearTimeout(timeoutId);
  }, [name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const formattedOrgName = name.trim().toLowerCase();
      router.push(`/app?name=${encodeURIComponent(formattedOrgName)}`);
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
                  on the organization name you enter
                </FormHelperText>
              </FormControl>

              {/* Storage method notification */}
              {name.trim() && (
                <Alert
                  status={
                    isLoading ? "info" : isAuthorized ? "success" : "info"
                  }
                  borderRadius="md"
                  fontSize="sm"
                >
                  <AlertIcon />
                  {isLoading
                    ? "Checking authorization..."
                    : isAuthorized
                    ? "You're using cloud storage (data syncs across devices)"
                    : "You're using local storage (data stays on this device)"}
                </Alert>
              )}

              <Button
                type="submit"
                colorScheme="orange"
                size="lg"
                fontWeight="semibold"
                fontFamily="cta"
                w="full"
                disabled={!name.trim() || isLoading}
              >
                Let&apos;s Go!
              </Button>
            </VStack>
          </form>
        </VStack>
      </Center>
      <Footer />
    </Box>
  );
}
