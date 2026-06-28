import { createStore } from 'zustand/vanilla';

import { calculateCheckInStatus, calculateCurrentLoss, calculateProgressRatio, calculateStreak } from '../domain/metrics';
import { DABING_WEIGHT_LOSS_TEXT, QIN_HAO_TOTAL_TARGET_LOSS_JIN, getExecutionDay, getRecipeForExecutionDay } from '../domain/recipes';
import { DailyCheckIn, DietCheckIn, ExerciseRecord, FoodViolation, PlanType, RecipeDay, UserSettings, WeightRecord } from '../domain/types';

export interface SlimState {
  userSettings: UserSettings;
  weightRecords: WeightRecord[];
  dietCheckIns: Record<string, DietCheckIn>;
  exerciseRecords: Record<string, ExerciseRecord>;
  dailyCheckIns: Record<string, DailyCheckIn>;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  setCurrentPlan: (planType: PlanType, startDate?: string) => void;
  setInitialWeight: (weight: number) => void;
  setTargetWeight: (weight: number) => void;
  addWeightRecord: (input: { date: string; weightJin: number; note?: string }) => void;
  saveDietCheckIn: (input: { date: string; followedRecipe: boolean; violationFoods: FoodViolation[]; note?: string }) => void;
  updateInclineWalk: (date: string, completed: boolean, minutes: number) => void;
  updateStrength: (date: string, completed: boolean, minutes: number) => void;
  updateExerciseNote: (date: string, note: string) => void;
  resetCheckInsAndWeights: () => void;
  resetAllLocalData: () => void;
  getTodayRecipe: (date?: string) => RecipeDay | undefined;
  getStreak: (date?: string) => number;
  getCurrentLoss: () => number | undefined;
  getPlanProgressRatio: () => number | undefined;
  getCompletionStats: (today?: string) => {
    dietCompletionRate: number;
    exerciseCompletionRate: number;
    totalCheckInRate: number;
  };
}

export function createSlimStore(today = formatLocalDate(new Date())) {
  return createStore<SlimState>((set, get) => ({
    userSettings: defaultUserSettings(today),
    weightRecords: [],
    dietCheckIns: {},
    exerciseRecords: {},
    dailyCheckIns: {},
    selectedDate: today,
    setSelectedDate: (date) => set({ selectedDate: date }),
    setCurrentPlan: (planType, startDate) =>
      set((state) => ({
        userSettings: {
          ...state.userSettings,
          currentPlan: planType,
          planStartDate: startDate ?? state.userSettings.planStartDate,
        },
      })),
    setInitialWeight: (weight) =>
      set((state) => ({
        userSettings: {
          ...state.userSettings,
          weightSettings: { ...state.userSettings.weightSettings, initialWeightJin: weight },
        },
      })),
    setTargetWeight: (weight) =>
      set((state) => ({
        userSettings: {
          ...state.userSettings,
          weightSettings: { ...state.userSettings.weightSettings, targetWeightJin: weight },
        },
      })),
    addWeightRecord: (input) =>
      set((state) => {
        const now = new Date().toISOString();
        const record: WeightRecord = {
          id: `weight-${input.date}-${now}`,
          date: input.date,
          weightJin: input.weightJin,
          note: input.note,
          createdAt: now,
          updatedAt: now,
        };
        return recalculateDate({ ...state, weightRecords: [...state.weightRecords, record] }, input.date);
      }),
    saveDietCheckIn: (input) =>
      set((state) => {
        const executionDay = getExecutionDay(state.userSettings.planStartDate, input.date);
        const recipe = getRecipeForExecutionDay(state.userSettings.currentPlan, executionDay);
        const record: DietCheckIn = {
          date: input.date,
          planType: state.userSettings.currentPlan,
          planDay: executionDay,
          cycleDay: recipe?.cycleDay,
          hasDietRecord: true,
          followedRecipe: input.followedRecipe,
          violationFoods: input.violationFoods,
          note: input.note,
          updatedAt: new Date().toISOString(),
        };
        return recalculateDate({ ...state, dietCheckIns: { ...state.dietCheckIns, [input.date]: record } }, input.date);
      }),
    updateInclineWalk: (date, completed, minutes) =>
      set((state) => recalculateDate(upsertExercise(state, date, { inclineWalkCompleted: completed, inclineWalkMinutes: minutes }), date)),
    updateStrength: (date, completed, minutes) =>
      set((state) => recalculateDate(upsertExercise(state, date, { strengthCompleted: completed, strengthMinutes: minutes }), date)),
    updateExerciseNote: (date, note) => set((state) => recalculateDate(upsertExercise(state, date, { note }), date)),
    resetCheckInsAndWeights: () =>
      set({
        weightRecords: [],
        dietCheckIns: {},
        exerciseRecords: {},
        dailyCheckIns: {},
      }),
    resetAllLocalData: () =>
      set({
        userSettings: defaultUserSettings(today),
        weightRecords: [],
        dietCheckIns: {},
        exerciseRecords: {},
        dailyCheckIns: {},
        selectedDate: today,
      }),
    getTodayRecipe: (date = get().selectedDate) => {
      const state = get();
      const executionDay = getExecutionDay(state.userSettings.planStartDate, date);
      return getRecipeForExecutionDay(state.userSettings.currentPlan, executionDay);
    },
    getStreak: (date = today) => calculateStreak(Object.values(get().dailyCheckIns), date),
    getCurrentLoss: () => calculateCurrentLoss(get().userSettings.weightSettings.initialWeightJin, get().weightRecords),
    getPlanProgressRatio: () => calculateProgressRatio(get().getCurrentLoss(), QIN_HAO_TOTAL_TARGET_LOSS_JIN),
    getCompletionStats: (currentDate = today) => {
      const executionDay = getExecutionDay(get().userSettings.planStartDate, currentDate);
      const denominator = Math.max(executionDay, 1);
      const dietCompleted = Object.values(get().dietCheckIns).filter((record) => record.followedRecipe).length;
      const exerciseCompleted = Object.values(get().exerciseRecords).filter((record) => record.isExerciseComplete).length;
      const successful = Object.values(get().dailyCheckIns).filter((record) => record.isSuccessful).length;
      return {
        dietCompletionRate: dietCompleted / denominator,
        exerciseCompletionRate: exerciseCompleted / denominator,
        totalCheckInRate: successful / denominator,
      };
    },
  }));
}

export const slimStore = createSlimStore();
export const qinHaoTargetLossJin = QIN_HAO_TOTAL_TARGET_LOSS_JIN;
export const dabingWeightLossText = DABING_WEIGHT_LOSS_TEXT;

function defaultUserSettings(today: string): UserSettings {
  return {
    currentPlan: 'qin_hao_15',
    planStartDate: today,
    weightSettings: {},
    dataVersion: 1,
  };
}

function recalculateDate(state: SlimState, date: string): Partial<SlimState> {
  const status = calculateCheckInStatus({
    hasWeightRecord: state.weightRecords.some((record) => record.date === date),
    hasDietRecord: Boolean(state.dietCheckIns[date]?.hasDietRecord),
    hasExerciseRecord: Boolean(state.exerciseRecords[date]?.hasExerciseRecord),
  });
  return {
    ...state,
    dailyCheckIns: {
      ...state.dailyCheckIns,
      [date]: {
        date,
        hasWeightRecord: state.weightRecords.some((record) => record.date === date),
        hasDietRecord: Boolean(state.dietCheckIns[date]?.hasDietRecord),
        hasExerciseRecord: Boolean(state.exerciseRecords[date]?.hasExerciseRecord),
        ...status,
        updatedAt: new Date().toISOString(),
      },
    },
  };
}

function upsertExercise(state: SlimState, date: string, patch: Partial<ExerciseRecord>): SlimState {
  const existing = state.exerciseRecords[date] ?? {
    id: `exercise-${date}`,
    date,
    inclineWalkCompleted: false,
    inclineWalkMinutes: 0,
    strengthCompleted: false,
    strengthMinutes: 0,
    hasExerciseRecord: false,
    isExerciseComplete: false,
    updatedAt: new Date().toISOString(),
  };
  const next = { ...existing, ...patch, updatedAt: new Date().toISOString() };
  next.hasExerciseRecord = next.inclineWalkCompleted || next.strengthCompleted || next.inclineWalkMinutes > 0 || next.strengthMinutes > 0 || Boolean(next.note);
  next.isExerciseComplete = next.inclineWalkCompleted && next.strengthCompleted;
  return {
    ...state,
    exerciseRecords: {
      ...state.exerciseRecords,
      [date]: next,
    },
  };
}

function formatLocalDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
