import { useEffect } from 'react';

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class AnalyticsTracker {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadEvents();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadEvents() {
    try {
      const stored = localStorage.getItem('chronos-analytics-events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load analytics events:', error);
    }
  }

  private saveEvents() {
    try {
      localStorage.setItem('chronos-analytics-events', JSON.stringify(this.events.slice(-100)));
    } catch (error) {
      console.error('Failed to save analytics events:', error);
    }
  }

  track(event: AnalyticsEvent) {
    const enrichedEvent: AnalyticsEvent = {
      ...event,
      timestamp: event.timestamp || Date.now(),
      properties: {
        ...event.properties,
        sessionId: this.sessionId,
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
    };

    this.events.push(enrichedEvent);
    this.saveEvents();

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', enrichedEvent);
    }
  }

  trackPageView(pageName: string) {
    this.track({
      name: 'page_view',
      properties: { page: pageName },
    });
  }

  trackFeatureUsage(feature: string) {
    this.track({
      name: 'feature_usage',
      properties: { feature },
    });
  }

  trackSearch(query: string, resultsCount: number) {
    this.track({
      name: 'search',
      properties: { query, resultsCount },
    });
  }

  trackError(error: string, context?: string) {
    this.track({
      name: 'error',
      properties: { error, context },
    });
  }

  getEvents() {
    return this.events;
  }

  clearEvents() {
    this.events = [];
    localStorage.removeItem('chronos-analytics-events');
  }
}

const tracker = new AnalyticsTracker();

export function useAnalytics() {
  useEffect(() => {
    // Track page view on mount
    tracker.trackPageView(window.location.pathname);
  }, []);

  return {
    track: (event: AnalyticsEvent) => tracker.track(event),
    trackPageView: (pageName: string) => tracker.trackPageView(pageName),
    trackFeatureUsage: (feature: string) => tracker.trackFeatureUsage(feature),
    trackSearch: (query: string, resultsCount: number) =>
      tracker.trackSearch(query, resultsCount),
    trackError: (error: string, context?: string) =>
      tracker.trackError(error, context),
    getEvents: () => tracker.getEvents(),
    clearEvents: () => tracker.clearEvents(),
  };
}

export { tracker };
