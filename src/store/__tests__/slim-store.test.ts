import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createSlimStore } from '../slim-store';

describe('slim app Zustand store', () => {
  it('starts on Qin Hao plan and stores weight settings', () => {
    const store = createSlimStore('2026-06-01');
    assert.equal(store.getState().userSettings.currentPlan, 'qin_hao_15');
    store.getState().setInitialWeight(166);
    store.getState().setTargetWeight(130);
    assert.deepEqual(store.getState().userSettings.weightSettings, {
      initialWeightJin: 166,
      targetWeightJin: 130,
    });
  });

  it('adding a weight record syncs the daily check-in status', () => {
    const store = createSlimStore('2026-06-01');
    store.getState().addWeightRecord({ date: '2026-06-01', weightJin: 166 });
    const daily = store.getState().dailyCheckIns['2026-06-01'];
    assert.equal(daily.hasWeightRecord, true);
    assert.equal(daily.status, 'partial');
    assert.equal(daily.isSuccessful, true);
  });

  it('replaces the same day weight record so the saved value is obvious', () => {
    const store = createSlimStore('2026-06-01');
    store.getState().addWeightRecord({ date: '2026-06-01', weightJin: 166 });
    store.getState().addWeightRecord({ date: '2026-06-01', weightJin: 165.2 });
    assert.equal(store.getState().weightRecords.length, 1);
    assert.equal(store.getState().weightRecords[0]?.weightJin, 165.2);
    assert.equal(store.getState().dailyCheckIns['2026-06-01'].hasWeightRecord, true);
  });

  it('saves diet check-ins without counting unfollowed days as diet completion', () => {
    const store = createSlimStore('2026-06-01');
    store.getState().saveDietCheckIn({
      date: '2026-06-01',
      followedRecipe: false,
      violationFoods: [{ id: 'v1', date: '2026-06-01', foodName: '奶茶' }],
      recipeId: 'qin-hao-1',
    });
    assert.equal(store.getState().dailyCheckIns['2026-06-01'].hasDietRecord, true);
    assert.equal(store.getState().getCompletionStats('2026-06-01').dietCompletionRate, 0);
    assert.equal(store.getState().dietCheckIns['2026-06-01'].recipeId, 'qin-hao-1');
  });

  it('uses the selected diet recipe for the current day recipe display', () => {
    const store = createSlimStore('2026-06-01');
    store.getState().saveDietCheckIn({
      date: '2026-06-01',
      followedRecipe: true,
      violationFoods: [],
      recipeId: 'qin-hao-3',
    });
    assert.equal(store.getState().getTodayRecipe('2026-06-01')?.stageName, '低糖水果日');
  });

  it('marks exercise as recorded when any exercise item is filled and complete only when both are done', () => {
    const store = createSlimStore('2026-06-01');
    store.getState().updateInclineWalk('2026-06-01', true, 60);
    assert.equal(store.getState().exerciseRecords['2026-06-01'].hasExerciseRecord, true);
    assert.equal(store.getState().exerciseRecords['2026-06-01'].isExerciseComplete, false);
    store.getState().updateStrength('2026-06-01', true, 30);
    assert.equal(store.getState().exerciseRecords['2026-06-01'].isExerciseComplete, true);
    assert.equal(store.getState().dailyCheckIns['2026-06-01'].hasExerciseRecord, true);
  });

  it('stores a timed exercise session with minutes rounded up from seconds', () => {
    const store = createSlimStore('2026-06-01');
    store.getState().completeTimedExercise('2026-06-01', 'inclineWalk', 91);
    assert.equal(store.getState().exerciseRecords['2026-06-01'].inclineWalkCompleted, true);
    assert.equal(store.getState().exerciseRecords['2026-06-01'].inclineWalkMinutes, 2);
    assert.equal(store.getState().dailyCheckIns['2026-06-01'].hasExerciseRecord, true);
  });

  it('switches plans without deleting historical records', () => {
    const store = createSlimStore('2026-06-01');
    store.getState().addWeightRecord({ date: '2026-06-01', weightJin: 166 });
    store.getState().setCurrentPlan('dabing_7_cycle', '2026-06-16');
    assert.equal(store.getState().userSettings.currentPlan, 'dabing_7_cycle');
    assert.equal(store.getState().weightRecords.length, 1);
  });

  it('resets tracked local data while preserving static recipes outside storage', () => {
    const store = createSlimStore('2026-06-01');
    store.getState().addWeightRecord({ date: '2026-06-01', weightJin: 166 });
    store.getState().saveDietCheckIn({ date: '2026-06-01', followedRecipe: true, violationFoods: [] });
    store.getState().resetCheckInsAndWeights();
    assert.equal(store.getState().weightRecords.length, 0);
    assert.deepEqual(store.getState().dailyCheckIns, {});
    assert.deepEqual(store.getState().dietCheckIns, {});
  });
});
