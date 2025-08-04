import React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  View,
  ScrollView,
  Text,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ProductCarousel } from "@/components/ProductCarousel";
import { PointsCounter } from "@/components/PointsCounter";
import { useLocation } from "@/hooks/useLocation";
import { useEventAttendance } from "@/hooks/useEventAttendance";
import { useEventStore } from "@/store/eventStore";
import { useProductStore } from "@/store/productStore";
import { useLocationStore } from "@/store/locationStore";

export default function HomeScreen() {
  const {
    hasPermission,
    permissionAsked,
    currentLocation,
    isLoading,
    error,
    requestPermission,
  } = useLocation();

  const { getAllEventStatuses, getTotalTimeAtEvent } = useEventAttendance();
  const { addEvent, resetEvents } = useEventStore();
  const { products, totalPoints, initializeData, resetProducts } =
    useProductStore();
  const { resetLocation } = useLocationStore();

  // Initialize products data on component mount
  React.useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Add a demo event for testing (you can remove this later)
  const addDemoEvent = () => {
    if (currentLocation) {
      addEvent({
        name: "Demo Event",
        description: "A test event at your current location",
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        radius: 100, // 100 meters
        isActive: true,
      });
    }
  };

  // Reset all app data
  const resetAllData = () => {
    resetEvents();
    resetProducts();
    resetLocation();
    // Re-initialize products after reset
    setTimeout(() => {
      initializeData();
    }, 100);
  };

  const renderEventStatuses = () => {
    if (!currentLocation) return null;

    const eventStatuses = getAllEventStatuses();

    if (eventStatuses.length === 0) {
      return (
        <ThemedView className="gap-1 mb-6 p-4 rounded-xl bg-white/5">
          <Text className="text-center font-semibold text-xl">
            No Active Events
          </Text>
          <ThemedText className="text-center mb-2">
            Add a demo event to test location tracking
          </ThemedText>
          <TouchableOpacity
            className="bg-green-600 px-4 py-2 rounded-lg self-center"
            onPress={addDemoEvent}
          >
            <ThemedText className="text-white font-semibold text-center">
              Add Demo Event
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      );
    }

    return (
      <ThemedView className="gap-4 mb-6">
        <ThemedText type="subtitle" className="text-center">
          Event Attendance
        </ThemedText>
        {eventStatuses.map(({ event, isAtEvent, attendance }) => {
          const totalTime = getTotalTimeAtEvent(event.id);

          return (
            <ThemedView key={event.id} className="p-4 rounded-xl bg-white/5">
              <ThemedView className="flex-row items-center justify-between mb-2">
                <ThemedText className="font-semibold text-lg">
                  {event.name}
                </ThemedText>
                <ThemedView
                  className={`px-3 py-1 rounded-full ${
                    isAtEvent ? "bg-green-600" : "bg-gray-600"
                  }`}
                >
                  <ThemedText className="text-white text-xs font-semibold">
                    {isAtEvent ? "AT EVENT" : "NOT AT EVENT"}
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              {event.description && (
                <ThemedText className="text-sm opacity-70 mb-2">
                  {event.description}
                </ThemedText>
              )}

              <ThemedView className="flex-row justify-between items-center">
                <ThemedText className="text-sm">
                  Radius: {event.radius}m
                </ThemedText>
                <ThemedText className="text-sm">
                  Total Time: {totalTime}min
                </ThemedText>
              </ThemedView>

              {attendance?.lastCheckedAt && (
                <ThemedText className="text-xs opacity-50 mt-1">
                  Last checked:{" "}
                  {new Date(attendance.lastCheckedAt).toLocaleTimeString()}
                </ThemedText>
              )}
            </ThemedView>
          );
        })}
      </ThemedView>
    );
  };

  const renderLocationContent = () => {
    if (isLoading) {
      return (
        <ThemedView className="gap-3 mb-6 p-4 rounded-xl bg-white/5 items-center">
          <ActivityIndicator size="large" />
          <ThemedText>Getting your location...</ThemedText>
        </ThemedView>
      );
    }

    if (error) {
      return (
        <ThemedView className="gap-3 mb-6 p-4 rounded-xl bg-white/5 items-center">
          <ThemedText className="text-red-400 text-center">{error}</ThemedText>
          <TouchableOpacity
            className="bg-blue-600 px-6 py-3 rounded-lg mt-2"
            onPress={requestPermission}
          >
            <ThemedText className="text-white font-semibold text-center">
              Try Again
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      );
    }

    if (hasPermission === false || (permissionAsked && !hasPermission)) {
      return (
        <ThemedView className="gap-3 mb-6 p-4 rounded-xl bg-white/5 items-center">
          <ThemedText>
            Location permission is required to show your location.
          </ThemedText>
          <TouchableOpacity
            className="bg-blue-600 px-6 py-3 rounded-lg mt-2"
            onPress={requestPermission}
          >
            <ThemedText className="text-white font-semibold text-center">
              Enable Location
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      );
    }

    if (currentLocation) {
      return (
        <ThemedView className="gap-1 mb-6 p-4 rounded-xl bg-white/5 items-center">
          <ThemedText type="subtitle">Your current location</ThemedText>
          <View className="flex-row gap-2">
            <ThemedText>
              Latitude: {currentLocation.coords.latitude.toFixed(6)}
            </ThemedText>
            <ThemedText>
              Longitude: {currentLocation.coords.longitude.toFixed(6)}
            </ThemedText>
          </View>
          <ThemedText>
            Accuracy: ±{currentLocation.coords.accuracy?.toFixed(0)}m
          </ThemedText>
          <ThemedText className="text-xs opacity-70">
            Updated on:{" "}
            {new Date(currentLocation.timestamp).toLocaleTimeString()}
          </ThemedText>
        </ThemedView>
      );
    }

    if (!permissionAsked) {
      return (
        <ThemedView className="gap-3 mb-6 p-4 rounded-xl bg-white/5 items-center">
          <ThemedText>Would you like to share your location?</ThemedText>
          <TouchableOpacity
            className="bg-blue-600 px-6 py-3 rounded-lg mt-2"
            onPress={requestPermission}
          >
            <ThemedText className="text-white font-semibold text-center">
              Share Location
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      );
    }

    return null;
  };

  const hasActiveEvents = getAllEventStatuses().length > 0;

  return (
    <ScrollView className="flex-1 bg-white pt-24">
      {/* Reset Button */}
      <ThemedView className="gap-3 mb-6 p-4 rounded-xl bg-red-100">
        <TouchableOpacity
          className="bg-red-600 px-4 py-2 rounded-lg self-center"
          onPress={resetAllData}
        >
          <ThemedText className="text-white font-semibold text-center">
            Reset All Data
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView className="flex-col items-center gap-1 px-5">
        <ThemedText type="title">Live Time</ThemedText>
        <Text className="text-center w-full">
          Live time will track the user real-time location information to
          determine if they are at an event.
        </Text>
      </ThemedView>

      <ThemedView className="px-5">
        {/* Points Counter */}
        <PointsCounter points={totalPoints} />

        {renderLocationContent()}

        {renderEventStatuses()}
      </ThemedView>

      {/* Product Carousel - Only show when user has active events */}
      {hasActiveEvents && <ProductCarousel products={products} />}
      <View className="h-24" />
    </ScrollView>
  );
}
