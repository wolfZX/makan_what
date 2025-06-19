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
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

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
                      onClick={() => onDelete(restaurant.id)}
                    />
                  )}
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
