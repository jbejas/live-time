import { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity, Alert, View } from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useProductStore } from "@/store/productStore";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<
    string[]
  >([]);
  const [hasRated, setHasRated] = useState(false);

  const { getProduct, characteristics, rateProduct, getProductRating } =
    useProductStore();

  const product = getProduct(id as string);
  const existingRating = getProductRating(id as string);

  useEffect(() => {
    if (existingRating) {
      setHasRated(true);
      setSelectedCharacteristics(existingRating.selectedCharacteristics);
    }
  }, [existingRating]);

  if (!product) {
    return (
      <ThemedView className="flex-1 justify-center items-center p-4">
        <ThemedText type="title">Product Not Found</ThemedText>
        <TouchableOpacity
          className="bg-blue-600 px-6 py-3 rounded-lg mt-4"
          onPress={() => router.back()}
        >
          <ThemedText className="text-white font-semibold">Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const toggleCharacteristic = (characteristicId: string) => {
    if (hasRated) return; // Don't allow changes after rating

    setSelectedCharacteristics((prev) =>
      prev.includes(characteristicId)
        ? prev.filter((id) => id !== characteristicId)
        : [...prev, characteristicId]
    );
  };

  const handleRating = (isLiked: boolean) => {
    if (hasRated) {
      Alert.alert("Already Rated", "You have already rated this product.");
      return;
    }

    if (selectedCharacteristics.length === 0 && isLiked) {
      Alert.alert(
        "Select Characteristics",
        "Please select at least one characteristic before rating the product."
      );
      return;
    }

    rateProduct(product.id, isLiked, selectedCharacteristics);
    setHasRated(true);

    const points = isLiked ? 10 : 5;
    Alert.alert(
      "Rating Submitted!",
      `Thank you for your feedback! You earned ${points} points.`,
      [
        {
          text: "Continue",
          onPress: () => router.back(),
        },
      ]
    );
  };

  const renderCharacteristics = () => (
    <ThemedView className="mb-6">
      <ThemedText type="subtitle" className="mb-4">
        What do you like about this product?
      </ThemedText>
      <ThemedText className="text-sm opacity-70 mb-4">
        Select the characteristics that apply:
      </ThemedText>

      {characteristics.map((characteristic) => {
        const isSelected = selectedCharacteristics.includes(characteristic.id);
        const isDisabled = hasRated;

        return (
          <TouchableOpacity
            key={characteristic.id}
            className={`flex-row items-center p-3 mb-2 rounded-lg border ${
              isSelected
                ? "bg-blue-100 border-blue-500"
                : "bg-gray-50 border-gray-300"
            } ${isDisabled ? "opacity-50" : ""}`}
            onPress={() => toggleCharacteristic(characteristic.id)}
            disabled={isDisabled}
          >
            <View
              className={`w-5 h-5 rounded mr-3 border-2 ${
                isSelected ? "bg-blue-500 border-blue-500" : "border-gray-400"
              } justify-center items-center`}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={12} color="white" />
              )}
            </View>
            <ThemedText className={isSelected ? "font-semibold" : ""}>
              {characteristic.label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </ThemedView>
  );

  const renderRatingButtons = () => {
    if (hasRated) {
      return (
        <ThemedView className="mb-6 p-4 bg-green-50 rounded-xl">
          <ThemedText className="text-green-800 text-center font-semibold">
            ✅ You have already rated this product
          </ThemedText>
          <ThemedText className="text-green-700 text-center mt-1">
            Rating: {existingRating?.isLiked ? "👍 Liked" : "👎 Disliked"}
          </ThemedText>
        </ThemedView>
      );
    }

    return (
      <ThemedView className="flex-row gap-4 mb-6">
        <TouchableOpacity
          className="flex-1 bg-green-600 p-4 rounded-xl flex-row items-center justify-center"
          onPress={() => handleRating(true)}
        >
          <Ionicons name="thumbs-up" size={24} color="white" />
          <ThemedText className="text-white font-semibold ml-2">
            Like (+10 pts)
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-red-600 p-4 rounded-xl flex-row items-center justify-center"
          onPress={() => handleRating(false)}
        >
          <Ionicons name="thumbs-down" size={24} color="white" />
          <ThemedText className="text-white font-semibold ml-2">
            Dislike (+10 pts)
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView className="flex-1 bg-white">
        {/* Header */}
        <ThemedView className="flex-row items-center p-4 pt-24 bg-blue-50">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <ThemedText type="title" className="flex-1">
            Product Details
          </ThemedText>
        </ThemedView>

        <ThemedView className="p-4">
          {/* Product Image */}
          <ThemedView className="mb-6">
            <Image
              source={{ uri: product.image }}
              style={{ width: "100%", height: 256, borderRadius: 12 }}
              contentFit="cover"
            />
          </ThemedView>

          {/* Product Info */}
          <ThemedView className="mb-6">
            <ThemedText type="title" className="mb-2">
              {product.title}
            </ThemedText>

            <ThemedView className="flex-row items-center mb-4">
              <ThemedText className="text-2xl font-bold text-blue-600">
                ${product.price}
              </ThemedText>
              <ThemedView className="bg-blue-100 px-3 py-1 rounded-full ml-4">
                <ThemedText className="text-blue-800 font-semibold text-sm">
                  {product.category}
                </ThemedText>
              </ThemedView>
            </ThemedView>

            <ThemedText className="text-gray-700 leading-6">
              {product.description}
            </ThemedText>
          </ThemedView>

          {/* Characteristics Selection */}
          {renderCharacteristics()}

          {/* Rating Buttons */}
          {renderRatingButtons()}
        </ThemedView>
      </ScrollView>
    </>
  );
}
