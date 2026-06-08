import { useEffect } from 'react';

export interface KeyboardShortcuts {
  [key: string]: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Build the key combination string
      const parts: string[] = [];
      if (event.ctrlKey || event.metaKey) parts.push('ctrl');
      if (event.shiftKey) parts.push('shift');
      if (event.altKey) parts.push('alt');
      parts.push(event.key.toLowerCase());

      const combination = parts.join('+');

      // Execute the shortcut if it exists
      if (shortcuts[combination]) {
        event.preventDefault();
        shortcuts[combination]();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export const CHRONOS_SHORTCUTS = {
  'ctrl+k': 'Open search',
  'ctrl+/': 'Show keyboard shortcuts',
  'ctrl+1': 'Go to home',
  'ctrl+2': 'Go to world clock',
  'ctrl+3': 'Go to converter',
  'ctrl+4': 'Go to team dashboard',
  'ctrl+5': 'Go to countdown',
  'ctrl+shift+d': 'Toggle dark mode',
} as const;
