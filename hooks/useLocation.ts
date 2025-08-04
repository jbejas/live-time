import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { useLocationStore } from '@/store/locationStore';

export const useLocation = () => {
  const {
    hasPermission,
    permissionAsked,
    currentLocation,
    isLoading,
    error,
    setPermission,
    setPermissionAsked,
    setCurrentLocation,
    setLoading,
    setError,
  } = useLocationStore();

  const watchSubscription = useRef<Location.LocationSubscription | null>(null);
  const updateInterval = useRef<NodeJS.Timeout | null>(null);

  const requestPermission = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      
      setPermission(granted);
      setPermissionAsked(true);
      
      if (granted) {
        await startLocationTracking();
      } else {
        setError('Location permission denied');
      }
    } catch (err) {
      setError('Failed to request location permission');
      console.error('Error requesting location permission:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setCurrentLocation(location);
    } catch (err) {
      setError('Failed to get current location');
      console.error('Error getting current location:', err);
    } finally {
      setLoading(false);
    }
  };

  const startLocationTracking = async () => {
    try {
      setLoading(true);
      setError(null);

      // Stop any existing tracking
      await stopLocationTracking();

      // Start watching location changes
      watchSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 30000, // Update every 30 seconds
          distanceInterval: 10, // Update when moved 10 meters
        },
        (location) => {
          setCurrentLocation(location);
        }
      );

      // Also get initial location immediately
      await getCurrentLocation();
    } catch (err) {
      setError('Failed to start location tracking');
      console.error('Error starting location tracking:', err);
    } finally {
      setLoading(false);
    }
  };

  const stopLocationTracking = async () => {
    if (watchSubscription.current) {
      await watchSubscription.current.remove();
      watchSubscription.current = null;
    }
    if (updateInterval.current) {
      clearInterval(updateInterval.current);
      updateInterval.current = null;
    }
  };

  const checkPermissionStatus = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      const granted = status === 'granted';
      setPermission(granted);
      
      if (granted && !currentLocation) {
        await startLocationTracking();
      }
    } catch (err) {
      console.error('Error checking permission status:', err);
    }
  };

  useEffect(() => {
    if (!permissionAsked) {
      checkPermissionStatus();
    } else if (hasPermission && !watchSubscription.current) {
      startLocationTracking();
    }
    
    // Cleanup on unmount
    return () => {
      stopLocationTracking();
    };
  }, [hasPermission, permissionAsked]);

  return {
    hasPermission,
    permissionAsked,
    currentLocation,
    isLoading,
    error,
    requestPermission,
    getCurrentLocation,
    startLocationTracking,
    stopLocationTracking,
    checkPermissionStatus,
  };
};