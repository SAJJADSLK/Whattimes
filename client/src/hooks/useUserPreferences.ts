import { useState, useEffect } from 'react';

export interface UserPreferences {
  favoritesCities: number[];
  teamCities: number[];
  theme: 'light' | 'dark';
  timeFormat: '12h' | '24h';
  defaultTimezone: string;
  recentSearches: string[];
  lastVisitedPage: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  favoritesCities: [],
  teamCities: [],
  theme: 'light',
  timeFormat: '24h',
  defaultTimezone: 'UTC',
  recentSearches: [],
  lastVisitedPage: '/',
};

const STORAGE_KEY = 'chronos-user-preferences';

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }, [preferences, isLoaded]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  const addFavoriteCity = (cityId: number) => {
    setPreferences((prev) => ({
      ...prev,
      favoritesCities: Array.from(new Set([...prev.favoritesCities, cityId])),
    }));
  };

  const removeFavoriteCity = (cityId: number) => {
    setPreferences((prev) => ({
      ...prev,
      favoritesCities: prev.favoritesCities.filter((id) => id !== cityId),
    }));
  };

  const addTeamCity = (cityId: number) => {
    setPreferences((prev) => ({
      ...prev,
      teamCities: Array.from(new Set([...prev.teamCities, cityId])),
    }));
  };

  const removeTeamCity = (cityId: number) => {
    setPreferences((prev) => ({
      ...prev,
      teamCities: prev.teamCities.filter((id) => id !== cityId),
    }));
  };

  const addRecentSearch = (query: string) => {
    setPreferences((prev) => ({
      ...prev,
      recentSearches: [
        query,
        ...prev.recentSearches.filter((s) => s !== query),
      ].slice(0, 10),
    }));
  };

  const clearRecentSearches = () => {
    setPreferences((prev) => ({
      ...prev,
      recentSearches: [],
    }));
  };

  return {
    preferences,
    updatePreferences,
    addFavoriteCity,
    removeFavoriteCity,
    addTeamCity,
    removeTeamCity,
    addRecentSearch,
    clearRecentSearches,
    isLoaded,
  };
}
