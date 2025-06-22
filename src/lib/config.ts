// Authorized users who can access the Supabase database
// These should be kept secure and not exposed in client-side code
// Parse from environment variable for security

// Server-side function to parse authorized users
const parseAuthorizedUsers = (): string[] => {
  const authorizedUsersEnv = process.env.AUTHORIZED_USERS || "";
  try {
    if (!authorizedUsersEnv) {
      console.warn("AUTHORIZED_USERS environment variable is not set");
      return [];
    }

    return authorizedUsersEnv
      .split(",")
      .map((user) => user.trim().toLowerCase())
      .filter(Boolean);
  } catch (error) {
    console.error(
      "Error parsing AUTHORIZED_USERS environment variable:",
      error
    );
    return []; // No fallback for security
  }
};

// Client-side function that calls the API route for authorization
async function checkAuthorizationViaAPI(username: string): Promise<boolean> {
  try {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.isAuthorized;
  } catch (error) {
    console.error("Authorization check error:", error);
    return false;
  }
}

// Check if a user is authorized to use Supabase
export const isAuthorizedUser = (username: string): boolean => {
  // If we're on the server side, use environment variables
  if (typeof window === "undefined") {
    const authorizedUsers = parseAuthorizedUsers();
    const normalizedUsername = username.toLowerCase().trim();
    return authorizedUsers.includes(normalizedUsername);
  }

  // If we're on the client side, we can't access non-NEXT_PUBLIC env vars
  // So we'll return false and let the component handle it via API call
  return false;
};

// Async version for client-side use
export const isAuthorizedUserAsync = async (
  username: string
): Promise<boolean> => {
  return await checkAuthorizationViaAPI(username);
};

// Environment configuration
export const config = {
  // Use Supabase for authorized users, localStorage for others
  useSupabase: (username: string) => isAuthorizedUser(username),

  // Check if we're in development mode
  isDevelopment: process.env.NODE_ENV === "development",

  // Check if we're in production mode
  isProduction: process.env.NODE_ENV === "production",
};
