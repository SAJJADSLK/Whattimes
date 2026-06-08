import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Star, Clock, Settings, Trash2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useRealTimeClock, formatClockTime } from '@/hooks/useRealTimeClock';

export default function UserDashboard() {
  const { user, loading } = useAuth();
  const { time } = useRealTimeClock();
  const [activeTab, setActiveTab] = useState('favorites');

  // Fetch user data
  const { data: favorites } = trpc.favorites.list.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: preferences } = trpc.preferences.get.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: meetings } = trpc.meetings.list.useQuery(
    { limit: 5 },
    { enabled: !!user }
  );

  const { data: countdowns } = trpc.countdowns.list.useQuery(
    { limit: 5 },
    { enabled: !!user }
  );

  // Mutations
  const removeFavoriteMutation = trpc.favorites.remove.useMutation();
  const deleteCountdownMutation = trpc.countdowns.delete.useMutation();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to access your dashboard</p>
          <Button onClick={() => window.location.href = '/'}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Card */}
        <Card className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h2>
              <p className="text-gray-700">Manage your timezones, meetings, and preferences</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Current Time</p>
              <p className="text-3xl font-bold text-blue-600 font-mono">
                {formatClockTime(time)}
              </p>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="favorites">
              <Star className="w-4 h-4 mr-2" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="meetings">
              <Clock className="w-4 h-4 mr-2" />
              Meetings
            </TabsTrigger>
            <TabsTrigger value="countdowns">
              <Clock className="w-4 h-4 mr-2" />
              Countdowns
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Favorite Cities</h3>
              {favorites && favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((fav) => (
                    <Card key={fav.id} className="p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{fav.city.name}</h4>
                          <p className="text-sm text-gray-600">{fav.city.country}</p>
                        </div>
                        <button
                          onClick={() => removeFavoriteMutation.mutate({ cityId: fav.city.id })}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 font-mono">{fav.city.timezone}</p>
                      <p className="text-xs text-gray-500 mt-2">UTC {fav.city.utcOffsetMinutes > 0 ? '+' : ''}{(fav.city.utcOffsetMinutes / 60).toFixed(1)}</p>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No favorite cities yet. Add some from the World Clock!</p>
              )}
            </Card>
          </TabsContent>

          {/* Meetings Tab */}
          <TabsContent value="meetings">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Meeting Invites</h3>
              {meetings && meetings.length > 0 ? (
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <Card key={meeting.id} className="p-4 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{meeting.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(meeting.meetingTimeUtc).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const url = `${window.location.origin}/invite/${meeting.inviteCode}`;
                            navigator.clipboard.writeText(url);
                            alert('Invite link copied!');
                          }}
                        >
                          Copy Link
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No meeting invites yet. Create one to get started!</p>
              )}
            </Card>
          </TabsContent>

          {/* Countdowns Tab */}
          <TabsContent value="countdowns">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Countdowns</h3>
              {countdowns && countdowns.length > 0 ? (
                <div className="space-y-4">
                  {countdowns.map((countdown) => (
                    <Card key={countdown.id} className="p-4 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{countdown.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{countdown.timezone}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Target: {new Date(countdown.targetTimeUtc).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteCountdownMutation.mutate(countdown.id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No countdowns yet. Create one to get started!</p>
              )}
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Theme
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="auto">Auto (System)</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Default Timezone
                  </label>
                  <input
                    type="text"
                    value={preferences?.defaultTimezone || 'UTC'}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div className="pt-4">
                  <Button variant="default">Save Preferences</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
