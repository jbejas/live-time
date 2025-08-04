# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo React Native application using TypeScript and NativeWind (Tailwind CSS for React Native). The app uses Expo Router for file-based routing with a tab-based navigation structure.

## Development Commands

- `npm install` - Install dependencies
- `npm start` or `npx expo start` - Start the development server
- `npm run android` - Start for Android
- `npm run ios` - Start for iOS  
- `npm run web` - Start for web
- `npm run lint` - Run ESLint
- `npm run reset-project` - Reset to blank project (moves starter code to app-example/)

## Architecture

### Routing Structure
- Uses Expo Router with file-based routing
- Main layout: `app/_layout.tsx` (Stack navigator with ThemeProvider)
- Tab layout: `app/(tabs)/_layout.tsx` (Bottom tabs with Home and Explore screens)
- Screens: `app/(tabs)/index.tsx` (Home), `app/(tabs)/explore.tsx` (Explore)
- 404 page: `app/+not-found.tsx`

### Styling System
- **NativeWind**: Tailwind CSS utility classes for React Native
- **CRITICAL**: ALWAYS use NativeWind className instead of StyleSheet.create()
- **NEVER use StyleSheet**: All styling must use `className` prop with Tailwind classes
- **Themed Components**: Components adapt to light/dark mode automatically
- **Global CSS**: `global.css` contains base Tailwind styles
- **Theme Colors**: Defined in `constants/Colors.ts`
- **Example**: Use `className="flex-row items-center gap-2"` instead of StyleSheet objects

### Component Architecture
- **Themed Components**: `ThemedText`, `ThemedView` automatically adapt to color scheme
- **UI Components**: Platform-specific components in `components/ui/`
- **Custom Hooks**: Color scheme and theme management in `hooks/`
- **Reusable Components**: `Collapsible`, `ParallaxScrollView`, `HapticTab`, etc.

### Key Features
- **Automatic Theme Switching**: Responds to system light/dark mode
- **Haptic Feedback**: Tab interactions include haptic feedback
- **Cross-Platform**: iOS, Android, and web support
- **TypeScript**: Full type safety with strict mode enabled
- **Path Aliases**: `@/*` maps to project root for clean imports

### Configuration Files
- **Expo**: `app.json` - App metadata, splash screen, icons
- **TypeScript**: `tsconfig.json` - Strict mode, path aliases
- **ESLint**: `eslint.config.js` - Expo's recommended ESLint config
- **Tailwind**: `tailwind.config.js` - NativeWind preset, content paths
- **Metro**: `metro.config.js` - Expo's default Metro configuration

### Project Structure Patterns
- Place new screens in `app/` directory following Expo Router conventions
- Reusable components go in `components/`
- UI-specific components go in `components/ui/`
- Custom hooks go in `hooks/`
- Constants and theme definitions go in `constants/`
- Assets (images, fonts) go in `assets/`

### Engineering Principles
**MANDATORY**: Strictly follow these software engineering principles in ALL code:

- **DRY (Don't Repeat Yourself)**: Eliminate code duplication by extracting common functionality into reusable functions, hooks, or components
- **SOLID Principles**:
  - **S**ingle Responsibility: Each function/component should have one clear purpose
  - **O**pen/Closed: Components should be open for extension, closed for modification
  - **L**iskov Substitution: Derived classes should be substitutable for base classes
  - **I**nterface Segregation: Use specific interfaces rather than large general ones
  - **D**ependency Inversion: Depend on abstractions, not concrete implementations
- **KISS (Keep It Simple, Stupid)**: Prefer simple, readable solutions over complex ones
- **Modularity**: Break code into small, focused, independent modules
- **Abstraction**: Hide implementation details behind clean interfaces
- **Encapsulation**: Keep related data and methods together, expose only necessary parts
- **Separation of Concerns**: Separate business logic, UI logic, and data management

### Development Notes
- Uses React 19 and React Native 0.79.5
- New Architecture enabled in Expo config
- Typed routes experiment enabled for better TypeScript support
- Font loading is asynchronous (SpaceMono font included)