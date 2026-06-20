import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Code } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Widget() {
  const { t } = useTranslation();
  const [widgetStyle, setWidgetStyle] = useState<'digital' | 'analog'>('digital');
  const [widgetTheme, setWidgetTheme] = useState<'light' | 'dark'>('light');
  const [timezone, setTimezone] = useState('UTC');
  const [copied, setCopied] = useState(false);

  const iframeCode = `<iframe src="https://www.whattime.info/embed?timezone=${timezone}&style=${widgetStyle}&theme=${widgetTheme}" width="300" height="150" frameborder="0" style="border: none; border-radius: 8px;"></iframe>`;

  const scriptCode = `<script src="https://www.whattime.info/widget.js"></script>
<div class="whattime-clock" data-timezone="${timezone}" data-style="${widgetStyle}" data-theme="${widgetTheme}"></div>`;

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
              {t('common.back')}
            </Button>
            <div className="flex items-center gap-2">
              <Code className="w-6 h-6 text-accent" />
              <span className="text-xl font-bold text-slate-900">{t('widget.title')}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">{t('widget.heading')}</h1>
          <p className="text-lg text-slate-600">
            {t('widget.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border-2 border-slate-200 rounded-xl p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  {t('common.timezone')}
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
                  {t('widget.style')}
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
                    <span className="text-sm text-slate-700">{t('widget.digital')}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="analog"
                      checked={widgetStyle === 'analog'}
                      onChange={(e) => setWidgetStyle(e.target.value as 'digital' | 'analog')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-700">{t('widget.analog')}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  {t('common.theme')}
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
                    <span className="text-sm text-slate-700">{t('common.light')}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="dark"
                      checked={widgetTheme === 'dark'}
                      onChange={(e) => setWidgetTheme(e.target.value as 'light' | 'dark')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-700">{t('common.dark')}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Code & Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview */}
            <div className="bg-white border-2 border-slate-200 rounded-xl p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">{t('widget.preview')}</h3>
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
              <h3 className="text-lg font-semibold text-slate-900">{t('widget.method1')}</h3>
              <p className="text-sm text-slate-600">
                {t('widget.method1Desc')}
              </p>
              <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <code>{iframeCode}</code>
              </div>
              <Button
                onClick={() => copyToClipboard(iframeCode)}
                className="w-full bg-foreground hover:bg-blue-700 text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? t('widget.copied') : t('widget.copyCode')}
              </Button>
            </div>

            {/* Script Method */}
            <div className="bg-white border-2 border-slate-200 rounded-xl p-8 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">{t('widget.method2')}</h3>
              <p className="text-sm text-slate-600">
                {t('widget.method2Desc')}
              </p>
              <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <code>{scriptCode}</code>
              </div>
              <Button
                onClick={() => copyToClipboard(scriptCode)}
                className="w-full bg-foreground hover:bg-blue-700 text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? t('widget.copied') : t('widget.copyCode')}
              </Button>
            </div>

            {/* Features */}
            <div className="bg-slate-50 border-2 border-border rounded-xl p-8 space-y-4">
              <h3 className="text-lg font-semibold text-blue-900">{t('widget.features')}</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>{t('widget.feature1')}</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>{t('widget.feature2')}</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>{t('widget.feature3')}</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>{t('widget.feature4')}</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>{t('widget.feature5')}</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>{t('widget.feature6')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
