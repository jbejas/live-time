import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface EventLocation {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters - how close user needs to be to be considered "at" the event
  isActive: boolean;
  startTime?: Date;
  endTime?: Date;
}

export interface EventAttendance {
  eventId: string;
  userId?: string;
  isAtEvent: boolean;
  lastCheckedAt: Date;
  enteredAt?: Date;
  exitedAt?: Date;
  totalTimeAtEvent: number; // in minutes
}

interface EventState {
  events: EventLocation[];
  currentAttendance: Record<string, EventAttendance>;
  addEvent: (event: Omit<EventLocation, 'id'>) => string;
  updateEvent: (id: string, updates: Partial<EventLocation>) => void;
  removeEvent: (id: string) => void;
  updateAttendance: (eventId: string, attendance: Partial<EventAttendance>) => void;
  getActiveEvents: () => EventLocation[];
  getCurrentAttendance: (eventId: string) => EventAttendance | null;
  resetEvents: () => void;
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: [],
      currentAttendance: {},
      
      addEvent: (event) => {
        const id = Date.now().toString();
        const newEvent: EventLocation = { ...event, id };
        set((state) => ({
          events: [...state.events, newEvent],
        }));
        return id;
      },
      
      updateEvent: (id, updates) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updates } : event
          ),
        })),
      
      removeEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
          currentAttendance: Object.fromEntries(
            Object.entries(state.currentAttendance).filter(([eventId]) => eventId !== id)
          ),
        })),
      
      updateAttendance: (eventId, attendance) =>
        set((state) => ({
          currentAttendance: {
            ...state.currentAttendance,
            [eventId]: {
              ...state.currentAttendance[eventId],
              eventId,
              lastCheckedAt: new Date(),
              totalTimeAtEvent: state.currentAttendance[eventId]?.totalTimeAtEvent || 0,
              isAtEvent: false,
              ...attendance,
            },
          },
        })),
      
      getActiveEvents: () => {
        const { events } = get();
        const now = new Date();
        return events.filter((event) => {
          if (!event.isActive) return false;
          if (event.startTime && now < new Date(event.startTime)) return false;
          if (event.endTime && now > new Date(event.endTime)) return false;
          return true;
        });
      },
      
      getCurrentAttendance: (eventId) => {
        const { currentAttendance } = get();
        return currentAttendance[eventId] || null;
      },
      
      resetEvents: () =>
        set({
          events: [],
          currentAttendance: {},
        }),
    }),
    {
      name: 'event-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        events: state.events,
        currentAttendance: state.currentAttendance,
      }),
    }
  )
);