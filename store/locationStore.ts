import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export interface LocationState {
  hasPermission: boolean | null;
  permissionAsked: boolean;
  currentLocation: Location.LocationObject | null;
  isLoading: boolean;
  error: string | null;
  setPermission: (hasPermission: boolean) => void;
  setPermissionAsked: (asked: boolean) => void;
  setCurrentLocation: (location: Location.LocationObject | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      hasPermission: null,
      permissionAsked: false,
      currentLocation: null,
      isLoading: false,
      error: null,
      setPermission: (hasPermission: boolean) =>
        set({ hasPermission }),
      setPermissionAsked: (asked: boolean) =>
        set({ permissionAsked: asked }),
      setCurrentLocation: (location: Location.LocationObject | null) =>
        set({ currentLocation: location }),
      setLoading: (loading: boolean) =>
        set({ isLoading: loading }),
      setError: (error: string | null) =>
        set({ error }),
      resetLocation: () =>
        set({
          hasPermission: null,
          permissionAsked: false,
          currentLocation: null,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasPermission: state.hasPermission,
        permissionAsked: state.permissionAsked,
      }),
    }
  )
);