# Live Time 📍

A React Native app built with Expo that tracks real-time location information to determine if users are at specific events. Users can discover products, rate them, and earn points based on their event attendance and engagement.

## Features

### 🗺️ Location Tracking
- Real-time GPS location monitoring
- Event proximity detection using radius-based geofencing
- Automatic check-in/check-out tracking
- Time spent at events calculation

### 🎯 Event Management
- Create and manage location-based events
- Demo event creation for testing
- Active event status monitoring
- Event attendance history

### 🛍️ Product Discovery
- Product carousel with featured items
- Product rating system (like/dislike)
- Characteristic-based feedback
- Points-based rewards system

### 📊 User Reviews
- Comprehensive review history
- Visual feedback with thumbs up/down
- Selected characteristics display
- Review timestamps and statistics

### 💎 Points System
- Earn 10 points for any product rating (like or dislike)
- Points counter with visual display
- Persistent point tracking across sessions

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand with persistence
- **Location Services**: Expo Location
- **Storage**: AsyncStorage
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Images**: Expo Image
- **Icons**: Expo Vector Icons

## Project Structure

```
app/
├── (tabs)/
│   ├── index.tsx          # Home screen with location & events
│   ├── explore.tsx        # Reviews screen with user data
│   └── _layout.tsx        # Tab navigation layout
├── product/
│   └── [id].tsx          # Product detail & rating screen
└── _layout.tsx           # Root layout

components/
├── PointsCounter.tsx     # Points display component
├── ProductCarousel.tsx   # Horizontal product scroller
├── ThemedText.tsx        # Styled text component
├── ThemedView.tsx        # Styled view component
└── ui/                   # UI components

store/
├── eventStore.ts         # Event & attendance management
├── productStore.ts       # Product & rating management
└── locationStore.ts      # Location state management

hooks/
├── useLocation.ts        # Location permission & tracking
├── useEventAttendance.ts # Event proximity logic
└── useThemeColor.ts      # Theme management

utils/
└── locationUtils.ts      # Distance & time calculations
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Open the app:
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal
   - **Physical Device**: Scan the QR code with Expo Go app

## Usage

### Location Setup
1. Grant location permissions when prompted
2. The app will start tracking your real-time location
3. Create a demo event to test proximity detection

### Product Rating
1. Navigate to the Home screen when you're at an active event
2. Browse products in the carousel
3. Tap "View Product Details" to rate products
4. Select characteristics (for likes) and rate the product
5. Earn 10 points for each rating

### Review History
1. Go to the "Reviews" tab
2. View all your product ratings and feedback
3. See selected characteristics and review dates
4. Track your total points earned

### Data Management
- Use the "Reset All Data" button to clear all app data
- This will remove events, ratings, points, and location data
- The action cannot be undone

## Key Components

### Location Tracking
- Uses Haversine formula for distance calculations
- Configurable radius-based event detection
- Persistent attendance tracking with entry/exit times

### State Management
- Zustand stores with AsyncStorage persistence
- Automatic state hydration on app launch
- Type-safe store interfaces

### Points System
- Equal points for likes and dislikes (10 points each)
- Prevents duplicate ratings per product
- Visual feedback with point counters

## Development

### Available Scripts
- `npm start` - Start Expo development server
- `npm run reset-project` - Reset to blank project template

### Environment
- Built with Expo SDK
- Compatible with iOS and Android
- Web support through Expo Router

## Privacy & Permissions

The app requires location permissions to function properly:
- **Location Access**: Used for event proximity detection
- **Background Location**: Tracks attendance when app is backgrounded
- All location data is stored locally on device

## Contributing

This project uses TypeScript and follows React Native best practices. Key conventions:
- Functional components with hooks
- Type-safe store management
- Responsive design with NativeWind
- Modular component architecture

## License

This project is part of a React Native development exercise focusing on location-based features and state management.