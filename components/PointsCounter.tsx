import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

interface PointsCounterProps {
  points: number;
}

export function PointsCounter({ points }: PointsCounterProps) {
  return (
    <ThemedView className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-xl mb-6 shadow-sm">
      <ThemedText className="text-white text-center text-sm mt-1 opacity-90">
        Rate products to earn more points!
      </ThemedText>
      <ThemedView className="flex-row items-center justify-center">
        <Ionicons name="star" size={24} color="#ffffff" />
        <ThemedText className="text-white font-bold text-xl ml-2">
          You have {points.toLocaleString()} Points
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
