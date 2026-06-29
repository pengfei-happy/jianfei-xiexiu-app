import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  QIN_HAO_TOTAL_TARGET_LOSS_JIN,
  dabingRecipes,
  getExecutionDay,
  getRecipeByDay,
  getRecipeForExecutionDay,
  getRecipeVisual,
  qinHaoRecipes,
} from '../recipes';

describe('static recipe data and plan lookup', () => {
  it('contains the locked Qin Hao 15 day plan with source weight loss values', () => {
    assert.equal(qinHaoRecipes.length, 15);
    assert.equal(QIN_HAO_TOTAL_TARGET_LOSS_JIN, 11.3);
    assert.equal(qinHaoRecipes.every((recipe) => recipe.sourceLocked), true);
    assert.deepEqual(pick(qinHaoRecipes[0], ['day', 'stageName', 'estimatedWeightLossJin']), {
      day: 1,
      stageName: '纯半液断日',
      estimatedWeightLossJin: 1.6,
    });
    assert.deepEqual(pick(qinHaoRecipes[14], ['day', 'stageName', 'estimatedWeightLossJin']), {
      day: 15,
      stageName: '完美过渡维稳日',
      estimatedWeightLossJin: 0.4,
    });
  });

  it('contains the locked Da Bing 7 day cycle without fabricated numeric loss', () => {
    assert.equal(dabingRecipes.length, 7);
    assert.equal(dabingRecipes.every((recipe) => recipe.sourceLocked), true);
    assert.equal(dabingRecipes.every((recipe) => recipe.estimatedWeightLossJin === undefined), true);
    assert.match(dabingRecipes[0].estimatedWeightLossText ?? '', /稳步减脂/);
  });

  it('reads Qin Hao days directly and cycles Da Bing days after day 7', () => {
    assert.equal(getRecipeByDay('qin_hao_15', 3)?.stageName, '低糖水果日');
    assert.equal(getRecipeForExecutionDay('dabing_7_cycle', 8)?.cycleDay, 1);
    assert.equal(getRecipeForExecutionDay('dabing_7_cycle', 14)?.cycleDay, 7);
  });

  it('calculates execution days by local natural dates', () => {
    assert.equal(getExecutionDay('2026-06-01', '2026-06-01'), 1);
    assert.equal(getExecutionDay('2026-06-01', '2026-06-15'), 15);
    assert.equal(getExecutionDay('2026-06-15', '2026-06-01'), 1);
  });

  it('matches recipe visuals to the day theme', () => {
    assert.equal(getRecipeVisual(getRecipeByDay('qin_hao_15', 1)!).emoji, '🥛');
    assert.equal(getRecipeVisual(getRecipeByDay('qin_hao_15', 2)!).emoji, '🌽');
    assert.equal(getRecipeVisual(getRecipeByDay('qin_hao_15', 3)!).emoji, '🍎');
  });
});

function pick<T extends object, K extends keyof T>(value: T, keys: K[]): Pick<T, K> {
  return keys.reduce((result, key) => ({ ...result, [key]: value[key] }), {} as Pick<T, K>);
}
