"use client";
import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import { Wheel as RouletteWheel } from "react-custom-roulette";
import { Restaurant } from "./RestaurantTable";

interface WheelProps {
  restaurants: Restaurant[];
  onSelect?: (selected: Restaurant) => void;
  mustSpin: boolean;
  prizeNumber: number;
  setMustSpin: (value: boolean) => void;
  setPrizeNumber: (value: number) => void;
}

// Our brand colors
const BRAND_COLORS = [
  "#009B9B", // Teal Treat
  "#E6392F", // Roulette Red
  "#B6CD00", // Lime Light
  "#F28C28", // Curry Orange
  "#4A2E29", // Kopi Brown
];

// Function to interpolate between two colors
const interpolateColor = (color1: string, color2: string, factor: number) => {
  const c1 = {
    r: parseInt(color1.slice(1, 3), 16),
    g: parseInt(color1.slice(3, 5), 16),
    b: parseInt(color1.slice(5, 7), 16),
  };
  const c2 = {
    r: parseInt(color2.slice(1, 3), 16),
    g: parseInt(color2.slice(3, 5), 16),
    b: parseInt(color2.slice(5, 7), 16),
  };

  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

// Function to generate colors based on number of options needed
const generateColors = (count: number): string[] => {
  if (count <= BRAND_COLORS.length) {
    return BRAND_COLORS.slice(0, count);
  }

  const colors: string[] = [...BRAND_COLORS];
  const remaining = count - BRAND_COLORS.length;

  for (let i = 0; i < remaining; i++) {
    const baseIndex = i % (BRAND_COLORS.length - 1);
    const factor = (i + 1) / (remaining + 1);
    const newColor = interpolateColor(
      BRAND_COLORS[baseIndex],
      BRAND_COLORS[baseIndex + 1],
      factor
    );
    colors.push(newColor);
  }

  return colors;
};

export default function Wheel({
  restaurants,
  onSelect,
  mustSpin,
  prizeNumber,
  setMustSpin,
  setPrizeNumber,
}: WheelProps) {
  // Handle empty state
  if (!restaurants || restaurants.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="300px"
        textAlign="center"
        color="gray.500"
      >
        <Text fontSize="lg" fontWeight="medium">
          No restaurants yet
        </Text>
      </Box>
    );
  }

  // Handle single restaurant state
  if (restaurants.length === 1) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="300px"
        textAlign="center"
      >
        <VStack spacing={3}>
          <Text fontSize="lg" color="gray.500" fontWeight="medium">
            Need at least 2 restaurants to spin
          </Text>
          <Text fontSize="sm" color="gray.400">
            Add more restaurants to start spinning!
          </Text>
        </VStack>
      </Box>
    );
  }

  const wheelColors = generateColors(restaurants.length);

  const data = restaurants.map((restaurant) => ({
    option: restaurant.name,
    style: {
      backgroundColor: wheelColors[restaurants.indexOf(restaurant)],
      textColor: "white",
    },
  }));

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      cursor="pointer"
      onClick={() => {
        if (!mustSpin && restaurants.length > 0) {
          const newPrizeNumber = Math.floor(Math.random() * restaurants.length);
          setPrizeNumber(newPrizeNumber);
          setMustSpin(true);
        }
      }}
    >
      <RouletteWheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        onStopSpinning={() => {
          setMustSpin(false);
          onSelect?.(restaurants[prizeNumber]);
        }}
        outerBorderColor="white"
        outerBorderWidth={1}
        innerBorderWidth={0}
        radiusLineWidth={0}
        fontSize={16}
        fontFamily="Poppins"
        spinDuration={0.8}
      />
    </Box>
  );
}
