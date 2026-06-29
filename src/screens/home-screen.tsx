import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton, DataCard, ProgressBar, SectionTitle } from '../components/ui';
import { getLatestWeightByDate } from '../domain/metrics';
import { QIN_HAO_TOTAL_TARGET_LOSS_JIN } from '../domain/recipes';
import { useAppActions, useAppStore } from '../store/app-store';
import { useTabNavigation } from '../navigation/tab-navigation';
import { colors, spacing } from '../theme';

export function HomeScreen() {
  const navigation = useTabNavigation();
  const state = useAppStore((value) => value);
  const actions = useAppActions();
  const today = state.selectedDate;
  const recipe = state.getTodayRecipe(today);
  const daily = state.dailyCheckIns[today];
  const currentLoss = state.getCurrentLoss();
  const progressRatio = state.getPlanProgressRatio();
  const streak = state.getStreak(today);
  const todayWeight = getLatestWeightByDate(state.weightRecords, today);
  const [weightInput, setWeightInput] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const parsedWeight = Number(weightInput);
  const canSaveWeight = Number.isFinite(parsedWeight) && parsedWeight > 0;
  const completedCount = [daily?.hasWeightRecord, daily?.hasDietRecord, daily?.hasExerciseRecord].filter(Boolean).length;
  const showLocalNotice = () => Alert.alert('本地提醒', '当前版本先记录打卡和体重，提醒推送后续接入。');
  const markDietDone = (message = '饮食已保存') => {
    actions.saveDietCheckIn({ date: today, followedRecipe: true, violationFoods: [], recipeId: recipe?.id });
    setSaveMessage(message);
  };
  const saveWeight = () => {
    if (!canSaveWeight) return;
    actions.addWeightRecord({ date: today, weightJin: parsedWeight });
    setWeightInput('');
    setSaveMessage(`今日体重已保存：${parsedWeight} 斤`);
  };
  const markExerciseDone = () => {
    actions.updateInclineWalk(today, true, 60);
    setSaveMessage('运动已记录：爬坡快走 60 分钟');
  };
  const handleWeightCardPress = () => {
    if (canSaveWeight) {
      saveWeight();
      return;
    }
    setSaveMessage(todayWeight ? `今日体重已保存：${todayWeight.weightJin} 斤` : '请在下方输入今日体重后保存');
  };
  const continueToday = () => {
    if (!daily?.hasDietRecord) {
      markDietDone(recipe ? `${recipe.stageName} 已打卡` : '饮食已保存');
      return;
    }
    if (!daily?.hasExerciseRecord) {
      navigation.navigate('Exercise');
      return;
    }
    if (!daily?.hasWeightRecord) {
      setSaveMessage('请在下方输入今日体重后保存');
      return;
    }
    setSaveMessage('今日三项记录已完成');
  };
  const primaryLabel = daily?.isComplete
    ? '今日已完成'
    : completedCount > 0
      ? `继续完成 ${3 - completedCount} 项`
      : '开始今日记录';

  return (
    <SafeAreaView style={screen.safe} edges={['top']}>
      <ScrollView contentContainerStyle={screen.content}>
        <View style={screen.topBar}>
          <View>
            <Text style={screen.title}>👩🏻 狠一点，瘦下来</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={showLocalNotice} style={({ pressed }) => [screen.iconButton, pressed && screen.pressed]}>
            <Text style={screen.bellText}>🔔</Text>
          </Pressable>
        </View>
        <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Recipes')} style={({ pressed }) => [screen.searchBox, pressed && screen.pressed]}>
          <Text style={screen.searchText}>⌕ 搜索食谱 / 运动 / 打卡</Text>
        </Pressable>

        <DataCard style={screen.planHero}>
          <View style={screen.planHeader}>
            <Text style={screen.planEyebrow}>今日计划</Text>
            <Text style={screen.planBadge}>{completedCount}/3 已完成</Text>
          </View>
          <Text style={screen.planTitle}>
            {recipe ? `${recipe.planType === 'qin_hao_15' ? `第 ${recipe.day} 天` : `循环第${recipe.cycleDay}天`} · ${recipe.stageName}` : '今日食谱待确认'}
          </Text>
          <Text style={screen.planSub}>{recipe?.meals.map((meal) => meal.content).join('；') ?? '进入饮食页选择今日食谱'}</Text>
          <View style={screen.heroActions}>
            <ActionButton
              tone={daily?.isComplete ? 'light' : 'purple'}
              disabled={Boolean(daily?.isComplete)}
              onPress={continueToday}
            >
              {primaryLabel}
            </ActionButton>
            <ActionButton tone="light" onPress={() => navigation.navigate('Recipes')}>
              查看食谱
            </ActionButton>
          </View>
          {saveMessage ? <Text style={screen.savedText}>{saveMessage}</Text> : null}
        </DataCard>

        <View style={screen.sectionLine}>
          <SectionTitle action={`已连续 ${streak} 天`}>今日进度</SectionTitle>
        </View>

        <View style={screen.actionGrid}>
          <DataCard
            style={screen.actionCard}
            status={daily?.hasWeightRecord ? 'success' : 'default'}
            onPress={handleWeightCardPress}
          >
            <Text style={screen.actionEmoji}>⚖️</Text>
            <Text style={screen.actionTitle}>体重</Text>
            <Text style={screen.actionSub}>{todayWeight ? `已保存 ${todayWeight.weightJin} 斤` : '待记录'}</Text>
          </DataCard>
          <DataCard
            style={screen.actionCard}
            status={daily?.hasDietRecord ? 'success' : 'default'}
            onPress={() => markDietDone()}
          >
            <Text style={screen.actionEmoji}>🍽️</Text>
            <Text style={screen.actionTitle}>饮食</Text>
            <Text style={screen.actionSub}>{daily?.hasDietRecord ? `${recipe?.stageName ?? '食谱'} 已打卡` : '按当前食谱保存'}</Text>
          </DataCard>
          <DataCard
            style={screen.actionCard}
            status={daily?.hasExerciseRecord ? 'success' : 'default'}
            onPress={markExerciseDone}
          >
            <Text style={screen.actionEmoji}>🏃</Text>
            <Text style={screen.actionTitle}>运动</Text>
            <Text style={screen.actionSub}>{daily?.hasExerciseRecord ? '已记录 60 分钟' : '一键保存快走'}</Text>
          </DataCard>
        </View>

        <View style={screen.weightBar}>
          <TextInput
            value={weightInput}
            onChangeText={setWeightInput}
            placeholder="今日体重（斤）"
            keyboardType="decimal-pad"
            style={screen.input}
          />
          <ActionButton
            tone="light"
            disabled={!canSaveWeight}
            onPress={saveWeight}
          >
            {canSaveWeight ? '保存体重' : '先填体重'}
          </ActionButton>
        </View>

        <DataCard
          title="当前计划"
          value={state.userSettings.currentPlan === 'qin_hao_15' ? '秦昊15天计划' : '大冰7天循环'}
          subtitle={`${today} · ${recipe?.stageName ?? '待确认'}`}
        />

        <SectionTitle>今日食谱</SectionTitle>
        <DataCard title={recipe?.stageName ?? '待确认'} subtitle={recipe?.coreRule}>
          {recipe?.meals.map((meal) => (
            <View key={meal.type} style={screen.mealRow}>
              <Text style={screen.mealLabel}>{meal.label}</Text>
              <Text style={screen.mealText}>{meal.content}</Text>
            </View>
          ))}
          {recipe?.warnings?.map((warning) => (
            <Text key={warning} style={screen.warning}>{warning}</Text>
          ))}
        </DataCard>

        <DataCard
          title="真实减重进度"
          value={currentLoss === undefined ? '待记录' : `${currentLoss.toFixed(1)}斤`}
          subtitle={`按初始体重与最近一次体重计算。秦昊15天目标 ${QIN_HAO_TOTAL_TARGET_LOSS_JIN}斤`}
        >
          <ProgressBar value={progressRatio} />
        </DataCard>

        {state.userSettings.currentPlan === 'qin_hao_15' && recipe?.day === 15 ? (
          <DataCard
            title="15天完成提示"
            subtitle="秦昊15天结束后，可在我的页面手动切换到大冰7天循环计划，不会自动强制切换。"
            status="success"
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

export const screen = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 104, gap: spacing.md },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text, fontSize: 26, fontWeight: '900', marginTop: 4 },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellText: { fontSize: 20 },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  searchBox: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#ECEFF6',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  searchText: { color: '#B0B6C5', fontSize: 16, fontWeight: '800' },
  planHero: { gap: spacing.sm },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  planEyebrow: { color: colors.text, fontSize: 16, fontWeight: '900' },
  planBadge: {
    color: colors.purple,
    fontSize: 13,
    fontWeight: '900',
    backgroundColor: colors.purpleSoft,
    borderRadius: 14,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  planTitle: { color: colors.text, fontSize: 24, fontWeight: '900', lineHeight: 31 },
  planSub: { color: colors.muted, fontSize: 15, lineHeight: 23, fontWeight: '800' },
  heroActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  sectionLine: { marginTop: spacing.xs },
  actionGrid: { flexDirection: 'row', gap: spacing.sm },
  actionCard: { flex: 1, alignItems: 'center', minHeight: 138, padding: spacing.md },
  actionEmoji: { fontSize: 34 },
  actionTitle: { color: colors.text, fontSize: 16, fontWeight: '900', marginTop: spacing.sm },
  actionSub: { color: colors.muted, fontSize: 13, fontWeight: '700', marginTop: 4, textAlign: 'center', lineHeight: 18 },
  weightBar: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, alignItems: 'center' },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  input: {
    minWidth: 128,
    minHeight: 38,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.sm,
    color: colors.text,
    backgroundColor: colors.paper,
  },
  mealRow: { gap: 4, paddingVertical: spacing.xs, borderTopWidth: 1, borderTopColor: colors.line },
  mealLabel: { color: colors.purple, fontSize: 13, fontWeight: '900' },
  mealText: { color: colors.text, fontSize: 15, lineHeight: 22 },
  warning: { color: colors.danger, fontSize: 13, lineHeight: 19, marginTop: spacing.xs },
  savedText: { color: colors.greenDark, fontSize: 13, fontWeight: '900', marginTop: spacing.xs },
});
