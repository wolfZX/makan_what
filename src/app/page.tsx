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
import SupabaseConfigModal from "@/components/SupabaseConfigModal";
import { isAuthorizedUserAsync } from "@/lib/config";
import { secureRestaurantService } from "@/lib/secureRestaurantService";

export default function LandingPage() {
  const [name, setName] = useState("");
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [hasCustomConfig, setHasCustomConfig] = useState(false);
  const router = useRouter();

  // Check authorization when name changes
  useEffect(() => {
    const checkAuth = async () => {
      if (name.trim()) {
        setIsLoading(true);
        try {
          const authorized = await isAuthorizedUserAsync(name.trim());
          setIsAuthorized(authorized);

          // Check if user has custom Supabase config
          const customConfig = secureRestaurantService.hasCustomConfig(
            name.trim()
          );
          setHasCustomConfig(customConfig);
        } catch (error) {
          console.error("Authorization check failed:", error);
          setIsAuthorized(false);
          setHasCustomConfig(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsAuthorized(null);
        setHasCustomConfig(false);
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
      router.push(`/restaurants?name=${encodeURIComponent(formattedOrgName)}`);
    }
  };

  const handleSupabaseConfig = (config: { url: string; key: string }) => {
    secureRestaurantService.saveCustomConfig(
      name.trim(),
      config.url,
      config.key
    );
    setHasCustomConfig(true);
    setIsAuthorized(true); // Treat as authorized since they have their own config
  };

  const getStorageMethodText = () => {
    if (isLoading) return "Checking authorization...";
    if (hasCustomConfig) return "You're using your own Supabase database";
    if (isAuthorized)
      return "You're using cloud storage (data syncs across devices)";
    return "You're using local storage (data stays on this device)";
  };

  const getStorageMethodStatus = () => {
    if (isLoading) return "info";
    if (hasCustomConfig || isAuthorized) return "success";
    return "info";
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
                  status={getStorageMethodStatus()}
                  borderRadius="md"
                  fontSize="sm"
                >
                  <AlertIcon />
                  {getStorageMethodText()}
                </Alert>
              )}

              {/* Configure Supabase button for unauthorized users */}
              {name.trim() &&
                !isLoading &&
                !isAuthorized &&
                !hasCustomConfig && (
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    size="sm"
                    onClick={() => setShowSupabaseModal(true)}
                    w="full"
                  >
                    Configure Your Own Supabase
                  </Button>
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

      {/* Supabase Configuration Modal */}
      <SupabaseConfigModal
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
        onConfigSubmit={handleSupabaseConfig}
      />
    </Box>
  );
}
