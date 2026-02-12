export interface Activity {
  id?: number;
  exercise: string;
  duration: number;
  calories: number;
  intensity: "low" | "moderate" | "high";
  notes?: string;
  date: string;
  timestamp: number;
}

export interface DietEntry {
  id?: number;
  mealType: string;
  mealName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes?: string;
  date: string;
  timestamp: number;
}

export interface Goal {
  id?: number;
  goalType: string;
  goalName: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  createdAt: number;
  status: "active" | "completed" | "failed";
}

export interface WaterLog {
  id?: number;
  amount: number;
  date: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  weight: string;
  feet: string;
}