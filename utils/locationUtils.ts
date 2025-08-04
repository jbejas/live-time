/**
 * Calculate the distance between two geographical points using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in meters
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Check if a user is within the specified radius of an event location
 * @param userLat User's latitude
 * @param userLon User's longitude
 * @param eventLat Event's latitude
 * @param eventLon Event's longitude
 * @param radius Event's radius in meters
 * @returns Boolean indicating if user is at the event location
 */
export const isUserAtEvent = (
  userLat: number,
  userLon: number,
  eventLat: number,
  eventLon: number,
  radius: number
): boolean => {
  const distance = calculateDistance(userLat, userLon, eventLat, eventLon);
  return distance <= radius;
};

/**
 * Format distance for display
 * @param distance Distance in meters
 * @returns Formatted string with appropriate units
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  } else {
    return `${(distance / 1000).toFixed(1)}km`;
  }
};

/**
 * Calculate time spent at an event location
 * @param enteredAt Date when user entered the event
 * @param exitedAt Date when user exited (optional, uses current time if not provided)
 * @returns Time spent in minutes
 */
export const calculateTimeSpent = (
  enteredAt: Date | string,
  exitedAt?: Date | string
): number => {
  const startTime = new Date(enteredAt);
  const endTime = exitedAt ? new Date(exitedAt) : new Date();
  const diffMs = endTime.getTime() - startTime.getTime();
  return Math.floor(diffMs / (1000 * 60)); // Convert to minutes
};