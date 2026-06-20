import { useRoute } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Users, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useRealTimeClock } from '@/hooks/useRealTimeClock';
import { useTranslation } from 'react-i18next';

export default function InviteDetail() {
  const { t } = useTranslation();
  const [route, params] = useRoute('/invite/:inviteId');
  const [copied, setCopied] = useState(false);
  const { time } = useRealTimeClock();

  if (!route) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t('inviteDetail.notFound')}</h1>
          <p className="text-gray-600 mt-2">{t('inviteDetail.notFoundDesc')}</p>
        </div>
      </div>
    );
  }

  const inviteId = params?.inviteId || '';

  // Mock invite data - in production, this would come from the server
  const invite = {
    id: inviteId,
    title: 'Team Standup Meeting',
    organizer: 'John Doe',
    proposedTime: '14:00 UTC',
    duration: '30 minutes',
    cities: [
      { name: 'New York', timezone: 'America/New_York', localTime: '10:00 AM' },
      { name: 'London', timezone: 'Europe/London', localTime: '03:00 PM' },
      { name: 'Tokyo', timezone: 'Asia/Tokyo', localTime: '11:00 PM' },
      { name: 'Sydney', timezone: 'Australia/Sydney', localTime: '12:00 AM (next day)' },
    ],
    createdAt: new Date().toLocaleDateString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{invite.title}</h1>
          <p className="text-gray-600">{t('inviteDetail.organizedBy')} {invite.organizer}</p>
        </div>

        {/* Main Card */}
        <Card className="mb-6 p-8 shadow-lg">
          <div className="space-y-6">
            {/* Meeting Details */}
            <div className="grid grid-cols-2 gap-6 pb-6 border-b">
              <div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">{t('inviteDetail.proposedTime')}</span>
                </div>
                <p className="text-2xl font-bold text-accent">{invite.proposedTime}</p>
                <p className="text-sm text-gray-500 mt-1">{t('inviteDetail.duration')} {invite.duration}</p>
              </div>

              <div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">{t('inviteDetail.attendees')}</span>
                </div>
                <p className="text-2xl font-bold text-accent">{invite.cities.length}</p>
                <p className="text-sm text-gray-500 mt-1">{t('inviteDetail.timezonesLabel')}</p>
              </div>
            </div>

            {/* Cities and Local Times */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('inviteDetail.localTimes')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {invite.cities.map((city) => (
                  <div key={city.name} className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{city.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{city.timezone}</p>
                      </div>
                      <MapPin className="w-5 h-5 text-accent flex-shrink-0" />
                    </div>
                    <p className="text-2xl font-bold text-accent mt-3">{city.localTime}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">{t('inviteDetail.shareInvite')}</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={window.location.href}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-600"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="default"
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      {t('inviteDetail.copied')}
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      {t('inviteDetail.copyLink')}
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Meta Information */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>{t('inviteDetail.created')} {invite.createdAt}</p>
              <p>{t('inviteDetail.expires')} {invite.expiresAt}</p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="default" className="flex-1">
            {t('inviteDetail.acceptInvite')}
          </Button>
          <Button variant="outline" className="flex-1">
            {t('inviteDetail.suggestAlternative')}
          </Button>
        </div>
      </div>
    </div>
  );
}
