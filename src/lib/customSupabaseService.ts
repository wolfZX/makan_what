import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Restaurant } from "@/components/RestaurantTable";

interface CustomSupabaseConfig {
  url: string;
  key: string;
  orgName: string;
}

class DatabaseError extends Error {
  constructor(message: string, public originalError: Error | unknown) {
    super(message);
    this.name = "DatabaseError";
  }
}

// Helper function to check if we're on the client side
const isClient = typeof window !== "undefined";

class CustomSupabaseService {
  private getConfigKey(orgName: string): string {
    return `custom_supabase_config_${orgName.toLowerCase().trim()}`;
  }

  private getSupabaseClient(orgName: string): SupabaseClient | null {
    if (!isClient) return null;

    try {
      const configKey = this.getConfigKey(orgName);
      const configStr = localStorage.getItem(configKey);

      if (!configStr) return null;

      const config: CustomSupabaseConfig = JSON.parse(configStr);
      return createClient(config.url, config.key);
    } catch (error) {
      console.error("Error creating Supabase client:", error);
      return null;
    }
  }

  saveConfig(orgName: string, url: string, key: string): void {
    if (!isClient) {
      throw new Error("localStorage is not available on server side");
    }

    try {
      const configKey = this.getConfigKey(orgName);
      const config: CustomSupabaseConfig = {
        url,
        key,
        orgName: orgName.toLowerCase().trim(),
      };
      localStorage.setItem(configKey, JSON.stringify(config));
    } catch (error) {
      console.error("Error saving Supabase config:", error);
      throw new Error("Failed to save configuration");
    }
  }

  hasConfig(orgName: string): boolean {
    if (!isClient) return false;

    try {
      const configKey = this.getConfigKey(orgName);
      return localStorage.getItem(configKey) !== null;
    } catch {
      return false;
    }
  }

  removeConfig(orgName: string): void {
    if (!isClient) return;

    try {
      const configKey = this.getConfigKey(orgName);
      localStorage.removeItem(configKey);
    } catch (error) {
      console.error("Error removing Supabase config:", error);
    }
  }

  async getRestaurants(orgName: string): Promise<Restaurant[]> {
    const supabase = this.getSupabaseClient(orgName);
    if (!supabase) {
      throw new Error("No custom Supabase configuration found");
    }

    try {
      const { data, error } = await supabase
        .from("makan where")
        .select("*")
        .eq("org_name", orgName.toLowerCase().trim());

      if (error) {
        throw new DatabaseError("Failed to fetch restaurants", error);
      }

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
      console.error("Custom Supabase error in getRestaurants:", error);
      throw new DatabaseError(
        "Unable to load restaurants from custom Supabase. Please check your configuration.",
        error
      );
    }
  }

  async addRestaurant(
    restaurant: Omit<Restaurant, "id">,
    orgName: string
  ): Promise<Restaurant> {
    const supabase = this.getSupabaseClient(orgName);
    if (!supabase) {
      throw new Error("No custom Supabase configuration found");
    }

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

      if (error) {
        throw new DatabaseError("Failed to add restaurant", error);
      }

      if (!data) {
        throw new DatabaseError(
          "No data returned after adding restaurant",
          new Error("No data")
        );
      }

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
      console.error("Custom Supabase error in addRestaurant:", error);
      throw new DatabaseError(
        "Unable to add restaurant to custom Supabase. Please check your configuration.",
        error
      );
    }
  }

  async updateRestaurant(
    id: string,
    restaurant: Omit<Restaurant, "id">,
    orgName: string
  ): Promise<Restaurant> {
    const supabase = this.getSupabaseClient(orgName);
    if (!supabase) {
      throw new Error("No custom Supabase configuration found");
    }

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

      if (error) {
        throw new DatabaseError("Failed to update restaurant", error);
      }

      if (!data) {
        throw new DatabaseError("Restaurant not found", new Error("No data"));
      }

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
      console.error("Custom Supabase error in updateRestaurant:", error);
      throw new DatabaseError(
        "Unable to update restaurant in custom Supabase. Please check your configuration.",
        error
      );
    }
  }

  async deleteRestaurant(id: string, orgName: string): Promise<void> {
    const supabase = this.getSupabaseClient(orgName);
    if (!supabase) {
      throw new Error("No custom Supabase configuration found");
    }

    try {
      const { error } = await supabase
        .from("makan where")
        .delete()
        .eq("id", id)
        .eq("org_name", orgName.toLowerCase().trim());

      if (error) {
        throw new DatabaseError("Failed to delete restaurant", error);
      }
    } catch (error) {
      console.error("Custom Supabase error in deleteRestaurant:", error);
      throw new DatabaseError(
        "Unable to delete restaurant from custom Supabase. Please check your configuration.",
        error
      );
    }
  }
}

export const customSupabaseService = new CustomSupabaseService();
