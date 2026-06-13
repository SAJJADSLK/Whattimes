import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Search, Globe, ArrowLeft, Star } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useRealTimeClock, formatClockTime } from '@/hooks/useRealTimeClock';

export default function WorldClock() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Fetch regions
  const { data: regions } = trpc.cities.getRegions.useQuery();

  // Search cities via server-side endpoint for speed (like time.is)
  const { data: searchResults, isLoading: searchLoading } = trpc.cities.search.useQuery(
    { query: searchQuery, limit: 20 },
    { enabled: searchQuery.length >= 2 }
  );

  // Fetch cities by region if selected
  const { data: regionCities, isLoading: regionLoading } = trpc.cities.getByRegion.useQuery(
    { region: selectedRegion || '', limit: 50 },
    { enabled: !!selectedRegion }
  );

  // Fetch default cities for initial load
  const { data: defaultCities, isLoading: defaultLoading } = trpc.cities.getAll.useQuery(
    { limit: 100 },
    { enabled: !searchQuery && !selectedRegion }
  );

  const filteredCities = useMemo(() => {
    if (searchQuery.length >= 2) return searchResults || [];
    if (selectedRegion) return regionCities || [];
    return defaultCities || [];
  }, [searchQuery, selectedRegion, searchResults, regionCities, defaultCities]);

  const citiesLoading = searchLoading || regionLoading || defaultLoading;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = '/')}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">World Clock</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Section */}
        <div className="mb-12 space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-slate-900">100+ Cities at a Glance</h1>
            <p className="text-lg text-slate-600">
              View current time across major cities worldwide
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search cities or countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 border-2 border-slate-200 focus:border-blue-600 rounded-lg"
            />
          </div>

          {/* Region Filter */}
          {regions && regions.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Filter by Region</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setSelectedRegion(null)}
                  variant={selectedRegion === null ? 'default' : 'outline'}
                  className={selectedRegion === null ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  All Regions
                </Button>
                {regions.map((region) => (
                  <Button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    variant={selectedRegion === region ? 'default' : 'outline'}
                    className={selectedRegion === region ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    {region}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cities Grid */}
        {citiesLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading cities...</p>
          </div>
        ) : filteredCities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No cities found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CityCard({ city }: { city: any }) {
  const { time } = useRealTimeClock(city.timezone);
  const [isFavorite, setIsFavorite] = useState(false);
  const addFavoriteMutation = trpc.favorites.add.useMutation();
  const removeFavoriteMutation = trpc.favorites.remove.useMutation();

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      removeFavoriteMutation.mutate({ cityId: city.id });
    } else {
      addFavoriteMutation.mutate({ cityId: city.id });
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{city.name}</h3>
          <p className="text-sm text-slate-500">{city.country}</p>
        </div>
        <button
          onClick={handleToggleFavorite}
          className="p-1 hover:bg-yellow-100 rounded transition-colors"
        >
          <Star className={isFavorite ? 'w-5 h-5 fill-yellow-400 text-yellow-400' : 'w-5 h-5 text-slate-400'} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Time Display */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
          <div className="text-3xl font-mono font-bold text-blue-600">
            {time ? formatClockTime(time) : '00:00:00'}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Timezone</span>
            <span className="font-medium text-slate-900">{city.timezone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">UTC Offset</span>
            <span className="font-medium text-slate-900">
              {time ? `UTC${time.offset >= 0 ? '+' : ''}${Math.floor(time.offset / 60)}` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">DST</span>
            <span className={`font-medium ${time?.isDst ? 'text-orange-600' : 'text-slate-900'}`}>
              {time?.isDst ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
