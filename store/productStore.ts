import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number;
}

export interface ProductCharacteristic {
  id: string;
  name: string;
  label: string;
}

export interface ProductRating {
  productId: string;
  isLiked: boolean; // true for thumbs up, false for thumbs down
  selectedCharacteristics: string[]; // array of characteristic ids
  ratedAt: Date;
}

interface ProductState {
  products: Product[];
  ratings: Record<string, ProductRating>;
  totalPoints: number;
  characteristics: ProductCharacteristic[];
  
  // Product management
  setProducts: (products: Product[]) => void;
  getProduct: (id: string) => Product | null;
  
  // Rating management
  rateProduct: (productId: string, isLiked: boolean, characteristics: string[]) => void;
  getProductRating: (productId: string) => ProductRating | null;
  
  // Points management
  addPoints: (points: number) => void;
  
  // Initialize default data
  initializeData: () => void;
  
  // Reset all data
  resetProducts: () => void;
}

const defaultCharacteristics: ProductCharacteristic[] = [
  { id: 'quality', name: 'quality', label: 'High Quality' },
  { id: 'design', name: 'design', label: 'Great Design' },
  { id: 'value', name: 'value', label: 'Good Value' },
  { id: 'functionality', name: 'functionality', label: 'Highly Functional' },
  { id: 'innovation', name: 'innovation', label: 'Innovative' },
];

// Sample products using JSONPlaceholder and Picsum for images
const sampleProducts: Product[] = [
  {
    id: '1',
    title: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.',
    image: 'https://picsum.photos/400/300?random=1',
    category: 'Electronics',
    price: 299.99,
  },
  {
    id: '2',
    title: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking watch with heart rate monitoring, GPS, and smartphone connectivity. Track your health and stay connected.',
    image: 'https://picsum.photos/400/300?random=2',
    category: 'Wearables',
    price: 199.99,
  },
  {
    id: '3',
    title: 'Portable Coffee Maker',
    description: 'Compact and portable coffee maker for travel and office use. Brew perfect coffee anywhere with this innovative design.',
    image: 'https://picsum.photos/400/300?random=3',
    category: 'Kitchen',
    price: 89.99,
  },
  {
    id: '4',
    title: 'Eco-Friendly Water Bottle',
    description: 'Sustainable water bottle made from recycled materials. Keep your drinks at the perfect temperature while helping the environment.',
    image: 'https://picsum.photos/400/300?random=4',
    category: 'Lifestyle',
    price: 24.99,
  },
  {
    id: '5',
    title: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design that fits perfectly on any desk or nightstand.',
    image: 'https://picsum.photos/400/300?random=5',
    category: 'Electronics',
    price: 49.99,
  },
];

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      ratings: {},
      totalPoints: 0,
      characteristics: defaultCharacteristics,
      
      setProducts: (products) => set({ products }),
      
      getProduct: (id) => {
        const { products } = get();
        return products.find(product => product.id === id) || null;
      },
      
      rateProduct: (productId, isLiked, selectedCharacteristics) => {
        const pointsEarned = 10; // Same points for both likes and dislikes
        
        set((state) => ({
          ratings: {
            ...state.ratings,
            [productId]: {
              productId,
              isLiked,
              selectedCharacteristics,
              ratedAt: new Date(),
            },
          },
          totalPoints: state.totalPoints + pointsEarned,
        }));
      },
      
      getProductRating: (productId) => {
        const { ratings } = get();
        return ratings[productId] || null;
      },
      
      addPoints: (points) => {
        set((state) => ({
          totalPoints: state.totalPoints + points,
        }));
      },
      
      initializeData: () => {
        const { products } = get();
        if (products.length === 0) {
          set({ products: sampleProducts });
        }
      },
      
      resetProducts: () =>
        set({
          products: [],
          ratings: {},
          totalPoints: 0,
        }),
    }),
    {
      name: 'product-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        ratings: state.ratings,
        totalPoints: state.totalPoints,
        products: state.products,
      }),
    }
  )
);