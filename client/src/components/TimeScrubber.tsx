import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TimeScrubberProps {
  value: number; // Time in milliseconds from midnight
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function TimeScrubber({ value, onChange, disabled = false }: TimeScrubberProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const percentage = (value / MS_PER_DAY) * 100;

  const handleMouseDown = () => {
    if (!disabled) setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const newValue = (percentage / 100) * MS_PER_DAY;

      onChange(Math.round(newValue));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onChange]);

  const hours = Math.floor(value / (60 * 60 * 1000));
  const minutes = Math.floor((value % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((value % (60 * 1000)) / 1000);

  const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleIncrement = (ms: number) => {
    onChange((value + ms + MS_PER_DAY) % MS_PER_DAY);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => handleIncrement(-60 * 60 * 1000)}
          disabled={disabled}
          className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          title="Previous hour"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{timeString}</div>
          <div className="text-sm text-gray-600 mt-1">Drag to adjust time</div>
        </div>

        <button
          onClick={() => handleIncrement(60 * 60 * 1000)}
          disabled={disabled}
          className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          title="Next hour"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div
        ref={sliderRef}
        className={`relative h-2 bg-gray-200 rounded-full cursor-pointer ${isDragging ? 'ring-2 ring-blue-400' : ''}`}
        onMouseDown={handleMouseDown}
      >
        {/* Progress bar */}
        <div
          className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />

        {/* Draggable thumb */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-lg transition-all ${
            isDragging ? 'scale-125' : 'hover:scale-110'
          }`}
          style={{ left: `${percentage}%`, transform: 'translate(-50%, -50%)' }}
          onMouseDown={handleMouseDown}
        />
      </div>

      {/* Time markers */}
      <div className="flex justify-between text-xs text-gray-500 px-1">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:59</span>
      </div>
    </div>
  );
}
