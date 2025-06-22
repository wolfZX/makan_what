import { Restaurant } from "@/components/RestaurantTable";
import { localStorageService } from "./localStorageService";
import { customSupabaseService } from "./customSupabaseService";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

class DatabaseError extends Error {
  constructor(message: string, public originalError: Error | unknown) {
    super(message);
    this.name = "DatabaseError";
  }
}

// Helper function to check if we're on the client side
const isClient = typeof window !== "undefined";

// Check authorization server-side
async function checkAuthorization(orgName: string): Promise<boolean> {
  if (!isClient) return false;

  try {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: orgName }),
    });

    if (!response.ok) {
      throw new Error("Authorization check failed");
    }

    const data = await response.json();
    return data.isAuthorized;
  } catch (error) {
    console.error("Authorization check error:", error);
    // Fallback to client-side check if server check fails
    return false;
  }
}

export const secureRestaurantService = {
  // Fetch all restaurants for a user
  async getRestaurants(orgName: string): Promise<Restaurant[]> {
    if (!isClient) return [];

    try {
      // First, check if user has a custom Supabase configuration
      if (customSupabaseService.hasConfig(orgName)) {
        try {
          return await customSupabaseService.getRestaurants(orgName);
        } catch (error) {
          console.error(
            "Custom Supabase failed, falling back to other methods:",
            error
          );
          // Continue to other methods if custom config fails
        }
      }

      const isAuthorized = await checkAuthorization(orgName);

      if (isAuthorized) {
        const { data, error } = await supabase
          .from("makan where")
          .select("*")
          .eq("org_name", orgName.toLowerCase().trim());

        if (error)
          throw new DatabaseError("Failed to fetch restaurants", error);
        if (!data) return [];

        return data.map((item) => ({
          id: item.id,
          name: item.name,
          cuisine: item.cuisine,
          priceRange: item.price_range,
          isHalal: item.is_halal,
          googleUrl: item.google_url,
          orgName: item.org_name,
        }));
      } else {
        // Use localStorage for non-authorized users
        if (!localStorageService.isAvailable()) {
          throw new Error("Local storage is not available in this browser");
        }
        return localStorageService.getRestaurants(orgName);
      }
    } catch (error) {
      console.error("Database error in getRestaurants:", error);
      throw new DatabaseError(
        "Unable to load restaurants. Please try again later.",
        error
      );
    }
  },

  // Add a new restaurant
  async addRestaurant(
    restaurant: Omit<Restaurant, "id">,
    orgName: string
  ): Promise<Restaurant> {
    if (!isClient) {
      throw new Error("Cannot add restaurant on server side");
    }

    try {
      // First, check if user has a custom Supabase configuration
      if (customSupabaseService.hasConfig(orgName)) {
        try {
          return await customSupabaseService.addRestaurant(restaurant, orgName);
        } catch (error) {
          console.error(
            "Custom Supabase failed, falling back to other methods:",
            error
          );
          // Continue to other methods if custom config fails
        }
      }

      const isAuthorized = await checkAuthorization(orgName);

      if (isAuthorized) {
        const { data, error } = await supabase
          .from("makan where")
          .insert([
            {
              name: restaurant.name,
              cuisine: restaurant.cuisine,
              price_range: restaurant.priceRange,
              is_halal: restaurant.isHalal,
              google_url: restaurant.googleUrl,
              org_name: orgName.toLowerCase().trim(),
            },
          ])
          .select()
          .single();

        if (error) throw new DatabaseError("Failed to add restaurant", error);
        if (!data)
          throw new DatabaseError(
            "No data returned after adding restaurant",
            new Error("No data")
          );

        return {
          id: data.id,
          name: data.name,
          cuisine: data.cuisine,
          priceRange: data.price_range,
          isHalal: data.is_halal,
          googleUrl: data.google_url,
          orgName: data.org_name,
        };
      } else {
        // Use localStorage for non-authorized users
        if (!localStorageService.isAvailable()) {
          throw new Error("Local storage is not available in this browser");
        }
        return localStorageService.addRestaurant(restaurant, orgName);
      }
    } catch (error) {
      console.error("Database error in addRestaurant:", error);
      throw new DatabaseError(
        "Unable to add restaurant. Please try again later.",
        error
      );
    }
  },

  // Update an existing restaurant
  async updateRestaurant(
    id: string,
    restaurant: Omit<Restaurant, "id">,
    orgName: string
  ): Promise<Restaurant> {
    if (!isClient) {
      throw new Error("Cannot update restaurant on server side");
    }

    try {
      // First, check if user has a custom Supabase configuration
      if (customSupabaseService.hasConfig(orgName)) {
        try {
          return await customSupabaseService.updateRestaurant(
            id,
            restaurant,
            orgName
          );
        } catch (error) {
          console.error(
            "Custom Supabase failed, falling back to other methods:",
            error
          );
          // Continue to other methods if custom config fails
        }
      }

      const isAuthorized = await checkAuthorization(orgName);

      if (isAuthorized) {
        const { data, error } = await supabase
          .from("makan where")
          .update({
            name: restaurant.name,
            cuisine: restaurant.cuisine,
            price_range: restaurant.priceRange,
            is_halal: restaurant.isHalal,
            google_url: restaurant.googleUrl,
            org_name: orgName.toLowerCase().trim(),
          })
          .eq("id", id)
          .select()
          .single();

        if (error)
          throw new DatabaseError("Failed to update restaurant", error);
        if (!data)
          throw new DatabaseError("Restaurant not found", new Error("No data"));

        return {
          id: data.id,
          name: data.name,
          cuisine: data.cuisine,
          priceRange: data.price_range,
          isHalal: data.is_halal,
          googleUrl: data.google_url,
          orgName: data.org_name,
        };
      } else {
        // Use localStorage for non-authorized users
        if (!localStorageService.isAvailable()) {
          throw new Error("Local storage is not available in this browser");
        }
        return localStorageService.updateRestaurant(id, restaurant, orgName);
      }
    } catch (error) {
      console.error("Database error in updateRestaurant:", error);
      throw new DatabaseError(
        "Unable to update restaurant. Please try again later.",
        error
      );
    }
  },

  // Delete a restaurant
  async deleteRestaurant(id: string, orgName: string): Promise<void> {
    if (!isClient) {
      throw new Error("Cannot delete restaurant on server side");
    }

    try {
      // First, check if user has a custom Supabase configuration
      if (customSupabaseService.hasConfig(orgName)) {
        try {
          await customSupabaseService.deleteRestaurant(id, orgName);
          return;
        } catch (error) {
          console.error(
            "Custom Supabase failed, falling back to other methods:",
            error
          );
          // Continue to other methods if custom config fails
        }
      }

      const isAuthorized = await checkAuthorization(orgName);

      if (isAuthorized) {
        const { error } = await supabase
          .from("makan where")
          .delete()
          .eq("id", id)
          .eq("org_name", orgName.toLowerCase().trim());

        if (error)
          throw new DatabaseError("Failed to delete restaurant", error);
      } else {
        // Use localStorage for non-authorized users
        if (!localStorageService.isAvailable()) {
          throw new Error("Local storage is not available in this browser");
        }
        localStorageService.deleteRestaurant(id, orgName);
      }
    } catch (error) {
      console.error("Database error in deleteRestaurant:", error);
      throw new DatabaseError(
        "Unable to delete restaurant. Please try again later.",
        error
      );
    }
  },

  // Check if user is authorized (for UI purposes)
  async checkUserAuthorization(orgName: string): Promise<boolean> {
    return await checkAuthorization(orgName);
  },

  // Check if user has custom Supabase configuration
  hasCustomConfig(orgName: string): boolean {
    return customSupabaseService.hasConfig(orgName);
  },

  // Save custom Supabase configuration
  saveCustomConfig(orgName: string, url: string, key: string): void {
    customSupabaseService.saveConfig(orgName, url, key);
  },

  // Remove custom Supabase configuration
  removeCustomConfig(orgName: string): void {
    customSupabaseService.removeConfig(orgName);
  },
};
