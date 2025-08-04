import { useState, useRef } from "react";
import {
  TouchableOpacity,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Product } from "@/store/productStore";

interface ProductCarouselProps {
  products: Product[];
}

const { width: screenWidth } = Dimensions.get("window");

export function ProductCarousel({ products }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const navigateToProduct = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(index);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ThemedView style={{ width: screenWidth }} className="px-4">
      <ThemedView className="bg-white rounded-xl border border-gray-100 overflow-hidden mx-2 my-4 p-4">
        <Image
          source={{ uri: item.image }}
          style={{ width: '100%', height: 192 }}
          contentFit="cover"
        />

        <ThemedView className="p-6">
          <ThemedView className="flex-row items-center justify-between mb-3">
            <ThemedText className="text-blue-600 font-bold text-2xl">
              ${item.price}
            </ThemedText>
            <ThemedView className="bg-blue-500 px-3 py-1 rounded-full">
              <ThemedText className="text-white text-sm font-semibold">
                {item.category}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedText
            className="font-bold text-xl mb-3 leading-6"
            numberOfLines={2}
          >
            {item.title}
          </ThemedText>

          <ThemedText
            className="text-gray-600 text-base leading-5 mb-4"
            numberOfLines={3}
          >
            {item.description}
          </ThemedText>
          <TouchableOpacity
            className="flex-1"
            onPress={() => navigateToProduct(item.id)}
          >
            <ThemedView className="bg-gradient-to-r from-blue-600 to-blue-700 py-4 rounded-xl shadow-sm">
              <ThemedText className="text-white text-center font-bold text-lg">
                View Product Details
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  const renderDotIndicators = () => (
    <ThemedView className="flex-row justify-center items-center mt-4 mb-2">
      {products.map((_, index) => (
        <TouchableOpacity
          key={index}
          className={`w-3 h-3 rounded-full mx-1 ${
            index === currentIndex ? "bg-blue-600" : "bg-gray-300"
          }`}
          onPress={() => {
            flatListRef.current?.scrollToIndex({
              index,
              animated: true,
            });
            setCurrentIndex(index);
          }}
        />
      ))}
    </ThemedView>
  );

  if (products.length === 0) {
    return null;
  }

  return (
    <ThemedView className="mb-6">
      <ThemedText type="subtitle" className="mb-4 px-4">
        Featured Products
      </ThemedText>

      <FlatList
        ref={flatListRef}
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={screenWidth}
        snapToAlignment="start"
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
      />

      {products.length > 1 && renderDotIndicators()}
    </ThemedView>
  );
}
