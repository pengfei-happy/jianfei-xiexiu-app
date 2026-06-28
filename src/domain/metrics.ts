import { CheckInStatus, DailyCheckIn, WeightRecord } from './types';

export function getLatestWeight(records: WeightRecord[]): WeightRecord | undefined {
  return [...records].sort(compareRecordTime).at(-1);
}

export function getLatestWeightByDate(records: WeightRecord[], date: string): WeightRecord | undefined {
  return records.filter((record) => record.date === date).sort(compareRecordTime).at(-1);
}

export function calculateCurrentLoss(initialWeightJin: number | undefined, records: WeightRecord[]): number | undefined {
  const latest = getLatestWeight(records);
  if (initialWeightJin === undefined || !latest) return undefined;
  return initialWeightJin - latest.weightJin;
}

export function calculateProgressRatio(value: number | undefined, max: number | undefined): number | undefined {
  if (value === undefined || max === undefined || max <= 0) return undefined;
  return value / max;
}

export function calculateDailyWeightChange(records: WeightRecord[], date: string): number | undefined {
  const current = getLatestWeightByDate(records, date);
  if (!current) return undefined;
  const previous = [...records]
    .filter((record) => record.date < date)
    .sort((a, b) => (a.date === b.date ? compareRecordTime(a, b) : a.date.localeCompare(b.date)))
    .at(-1);
  if (!previous) return undefined;
  return current.weightJin - previous.weightJin;
}

export function calculateCheckInStatus(input: Pick<DailyCheckIn, 'hasWeightRecord' | 'hasDietRecord' | 'hasExerciseRecord'>): {
  status: CheckInStatus;
  isSuccessful: boolean;
  isComplete: boolean;
} {
  const isSuccessful = input.hasWeightRecord || input.hasDietRecord || input.hasExerciseRecord;
  const isComplete = input.hasWeightRecord && input.hasDietRecord && input.hasExerciseRecord;
  return {
    status: isComplete ? 'complete' : isSuccessful ? 'partial' : 'none',
    isSuccessful,
    isComplete,
  };
}

export function calculateStreak(records: DailyCheckIn[], today: string): number {
  const successByDate = new Map(records.map((record) => [record.date, record.isSuccessful]));
  let cursor = parseLocalDate(today);
  let streak = 0;
  while (successByDate.get(formatLocalDate(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - 1);
  }
  return streak;
}

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function compareRecordTime(a: WeightRecord, b: WeightRecord): number {
  return new Date(a.updatedAt || a.createdAt).getTime() - new Date(b.updatedAt || b.createdAt).getTime();
}

function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}
