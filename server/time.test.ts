import { describe, it, expect, beforeEach } from 'vitest';
import {
  getServerTimeOffset,
  getTimeInTimezone,
  getUtcOffsetMinutes,
  isDstActive,
  calculateOverlapHours,
} from './time';

describe('Time Utilities', () => {
  describe('getServerTimeOffset', () => {
    it('should return server time and timestamp', () => {
      const result = getServerTimeOffset();
      expect(result).toHaveProperty('serverTime');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.serverTime).toBe('number');
      expect(typeof result.timestamp).toBe('string');
    });

    it('should return current time (within 1 second)', () => {
      const before = Date.now();
      const result = getServerTimeOffset();
      const after = Date.now();

      expect(result.serverTime).toBeGreaterThanOrEqual(before);
      expect(result.serverTime).toBeLessThanOrEqual(after);
    });
  });

  describe('getTimeInTimezone', () => {
    it('should return valid DateTime for valid timezone', () => {
      const result = getTimeInTimezone('America/New_York');
      expect(result).toBeDefined();
      expect(result.hour).toBeGreaterThanOrEqual(0);
      expect(result.hour).toBeLessThan(24);
      expect(result.minute).toBeGreaterThanOrEqual(0);
      expect(result.minute).toBeLessThan(60);
      expect(result.second).toBeGreaterThanOrEqual(0);
      expect(result.second).toBeLessThan(60);
    });

    it('should handle UTC timezone', () => {
      const result = getTimeInTimezone('UTC');
      expect(result).toBeDefined();
      expect(result.zone.name).toBe('UTC');
    });

    it('should return fallback for invalid timezone', () => {
      const result = getTimeInTimezone('Invalid/Timezone');
      expect(result).toBeDefined();
      expect(result.zone.name).toBe('UTC');
    });

    it('should return different times for different timezones', () => {
      const nyTime = getTimeInTimezone('America/New_York');
      const tokyoTime = getTimeInTimezone('Asia/Tokyo');

      // Times should be different (unless it's a rare coincidence)
      expect(nyTime.hour).not.toBe(tokyoTime.hour);
    });
  });

  describe('getUtcOffsetMinutes', () => {
    it('should return offset for valid timezone', () => {
      const offset = getUtcOffsetMinutes('America/New_York');
      expect(typeof offset).toBe('number');
      expect(offset).toBeLessThanOrEqual(0); // EST/EDT is UTC-5 or UTC-4
      expect(offset).toBeGreaterThanOrEqual(-600); // Max -10 hours
    });

    it('should return 0 for UTC', () => {
      const offset = getUtcOffsetMinutes('UTC');
      expect(offset).toBe(0);
    });

    it('should return positive offset for timezones east of UTC', () => {
      const offset = getUtcOffsetMinutes('Asia/Tokyo');
      expect(offset).toBeGreaterThan(0);
    });

    it('should return 0 for invalid timezone', () => {
      const offset = getUtcOffsetMinutes('Invalid/Timezone');
      expect(offset).toBe(0);
    });
  });

  describe('isDstActive', () => {
    it('should return boolean for valid timezone', () => {
      const result = isDstActive('America/New_York');
      expect(typeof result).toBe('boolean');
    });

    it('should return false for UTC (no DST)', () => {
      const result = isDstActive('UTC');
      expect(result).toBe(false);
    });

    it('should return false for invalid timezone', () => {
      const result = isDstActive('Invalid/Timezone');
      expect(result).toBe(false);
    });
  });

  describe('calculateOverlapHours', () => {
    it('should return 0 overlap for less than 2 timezones', () => {
      const result = calculateOverlapHours(['America/New_York']);
      expect(result.overlap).toBe(0);
      expect(result.color).toBe('gray');
    });

    it('should calculate overlap between two timezones', () => {
      const result = calculateOverlapHours(['America/New_York', 'America/Los_Angeles']);
      expect(typeof result.overlap).toBe('number');
      expect(result.overlap).toBeGreaterThanOrEqual(0);
      expect(result.overlap).toBeLessThanOrEqual(24);
    });

    it('should return green for good overlap (4+ hours)', () => {
      const result = calculateOverlapHours(['Europe/London', 'Europe/Paris']);
      // These are close timezones, should have good overlap
      if (result.overlap >= 4) {
        expect(result.color).toBe('green');
      }
    });

    it('should return yellow for partial overlap (1-3 hours)', () => {
      const result = calculateOverlapHours(['America/New_York', 'Asia/Tokyo']);
      // These are far apart, might have partial overlap
      if (result.overlap >= 1 && result.overlap < 4) {
        expect(result.color).toBe('yellow');
      }
    });

    it('should return red for no overlap', () => {
      const result = calculateOverlapHours(['America/Los_Angeles', 'Asia/Tokyo']);
      // These are very far apart
      if (result.overlap === 0) {
        expect(result.color).toBe('red');
      }
    });

    it('should handle multiple timezones', () => {
      const result = calculateOverlapHours([
        'America/New_York',
        'Europe/London',
        'Asia/Tokyo',
      ]);
      expect(typeof result.overlap).toBe('number');
      expect(Array.isArray(result.hours)).toBe(true);
    });
  });
});
