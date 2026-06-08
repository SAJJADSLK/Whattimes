import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useRealTimeClock, formatClockTime } from '@/hooks/useRealTimeClock';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, MapPin, Users, Sunrise, Sunset, Compass } from 'lucide-react';
import { DateTime } from 'luxon';

export default function CityDetailPage() {
  const params = useParams();
  const cityName = params.city?.replace(/_/g, ' ') || '';

  // Fetch city data
  const { data: cities } = trpc.cities.getAll.useQuery({ limit: 200 });
  const city = useMemo(() => {
    return cities?.find(c => c.name.toLowerCase() === cityName.toLowerCase());
  }, [cities, cityName]);

  const { time } = useRealTimeClock(city?.timezone || 'UTC');

  // Fetch all cities for comparison table
  const { data: allCities } = trpc.cities.getAll.useQuery({ limit: 200 });

  // Calculate time differences
  const timeDifferences = useMemo(() => {
    if (!city || !allCities) return [];
    
    const cityTime = DateTime.now().setZone(city.timezone);
    
    return allCities
      .filter(c => c.id !== city.id)
      .map(c => {
        const otherTime = DateTime.now().setZone(c.timezone);
        const diffMinutes = otherTime.diff(cityTime, 'minutes').minutes;
        const diffHours = Math.floor(diffMinutes / 60);
        const diffMins = diffMinutes % 60;
        
        return {
          name: c.name,
          country: c.country,
          diffHours,
          diffMins,
          timezone: c.timezone,
        };
      })
      .sort((a, b) => a.diffHours - b.diffHours)
      .slice(0, 20);
  }, [city, allCities]);

  // Calculate sunrise/sunset
  const sunData = useMemo(() => {
    if (!city) return null;
    
    try {
      const now = DateTime.now().setZone(city.timezone);
      // Simplified calculation - in production, use a library like SunCalc
      const sunrise = now.set({ hour: 5, minute: 30 });
      const sunset = now.set({ hour: 20, minute: 0 });
      const dayLength = sunset.diff(sunrise, 'hours').hours;
      
      return {
        sunrise: sunrise.toFormat('hh:mm a'),
        sunset: sunset.toFormat('hh:mm a'),
        dayLength: dayLength.toFixed(1),
      };
    } catch {
      return null;
    }
  }, [city]);

  if (!city) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">City not found</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">
            Time in {city.name}, {city.country}
          </h1>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12 space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-slate-900">{city.name}</h1>
            <p className="text-xl text-slate-600">{city.country}</p>
            <p className="text-sm text-slate-500">{city.timezone}</p>
          </div>

          {/* Large Clock Display */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-white text-center space-y-6">
            <div className="text-7xl font-mono font-bold">
              {time ? formatClockTime(time) : '00:00:00'}
            </div>
            <div className="text-2xl font-semibold">{time?.date || 'Loading...'}</div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Location Info */}
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Location
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">City</span>
                <span className="font-semibold text-slate-900">{city.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Country</span>
                <span className="font-semibold text-slate-900">{city.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Region</span>
                <span className="font-semibold text-slate-900">{city.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Population</span>
                <span className="font-semibold text-slate-900">
                  {city.population ? parseInt(city.population).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          </Card>

          {/* Timezone Info */}
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" />
              Coordinates
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Timezone</span>
                <span className="font-semibold text-slate-900">{city.timezone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Latitude</span>
                <span className="font-semibold text-slate-900">{parseFloat(city.latitude).toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Longitude</span>
                <span className="font-semibold text-slate-900">{parseFloat(city.longitude).toFixed(4)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Time Differences */}
        {timeDifferences.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Time Differences</h2>
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">City</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Country</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Timezone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Difference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {timeDifferences.map((diff, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-3 text-sm text-slate-900">{diff.name}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">{diff.country}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">{diff.timezone}</td>
                      <td className="px-6 py-3 text-sm font-semibold text-slate-900">
                        {diff.diffHours > 0 ? '+' : ''}{diff.diffHours}:{String(Math.abs(diff.diffMins)).padStart(2, '0')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sun Data */}
        {sunData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Sunrise className="w-5 h-5 text-orange-500" />
                Sunrise
              </h3>
              <p className="text-3xl font-bold text-slate-900">{sunData.sunrise}</p>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Sunset className="w-5 h-5 text-orange-500" />
                Sunset
              </h3>
              <p className="text-3xl font-bold text-slate-900">{sunData.sunset}</p>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Sun className="w-5 h-5 text-yellow-500" />
                Day Length
              </h3>
              <p className="text-3xl font-bold text-slate-900">{sunData.dayLength}h</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

import { Sun } from 'lucide-react';
