import { createClient } from "@supabase/supabase-js";
import { Restaurant } from "@/components/RestaurantTable";

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

export const restaurantService = {
  // Fetch all restaurants for a user
  async getRestaurants(orgName: string): Promise<Restaurant[]> {
    try {
      const { data, error } = await supabase
        .from("makan where")
        .select("*")
        .eq("org_name", orgName.toLowerCase().trim());

      if (error) throw new DatabaseError("Failed to fetch restaurants", error);
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
    try {
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
    try {
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

      if (error) throw new DatabaseError("Failed to update restaurant", error);
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
    try {
      const { error } = await supabase
        .from("makan where")
        .delete()
        .eq("id", id)
        .eq("org_name", orgName.toLowerCase().trim());

      if (error) throw new DatabaseError("Failed to delete restaurant", error);
    } catch (error) {
      console.error("Database error in deleteRestaurant:", error);
      throw new DatabaseError(
        "Unable to delete restaurant. Please try again later.",
        error
      );
    }
  },
};
