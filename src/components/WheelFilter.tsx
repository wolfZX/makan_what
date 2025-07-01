"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Checkbox,
  Badge,
  Button,
  Select,
  Flex,
} from "@chakra-ui/react";
import { Restaurant } from "./RestaurantTable";

interface WheelFilterProps {
  restaurants: Restaurant[];
  onFilterChange: (filteredRestaurants: Restaurant[]) => void;
}

interface FilterState {
  priceRanges: string[];
  cuisines: string[];
  halalOnly: boolean;
}

export default function WheelFilter({
  restaurants,
  onFilterChange,
}: WheelFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRanges: [],
    cuisines: [],
    halalOnly: false,
  });

  // Get unique values for filter options
  const uniquePriceRanges = [
    ...new Set(restaurants.map((r) => r.priceRange)),
  ].sort();
  const uniqueCuisines = [...new Set(restaurants.map((r) => r.cuisine))].sort();

  // Apply filters whenever filters or restaurants change
  useEffect(() => {
    let filtered = [...restaurants];

    // Filter by price range
    if (filters.priceRanges.length > 0) {
      filtered = filtered.filter((r) =>
        filters.priceRanges.includes(r.priceRange)
      );
    }

    // Filter by cuisine
    if (filters.cuisines.length > 0) {
      filtered = filtered.filter((r) => filters.cuisines.includes(r.cuisine));
    }

    // Filter by halal status
    if (filters.halalOnly) {
      filtered = filtered.filter((r) => r.isHalal);
    }

    onFilterChange(filtered);
  }, [filters, restaurants, onFilterChange]);

  const handlePriceRangeChange = (selectedPriceRange: string) => {
    if (selectedPriceRange === "") {
      // Clear price range filter
      setFilters((prev) => ({
        ...prev,
        priceRanges: [],
      }));
    } else {
      // Set single price range filter
      setFilters((prev) => ({
        ...prev,
        priceRanges: [selectedPriceRange],
      }));
    }
  };

  const handleCuisineChange = (selectedCuisine: string) => {
    if (selectedCuisine === "") {
      // Clear cuisine filter
      setFilters((prev) => ({
        ...prev,
        cuisines: [],
      }));
    } else {
      // Set single cuisine filter
      setFilters((prev) => ({
        ...prev,
        cuisines: [selectedCuisine],
      }));
    }
  };

  const handleHalalChange = (isChecked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      halalOnly: isChecked,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      priceRanges: [],
      cuisines: [],
      halalOnly: false,
    });
  };

  const hasActiveFilters =
    filters.priceRanges.length > 0 ||
    filters.cuisines.length > 0 ||
    filters.halalOnly;

  const getFilteredCount = () => {
    let filtered = [...restaurants];
    if (filters.priceRanges.length > 0) {
      filtered = filtered.filter((r) =>
        filters.priceRanges.includes(r.priceRange)
      );
    }
    if (filters.cuisines.length > 0) {
      filtered = filtered.filter((r) => filters.cuisines.includes(r.cuisine));
    }
    if (filters.halalOnly) {
      filtered = filtered.filter((r) => r.isHalal);
    }
    return filtered.length;
  };

  return (
    <Box
      bg="gray.50"
      borderRadius="lg"
      p={4}
      border="1px solid"
      borderColor="gray.200"
    >
      <HStack justify="space-between" align="center" mb={3}>
        <HStack spacing={2}>
          <Text fontWeight="semibold" color="gray.700" fontSize="sm">
            Filter Options
          </Text>
          {hasActiveFilters && (
            <Badge colorScheme="blue" variant="subtle" fontSize="xs">
              {getFilteredCount()} of {restaurants.length}
            </Badge>
          )}
        </HStack>
        {hasActiveFilters && (
          <Button
            size="xs"
            variant="ghost"
            colorScheme="gray"
            onClick={clearAllFilters}
          >
            Clear All
          </Button>
        )}
      </HStack>

      <VStack spacing={3} align="stretch">
        {/* Price Range and Cuisine Filters - Side by Side */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          gap={3}
          align={{ base: "stretch", sm: "end" }}
        >
          {/* Price Range Filter */}
          <Box flex={1}>
            <Text fontSize="xs" fontWeight="medium" color="gray.600" mb={2}>
              Price Range
            </Text>
            <Select
              size="sm"
              value={filters.priceRanges[0] || ""}
              onChange={(e) => handlePriceRangeChange(e.target.value)}
              placeholder="All prices"
              bg="white"
              borderColor="gray.300"
              _hover={{ borderColor: "gray.400" }}
              _focus={{
                borderColor: "teal.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
              }}
            >
              {uniquePriceRanges.map((priceRange) => (
                <option key={priceRange} value={priceRange}>
                  {priceRange}
                </option>
              ))}
            </Select>
          </Box>

          {/* Cuisine Filter */}
          <Box flex={1}>
            <Text fontSize="xs" fontWeight="medium" color="gray.600" mb={2}>
              Cuisine Type
            </Text>
            <Select
              size="sm"
              value={filters.cuisines[0] || ""}
              onChange={(e) => handleCuisineChange(e.target.value)}
              placeholder="All cuisines"
              bg="white"
              borderColor="gray.300"
              _hover={{ borderColor: "gray.400" }}
              _focus={{
                borderColor: "teal.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
              }}
            >
              {uniqueCuisines.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </Select>
          </Box>
        </Flex>

        {/* Halal Filter */}
        <Box>
          <Checkbox
            isChecked={filters.halalOnly}
            onChange={(e) => handleHalalChange(e.target.checked)}
            colorScheme="teal"
            size="sm"
          >
            <Text fontSize="xs" fontWeight="medium" color="gray.600">
              Halal Only
            </Text>
          </Checkbox>
        </Box>
      </VStack>
    </Box>
  );
}
