export type PlanType = 'qin_hao_15' | 'dabing_7_cycle';
export type CheckInStatus = 'none' | 'partial' | 'complete';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type RecipePhase = 'rapid_loss' | 'refeed_stabilize' | 'dabing_cycle';

export interface RecipeMeal {
  type: MealType;
  label: string;
  content: string;
  isProvidedBySource: boolean;
}

export interface RecipeDay {
  id: string;
  planType: PlanType;
  day: number;
  cycleDay?: number;
  phase: RecipePhase;
  stageName: string;
  estimatedWeightLossJin?: number;
  estimatedWeightLossText?: string;
  meals: RecipeMeal[];
  coreRule: string;
  warnings?: string[];
  principle?: string;
  sourceLocked: true;
}

export interface WeightRecord {
  id: string;
  date: string;
  weightJin: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeightSettings {
  initialWeightJin?: number;
  targetWeightJin?: number;
}

export interface FoodViolation {
  id: string;
  date: string;
  foodName: string;
  note?: string;
}

export interface DietCheckIn {
  date: string;
  planType: PlanType;
  planDay: number;
  cycleDay?: number;
  hasDietRecord: boolean;
  followedRecipe: boolean;
  violationFoods: FoodViolation[];
  note?: string;
  updatedAt: string;
}

export interface DailyCheckIn {
  date: string;
  hasWeightRecord: boolean;
  hasDietRecord: boolean;
  hasExerciseRecord: boolean;
  status: CheckInStatus;
  isSuccessful: boolean;
  isComplete: boolean;
  updatedAt: string;
}

export interface ExerciseRecord {
  id: string;
  date: string;
  inclineWalkCompleted: boolean;
  inclineWalkMinutes: number;
  strengthCompleted: boolean;
  strengthMinutes: number;
  hasExerciseRecord: boolean;
  isExerciseComplete: boolean;
  caloriesBurnedKcal?: number;
  note?: string;
  updatedAt: string;
}

export interface PlanProgress {
  planType: PlanType;
  startDate: string;
  executionDay: number;
  qinHaoDay?: number;
  dabingCycleDay?: number;
  totalTargetLossJin?: number;
  currentLossJin?: number;
  progressRatio?: number;
}

export interface UserSettings {
  currentPlan: PlanType;
  planStartDate: string;
  weightSettings: WeightSettings;
  dataVersion: number;
}
