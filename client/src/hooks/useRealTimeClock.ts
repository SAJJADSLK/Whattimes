import { useEffect, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import type { DateTime as LuxonDateTime } from 'luxon';
import { trpc } from '@/lib/trpc';

export interface TimeState {
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  date: string;
  weekNumber: number;
  timezone: string;
  isDst: boolean;
  offset: number;
  dt?: LuxonDateTime;
}

/**
 * Hook for real-time clock with server-time offset synchronization
 * Ensures accurate time display across all browsers
 */
export function useRealTimeClock(timezone: string = 'UTC') {
  const [time, setTime] = useState<TimeState | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const animationFrameRef = useRef<ReturnType<typeof requestAnimationFrame> | undefined>(undefined);
  const lastUpdateRef = useRef<number>(0);

  // Fetch server time offset on mount
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: serverTimeData } = (trpc.time.getOffset.useQuery as any)();

  // Calculate client-server offset
  useEffect(() => {
    if (!serverTimeData?.serverTime) return;

    const clientTime = Date.now();
    const serverTime = serverTimeData.serverTime;
    const calculatedOffset = serverTime - clientTime;

    setOffset(calculatedOffset);
    setIsLoading(false);
  }, [serverTimeData]);

  // Update time on every frame for smooth animation
  useEffect(() => {
    const updateTime = () => {
      const now = Date.now() + offset;
      const dt = DateTime.fromMillis(now).setZone(timezone);

      setTime({
        hour: dt.hour,
        minute: dt.minute,
        second: dt.second,
        millisecond: dt.millisecond,
        date: dt.toFormat('EEEE, d MMMM yyyy'),
        weekNumber: dt.weekNumber,
        timezone,
        isDst: dt.isInDST,
        offset: dt.offset,
        dt,
      });

      lastUpdateRef.current = now;
      animationFrameRef.current = requestAnimationFrame(updateTime);
    };

    if (!isLoading) {
      animationFrameRef.current = requestAnimationFrame(updateTime);
    }

    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [offset, timezone, isLoading]);

  return {
    time,
    isLoading,
  };
}

/**
 * Format time for display (HH:MM:SS)
 */
export function formatClockTime(time: TimeState | null): string {
  if (!time) return '--:--:--';
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}:${String(time.second).padStart(2, '0')}`;
}

/**
 * Format time with milliseconds for high-precision display
 */
export function formatClockTimeWithMs(time: TimeState | null): string {
  if (!time) return '--:--:--.-';
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}:${String(time.second).padStart(2, '0')}.${String(Math.floor(time.millisecond / 100))}`;
}
