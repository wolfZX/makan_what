"use client";
import { useSearchParams } from "next/navigation";
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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Wheel from "../../components/Wheel";
import RestaurantTable, { Restaurant } from "../../components/RestaurantTable";
import AddRestaurantModal from "../../components/AddRestaurantModal";
import { restaurantService } from "../../lib/restaurantService";
import { ChevronLeftIcon } from "@chakra-ui/icons";

export default function AppPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

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
        const data = await restaurantService.getRestaurants(name);
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
      const added = await restaurantService.addRestaurant(newRestaurant, name);
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
      await restaurantService.deleteRestaurant(id, name);
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
      const updatedRestaurant = await restaurantService.updateRestaurant(
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

  return (
    <Box minH="100vh" bg="brand.soyMilk" p={{ base: 2, md: 8 }}>
      <Flex align="center" mb={6} gap={4}>
        <IconButton
          aria-label="Go back to home page"
          icon={<ChevronLeftIcon boxSize={6} />}
          variant="ghost"
          colorScheme="orange"
          size="sm"
          onClick={() => (window.location.href = "/")}
        />
        <Heading as="h2" size="lg" color="brand.kopiBrown" fontFamily="heading">
          Welcome, {name}!
        </Heading>
      </Flex>
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
          mb={{ base: 8, md: 0 }}
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
