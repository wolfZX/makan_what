"use client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Alert,
  AlertIcon,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSubmit: (config: { url: string; key: string }) => void;
}

export default function SupabaseConfigModal({
  isOpen,
  onClose,
  onConfigSubmit,
}: SupabaseConfigModalProps) {
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Basic validation
      if (!url.trim() || !key.trim()) {
        throw new Error("Please fill in both URL and API key");
      }

      // Test the Supabase connection
      const testResult = await testSupabaseConnection(url.trim(), key.trim());

      if (testResult.success) {
        onConfigSubmit({ url: url.trim(), key: key.trim() });
        toast({
          title: "Configuration saved",
          description:
            "Your Supabase configuration has been saved successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } else {
        throw new Error(testResult.error || "Invalid Supabase configuration");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast({
        title: "Configuration failed",
        description:
          "Falling back to local storage due to invalid configuration.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testSupabaseConnection = async (
    url: string,
    key: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Create a test Supabase client
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(url, key);

      // Test the connection by making a simple query
      const { error } = await supabase
        .from("makan where")
        .select("id")
        .limit(1);

      // If we get a permission error, that's actually good - it means the connection works
      // but we don't have access to the table (which is expected for a new config)
      if (error && error.code === "PGRST116") {
        // PGRST116 is "JWT token is invalid" - this means the connection works but auth is wrong
        return {
          success: false,
          error: "Invalid API key. Please check your anon key.",
        };
      }

      if (error && error.code === "PGRST301") {
        // PGRST301 is "relation does not exist" - this means the table doesn't exist
        return {
          success: false,
          error:
            "Table 'makan where' not found. Please create the required table.",
        };
      }

      // If we get here, the connection is working
      return { success: true };
    } catch {
      return {
        success: false,
        error:
          "Unable to connect to Supabase. Please check your URL and try again.",
      };
    }
  };

  const handleClose = () => {
    setUrl("");
    setKey("");
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Configure Your Own Supabase</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Box>
                  <Text fontSize="sm" fontWeight="medium">
                    Use Your Own Database
                  </Text>
                  <Text fontSize="xs" mt={1}>
                    We do not track or store your Supabase credentials. They are
                    stored locally in your browser only.
                  </Text>
                </Box>
              </Alert>

              {error && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">{error}</Text>
                </Alert>
              )}

              <FormControl isRequired>
                <FormLabel fontSize="sm">Supabase URL</FormLabel>
                <Input
                  placeholder="https://your-project.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  size="md"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">Supabase Anon Key</FormLabel>
                <Input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  size="md"
                />
              </FormControl>

              <Text fontSize="xs" color="gray.600" textAlign="center">
                You&apos;ll need to create a table named &quot;makan where&quot;
                with the following columns: id (uuid), name (text), cuisine
                (text), price_range (text), is_halal (boolean), google_url
                (text), org_name (text)
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Testing Connection..."
            >
              Save Configuration
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
