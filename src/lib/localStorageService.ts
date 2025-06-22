import { Restaurant } from "@/components/RestaurantTable";

const STORAGE_KEY_PREFIX = "makan_where_restaurants_";

// Helper function to check if we're on the client side
const isClient = typeof window !== "undefined";

export const localStorageService = {
  // Get restaurants for a specific organization from localStorage
  getRestaurants(orgName: string): Restaurant[] {
    if (!isClient) return [];

    try {
      const key = `${STORAGE_KEY_PREFIX}${orgName.toLowerCase().trim()}`;
      const stored = localStorage.getItem(key);
      if (!stored) return [];

      const data = JSON.parse(stored);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  },

  // Add a new restaurant to localStorage
  addRestaurant(
    restaurant: Omit<Restaurant, "id">,
    orgName: string
  ): Restaurant {
    if (!isClient) {
      throw new Error("localStorage is not available on server side");
    }

    try {
      const key = `${STORAGE_KEY_PREFIX}${orgName.toLowerCase().trim()}`;
      const existing = this.getRestaurants(orgName);

      const newRestaurant: Restaurant = {
        ...restaurant,
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orgName: orgName.toLowerCase().trim(),
      };

      const updated = [...existing, newRestaurant];
      localStorage.setItem(key, JSON.stringify(updated));

      return newRestaurant;
    } catch (error) {
      console.error("Error adding to localStorage:", error);
      throw new Error("Failed to add restaurant to local storage");
    }
  },

  // Update an existing restaurant in localStorage
  updateRestaurant(
    id: string,
    restaurant: Omit<Restaurant, "id">,
    orgName: string
  ): Restaurant {
    if (!isClient) {
      throw new Error("localStorage is not available on server side");
    }

    try {
      const key = `${STORAGE_KEY_PREFIX}${orgName.toLowerCase().trim()}`;
      const existing = this.getRestaurants(orgName);

      const updated = existing.map((r) =>
        r.id === id
          ? {
              ...restaurant,
              id,
              orgName: orgName.toLowerCase().trim(),
            }
          : r
      );

      localStorage.setItem(key, JSON.stringify(updated));

      const updatedRestaurant = updated.find((r) => r.id === id);
      if (!updatedRestaurant) {
        throw new Error("Restaurant not found");
      }

      return updatedRestaurant;
    } catch (error) {
      console.error("Error updating localStorage:", error);
      throw new Error("Failed to update restaurant in local storage");
    }
  },

  // Delete a restaurant from localStorage
  deleteRestaurant(id: string, orgName: string): void {
    if (!isClient) {
      throw new Error("localStorage is not available on server side");
    }

    try {
      const key = `${STORAGE_KEY_PREFIX}${orgName.toLowerCase().trim()}`;
      const existing = this.getRestaurants(orgName);

      const updated = existing.filter((r) => r.id !== id);
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (error) {
      console.error("Error deleting from localStorage:", error);
      throw new Error("Failed to delete restaurant from local storage");
    }
  },

  // Check if localStorage is available
  isAvailable(): boolean {
    if (!isClient) return false;

    try {
      const test = "__localStorage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },
};
