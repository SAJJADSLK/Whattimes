/**
 * SEO Optimization Utilities
 * Handles meta tags, structured data, and SEO best practices
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
}

/**
 * Set page meta tags for SEO
 */
export function setSEOMeta(config: SEOConfig) {
  // Title
  document.title = config.title;
  updateMetaTag('og:title', config.title);
  updateMetaTag('twitter:title', config.title);

  // Description
  updateMetaTag('description', config.description);
  updateMetaTag('og:description', config.description);
  updateMetaTag('twitter:description', config.description);

  // Keywords
  if (config.keywords?.length) {
    updateMetaTag('keywords', config.keywords.join(', '));
  }

  // Image
  if (config.image) {
    updateMetaTag('og:image', config.image);
    updateMetaTag('twitter:image', config.image);
  }

  // URL
  if (config.url) {
    updateMetaTag('og:url', config.url);
    updateMetaTag('canonical', config.url);
  }

  // Type
  if (config.type) {
    updateMetaTag('og:type', config.type);
  }

  // Author
  if (config.author) {
    updateMetaTag('author', config.author);
  }

  // Twitter Card
  updateMetaTag('twitter:card', 'summary_large_image');
}

/**
 * Update or create a meta tag
 */
function updateMetaTag(name: string, content: string) {
  if (name === 'canonical') {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', content);
    return;
  }

  let tag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`) as HTMLMetaElement;

  if (!tag) {
    tag = document.createElement('meta');
    const isProperty = name.startsWith('og:') || name.startsWith('twitter:');
    if (isProperty) {
      tag.setAttribute('property', name);
    } else {
      tag.setAttribute('name', name);
    }
    document.head.appendChild(tag);
  }

  tag.content = content;
}

/**
 * Generate structured data (JSON-LD)
 */
export function setStructuredData(data: Record<string, any>) {
  let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;

  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Chronos',
    url: 'https://whattime.info',
    logo: 'https://whattime.info/logo.png',
    description: 'Premium world clock and timezone management suite',
    sameAs: [
      'https://twitter.com/chronos',
      'https://github.com/chronos',
    ],
  };
}

/**
 * Generate WebApplication schema
 */
export function generateWebApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Chronos',
    url: 'https://whattime.info',
    description: 'Real-time world clock, timezone converter, and meeting scheduler',
    applicationCategory: 'Productivity',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

/**
 * Generate City schema for city detail pages
 */
export function generateCitySchema(city: {
  name: string;
  country: string;
  timezone: string;
  latitude: number;
  longitude: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'City',
    name: city.name,
    areaServed: city.country,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: city.latitude,
      longitude: city.longitude,
    },
    identifier: city.timezone,
  };
}
