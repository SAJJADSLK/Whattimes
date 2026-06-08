import { describe, it, expect, beforeEach } from 'vitest';

describe('Timezone Detection', () => {
  describe('Timezone Offset Calculation', () => {
    it('should correctly calculate UTC offset for UTC timezone', () => {
      const now = new Date();
      const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
      const offsetMs = tzDate.getTime() - utcDate.getTime();
      const offsetMinutes = offsetMs / (1000 * 60);
      
      expect(offsetMinutes).toBe(0);
    });

    it('should correctly calculate UTC offset for America/New_York', () => {
      const now = new Date();
      const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const offsetMs = tzDate.getTime() - utcDate.getTime();
      const offsetMinutes = offsetMs / (1000 * 60);
      
      // Should be -300 (EST) or -240 (EDT)
      expect(Math.abs(offsetMinutes)).toBeLessThanOrEqual(300);
      expect(Math.abs(offsetMinutes)).toBeGreaterThanOrEqual(240);
    });

    it('should correctly calculate UTC offset for Asia/Tokyo', () => {
      const now = new Date();
      const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
      const offsetMs = tzDate.getTime() - utcDate.getTime();
      const offsetMinutes = offsetMs / (1000 * 60);
      
      // Should be 540 (JST, no DST)
      expect(offsetMinutes).toBe(540);
    });
  });

  describe('DST Detection', () => {
    it('should detect DST status correctly', () => {
      const now = new Date();
      const timeZoneName = 'America/New_York';
      
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

      // July should have a larger offset (EDT) than January (EST)
      expect(julyOffset).toBeGreaterThan(januaryOffset);
    });

    it('should not detect DST for Asia/Tokyo (no DST)', () => {
      const now = new Date();
      const timeZoneName = 'Asia/Tokyo';
      
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

      // Should be the same (540 minutes)
      expect(januaryOffset).toBe(julyOffset);
    });
  });

  describe('Timezone Name Parsing', () => {
    it('should extract city name from timezone string', () => {
      const timezone = 'America/New_York';
      const parts = timezone.split('/');
      const city = parts[parts.length - 1]?.replace(/_/g, ' ') || '';
      
      expect(city).toBe('New York');
    });

    it('should extract city name from Asia/Tokyo', () => {
      const timezone = 'Asia/Tokyo';
      const parts = timezone.split('/');
      const city = parts[parts.length - 1]?.replace(/_/g, ' ') || '';
      
      expect(city).toBe('Tokyo');
    });

    it('should handle UTC timezone', () => {
      const timezone = 'UTC';
      const parts = timezone.split('/');
      const city = parts[parts.length - 1]?.replace(/_/g, ' ') || '';
      
      expect(city).toBe('UTC');
    });
  });

  describe('Offset String Formatting', () => {
    it('should format positive offset correctly', () => {
      const offsetMinutes = 330; // +5:30
      const hours = Math.floor(Math.abs(offsetMinutes) / 60);
      const minutes = Math.abs(offsetMinutes) % 60;
      const sign = offsetMinutes >= 0 ? '+' : '-';
      const offsetString = `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      
      expect(offsetString).toBe('UTC+05:30');
    });

    it('should format negative offset correctly', () => {
      const offsetMinutes = -300; // -5:00
      const hours = Math.floor(Math.abs(offsetMinutes) / 60);
      const minutes = Math.abs(offsetMinutes) % 60;
      const sign = offsetMinutes >= 0 ? '+' : '-';
      const offsetString = `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      
      expect(offsetString).toBe('UTC-05:00');
    });

    it('should format zero offset correctly', () => {
      const offsetMinutes = 0;
      const hours = Math.floor(Math.abs(offsetMinutes) / 60);
      const minutes = Math.abs(offsetMinutes) % 60;
      const sign = offsetMinutes >= 0 ? '+' : '-';
      const offsetString = `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      
      expect(offsetString).toBe('UTC+00:00');
    });
  });
});
