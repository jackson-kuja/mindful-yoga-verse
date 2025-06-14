
import { useState, useEffect, useCallback } from 'react';

type ProgressData = Record<string, number>;

const getProgressFromStorage = (): ProgressData => {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    const item = window.localStorage.getItem('yoga-progress');
    return item ? JSON.parse(item) : {};
  } catch (error) {
    console.warn('Error reading progress from localStorage', error);
    return {};
  }
};

export const useProgress = () => {
  const [progress, setProgressState] = useState<ProgressData>(getProgressFromStorage);

  useEffect(() => {
    const handleStorageChange = () => {
      setProgressState(getProgressFromStorage());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const setProgress = useCallback((sessionId: string, percent: number) => {
    const currentProgress = getProgressFromStorage();
    const newProgress = { ...currentProgress, [sessionId]: Math.round(percent) };
    try {
      window.localStorage.setItem('yoga-progress', JSON.stringify(newProgress));
      setProgressState(newProgress);
      // Manually dispatch a storage event to sync across components/tabs
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.warn('Error saving progress to localStorage', error);
    }
  }, []);

  const getProgress = useCallback((sessionId: string): number => {
    return progress[sessionId] || 0;
  }, [progress]);

  return { progress, getProgress, setProgress };
};
