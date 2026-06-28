# 本地存储与 Zustand 状态模块任务

目标：实现离线可用的数据管理层，覆盖用户设置、体重、饮食打卡、运动记录和每日打卡汇总。

## 最小任务清单

- [ ] 确认或安装 Zustand 与 AsyncStorage 依赖。
- [ ] 建立统一 AsyncStorage 键名常量。
- [ ] 实现 `userSettings` 状态：当前计划、计划开始日期、初始体重、目标体重、数据版本。
- [ ] 实现 `recipeStore`：当前计划、计划开始日期、今日食谱读取、指定食谱读取。
- [ ] 实现 `weightStore`：初始体重、目标体重、体重记录列表。
- [ ] 实现 `setInitialWeight` 和 `setTargetWeight`。
- [ ] 实现 `addWeightRecord`。
- [ ] 实现 `updateWeightRecord`。
- [ ] 实现 `getLatestWeight`。
- [ ] 实现 `getLatestWeightByDate`，同一天多条记录取最后一条。
- [ ] 实现累计减重计算：初始体重减最新体重。
- [ ] 实现单日体重变化计算：当日体重减上一条有记录日期体重。
- [ ] 实现 `checkInStore`：每日汇总、饮食打卡、违规进食记录。
- [ ] 实现 `saveDietCheckIn`。
- [ ] 实现 `syncWeightStatus(date)`。
- [ ] 实现 `syncExerciseStatus(date)`。
- [ ] 实现 `recalculateDailyStatus(date)`。
- [ ] 实现打卡成功判定：体重、饮食、运动任意一项完成。
- [ ] 实现完整打卡判定：三项全部完成。
- [ ] 实现连续打卡天数倒推统计。
- [ ] 实现补打卡后重新计算连续打卡。
- [ ] 实现饮食完成率统计，仅统计 `followedRecipe = true`。
- [ ] 实现 `exerciseStore`：运动记录列表、默认爬坡目标60分钟、默认力量目标30分钟。
- [ ] 实现 `saveExerciseRecord`。
- [ ] 实现 `updateInclineWalk`。
- [ ] 实现 `updateStrength`。
- [ ] 实现 `updateExerciseNote`。
- [ ] 实现运动记录判定：任意运动项填写或完成即有运动记录。
- [ ] 实现运动完整判定：爬坡完成且力量完成。
- [ ] 实现重置打卡和体重记录动作。
- [ ] 实现重置全部本地数据动作。
- [ ] 预留数据版本迁移入口。
- [ ] 验证 App 重启后本地数据不丢失。

## 验收标准

- [ ] 所有状态模块均可离线读写。
- [ ] 计划切换不删除历史记录。
- [ ] 重置动作不会绕过二次确认入口。
- [ ] 热量相关字段只预留，不自动计算。
- [ ] 补打卡会影响历史记录和连续打卡统计。
