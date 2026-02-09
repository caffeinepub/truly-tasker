import { useEffect } from 'react';
import { ThemeSettings } from '../state/taskerTypes';

export function useThemeSettings(theme: ThemeSettings | undefined) {
  useEffect(() => {
    if (!theme) return;

    // Apply dark/light mode
    if (theme.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply accent color if set
    if (theme.accentColor) {
      const root = document.documentElement;
      root.style.setProperty('--primary', theme.accentColor);
      root.style.setProperty('--ring', theme.accentColor);
      root.style.setProperty('--sidebar-primary', theme.accentColor);
      root.style.setProperty('--sidebar-ring', theme.accentColor);
    }

    // Apply background image
    if (theme.backgroundType === 'image' || theme.backgroundType === 'url') {
      if (theme.backgroundImage) {
        document.documentElement.style.setProperty('--app-background-image', `url(${theme.backgroundImage})`);
      }
    } else {
      document.documentElement.style.removeProperty('--app-background-image');
    }
  }, [theme]);
}
