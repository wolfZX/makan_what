"use client";
import React, { useState, useEffect } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { Restaurant } from "./RestaurantTable";

interface WheelProps {
  restaurants: Restaurant[];
  onSelect?: (selected: Restaurant) => void;
  mustSpin: boolean;
  prizeNumber: number;
  setMustSpin: (value: boolean) => void;
  setPrizeNumber: (value: number) => void;
}

// Type for the RouletteWheel component
interface RouletteWheelProps {
  mustStartSpinning: boolean;
  prizeNumber: number;
  data: Array<{
    option: string;
    style: {
      backgroundColor: string;
      textColor: string;
    };
  }>;
  onStopSpinning: () => void;
  outerBorderColor: string;
  outerBorderWidth: number;
  innerBorderWidth: number;
  radiusLineWidth: number;
  fontSize: number;
  fontFamily: string;
  spinDuration: number;
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

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

export default function Wheel({
  restaurants,
  onSelect,
  mustSpin,
  prizeNumber,
  setMustSpin,
  setPrizeNumber,
}: WheelProps) {
  const [RouletteWheel, setRouletteWheel] =
    useState<React.ComponentType<RouletteWheelProps> | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import the wheel component only on client side
    import("react-custom-roulette").then((module) => {
      setRouletteWheel(() => module.Wheel);
    });
  }, []);

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
        <VStack spacing={3}>
          <Text fontSize="lg" fontWeight="medium">
            No restaurants match your filters
          </Text>
          <Text fontSize="sm" color="gray.400">
            Try adjusting your filter options above
          </Text>
        </VStack>
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

  // Show loading state while the wheel component is being loaded
  if (!isClient || !RouletteWheel) {
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
          Loading wheel...
        </Text>
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
      <div style={{ marginBottom: "10px" }}>
        <Text
          fontSize="lg"
          fontWeight="semibold"
          color="gray.700"
          animation={!mustSpin ? `${bounce} 2s infinite` : "none"}
        >
          Click the wheel to spin!
        </Text>
        <Text fontSize="sm" color="gray.500">
          Let fate decide where to eat today
        </Text>
      </div>
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
