import { useMemo, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Globe, Search, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export default function Countries() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch all cities to extract unique countries
  const { data: cities, isLoading } = trpc.cities.getAll.useQuery({ limit: 500 });

  // Extract unique countries and sort alphabetically
  const countries = useMemo(() => {
    if (!cities) return [];
    
    const countrySet = new Set<string>();
    cities.forEach(city => {
      if (city.country) countrySet.add(city.country);
    });
    
    return Array.from(countrySet).sort();
  }, [cities]);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    return countries.filter(country =>
      country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countries, searchTerm]);

  // Get cities for a country
  const getCitiesForCountry = (country: string) => {
    return cities?.filter(city => city.country === country) || [];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading countries...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Countries & Timezones</h1>
          </div>
          <p className="text-slate-600 mb-6">
            Browse all countries and their timezones. Click on any country to see cities and current times.
          </p>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-2 text-base"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredCountries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No countries found matching "{searchTerm}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCountries.map((country) => {
              const countryCities = getCitiesForCountry(country);
              const timezones = new Set(countryCities.map(c => c.timezone));
              
              return (
                <Link key={country} href={`/country/${encodeURIComponent(country)}`}>
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{country}</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {countryCities.length} {countryCities.length === 1 ? 'city' : 'cities'}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-slate-600 font-semibold">TIMEZONES</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Array.from(timezones).slice(0, 3).map(tz => (
                            <span key={tz} className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                              {tz.split('/')[1] || tz}
                            </span>
                          ))}
                          {timezones.size > 3 && (
                            <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded">
                              +{timezones.size - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-slate-200">
                        <p className="text-xs text-slate-600">
                          {countryCities.length > 0 && (
                            <>
                              <span className="font-semibold">Top cities:</span> {' '}
                              {countryCities.slice(0, 2).map(c => c.name).join(', ')}
                              {countryCities.length > 2 && '...'}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">{countries.length}</p>
              <p className="text-slate-600 mt-2">Countries</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">{cities?.length || 0}</p>
              <p className="text-slate-600 mt-2">Cities</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">
                {new Set(cities?.map(c => c.timezone)).size}
              </p>
              <p className="text-slate-600 mt-2">Timezones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
