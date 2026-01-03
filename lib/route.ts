/*
 * An array of routes accessible to the user
 * @param {string[]} routes - The routes to be added
 */
export const publicRoutes = ["/"];

/*
 * An array of routes that used for user authentication (for logged out users)
 * will redirect to login page if not authenticated, else /settings
 * @param {string[]} routes - The routes to be added
 */
export const authRoutes = ["/sign-in", "/sign-up"];

/*
 * prefix for API routes
 * These routes will allways be allowed
 * @param {string} apiAuthPrefix - The prefix for the API routes
 */
export const apiAuthPrefix = "/api/auth";

/*
 * prefix for Admin routes
 * These routes will allways be allowed
 * @param {string} apiAdminPrefix - The prefix for the Admin routes
 */
export const apiAdminPrefix = "/api/admin";

/**
 *  allowed api routes
 * @param{string[]} routes - The routes to be added
 */
export const allowedApiRoutes = [];

export const DEFAULT_REDIRECT_URL = "/";
