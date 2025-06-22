// More secure configuration approach
// This should be used in production instead of the client-side config

// Environment variable for authorized users (comma-separated)
const AUTHORIZED_USERS_ENV = process.env.AUTHORIZED_USERS || "";

// Parse authorized users from environment variable
const parseAuthorizedUsers = (): string[] => {
  try {
    if (!AUTHORIZED_USERS_ENV) {
      console.warn("AUTHORIZED_USERS environment variable is not set");
      return [];
    }

    return AUTHORIZED_USERS_ENV.split(",")
      .map((user) => user.trim().toLowerCase())
      .filter(Boolean);
  } catch (error) {
    console.error(
      "Error parsing AUTHORIZED_USERS environment variable:",
      error
    );
    return []; // No fallback - security through obscurity
  }
};

// Server-side function to check authorization (for API routes)
export const checkServerSideAuthorization = (username: string): boolean => {
  const authorizedUsers = parseAuthorizedUsers();
  return authorizedUsers.includes(username.toLowerCase().trim());
};

// Client-side function (less secure, but needed for UI feedback)
export const checkClientSideAuthorization = (username: string): boolean => {
  // In production, this should be validated server-side
  const authorizedUsers = parseAuthorizedUsers();
  return authorizedUsers.includes(username.toLowerCase().trim());
};

// Get authorized users for display purposes (only in development)
export const getAuthorizedUsers = (): string[] => {
  if (process.env.NODE_ENV === "development") {
    return parseAuthorizedUsers();
  }
  return []; // Don't expose in production
};

// Configuration object
export const secureConfig = {
  // Check if we're in development mode
  isDevelopment: process.env.NODE_ENV === "development",

  // Check if we're in production mode
  isProduction: process.env.NODE_ENV === "production",

  // Get the current authorized users count (for debugging)
  getAuthorizedUsersCount: () => parseAuthorizedUsers().length,

  // Check if a specific user is authorized
  isAuthorized: checkClientSideAuthorization,
};
