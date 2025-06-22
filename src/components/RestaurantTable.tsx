"use client";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  HStack,
  Link,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  Text,
  VStack,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  priceRange: string; // '$' | '$$' | '$$$'
  isHalal: boolean;
  googleUrl?: string;
  selected?: boolean;
  orgName: string;
}

interface RestaurantTableProps {
  data: Restaurant[];
  onDelete?: (id: string) => void;
  onEdit?: (restaurant: Restaurant) => void;
}

export default function RestaurantTable({
  data,
  onDelete,
  onEdit,
}: RestaurantTableProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [restaurantToDelete, setRestaurantToDelete] =
    useState<Restaurant | null>(null);

  const handleDelete = (restaurant: Restaurant) => {
    setRestaurantToDelete(restaurant);
    onOpen();
  };

  const confirmDelete = () => {
    if (restaurantToDelete && onDelete) {
      onDelete(restaurantToDelete.id);
    }
    onClose();
    setRestaurantToDelete(null);
  };

  // Show empty state if no data
  if (!data || data.length === 0) {
    return (
      <Box
        height="calc(100vh - 350px)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4} textAlign="center" color="gray.500">
          <Text fontSize="lg" fontWeight="medium">
            No restaurants yet
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box overflowY="auto" maxH="calc(100vh - 250px)" fontFamily="body">
      <Table variant="simple" size="md">
        <Thead position="sticky" top={0} bg="white" zIndex={1}>
          <Tr>
            <Th color="brand.tealTreat">Name</Th>
            <Th color="brand.tealTreat">Cuisine</Th>
            <Th color="brand.tealTreat">Price Range</Th>
            <Th color="brand.tealTreat">Halal Status</Th>
            <Th color="brand.tealTreat">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((restaurant) => (
            <Tr key={restaurant.id}>
              <Td>
                {restaurant.googleUrl ? (
                  <Link
                    href={restaurant.googleUrl}
                    isExternal
                    color="blue.500"
                    textDecoration="underline"
                  >
                    {restaurant.name}
                  </Link>
                ) : (
                  restaurant.name
                )}
              </Td>
              <Td>{restaurant.cuisine}</Td>
              <Td>{restaurant.priceRange}</Td>
              <Td>
                <Badge
                  colorScheme={restaurant.isHalal ? "green" : "red"}
                  variant="subtle"
                >
                  {restaurant.isHalal ? "HALAL" : "NON-HALAL"}
                </Badge>
              </Td>
              <Td>
                <HStack spacing={1}>
                  {onEdit && (
                    <IconButton
                      aria-label="Edit restaurant"
                      icon={<EditIcon />}
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      onClick={() => onEdit(restaurant)}
                    />
                  )}
                  {onDelete && (
                    <IconButton
                      aria-label="Delete restaurant"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDelete(restaurant)}
                    />
                  )}
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Restaurant
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete {restaurantToDelete?.name}? This
              action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
