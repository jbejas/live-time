import { useEffect } from 'react';
import * as Location from 'expo-location';
import { useEventStore } from '@/store/eventStore';
import { useLocationStore } from '@/store/locationStore';
import { isUserAtEvent, calculateTimeSpent } from '@/utils/locationUtils';

export const useEventAttendance = () => {
  const { currentLocation } = useLocationStore();
  const {
    events,
    currentAttendance,
    getActiveEvents,
    getCurrentAttendance,
    updateAttendance,
  } = useEventStore();

  const checkEventAttendance = (location: Location.LocationObject) => {
    const activeEvents = getActiveEvents();
    
    activeEvents.forEach((event) => {
      const { latitude, longitude } = location.coords;
      const isAtEvent = isUserAtEvent(
        latitude,
        longitude,
        event.latitude,
        event.longitude,
        event.radius
      );
      
      const currentAttendanceRecord = getCurrentAttendance(event.id);
      const wasAtEvent = currentAttendanceRecord?.isAtEvent || false;
      
      // User just entered the event
      if (isAtEvent && !wasAtEvent) {
        updateAttendance(event.id, {
          isAtEvent: true,
          enteredAt: new Date(),
          exitedAt: undefined,
        });
      }
      
      // User just left the event
      if (!isAtEvent && wasAtEvent && currentAttendanceRecord?.enteredAt) {
        const timeSpent = calculateTimeSpent(currentAttendanceRecord.enteredAt);
        const totalTime = (currentAttendanceRecord.totalTimeAtEvent || 0) + timeSpent;
        
        updateAttendance(event.id, {
          isAtEvent: false,
          exitedAt: new Date(),
          totalTimeAtEvent: totalTime,
        });
      }
      
      // Update attendance even if status hasn't changed (for lastCheckedAt)
      if (isAtEvent === wasAtEvent) {
        updateAttendance(event.id, {
          isAtEvent,
          lastCheckedAt: new Date(),
        });
      }
    });
  };

  const getEventStatus = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    const attendance = getCurrentAttendance(eventId);
    
    if (!event || !currentLocation) {
      return {
        isAtEvent: false,
        distance: null,
        event: null,
        attendance: null,
      };
    }

    const { latitude, longitude } = currentLocation.coords;
    const distance = isUserAtEvent(
      latitude,
      longitude,
      event.latitude,
      event.longitude,
      event.radius
    );

    return {
      isAtEvent: attendance?.isAtEvent || false,
      distance,
      event,
      attendance,
    };
  };

  const getAllEventStatuses = () => {
    const activeEvents = getActiveEvents();
    return activeEvents.map(event => ({
      ...getEventStatus(event.id),
      event,
    }));
  };

  const getTotalTimeAtEvent = (eventId: string): number => {
    const attendance = getCurrentAttendance(eventId);
    if (!attendance) return 0;
    
    let totalTime = attendance.totalTimeAtEvent || 0;
    
    // If currently at event, add current session time
    if (attendance.isAtEvent && attendance.enteredAt) {
      const currentSessionTime = calculateTimeSpent(attendance.enteredAt);
      totalTime += currentSessionTime;
    }
    
    return totalTime;
  };

  // Check attendance whenever location updates
  useEffect(() => {
    if (currentLocation) {
      checkEventAttendance(currentLocation);
    }
  }, [currentLocation]);

  return {
    checkEventAttendance,
    getEventStatus,
    getAllEventStatuses,
    getTotalTimeAtEvent,
    activeEvents: getActiveEvents(),
    currentAttendance,
  };
};