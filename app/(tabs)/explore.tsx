import React from "react";
import { ScrollView, View } from "react-native";
import { Image } from 'expo-image';

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PointsCounter } from "@/components/PointsCounter";
import { useProductStore } from "@/store/productStore";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function ReviewsScreen() {
  const { products, ratings, totalPoints, characteristics } = useProductStore();

  const reviewedProducts = Object.entries(ratings)
    .map(([productId, rating]) => {
      const product = products.find((p) => p.id === productId);
      return product ? { product, rating } : null;
    })
    .filter(Boolean) as Array<{ product: any; rating: any }>;

  const renderReviewCard = ({
    product,
    rating,
  }: {
    product: any;
    rating: any;
  }) => {
    const selectedCharacteristicLabels = rating.selectedCharacteristics.map(
      (charId: string) => {
        const characteristic = characteristics.find((c) => c.id === charId);
        return characteristic?.label || charId;
      }
    );

    return (
      <ThemedView key={product.id} className="p-4 mb-4 rounded-xl bg-white/5">
        <View className="flex-row mb-3">
          <Image
            source={{ uri: product.image }}
            style={{ width: 64, height: 64, borderRadius: 8, marginRight: 12 }}
            contentFit="cover"
          />
          <View className="flex-1">
            <ThemedText className="font-semibold text-lg mb-1">
              {product.title}
            </ThemedText>
            <ThemedText className="text-sm opacity-70 mb-2">
              {product.category} • ${product.price}
            </ThemedText>
            <View className="flex-row items-center">
              <IconSymbol
                size={20}
                name={
                  rating.isLiked ? "hand.thumbsup.fill" : "hand.thumbsdown.fill"
                }
                color={rating.isLiked ? "#22c55e" : "#ef4444"}
              />
              <ThemedText
                className={`ml-2 font-medium ${
                  rating.isLiked ? "text-green-600" : "text-red-500"
                }`}
              >
                {rating.isLiked ? "Liked" : "Disliked"}
              </ThemedText>
            </View>
          </View>
        </View>

        {selectedCharacteristicLabels.length > 0 && (
          <View>
            <ThemedText className="text-sm font-medium mb-2">
              Selected characteristics:
            </ThemedText>
            <View className="flex-row flex-wrap gap-2">
              {selectedCharacteristicLabels.map(
                (label: string, index: number) => (
                  <View
                    key={index}
                    className="px-3 py-1 rounded-full bg-blue-100"
                  >
                    <ThemedText className="text-blue-800 text-xs font-medium">
                      {label}
                    </ThemedText>
                  </View>
                )
              )}
            </View>
          </View>
        )}

        <ThemedText className="text-xs opacity-50 mt-3">
          Reviewed on {new Date(rating.ratedAt).toLocaleDateString()}
        </ThemedText>
      </ThemedView>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 pt-24">
        <ThemedView className="px-5 mb-6">
          <ThemedText type="title" className="text-center mb-4">
            Your Reviews
          </ThemedText>

          {/* Points Counter */}
          <PointsCounter points={totalPoints} />
        </ThemedView>

        <ThemedView className="px-5">
          {reviewedProducts.length === 0 ? (
            <ThemedView className="items-center py-8">
              <IconSymbol
                size={64}
                name="star"
                color="#9ca3af"
                style={{ marginBottom: 16 }}
              />
              <ThemedText type="subtitle" className="text-center mb-2">
                No reviews yet
              </ThemedText>
              <ThemedText className="text-center opacity-70">
                Start reviewing products to see them here!
              </ThemedText>
            </ThemedView>
          ) : (
            <>
              <ThemedText type="subtitle" className="mb-4">
                Your Product Reviews ({reviewedProducts.length})
              </ThemedText>

              {reviewedProducts.map(renderReviewCard)}
            </>
          )}
        </ThemedView>
      </ScrollView>
    </View>
  );
}
