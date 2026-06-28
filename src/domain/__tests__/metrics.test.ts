import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  calculateCheckInStatus,
  calculateCurrentLoss,
  calculateDailyWeightChange,
  calculateProgressRatio,
  calculateStreak,
  getLatestWeight,
  getLatestWeightByDate,
} from '../metrics';
import { DailyCheckIn, WeightRecord } from '../types';

const weights: WeightRecord[] = [
  { id: '1', date: '2026-06-01', weightJin: 166, createdAt: '2026-06-01T08:00:00.000Z', updatedAt: '2026-06-01T08:00:00.000Z' },
  { id: '2', date: '2026-06-02', weightJin: 165.5, createdAt: '2026-06-02T08:00:00.000Z', updatedAt: '2026-06-02T08:00:00.000Z' },
  { id: '3', date: '2026-06-02', weightJin: 165.1, createdAt: '2026-06-02T21:00:00.000Z', updatedAt: '2026-06-02T21:00:00.000Z' },
];

describe('weight and check-in metrics', () => {
  it('uses the latest record overall and the last record of a day', () => {
    assert.equal(getLatestWeight(weights)?.id, '3');
    assert.equal(getLatestWeightByDate(weights, '2026-06-02')?.weightJin, 165.1);
  });

  it('calculates real loss and progress from real weights only', () => {
    assert.equal(round(calculateCurrentLoss(166, weights)), 0.9);
    assert.equal(round(calculateProgressRatio(0.9, 11.3), 4), 0.0796);
  });

  it('calculates daily change against the previous date with a record', () => {
    assert.equal(round(calculateDailyWeightChange(weights, '2026-06-02')), -0.9);
  });

  it('marks partial and complete check-ins according to the three action rules', () => {
    assert.deepEqual(calculateCheckInStatus({ hasWeightRecord: true, hasDietRecord: false, hasExerciseRecord: false }), {
      status: 'partial',
      isSuccessful: true,
      isComplete: false,
    });
    assert.deepEqual(calculateCheckInStatus({ hasWeightRecord: true, hasDietRecord: true, hasExerciseRecord: true }), {
      status: 'complete',
      isSuccessful: true,
      isComplete: true,
    });
  });

  it('recomputes streak from a selected natural day', () => {
    const records: DailyCheckIn[] = [
      makeDaily('2026-06-01', true),
      makeDaily('2026-06-02', false),
      makeDaily('2026-06-03', true),
      makeDaily('2026-06-04', true),
    ];
    assert.equal(calculateStreak(records, '2026-06-04'), 2);
    assert.equal(calculateStreak([...records, makeDaily('2026-06-02', true)], '2026-06-04'), 4);
  });
});

function makeDaily(date: string, success: boolean): DailyCheckIn {
  return {
    date,
    hasWeightRecord: success,
    hasDietRecord: false,
    hasExerciseRecord: false,
    status: success ? 'partial' : 'none',
    isSuccessful: success,
    isComplete: false,
    updatedAt: `${date}T00:00:00.000Z`,
  };
}

function round(value: number | undefined, digits = 1): number | undefined {
  if (value === undefined) return undefined;
  return Number(value.toFixed(digits));
}
