import { Restaurant } from "../components/RestaurantTable";

export const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Laksa House",
    cuisine: "Singaporean",
    priceRange: "$$",
    isHalal: false,
  },
  {
    id: "2",
    name: "Sushi Express",
    cuisine: "Japanese",
    priceRange: "$$$",
    isHalal: false,
  },
  {
    id: "3",
    name: "Nasi Lemak Corner",
    cuisine: "Malaysian",
    priceRange: "$",
    isHalal: true,
  },
  {
    id: "4",
    name: "Pho Delight",
    cuisine: "Vietnamese",
    priceRange: "$$",
    isHalal: false,
  },
  {
    id: "5",
    name: "Dim Sum Palace",
    cuisine: "Chinese",
    priceRange: "$$",
    isHalal: false,
  },
  {
    id: "6",
    name: "Curry House",
    cuisine: "Indian",
    priceRange: "$",
    isHalal: true,
  },
];
