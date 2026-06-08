import { useEffect } from 'react';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  author?: string;
  robots?: string;
}

export function useSEO(metadata: SEOMetadata) {
  useEffect(() => {
    // Set title
    document.title = metadata.title;

    // Helper to set meta tag
    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const setProperty = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Set description
    setMeta('description', metadata.description);

    // Set keywords
    if (metadata.keywords) {
      setMeta('keywords', metadata.keywords.join(', '));
    }

    // Set author
    if (metadata.author) {
      setMeta('author', metadata.author);
    }

    // Set robots
    if (metadata.robots) {
      setMeta('robots', metadata.robots);
    }

    // Set Open Graph tags
    if (metadata.ogTitle) {
      setProperty('og:title', metadata.ogTitle);
    }
    if (metadata.ogDescription) {
      setProperty('og:description', metadata.ogDescription);
    }
    if (metadata.ogImage) {
      setProperty('og:image', metadata.ogImage);
    }
    if (metadata.ogType) {
      setProperty('og:type', metadata.ogType);
    }

    // Set canonical URL
    if (metadata.canonical) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', metadata.canonical);
    }
  }, [metadata]);
}

export function generateCityPageSEO(cityName: string, timezone: string, country: string) {
  return {
    title: `${cityName}, ${country} - Current Time & Timezone | Chronos`,
    description: `Check the current time in ${cityName}, ${country}. Timezone: ${timezone}. Real-time clock, sunrise/sunset times, and DST information.`,
    keywords: [
      `time in ${cityName}`,
      `${cityName} timezone`,
      timezone,
      `current time ${cityName}`,
      `${country} time`,
    ],
    ogTitle: `Current Time in ${cityName}`,
    ogDescription: `Real-time clock for ${cityName}, ${country}. Timezone: ${timezone}`,
    ogType: 'website',
    robots: 'index, follow',
  };
}

export function generateInvitePageSEO(meetingTitle: string) {
  return {
    title: `${meetingTitle} - Meeting Invite | Chronos`,
    description: `Join the meeting: ${meetingTitle}. View local times across all timezones and confirm your attendance.`,
    keywords: ['meeting invite', 'timezone', 'meeting times', meetingTitle],
    ogTitle: `${meetingTitle} - Meeting Invite`,
    ogDescription: `Join the meeting and see local times in your timezone`,
    ogType: 'website',
    robots: 'noindex, follow', // Don't index invite pages
  };
}

export function generateCountdownPageSEO(countdownTitle: string) {
  return {
    title: `${countdownTitle} - Countdown Timer | Chronos`,
    description: `Countdown to ${countdownTitle}. Real-time countdown timer with days, hours, minutes, and seconds.`,
    keywords: ['countdown', 'timer', countdownTitle],
    ogTitle: `${countdownTitle} - Countdown Timer`,
    ogDescription: `Live countdown to ${countdownTitle}`,
    ogType: 'website',
    robots: 'index, follow',
  };
}
