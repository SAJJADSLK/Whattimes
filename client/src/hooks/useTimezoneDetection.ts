import { useState, useEffect } from 'react';

export interface DetectedTimezone {
  name: string;
  offset: number; // UTC offset in minutes
  offsetString: string; // e.g., "UTC+5:30"
  isDST: boolean;
  city?: string;
  country?: string;
}

/**
 * Detects the user's local timezone using the Intl API
 * and provides timezone information
 */
export function useTimezoneDetection() {
  const [timezone, setTimezone] = useState<DetectedTimezone | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectTimezone = () => {
      try {
        // Get timezone name from Intl API
        const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Calculate UTC offset
        const now = new Date();
        const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timeZoneName }));
        const offsetMs = tzDate.getTime() - utcDate.getTime();
        const offsetMinutes = offsetMs / (1000 * 60);

        // Format offset string
        const hours = Math.floor(Math.abs(offsetMinutes) / 60);
        const minutes = Math.abs(offsetMinutes) % 60;
        const sign = offsetMinutes >= 0 ? '+' : '-';
        const offsetString = `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

        // Check if DST is active (compare with standard time)
        const january = new Date(now.getFullYear(), 0, 1);
        const july = new Date(now.getFullYear(), 6, 1);

        const januaryOffset =
          (new Date(january.toLocaleString('en-US', { timeZone: timeZoneName })).getTime() -
            new Date(january.toLocaleString('en-US', { timeZone: 'UTC' })).getTime()) /
          (1000 * 60);

        const julyOffset =
          (new Date(july.toLocaleString('en-US', { timeZone: timeZoneName })).getTime() -
            new Date(july.toLocaleString('en-US', { timeZone: 'UTC' })).getTime()) /
          (1000 * 60);

        const isDST = offsetMinutes > Math.min(januaryOffset, julyOffset);

        // Extract city from timezone name (e.g., "America/New_York" -> "New York")
        const parts = timeZoneName.split('/');
        const city = parts[parts.length - 1]?.replace(/_/g, ' ') || '';

        setTimezone({
          name: timeZoneName,
          offset: offsetMinutes,
          offsetString,
          isDST,
          city,
        });
      } catch (error) {
        console.error('Failed to detect timezone:', error);
        // Fallback to UTC
        setTimezone({
          name: 'UTC',
          offset: 0,
          offsetString: 'UTC+00:00',
          isDST: false,
          city: 'UTC',
        });
      } finally {
        setIsLoading(false);
      }
    };

    detectTimezone();
  }, []);

  return { timezone, isLoading };
}

/**
 * Get the user's timezone from localStorage or detect it
 */
export function useUserTimezone() {
  const [userTimezone, setUserTimezone] = useState<string | null>(null);
  const { timezone, isLoading } = useTimezoneDetection();

  useEffect(() => {
    if (!isLoading && timezone) {
      // Check if user has a saved timezone preference
      try {
        const saved = localStorage.getItem('chronos-user-timezone');
        if (saved) {
          setUserTimezone(saved);
        } else {
          setUserTimezone(timezone.name);
          localStorage.setItem('chronos-user-timezone', timezone.name);
        }
      } catch (error) {
        console.error('Failed to access localStorage:', error);
        setUserTimezone(timezone.name);
      }
    }
  }, [timezone, isLoading]);

  const setTimezonePreference = (tz: string) => {
    try {
      localStorage.setItem('chronos-user-timezone', tz);
      setUserTimezone(tz);
    } catch (error) {
      console.error('Failed to save timezone preference:', error);
    }
  };

  return {
    userTimezone,
    detectedTimezone: timezone,
    isLoading,
    setTimezonePreference,
  };
}
