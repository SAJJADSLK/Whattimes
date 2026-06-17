import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Timer() {
  const { t } = useTranslation();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(60);
  const [sound, setSound] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            if (sound) playNotification();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, sound]);

  const playNotification = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleStart = () => {
    if (totalSeconds > 0) setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTotalSeconds(hours * 3600 + minutes * 60 + seconds);
  };

  const handleSetTime = () => {
    setTotalSeconds(hours * 3600 + minutes * 60 + seconds);
    setIsRunning(false);
  };

  const displayHours = Math.floor(totalSeconds / 3600);
  const displayMinutes = Math.floor((totalSeconds % 3600) / 60);
  const displaySeconds = totalSeconds % 60;

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h1 className="text-5xl font-light">
            <span className="font-semibold text-accent">Timer</span>
          </h1>
          <p className="text-lg text-foreground/70">Set and track time with precision</p>
        </div>

        {/* Timer Display */}
        <div className="relative max-w-md mx-auto mb-12">
          <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg blur-2xl" />
          
          <div className="relative bg-card border border-border rounded-lg p-12 luxury-shadow">
            {/* Art Deco corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent rounded-br-lg" />

            <div className="space-y-8">
              {/* Time Display */}
              <div className="text-center">
                <div className="text-6xl font-mono font-bold tracking-wider text-foreground mb-2">
                  {String(displayHours).padStart(2, '0')}:{String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
                </div>
                <div className="art-deco-divider" />
              </div>

              {/* Input Controls */}
              {!isRunning && totalSeconds === 0 && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground/60 uppercase">Hours</label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={hours}
                      onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-background border border-border rounded px-3 py-2 text-center font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground/60 uppercase">Minutes</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={minutes}
                      onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                      className="w-full bg-background border border-border rounded px-3 py-2 text-center font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground/60 uppercase">Seconds</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={seconds}
                      onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                      className="w-full bg-background border border-border rounded px-3 py-2 text-center font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex gap-3 pt-6 border-t border-border">
                {totalSeconds === 0 && !isRunning ? (
                  <button
                    onClick={handleSetTime}
                    className="flex-1 px-4 py-3 bg-accent text-background rounded-lg hover:bg-accent/90 transition-luxury font-semibold"
                  >
                    Set Timer
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleStart}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent text-background rounded-lg hover:bg-accent/90 transition-luxury"
                    >
                      {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isRunning ? 'Pause' : 'Start'}
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-lg transition-luxury"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSound(!sound)}
                  className="px-4 py-3 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-lg transition-luxury"
                >
                  {sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
