"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  resetToAutoTheme: () => void;
  forceTimeUpdate: () => void;
  isAutoMode: boolean;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(true);

  const getTimeBasedTheme = (): Theme => {
    const hour = new Date().getHours();
    console.log('Current hour:', hour);
    // Light mode: 6 AM to 6 PM (6-18), Dark mode: 6 PM to 6 AM
    const timeBasedTheme = hour >= 6 && hour < 18 ? "light" : "dark";
    console.log('Time-based theme should be:', timeBasedTheme);
    return timeBasedTheme;
  };

  useEffect(() => {
    // Clean up old theme storage format (one-time migration)
    const oldTheme = localStorage.getItem("theme");
    if (oldTheme && !localStorage.getItem("themeManualTimestamp")) {
      // This is an old stored preference without timestamp, remove it to enable auto mode
      localStorage.removeItem("theme");
      console.log('Removed old theme preference to enable auto mode by default');
    }

    // Always start with time-based theme by default
    const initialTheme = getTimeBasedTheme();
    
    // Check if user has a temporary manual override (expires after 4 hours)
    const stored = localStorage.getItem("theme") as Theme | null;
    const manualTimestamp = localStorage.getItem("themeManualTimestamp");
    
    console.log('Stored theme preference:', stored);
    console.log('Manual timestamp:', manualTimestamp);
    
    if (stored && manualTimestamp) {
      const fourHoursInMs = 4 * 60 * 60 * 1000; // 4 hours
      const timeSinceManual = Date.now() - parseInt(manualTimestamp);
      
      if (timeSinceManual < fourHoursInMs) {
        // Use manual preference if less than 4 hours old
        setTheme(stored);
        setIsAutoMode(false);
        console.log('Using stored manual preference:', stored);
      } else {
        // Manual preference expired, go back to auto
        localStorage.removeItem("theme");
        localStorage.removeItem("themeManualTimestamp");
        setTheme(initialTheme);
        setIsAutoMode(true);
        console.log('Manual preference expired, using auto:', initialTheme);
      }
    } else {
      // No manual preference, use auto mode
      setTheme(initialTheme);
      setIsAutoMode(true);
      console.log('No manual preference, using auto:', initialTheme);
    }
    
    applyTheme(theme);
    setMounted(true);

    // Set up interval to check time every minute and handle auto mode
    const intervalId = setInterval(() => {
      // Check if manual preference has expired
      const stored = localStorage.getItem("theme");
      const manualTimestamp = localStorage.getItem("themeManualTimestamp");
      
      if (stored && manualTimestamp) {
        const fourHoursInMs = 4 * 60 * 60 * 1000;
        const timeSinceManual = Date.now() - parseInt(manualTimestamp);
        
        if (timeSinceManual >= fourHoursInMs) {
          // Manual preference expired, reset to auto
          console.log('Manual preference expired, switching back to auto mode');
          localStorage.removeItem("theme");
          localStorage.removeItem("themeManualTimestamp");
          setIsAutoMode(true);
          const timeBasedTheme = getTimeBasedTheme();
          setTheme(timeBasedTheme);
          applyTheme(timeBasedTheme);
          return;
        }
      }
      
      // If in auto mode, update theme based on time
      if (isAutoMode) {
        const timeBasedTheme = getTimeBasedTheme();
        if (timeBasedTheme !== theme) {
          console.log('Auto mode: updating theme from', theme, 'to', timeBasedTheme);
          setTheme(timeBasedTheme);
          applyTheme(timeBasedTheme);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [theme, isAutoMode]);

  const applyTheme = (newTheme: Theme) => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    // Set temporary manual override (expires in 4 hours)
    localStorage.setItem("theme", newTheme);
    localStorage.setItem("themeManualTimestamp", Date.now().toString());
    setIsAutoMode(false);
    applyTheme(newTheme);
    console.log('Manual theme override set:', newTheme, 'will expire in 4 hours');
  };

  const resetToAutoTheme = () => {
    localStorage.removeItem("theme");
    localStorage.removeItem("themeManualTimestamp");
    setIsAutoMode(true);
    const hour = new Date().getHours();
    const autoTheme: Theme = hour >= 6 && hour < 18 ? "light" : "dark";
    console.log('Resetting to auto theme:', autoTheme, 'at hour:', hour);
    setTheme(autoTheme);
    applyTheme(autoTheme);
  };

  const forceTimeUpdate = () => {
    if (isAutoMode) {
      const hour = new Date().getHours();
      const timeBasedTheme: Theme = hour >= 6 && hour < 18 ? "light" : "dark";
      console.log('Force updating to time-based theme:', timeBasedTheme, 'at hour:', hour);
      setTheme(timeBasedTheme);
      applyTheme(timeBasedTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, resetToAutoTheme, forceTimeUpdate, isAutoMode, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}