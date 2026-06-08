import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Code } from 'lucide-react';

export default function Widget() {
  const [widgetStyle, setWidgetStyle] = useState<'digital' | 'analog'>('digital');
  const [widgetTheme, setWidgetTheme] = useState<'light' | 'dark'>('light');
  const [timezone, setTimezone] = useState('UTC');
  const [copied, setCopied] = useState(false);

  const iframeCode = `<iframe src="https://chronos.example.com/embed?timezone=${timezone}&style=${widgetStyle}&theme=${widgetTheme}" width="300" height="150" frameborder="0" style="border: none; border-radius: 8px;"></iframe>`;

  const scriptCode = `<script src="https://chronos.example.com/widget.js"></script>
<div class="chronos-clock" data-timezone="${timezone}" data-style="${widgetStyle}" data-theme="${widgetTheme}"></div>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              <Code className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">Embed Widget</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">Embeddable Clock Widget</h1>
          <p className="text-lg text-slate-600">
            Add a real-time clock to your website with just a few lines of code
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border-2 border-slate-200 rounded-xl p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 focus:border-blue-600 focus:outline-none"
                >
                  <option>UTC</option>
                  <option>America/New_York</option>
                  <option>Europe/London</option>
                  <option>Asia/Tokyo</option>
                  <option>Australia/Sydney</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Style
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="digital"
                      checked={widgetStyle === 'digital'}
                      onChange={(e) => setWidgetStyle(e.target.value as 'digital' | 'analog')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-700">Digital</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="analog"
                      checked={widgetStyle === 'analog'}
                      onChange={(e) => setWidgetStyle(e.target.value as 'digital' | 'analog')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-700">Analog</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Theme
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="light"
                      checked={widgetTheme === 'light'}
                      onChange={(e) => setWidgetTheme(e.target.value as 'light' | 'dark')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-700">Light</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="dark"
                      checked={widgetTheme === 'dark'}
                      onChange={(e) => setWidgetTheme(e.target.value as 'light' | 'dark')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-700">Dark</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Code & Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview */}
            <div className="bg-white border-2 border-slate-200 rounded-xl p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Preview</h3>
              <div
                className={`flex items-center justify-center p-8 rounded-lg ${
                  widgetTheme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'
                }`}
              >
                <div
                  className={`text-center ${widgetTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}
                >
                  <div className="text-4xl font-mono font-bold mb-2">09:15:42</div>
                  <div className="text-sm opacity-75">{timezone}</div>
                </div>
              </div>
            </div>

            {/* Iframe Method */}
            <div className="bg-white border-2 border-slate-200 rounded-xl p-8 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Method 1: Iframe</h3>
              <p className="text-sm text-slate-600">
                Embed the widget using an iframe tag. Recommended for most websites.
              </p>
              <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <code>{iframeCode}</code>
              </div>
              <Button
                onClick={() => copyToClipboard(iframeCode)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>
            </div>

            {/* Script Method */}
            <div className="bg-white border-2 border-slate-200 rounded-xl p-8 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Method 2: Script Tag</h3>
              <p className="text-sm text-slate-600">
                Embed the widget using a script tag. Automatically initializes all widgets on the page.
              </p>
              <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <code>{scriptCode}</code>
              </div>
              <Button
                onClick={() => copyToClipboard(scriptCode)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>
            </div>

            {/* Features */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 space-y-4">
              <h3 className="text-lg font-semibold text-blue-900">Widget Features</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>Real-time clock synchronization with server</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>Support for any timezone globally</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>Digital and analog clock styles</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>Light and dark theme options</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>Fully responsive and mobile-friendly</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>No dependencies required</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
