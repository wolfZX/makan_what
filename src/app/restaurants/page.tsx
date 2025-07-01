"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  Badge,
  Link,
  ModalFooter,
  HStack,
  Center,
  useToast,
  IconButton,
  Alert,
  AlertIcon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Wheel from "../../components/Wheel";
import RestaurantTable, { Restaurant } from "../../components/RestaurantTable";
import AddRestaurantModal from "../../components/AddRestaurantModal";
import SupabaseConfigModal from "../../components/SupabaseConfigModal";
import { secureRestaurantService } from "../../lib/secureRestaurantService";
import { ChevronLeftIcon, SettingsIcon } from "@chakra-ui/icons";

function AppPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get("name") || "";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [hasCustomConfig, setHasCustomConfig] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);

  // Edit modal state
  const [editRestaurant, setEditRestaurant] = useState<Restaurant | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Jackpot modal state
  const [jackpotOpen, setJackpotOpen] = useState(false);
  const [jackpotRestaurant, setJackpotRestaurant] = useState<Restaurant | null>(
    null
  );

  // Wheel state
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const toast = useToast();

  // Load restaurants on mount
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        // Check authorization first
        const authorized = await secureRestaurantService.checkUserAuthorization(
          name
        );
        setIsAuthorized(authorized);

        // Check for custom Supabase config
        const customConfig = secureRestaurantService.hasCustomConfig(name);
        setHasCustomConfig(customConfig);

        const data = await secureRestaurantService.getRestaurants(name);
        setRestaurants(data);
      } catch (error) {
        console.error("Failed to load restaurants:", error);
        toast({
          title: "Error loading restaurants",
          description: "Please try refreshing the page",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (name) {
      loadRestaurants();
    }
  }, [name, toast]);

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setJackpotRestaurant(restaurant);
    setJackpotOpen(true);
  };

  const handleSpinWheel = () => {
    if (!mustSpin && restaurants.length > 0) {
      const newPrizeNumber = Math.floor(Math.random() * restaurants.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleAddRestaurant = async (newRestaurant: Omit<Restaurant, "id">) => {
    try {
      const added = await secureRestaurantService.addRestaurant(
        newRestaurant,
        name
      );
      setRestaurants([...restaurants, added]);
      onClose();
      toast({
        title: "Restaurant added",
        description: `${added.name} has been added to your list`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to add restaurant:", error);
      toast({
        title: "Error adding restaurant",
        description: "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteRestaurant = async (id: string) => {
    try {
      await secureRestaurantService.deleteRestaurant(id, name);
      const deletedRestaurant = restaurants.find((r) => r.id === id);
      setRestaurants(restaurants.filter((r) => r.id !== id));
      if (selectedRestaurant && selectedRestaurant.id === id) {
        setSelectedRestaurant(null);
      }
      toast({
        title: "Restaurant deleted",
        description: deletedRestaurant
          ? `${deletedRestaurant.name} has been removed`
          : "Restaurant has been removed",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to delete restaurant:", error);
      toast({
        title: "Error deleting restaurant",
        description: "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setEditRestaurant(restaurant);
    setIsEditModalOpen(true);
  };

  const handleUpdateRestaurant = async (updated: Omit<Restaurant, "id">) => {
    if (!editRestaurant) return;

    try {
      const updatedRestaurant = await secureRestaurantService.updateRestaurant(
        editRestaurant.id,
        updated,
        name
      );
      setRestaurants(
        restaurants.map((r) =>
          r.id === editRestaurant.id ? updatedRestaurant : r
        )
      );
      setIsEditModalOpen(false);
      setEditRestaurant(null);
      toast({
        title: "Restaurant updated",
        description: `${updatedRestaurant.name} has been updated`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to update restaurant:", error);
      toast({
        title: "Error updating restaurant",
        description: "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSupabaseConfig = (config: { url: string; key: string }) => {
    secureRestaurantService.saveCustomConfig(name, config.url, config.key);
    setHasCustomConfig(true);
    setIsAuthorized(true); // Treat as authorized since they have their own config
    toast({
      title: "Configuration saved",
      description: "Your Supabase configuration has been saved successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRemoveCustomConfig = () => {
    secureRestaurantService.removeCustomConfig(name);
    setHasCustomConfig(false);
    setIsAuthorized(false);
    toast({
      title: "Configuration removed",
      description: "Your custom Supabase configuration has been removed.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const getStorageMethodText = () => {
    if (hasCustomConfig) return "Using your own Supabase database";
    if (isAuthorized)
      return "Using cloud storage - your data syncs across devices";
    return "Using local storage - your data stays on this device";
  };

  const getStorageMethodStatus = () => {
    if (hasCustomConfig || isAuthorized) return "success";
    return "info";
  };

  return (
    <Box minH="100vh" bg="brand.soyMilk" p={{ base: 2, md: 8 }}>
      <Flex align="center" mb={6} gap={4}>
        <IconButton
          aria-label="Go back to home page"
          icon={<ChevronLeftIcon boxSize={6} />}
          variant="ghost"
          colorScheme="orange"
          size="sm"
          onClick={() => router.push("/")}
        />
        <Heading as="h2" size="lg" color="brand.kopiBrown" fontFamily="heading">
          Welcome, {name}!
        </Heading>
        <Box ml="auto">
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Storage settings"
              icon={<SettingsIcon />}
              variant="ghost"
              size="sm"
            />
            <MenuList>
              <Text px={3} py={2} fontSize="sm" color="gray.600">
                Storage Method
              </Text>
              <MenuDivider />
              <MenuItem onClick={() => setShowSupabaseModal(true)}>
                Configure Supabase
              </MenuItem>
              {hasCustomConfig && (
                <MenuItem onClick={handleRemoveCustomConfig} color="red.500">
                  Remove Custom Config
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </Box>
      </Flex>

      {/* Storage method indicator */}
      {isAuthorized !== null && (
        <Alert
          status={getStorageMethodStatus()}
          borderRadius="md"
          mb={4}
          fontSize="sm"
        >
          <AlertIcon />
          {getStorageMethodText()}
        </Alert>
      )}

      <Flex
        direction={{ base: "column", md: "row" }}
        gap={8}
        align="stretch"
        justify="center"
        w="full"
        h={{ base: "auto", md: "calc(100vh - 120px)" }}
        minH={{ base: "calc(100vh - 120px)", md: "auto" }}
      >
        {/* Wheel */}
        <Box
          flex={1}
          bg="white"
          borderRadius="xl"
          boxShadow="md"
          p={{ base: 3, md: 6 }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Wheel
            restaurants={restaurants}
            onSelect={handleRestaurantSelect}
            mustSpin={mustSpin}
            prizeNumber={prizeNumber}
            setMustSpin={setMustSpin}
            setPrizeNumber={setPrizeNumber}
          />
        </Box>
        {/* Restaurant Table */}
        <Box
          flex={1}
          bg="white"
          borderRadius="xl"
          boxShadow="md"
          p={6}
          display="flex"
          flexDirection="column"
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md" color="brand.kopiBrown" fontFamily="heading">
              Restaurants List
            </Heading>
            <Button colorScheme="orange" onClick={onOpen} fontFamily="cta">
              + Add Restaurant
            </Button>
          </Flex>
          <Box flex={1} overflow="hidden">
            {isLoading ? (
              <Center h="200px">
                <Text>Loading restaurants...</Text>
              </Center>
            ) : (
              <RestaurantTable
                data={restaurants}
                onDelete={handleDeleteRestaurant}
                onEdit={handleEditRestaurant}
              />
            )}
          </Box>
        </Box>
      </Flex>
      {/* Add Modal */}
      <AddRestaurantModal
        isOpen={isOpen}
        onClose={onClose}
        onAdd={handleAddRestaurant}
        mode="add"
      />
      {/* Edit Modal */}
      <AddRestaurantModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleUpdateRestaurant}
        mode="edit"
        initialValues={
          editRestaurant
            ? {
                orgName: editRestaurant.orgName,
                name: editRestaurant.name,
                cuisine: editRestaurant.cuisine,
                priceRange: editRestaurant.priceRange,
                isHalal: editRestaurant.isHalal,
                googleUrl: editRestaurant.googleUrl,
              }
            : undefined
        }
      />
      {/* Supabase Configuration Modal */}
      <SupabaseConfigModal
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
        onConfigSubmit={handleSupabaseConfig}
      />
      {/* Jackpot Modal */}
      <Modal
        isOpen={jackpotOpen}
        onClose={() => setJackpotOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2xl" color="orange.400">
            🎉 HURRAY! 🎉
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box textAlign="center" py={6}>
              <Text
                fontSize="3xl"
                fontWeight="bold"
                color="brand.rouletteRed"
                mb={4}
                style={{ animation: "jackpot 1s infinite alternate" }}
              >
                {jackpotRestaurant?.name}
              </Text>
              <VStack spacing={3} align="center">
                <HStack spacing={2}>
                  <Badge
                    fontSize="sm"
                    px={2}
                    py={0.5}
                    borderRadius="5px"
                    colorScheme="purple"
                  >
                    {jackpotRestaurant?.cuisine}
                  </Badge>
                  <Badge
                    fontSize="sm"
                    px={2}
                    py={0.5}
                    borderRadius="5px"
                    colorScheme="yellow"
                  >
                    {jackpotRestaurant?.priceRange}
                  </Badge>
                  <Badge
                    colorScheme={jackpotRestaurant?.isHalal ? "green" : "red"}
                    fontSize="sm"
                    px={2}
                    py={0.5}
                    borderRadius="5px"
                  >
                    {jackpotRestaurant?.isHalal ? "HALAL" : "NON-HALAL"}
                  </Badge>
                </HStack>
                {jackpotRestaurant?.googleUrl && (
                  <Link
                    href={jackpotRestaurant.googleUrl}
                    isExternal
                    color="blue.500"
                    textDecoration="underline"
                  >
                    View on Google Maps
                  </Link>
                )}
              </VStack>
            </Box>
          </ModalBody>
          <ModalFooter justifyContent="center" gap={4}>
            <Button
              colorScheme="orange"
              onClick={() => {
                setJackpotOpen(false);
                handleSpinWheel();
              }}
            >
              Spin Again
            </Button>
            <Button variant="ghost" onClick={() => setJackpotOpen(false)}>
              Okay
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <style jsx global>{`
        @keyframes jackpot {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.15) rotate(-2deg);
          }
        }
      `}</style>
    </Box>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <Box minH="100vh" bg="brand.soyMilk" p={{ base: 2, md: 8 }}>
      <Center h="100vh">
        <Text fontSize="lg" color="gray.500">
          Loading...
        </Text>
      </Center>
    </Box>
  );
}

export default function AppPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AppPageContent />
    </Suspense>
  );
}
