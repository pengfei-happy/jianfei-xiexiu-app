# 秦昊减脂打卡助手详细设计

## 0. 强制设计原则

1. 组件原子拆分：页面由多个独立业务卡片组成，页面只负责编排，单文件代码量保持可控。
2. 全部数据定义完整 TS 接口：体重记录、每日打卡、单日食谱、运动记录、计划进度均有明确类型。
3. 内置静态食谱数据严格还原原文：秦昊15天分5天极速减脂期和10天复食巩固期；大冰7天循环保留全套三餐和饮食规则。大冰原文未提供每日掉秤预估，不自行估算。
4. 打卡判定规则：当日完成体重、饮食、运动任意一项，即视为当日打卡成功；自然日断卡后连续打卡天数重置。
5. 热量与减重计算逻辑：当前版本不自动计算热量缺口；预留饮食摄入和运动消耗字段，待后续确认 kcal 数据后再启用。减重进度按 `当前真实减重 / 目标总减重` 计算。

## 1. 全局 UI 规范

### 1.1 视觉风格

整体采用移动端优先的健康记录工具风格，信息密度适中，优先保证食谱内容、打卡状态和体重数据清晰可读。

- 主色调：健康绿色，用于主按钮、选中状态、进度条和成功状态。
- 背景色：浅白或极浅灰，保证长文本阅读舒适。
- 警示色：用于禁忌、违规进食、重置数据和危险操作。
- 成功色：用于已打卡、已完成、连续打卡等正向反馈。
- 弱化色：用于待确认、空状态、历史说明和辅助信息。

### 1.2 尺寸与间距

- 页面水平安全边距：16。
- 页面区块垂直间距：16。
- 卡片内边距：16。
- 卡片之间间距：12。
- 列表项之间间距：8 到 12。
- 底部 Tab 上方内容预留安全区域，避免遮挡最后一个卡片。

### 1.3 圆角与阴影

- 普通卡片圆角：8。
- 输入框、选择器、打卡卡片圆角：8。
- 小标签圆角：6。
- 卡片阴影保持轻量，仅用于区分层级。
- 危险操作区不使用强装饰，依靠颜色和二次确认表达风险。

### 1.4 字号规范

- 页面标题：22，半粗或加粗。
- 区块标题：18，半粗。
- 卡片标题：16，半粗。
- 正文：14 到 16。
- 辅助说明：12 到 13。
- 数据大数字：24 到 32，按空间自适应。
- 长食谱文本默认 14 到 15，必须支持自动换行。

### 1.5 状态规范

每个数据依赖视图都需要覆盖以下状态：

- 首次使用空状态。
- 未填写初始体重或目标体重空状态。
- 无体重记录空状态。
- 无运动记录空状态。
- 无历史打卡记录空状态。
- 待确认字段状态。
- 本地数据重置二次确认状态。

## 2. TypeScript 数据接口定义

以下为设计级接口规范，用于约束后续实现，不在本阶段生成代码。

### 2.1 基础枚举类型

```ts
type PlanType = 'qin_hao_15' | 'dabing_7_cycle';

type CheckInStatus = 'none' | 'partial' | 'complete';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

type RecipePhase =
  | 'rapid_loss'
  | 'refeed_stabilize'
  | 'dabing_cycle';
```

### 2.2 单日食谱接口

```ts
interface RecipeMeal {
  type: MealType;
  label: string;
  content: string;
  isProvidedBySource: boolean;
}

interface RecipeDay {
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
```

设计说明：

- 秦昊15天使用 `day` 表示第1天到第15天。
- 大冰7天使用 `cycleDay` 表示循环第1天到第7天。
- 秦昊计划允许 `estimatedWeightLossJin`。
- 大冰计划不写每日数值，使用 `estimatedWeightLossText` 展示“稳步减脂、维稳塑形”类文案。
- `sourceLocked` 固定为 `true`，提醒后续实现不要提供编辑入口。

### 2.3 体重历史接口

```ts
interface WeightRecord {
  id: string;
  date: string;
  weightJin: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

interface WeightSettings {
  initialWeightJin?: number;
  targetWeightJin?: number;
}
```

设计说明：

- `date` 使用本地自然日字符串，如 `YYYY-MM-DD`。
- 同一天可有多条记录。
- 图表和最新体重默认取同一天最后一次记录。

### 2.4 每日打卡接口

```ts
interface DietCheckIn {
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

interface FoodViolation {
  id: string;
  date: string;
  foodName: string;
  note?: string;
}

interface DailyCheckIn {
  date: string;
  hasWeightRecord: boolean;
  hasDietRecord: boolean;
  hasExerciseRecord: boolean;
  status: CheckInStatus;
  isSuccessful: boolean;
  isComplete: boolean;
  updatedAt: string;
}
```

设计说明：

- `hasDietRecord = true` 表示用户填写了饮食记录。
- `followedRecipe = false` 时，当天仍算饮食记录已填写，但不计入饮食完成率。
- `isSuccessful = hasWeightRecord || hasDietRecord || hasExerciseRecord`。
- `isComplete = hasWeightRecord && hasDietRecord && hasExerciseRecord`。

### 2.5 运动记录接口

```ts
interface ExerciseRecord {
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
```

设计说明：

- 默认目标：爬坡快走 60 分钟，力量训练 30 分钟。
- 任意一项填写或完成，即 `hasExerciseRecord = true`，可触发当日 partial 打卡。
- 只有爬坡快走完成且力量训练完成，才 `isExerciseComplete = true`。
- `caloriesBurnedKcal` 当前版本预留，不自动估算。

### 2.6 计划进度接口

```ts
interface PlanProgress {
  planType: PlanType;
  startDate: string;
  executionDay: number;
  qinHaoDay?: number;
  dabingCycleDay?: number;
  totalTargetLossJin?: number;
  currentLossJin?: number;
  progressRatio?: number;
}

interface UserSettings {
  currentPlan: PlanType;
  planStartDate: string;
  weightSettings: WeightSettings;
  dataVersion: number;
}
```

设计说明：

- 秦昊15天总目标固定为 11.3 斤。
- 当前真实减重 = 初始体重 - 最新体重。
- 进度 = 当前真实减重 / 目标总减重。
- 未填写初始体重或无体重记录时展示空状态。

## 3. 五大页面组件拆分清单

### 3.1 首页

页面定位：每日执行入口。

组件拆分：

- `TodayPlanHeaderCard`：当前计划、日期、计划日、今日预估掉秤。
- `TodayCheckInSummaryCard`：体重、饮食、运动三项打卡状态。
- `StreakCard`：连续打卡天数和当日完成状态。
- `TodayRecipePreviewCard`：今日早餐、午餐、晚餐、加餐、核心规则。
- `WeightProgressCard`：真实累计减重与秦昊 11.3 斤目标进度。
- `BottomTabNavigator`：底部五大页面导航。

### 3.2 食谱计划

页面定位：完整查看秦昊15天与大冰7天循环食谱。

组件拆分：

- `PlanSegmentTabs`：秦昊15天 / 大冰7天循环切换。
- `RecipeDayList`：食谱天数列表。
- `RecipeAccordionItem`：单日展开容器。
- `RecipeDetailCard`：完整三餐、规则、禁忌、预估掉秤。
- `DietCheckInPanel`：是否按食谱完成、违规进食入口。

### 3.3 数据看板

页面定位：体重、打卡、趋势和历史数据总览。

组件拆分：

- `DashboardMetricGrid`：今日饮食状态、运动状态、连续打卡、累计减重、计划完成率。
- `WeightTrendSection`：周/月切换和折线图。
- `CompletionProgressSection`：饮食完成率、运动完成率、总打卡完成率。
- `WeightHistoryList`：历史每日体重变化。
- `DailyHistoryList`：历史打卡记录清单。

### 3.4 运动记录

页面定位：记录每日固定运动和查看运动历史。

组件拆分：

- `ExerciseDateHeader`：当前记录日期。
- `ExerciseCheckCard`：爬坡快走完成状态和时长。
- `ExerciseCheckCard`：力量训练完成状态和时长。
- `ExerciseNoteCard`：当日运动备注。
- `ExerciseTipsCard`：爬坡和力量训练注意事项。
- `ExerciseHistoryList`：运动历史。

### 3.5 个人中心

页面定位：用户设置、计划切换、须知和本地数据管理。

组件拆分：

- `WeightSettingsCard`：初始体重、目标体重设置。
- `PlanSwitchCard`：当前计划和手动切换入口。
- `NoticeCard`：减脂须知、称重标准、饮食禁忌。
- `HistoryEntryCard`：历史打卡记录查看入口。
- `DangerZoneCard`：重置打卡和体重记录、重置全部本地数据。
- `ConfirmResetDialog`：重置二次确认。

## 4. 公共组件详细设计

### 4.1 DataCard

入参：

- `title`：卡片标题。
- `subtitle`：辅助说明。
- `value`：核心值。
- `status`：默认、成功、警示、待确认。
- `children`：自定义内容。

渲染逻辑：

- 标题置顶，核心值突出显示。
- 待确认状态使用弱化色和说明文案。
- 警示状态用于违规进食、禁忌、重置等内容。

交互说明：

- 默认不可点击。
- 如传入点击回调，可作为设置入口或历史入口。

### 4.2 ProgressBar

入参：

- `value`：当前值。
- `max`：目标值。
- `label`：展示标题。
- `description`：辅助文案。

渲染逻辑：

- 百分比 = `value / max`。
- 小于 0 时按 0 展示。
- 大于 100% 时视觉可满格，但文字展示真实比例。
- 缺少值时展示空状态。

交互说明：

- 仅展示，不承载业务修改。

### 4.3 DatePicker

入参：

- `selectedDate`：当前日期。
- `minDate`：可选最小日期。
- `maxDate`：可选最大日期。
- `onChange`：日期变化回调。

渲染逻辑：

- 默认展示本地自然日。
- 补打卡场景允许选择历史日期。
- 未来日期默认不允许打卡。

交互说明：

- 切换日期后页面重新读取对应打卡、体重、运动和食谱数据。

### 4.4 CheckInCard

入参：

- `title`：打卡项名称。
- `description`：说明。
- `checked`：是否完成。
- `partial`：是否部分完成。
- `disabled`：是否禁用。
- `onToggle`：切换回调。

渲染逻辑：

- 完成状态显示绿色勾选。
- 部分完成状态显示中间态。
- 未完成显示空状态。

交互说明：

- 首页用于体重、饮食、运动三类打卡入口。
- 运动页用于爬坡快走、力量训练双项打卡。

### 4.5 LineChart

入参：

- `data`：图表点位数组。
- `range`：`week` 或 `month`。
- `unit`：斤。
- `emptyText`：空状态文案。

渲染逻辑：

- 周视图展示最近7天。
- 月视图展示最近30天。
- 缺失日期保持日期轴连续，点位可为空或断线展示。
- 同一天多次体重记录取最后一次。

交互说明：

- 支持周/月切换。
- 当前版本不要求复杂缩放。

### 4.6 BottomTabNavigator

入参：

- 五大页面路由配置。
- 当前选中路由。

渲染逻辑：

- 固定底部。
- 展示首页、食谱计划、数据看板、运动记录、我的。
- 选中态使用主色绿色。

交互说明：

- 点击切换主页面，不清空页面内业务数据。

### 4.7 RecipeDetailCard

入参：

- `recipe`：单日食谱。
- `expanded`：是否展开。
- `showCheckIn`：是否展示饮食打卡入口。

渲染逻辑：

- 按早餐、午餐、晚餐、加餐分组展示。
- 加餐仅在原文提供时展示。
- 秦昊计划展示数值型当日预计掉秤。
- 大冰计划展示固定文案，不展示自造数字。
- 禁忌、注意事项使用警示样式。

交互说明：

- 食谱计划页一次只展开一个天数。
- 首页可展示今日简化但不摘要改写的完整餐单。

## 5. Zustand 四大状态模块详细设计

### 5.1 recipeStore：食谱静态数据与计划读取

状态：

- `currentPlan`。
- `planStartDate`。
- `qinHaoRecipes`。
- `dabingRecipes`。

动作：

- `setCurrentPlan(planType)`：切换当前计划。
- `setPlanStartDate(date)`：设置计划开始日期。
- `getExecutionDay(date)`：计算执行第几天。
- `getTodayRecipe(date)`：读取今日食谱。
- `getRecipeByDay(planType, day)`：读取指定食谱。

派生逻辑：

- 秦昊计划执行天数超过15天时，提示用户切换大冰计划，不强制切换。
- 大冰循环日 = `((执行天数 - 1) % 7) + 1`。
- 食谱数据只读，不提供修改动作。

### 5.2 weightStore：体重记录

状态：

- `initialWeightJin`。
- `targetWeightJin`。
- `records`。

动作：

- `setInitialWeight(weight)`。
- `setTargetWeight(weight)`。
- `addWeightRecord(record)`。
- `updateWeightRecord(id, patch)`。
- `getLatestWeight()`。
- `getLatestWeightByDate(date)`。

派生逻辑：

- 最新体重取最新创建或更新记录。
- 同日图表值取当天最后一次记录。
- 累计减重 = 初始体重 - 最新体重。
- 单日变化 = 当日体重 - 上一条有记录日期的体重。

### 5.3 checkInStore：打卡记录

状态：

- `dailyCheckIns`。
- `dietCheckIns`。
- `foodViolations`。

动作：

- `syncWeightStatus(date)`。
- `saveDietCheckIn(record)`。
- `syncExerciseStatus(date)`。
- `recalculateDailyStatus(date)`。
- `recalculateStreak(today)`。
- `getCompletionStats(range)`。

派生逻辑：

- 当日成功 = 体重、饮食、运动任意一项有记录。
- 当日完整 = 体重、饮食、运动三项都有记录。
- 连续打卡从今天或指定日期向前按自然日倒推。
- 补打卡后重新计算受影响日期之后的连续打卡。
- 饮食完成率只统计 `followedRecipe = true` 的天数。

### 5.4 exerciseStore：运动记录

状态：

- `records`。
- 默认爬坡目标：60 分钟。
- 默认力量目标：30 分钟。

动作：

- `saveExerciseRecord(record)`。
- `updateInclineWalk(date, completed, minutes)`。
- `updateStrength(date, completed, minutes)`。
- `updateExerciseNote(date, note)`。
- `getExerciseRecordByDate(date)`。

派生逻辑：

- 任意运动项填写或完成，即有运动记录。
- 爬坡完成且力量完成，才是运动完整完成。
- 当前版本不自动估算运动消耗热量。

## 6. 双计划切换逻辑

### 6.1 秦昊15天单次执行

- 首次进入默认计划为秦昊15天计划。
- 计划开始日期由用户首次开始或设置时确定。
- 第1天到第15天读取固定食谱。
- 第15天完成后显示切换大冰计划提示。
- 不自动强制切换。
- 用户可在个人中心手动切换。

### 6.2 大冰7天无限循环

- 大冰计划以7天为一个周期。
- 循环第几天 = `((执行天数 - 1) % 7) + 1`。
- 第7天结束后下一天回到第1天。
- 历史记录保留真实日期、计划类型、循环第几天。
- 大冰计划不展示每日具体掉秤数字。

### 6.3 切换数据保留

- 切换计划不删除历史体重、饮食、运动和打卡记录。
- 计划切换只影响之后日期的今日食谱和计划日计算。
- 历史列表按记录当时的计划类型展示。

## 7. 体重折线图与预估掉秤统计

### 7.1 周/月数据聚合规则

周视图：

- 范围为最近7个自然日。
- 每个自然日最多一个图表点。
- 同日多次记录取最后一次。

月视图：

- 范围为最近30个自然日。
- 每个自然日最多一个图表点。
- 缺失体重记录的日期不补造体重。

### 7.2 体重变化计算

- 最新体重 = 最近一次体重记录。
- 累计减重 = 初始体重 - 最新体重。
- 单日变化 = 当日最后一次体重 - 上一个有体重记录日期的最后一次体重。
- 单位固定为斤。

### 7.3 预估掉秤统计逻辑

秦昊计划：

- 每日预计掉秤使用原文数字。
- 总预估掉秤固定为 11.3 斤。
- 预估值仅用于展示，不参与真实累计减重计算。

大冰计划：

- 原文未提供每日具体掉秤数字。
- 不自行估算。
- 展示“大冰循环以稳步减脂、维稳塑形为主”。

### 7.4 进度计算

- 秦昊15天目标总减重：11.3 斤。
- 用户目标体重进度：按初始体重、目标体重和最新体重计算。
- 缺少初始体重、目标体重或最新体重时展示空状态。

## 8. 食谱详情渲染规则

### 8.1 餐次展示

食谱详情按以下顺序渲染：

1. 早餐。
2. 午餐。
3. 晚餐。
4. 加餐。

加餐规则：

- 原文提供加餐时展示。
- 原文未提供时不展示，不写“无加餐”作为新增内容。

### 8.2 当日预估掉秤

- 秦昊15天展示“预计掉秤 X 斤”。
- 大冰7天展示“稳步减脂、维稳塑形”，不展示数字。
- 预估掉秤文案必须与计划类型绑定，避免误导用户。

### 8.3 禁忌与规则提示

- 核心规则优先展示在三餐下方。
- 禁忌或注意事项使用警示样式。
- 长文本必须自动换行，不允许溢出卡片。
- 食谱内容不得摘要替代原始餐单。

## 9. 每日运动打卡规则

### 9.1 默认双项运动

- 爬坡快走：默认目标 60 分钟。
- 力量训练：默认目标 30 分钟。

### 9.2 状态判定

- 未填写任何运动：无运动记录。
- 完成或填写任意一项：有运动记录，可让当日打卡进入 partial。
- 两项都完成：运动完整完成。
- 缺少任意一项：运动未完整完成。

### 9.3 页面表现

- 两项分别使用独立打卡卡片。
- 每项支持完成状态和时长输入。
- 当天运动备注独立保存。
- 不展示自动 kcal 消耗。

## 10. 本地存储键名统一规范

### 10.1 AsyncStorage 键名

| 键名 | 内容 | 持久化策略 |
| --- | --- | --- |
| `slim_app:user_settings:v1` | 当前计划、计划开始日期、初始体重、目标体重、数据版本 | 永久保存，重置全部数据时清除 |
| `slim_app:weight_records:v1` | 体重历史记录 | 永久保存，可单独重置 |
| `slim_app:diet_checkins:v1` | 饮食打卡和违规进食记录 | 永久保存，可随打卡重置 |
| `slim_app:exercise_records:v1` | 运动记录 | 永久保存，可随打卡重置 |
| `slim_app:daily_checkins:v1` | 每日打卡汇总 | 永久保存，可随打卡重置 |
| `slim_app:data_version` | 本地数据结构版本 | 永久保存，用于后续迁移 |

### 10.2 保存原则

- 历史数据永久保存，除非用户主动重置。
- 重置打卡和体重记录时需要二次确认。
- 重置全部本地数据时需要二次确认。
- 计划切换不删除历史记录。
- 内置食谱 JSON 不写入 AsyncStorage。

### 10.3 数据迁移预留

- 每个持久化模块携带版本号。
- 后续字段调整时通过数据版本执行迁移。
- 无法识别的数据版本需要进入降级处理或提示用户重置。

## 11. 热量字段预留规则

当前版本不自动计算：

- 饮食摄入热量。
- 运动消耗热量。
- 热量缺口。

预留字段：

- `caloriesIntakeKcal?: number`。
- `caloriesBurnedKcal?: number`。
- `calorieGapKcal?: number`。

启用条件：

- 后续确认每餐摄入热量。
- 后续确认运动消耗规则。
- 后续确认热量缺口展示口径。

在启用前：

- 数据看板不展示热量缺口。
- 运动页不自动估算 kcal。
- 食谱页不根据餐单推导 kcal。

## 12. 详细设计验收标准

- 已生成 `doc/detailed-design.md`。
- 文档只包含设计规范，不包含 React Native 代码。
- 未安装依赖。
- 未修改 `src`。
- 未修改 `App.tsx`。
- 已覆盖全局 UI 规范。
- 已覆盖完整 TS 数据接口。
- 已覆盖五大页面组件拆分。
- 已覆盖公共组件入参、渲染逻辑和交互说明。
- 已覆盖 Zustand 四大状态模块详细设计。
- 已覆盖双计划切换逻辑。
- 已覆盖体重折线图周/月聚合规则和预估掉秤规则。
- 已覆盖食谱详情渲染规则。
- 已覆盖每日运动双项打卡规则。
- 已覆盖本地存储键名统一规范。
