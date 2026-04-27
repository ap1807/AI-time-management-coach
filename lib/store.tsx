'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, initialProfile, Task, Habit, FocusSession, UserProfile } from './types';

interface AppContextType {
  state: AppState;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addTask: (task: Omit<Task, 'id' | 'completed' | 'date'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates'>) => void;
  toggleHabit: (id: string, date: string) => void;
  addFocusSession: (session: Omit<FocusSession, 'id'>) => void;
  setTasks: (tasks: Task[]) => void;
  clearAll: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'chronos_ai_state';

const defaultState: AppState = {
  profile: initialProfile,
  tasks: [],
  habits: [],
  focusSessions: [],
  lastUpdate: new Date().toISOString(),
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Use a promise to break the synchronous render cycle
        Promise.resolve().then(() => {
          setState(parsed);
          setIsLoaded(true);
        });
        return;
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
    
    Promise.resolve().then(() => {
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
      lastUpdate: new Date().toISOString(),
    }));
  };

  const addTask = (task: Omit<Task, 'id' | 'completed' | 'date'>) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
      date: new Date().toISOString().split('T')[0],
    };
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
      lastUpdate: new Date().toISOString(),
    }));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
      lastUpdate: new Date().toISOString(),
    }));
  };

  const deleteTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id),
      lastUpdate: new Date().toISOString(),
    }));
  };

  const setTasks = (tasks: Task[]) => {
    setState(prev => ({
      ...prev,
      tasks,
      lastUpdate: new Date().toISOString(),
    }));
  };

  const addHabit = (habit: Omit<Habit, 'id' | 'completedDates'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Math.random().toString(36).substr(2, 9),
      completedDates: [],
    };
    setState(prev => ({
      ...prev,
      habits: [...prev.habits, newHabit],
      lastUpdate: new Date().toISOString(),
    }));
  };

  const toggleHabit = (id: string, date: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => {
        if (h.id === id) {
          const completedDates = h.completedDates.includes(date)
            ? h.completedDates.filter(d => d !== date)
            : [...h.completedDates, date];
          return { ...h, completedDates };
        }
        return h;
      }),
      lastUpdate: new Date().toISOString(),
    }));
  };

  const addFocusSession = (session: Omit<FocusSession, 'id'>) => {
    const newSession: FocusSession = {
      ...session,
      id: Math.random().toString(36).substr(2, 9),
    };
    setState(prev => ({
      ...prev,
      focusSessions: [...prev.focusSessions, newSession],
      lastUpdate: new Date().toISOString(),
    }));
  };

  const clearAll = () => {
    setState(defaultState);
  };

  return (
    <AppContext.Provider value={{
      state,
      updateProfile,
      addTask,
      updateTask,
      deleteTask,
      addHabit,
      toggleHabit,
      addFocusSession,
      setTasks,
      clearAll
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
