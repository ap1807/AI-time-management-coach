'use client';

import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Task } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });

export const CHRONOS_SYSTEM_PROMPT = `You are "Chronos", a world-class AI Productivity & Time Management Coach.
Your philosophy is based on "Deep Work", "Atomic Habits", and "Intentional Living".
You are direct, encouraging, analytical, and highly organized.
You help users by:
1. Breaking down massive goals into daily actionable steps.
2. Generating optimized daily schedules using time-blocking based on energy levels.
3. Identifying distraction patterns and suggesting anti-procrastination micro-actions.
4. Providing accountability and motivation.

ALWAYS output clear, professional content. When asked for a schedule, think about logical transitions between tasks (e.g., commute, prep time, wind down).`;

export async function generateDailySchedule(profile: UserProfile, pendingTasks: Partial<Task>[]): Promise<Task[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a time-blocking engine. Create an optimized full daily schedule (from wake to sleep) for this user:
      Profile: ${JSON.stringify(profile)}
      Pending Tasks: ${JSON.stringify(pendingTasks)}

      Return a list of tasks including meals, breaks, workouts, and work blocks.
      Ensure the schedule is realistic and follows the user's working style (${profile.workStyle}).`,
      config: {
        systemInstruction: CHRONOS_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              duration: { type: Type.NUMBER, description: "Duration in minutes" },
              priority: { type: Type.STRING, enum: ["low", "medium", "high"] },
              startTime: { type: Type.STRING, description: "HH:mm format" },
              category: { type: Type.STRING, enum: ["work", "break", "meal", "workout", "rest", "other"] }
            },
            required: ["title", "duration", "priority", "startTime", "category"]
          }
        }
      }
    });

    const tasks = JSON.parse(response.text || '[]');
    return tasks.map((t: any) => ({
      ...t,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
      date: new Date().toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error("AI Schedule Generation Error:", error);
    return [];
  }
}

export async function getCoachResponse(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: CHRONOS_SYSTEM_PROMPT,
    }
  });

  // We should ideally pass history, but simplified for now
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [...history.map(h => ({ role: h.role, parts: h.parts })), { role: 'user', parts: [{ text: message }] }],
    config: {
      systemInstruction: CHRONOS_SYSTEM_PROMPT
    }
  });

  return response.text;
}

export async function breakdownGoal(goal: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Break down this big goal into a hierarchy of tasks: "${goal}".
      Output as a structured list of actionable items with estimated durations.`,
      config: {
        systemInstruction: CHRONOS_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              duration: { type: Type.NUMBER },
              priority: { type: Type.STRING, enum: ["low", "medium", "high"] },
              category: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("AI Goal Breakdown Error:", error);
    return [];
  }
}
