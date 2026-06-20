import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Calendar() {
  const { t, i18n } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Derive month/day names from the active language via Intl rather than
  // maintaining parallel translation arrays - more accurate per-locale.
  const monthNames = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) =>
      new Intl.DateTimeFormat(i18n.language, { month: 'long' }).format(new Date(2024, i, 1))
    );
  }, [i18n.language]);

  const dayNames = useMemo(() => {
    // Jan 7, 2024 is a Sunday - use it as the anchor for weekday order.
    return Array.from({ length: 7 }, (_, i) =>
      new Intl.DateTimeFormat(i18n.language, { weekday: 'short' }).format(new Date(2024, 0, 7 + i))
    );
  }, [i18n.language]);

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const today = new Date();
  const isToday = (day: number | null) => {
    return day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();
  };

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h1 className="text-5xl font-light">
            <span className="font-semibold text-accent">{t('calendar.heading')}</span>
          </h1>
          <p className="text-lg text-foreground/70">{t('calendar.subtitle')}</p>
        </div>

        {/* Calendar */}
        <div className="relative max-w-md mx-auto">
          <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg blur-2xl" />
          
          <div className="relative bg-card border border-border rounded-lg p-8 luxury-shadow">
            {/* Art Deco corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent rounded-br-lg" />

            <div className="space-y-6">
              {/* Month/Year Header */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-foreground/10 rounded-lg transition-luxury"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <h2 className="text-2xl font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-foreground/10 rounded-lg transition-luxury"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="art-deco-divider" />

              {/* Day Names */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-foreground/60 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => (
                  <div
                    key={idx}
                    className={`
                      aspect-square flex items-center justify-center rounded-lg text-sm font-medium
                      transition-luxury
                      ${day === null ? 'bg-transparent' : ''}
                      ${isToday(day) ? 'bg-accent text-background font-bold' : ''}
                      ${day !== null && !isToday(day) ? 'bg-foreground/5 hover:bg-foreground/10 cursor-pointer' : ''}
                    `}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Today Info */}
              <div className="pt-6 border-t border-border space-y-2">
                <p className="text-sm text-foreground/60">{t('calendar.today')}</p>
                <p className="text-lg font-semibold">
                  {monthNames[today.getMonth()]} {today.getDate()}, {today.getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
