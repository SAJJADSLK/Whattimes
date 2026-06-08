import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, RefreshCw, Trash2 } from 'lucide-react';
import { tracker } from '@/hooks/useAnalytics';

interface AnalyticsData {
  totalEvents: number;
  pageViews: number;
  featureUsage: number;
  errors: number;
  eventsByType: { name: string; value: number }[];
  topPages: { page: string; count: number }[];
  topFeatures: { feature: string; count: number }[];
}

export default function AdminDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalytics = () => {
    setRefreshing(true);
    const events = tracker.getEvents();

    const eventsByType: Record<string, number> = {};
    const pageViews: Record<string, number> = {};
    const features: Record<string, number> = {};
    let errorCount = 0;

    events.forEach((event) => {
      eventsByType[event.name] = (eventsByType[event.name] || 0) + 1;

      if (event.name === 'page_view') {
        const page = event.properties?.page || 'unknown';
        pageViews[page] = (pageViews[page] || 0) + 1;
      }

      if (event.name === 'feature_usage') {
        const feature = event.properties?.feature || 'unknown';
        features[feature] = (features[feature] || 0) + 1;
      }

      if (event.name === 'error') {
        errorCount++;
      }
    });

    const data: AnalyticsData = {
      totalEvents: events.length,
      pageViews: Object.values(pageViews).reduce((a, b) => a + b, 0),
      featureUsage: Object.values(features).reduce((a, b) => a + b, 0),
      errors: errorCount,
      eventsByType: Object.entries(eventsByType).map(([name, value]) => ({
        name,
        value,
      })),
      topPages: Object.entries(pageViews)
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      topFeatures: Object.entries(features)
        .map(([feature, count]) => ({ feature, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
    };

    setAnalyticsData(data);
    setRefreshing(false);
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleExport = () => {
    const events = tracker.getEvents();
    const dataStr = JSON.stringify(events, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chronos-analytics-${Date.now()}.json`;
    link.click();
  };

  const handleClearAnalytics = () => {
    if (confirm('Are you sure you want to clear all analytics data?')) {
      tracker.clearEvents();
      setAnalyticsData(null);
      loadAnalytics();
    }
  };

  const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Real-time user behavior and feature usage tracking</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadAnalytics}
              disabled={refreshing}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              onClick={handleClearAnalytics}
              variant="outline"
              className="gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Events', value: analyticsData.totalEvents },
            { label: 'Page Views', value: analyticsData.pageViews },
            { label: 'Feature Usage', value: analyticsData.featureUsage },
            { label: 'Errors', value: analyticsData.errors },
          ].map((metric) => (
            <Card key={metric.label} className="p-6">
              <div className="text-gray-600 text-sm font-medium mb-2">{metric.label}</div>
              <div className="text-4xl font-bold text-blue-600">{metric.value}</div>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Event Types Pie Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Events by Type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.eventsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.eventsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Features Bar Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Features</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.topFeatures}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feature" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Top Pages */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h2>
          <div className="space-y-3">
            {analyticsData.topPages.map((page) => (
              <div key={page.page} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900 font-medium">{page.page || '/'}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(page.count / Math.max(...analyticsData.topPages.map((p) => p.count))) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-gray-600 font-medium w-12 text-right">{page.count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
