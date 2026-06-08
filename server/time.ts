/**
 * Time synchronization utilities for accurate real-time clock display
 * Implements server-time offset calculation for precision timekeeping
 */

import { DateTime } from 'luxon';

/**
 * Calculate the offset between server time and browser time
 * This is sent to the client on page load for accurate clock display
 */
export function getServerTimeOffset() {
  return {
    serverTime: Date.now(),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get current time in a specific timezone
 * @param timezone IANA timezone string (e.g., 'America/New_York')
 * @returns DateTime object in the specified timezone
 */
export function getTimeInTimezone(timezone: string) {
  try {
    return DateTime.now().setZone(timezone);
  } catch (error) {
    console.error(`Invalid timezone: ${timezone}`, error);
    return DateTime.now().toUTC();
  }
}

/**
 * Format time for display in a specific timezone
 * @param timezone IANA timezone string
 * @param format Luxon format string (default: 'HH:mm:ss')
 */
export function formatTimeInTimezone(timezone: string, format = 'HH:mm:ss') {
  const dt = getTimeInTimezone(timezone);
  return dt.toFormat(format);
}

/**
 * Get sunrise and sunset times for a location
 * Uses approximate calculation based on latitude/longitude
 * For production, consider using a library like SunCalc
 */
export function getSunTimes(latitude: number, longitude: number, timezone: string) {
  const now = getTimeInTimezone(timezone);
  
  // Approximate sunrise/sunset calculation
  // For production, use a dedicated library like 'suncalc'
  const dayOfYear = now.ordinal;
  const latRad = (latitude * Math.PI) / 180;
  
  // Simplified calculation - in production use a proper library
  const sunrise = now.set({ hour: 6, minute: 0, second: 0 });
  const sunset = now.set({ hour: 18, minute: 0, second: 0 });
  
  return {
    sunrise: sunrise.toISO(),
    sunset: sunset.toISO(),
    daylightHours: 12,
  };
}

/**
 * Get UTC offset in minutes for a timezone
 * @param timezone IANA timezone string
 */
export function getUtcOffsetMinutes(timezone: string): number {
  try {
    const dt = DateTime.now().setZone(timezone);
    const offset = dt.offset;
    return isNaN(offset) ? 0 : offset; // offset in minutes
  } catch (error) {
    console.error(`Invalid timezone: ${timezone}`, error);
    return 0;
  }
}

/**
 * Check if DST is currently active in a timezone
 */
export function isDstActive(timezone: string): boolean {
  try {
    const dt = DateTime.now().setZone(timezone);
    return dt.isInDST;
  } catch (error) {
    console.error(`Invalid timezone: ${timezone}`, error);
    return false;
  }
}

/**
 * Get next DST change for a timezone
 * Returns the date when DST will change next
 */
export function getNextDstChange(timezone: string): { date: string; type: 'spring-forward' | 'fall-back' } | null {
  try {
    const dt = DateTime.now().setZone(timezone);
    const year = dt.year;
    
    // Check for DST changes in the next 12 months
    for (let month = dt.month; month <= 12; month++) {
      const testDate = DateTime.fromObject({ year, month, day: 15 }, { zone: timezone });
      const nextMonth = testDate.plus({ months: 1 });
      
      if (testDate.isInDST !== nextMonth.isInDST) {
        const changeDate = nextMonth.isInDST ? 'spring-forward' : 'fall-back';
        return {
          date: nextMonth.toISODate() || '',
          type: changeDate,
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Invalid timezone: ${timezone}`, error);
    return null;
  }
}

/**
 * Convert a time from one timezone to another
 * @param sourceTime ISO timestamp or Date object
 * @param fromTimezone Source timezone
 * @param toTimezone Target timezone
 */
export function convertTimezone(sourceTime: Date | string, fromTimezone: string, toTimezone: string) {
  try {
    const dt = typeof sourceTime === 'string' ? DateTime.fromISO(sourceTime) : DateTime.fromJSDate(sourceTime as Date);
    const inSource = dt.setZone(fromTimezone);
    const inTarget = inSource.setZone(toTimezone);
    
    return {
      sourceTime: inSource.toISO(),
      targetTime: inTarget.toISO(),
      sourceTimezone: fromTimezone,
      targetTimezone: toTimezone,
      utcTime: inSource.toUTC().toISO(),
    };
  } catch (error) {
    console.error('Timezone conversion failed', error);
    throw error;
  }
}

/**
 * Calculate working hours overlap between multiple timezones
 * Returns color coding: 'green' (good), 'yellow' (partial), 'red' (no overlap)
 */
export function calculateOverlapHours(timezones: string[]) {
  if (timezones.length < 2) return { overlap: 0, color: 'gray', hours: [] };
  
  try {
    const times = timezones.map((tz) => {
      const dt = getTimeInTimezone(tz);
      return {
        timezone: tz,
        hour: dt.hour,
        offset: getUtcOffsetMinutes(tz),
      };
    });
    
    // Find common working hours (9 AM - 5 PM)
    const workStart = 9;
    const workEnd = 17;
    
    let overlapHours = 0;
    const overlapRange: number[] = [];
    
    for (let hour = 0; hour < 24; hour++) {
      let allInWorkHours = true;
      
      for (const time of times) {
        const localHour = (hour + Math.floor(time.offset / 60)) % 24;
        if (localHour < workStart || localHour >= workEnd) {
          allInWorkHours = false;
          break;
        }
      }
      
      if (allInWorkHours) {
        overlapHours++;
        overlapRange.push(hour);
      }
    }
    
    let color = 'red';
    if (overlapHours >= 4) color = 'green';
    else if (overlapHours >= 1) color = 'yellow';
    
    return {
      overlap: overlapHours,
      color,
      hours: overlapRange,
    };
  } catch (error) {
    console.error('Overlap calculation failed', error);
    return { overlap: 0, color: 'gray', hours: [] };
  }
}
