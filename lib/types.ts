import { nanoid } from 'nanoid';

export type GoalType = 'study' | 'work' | 'fitness' | 'exams' | 'business' | 'personal' | 'growth';
export type WorkStyle = 'deep-work' | 'flexible' | 'strict';
export type Priority = 'low' | 'medium' | 'high';

export interface UserProfile {
  name: string;
  goals: GoalType[];
  wakeTime: string; // HH:mm
  sleepTime: string; // HH:mm
  freeHours: number;
  distractions: string[];
  workStyle: WorkStyle;
  isPremium: boolean;
  onboarded: boolean;
}

export interface Task {
  id: string;
  title: string;
  duration: number; // minutes
  priority: Priority;
  startTime?: string; // HH:mm if scheduled
  completed: boolean;
  category: 'work' | 'break' | 'meal' | 'workout' | 'rest' | 'other';
  date: string; // ISO date string
}

export interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  goal: number; // target count per period
  completedDates: string[]; // array of ISO date strings (just YYYY-MM-DD)
  color: string;
  icon: string;
}

export interface FocusSession {
  id: string;
  startTime: string;
  duration: number; // minutes actually completed
  taskId?: string;
  type: 'pomodoro' | 'deep-work' | 'break';
}

export interface AppState {
  profile: UserProfile;
  tasks: Task[];
  habits: Habit[];
  focusSessions: FocusSession[];
  lastUpdate: string;
}

export const initialProfile: UserProfile = {
  name: "User",
  goals: [],
  wakeTime: "07:00",
  sleepTime: "23:00",
  freeHours: 4,
  distractions: [],
  workStyle: 'deep-work',
  isPremium: false,
  onboarded: false,
};
