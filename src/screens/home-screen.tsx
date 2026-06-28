import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton, CheckInPill, DataCard, ProgressBar, SectionTitle } from '../components/ui';
import { QIN_HAO_TOTAL_TARGET_LOSS_JIN } from '../domain/recipes';
import { useAppActions, useAppStore } from '../store/app-store';
import { colors, spacing } from '../theme';

export function HomeScreen() {
  const state = useAppStore((value) => value);
  const actions = useAppActions();
  const today = state.selectedDate;
  const recipe = state.getTodayRecipe(today);
  const daily = state.dailyCheckIns[today];
  const currentLoss = state.getCurrentLoss();
  const progressRatio = state.getPlanProgressRatio();
  const streak = state.getStreak(today);
  const [weightInput, setWeightInput] = useState('');
  const parsedWeight = Number(weightInput);
  const canSaveWeight = Number.isFinite(parsedWeight) && parsedWeight > 0;

  return (
    <SafeAreaView style={screen.safe} edges={['top']}>
      <ScrollView contentContainerStyle={screen.content}>
        <View style={screen.topBar}>
          <View>
            <Text style={screen.title}>👩🏻 狠一点，瘦下来</Text>
          </View>
          <View style={screen.bell}><Text style={screen.bellText}>🔔</Text></View>
        </View>
        <View style={screen.searchBox}>
          <Text style={screen.searchText}>⌕ 搜索食谱 / 运动 / 打卡</Text>
        </View>

        <DataCard
          title="今日必须打卡"
          subtitle="体重、饮食、运动三选一即可完成。别摆烂，30秒先把日律续上。"
          style={screen.heroCard}
        >
          <ActionButton
            tone="red"
            onPress={() => actions.saveDietCheckIn({ date: today, followedRecipe: true, violationFoods: [] })}
          >
            立即打卡
          </ActionButton>
          <Text style={screen.fire}>🔥</Text>
        </DataCard>

        <View style={screen.sectionLine}>
          <SectionTitle action={`已连续 ${streak} 天`}>三选一打卡</SectionTitle>
        </View>

        <View style={screen.actionGrid}>
          <DataCard
            style={screen.actionCard}
            onPress={() => {
              if (canSaveWeight) {
                actions.addWeightRecord({ date: today, weightJin: parsedWeight });
                setWeightInput('');
              }
            }}
          >
            <Text style={screen.actionEmoji}>⚖️</Text>
            <Text style={screen.actionTitle}>体重</Text>
            <Text style={screen.actionSub}>{daily?.hasWeightRecord ? '已记录' : '待记录'}</Text>
          </DataCard>
          <DataCard
            style={screen.actionCard}
            onPress={() => actions.saveDietCheckIn({ date: today, followedRecipe: true, violationFoods: [] })}
          >
            <Text style={screen.actionEmoji}>🥗</Text>
            <Text style={screen.actionTitle}>饮食</Text>
            <Text style={screen.actionSub}>{daily?.hasDietRecord ? '已打卡' : '对照食谱'}</Text>
          </DataCard>
          <DataCard
            style={screen.actionCard}
            onPress={() => actions.updateInclineWalk(today, true, 60)}
          >
            <Text style={screen.actionEmoji}>🏃</Text>
            <Text style={screen.actionTitle}>运动</Text>
            <Text style={screen.actionSub}>{daily?.hasExerciseRecord ? '已记录' : '90分钟'}</Text>
          </DataCard>
        </View>

        <DataCard
          title="今日计划"
          value={state.userSettings.currentPlan === 'qin_hao_15' ? '秦昊15天计划' : '大冰7天循环'}
          subtitle={`${today} · ${recipe?.stageName ?? '待确认'}`}
        />

        <DataCard
          title="今日打卡"
          subtitle={`连续打卡 ${streak} 天`}
          status={daily?.isComplete ? 'success' : daily?.isSuccessful ? 'pending' : 'default'}
        >
          <View style={screen.pills}>
            <CheckInPill label="体重" done={Boolean(daily?.hasWeightRecord)} icon="scale-outline" />
            <CheckInPill label="饮食" done={Boolean(daily?.hasDietRecord)} icon="restaurant-outline" />
            <CheckInPill label="运动" done={Boolean(daily?.hasExerciseRecord)} icon="walk-outline" />
          </View>
          <View style={screen.quickRow}>
            <TextInput
              value={weightInput}
              onChangeText={setWeightInput}
              placeholder="今日体重（斤）"
              keyboardType="decimal-pad"
              style={screen.input}
            />
            {canSaveWeight ? (
              <ActionButton
                tone="light"
                onPress={() => {
                  actions.addWeightRecord({ date: today, weightJin: parsedWeight });
                  setWeightInput('');
                }}
              >
                保存体重
              </ActionButton>
            ) : null}
            <ActionButton
              tone="light"
              onPress={() => actions.saveDietCheckIn({ date: today, followedRecipe: true, violationFoods: [] })}
            >
              饮食完成
            </ActionButton>
            <ActionButton tone="light" onPress={() => actions.updateInclineWalk(today, true, 60)}>
              运动记录
            </ActionButton>
          </View>
        </DataCard>

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
          subtitle={`秦昊15天目标 ${QIN_HAO_TOTAL_TARGET_LOSS_JIN}斤，按真实体重记录计算`}
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
  searchBox: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#ECEFF6',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  searchText: { color: '#B0B6C5', fontSize: 16, fontWeight: '800' },
  heroCard: {
    minHeight: 206,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fire: {
    position: 'absolute',
    right: 18,
    bottom: 14,
    fontSize: 70,
    opacity: 0.22,
  },
  sectionLine: { marginTop: spacing.xs },
  actionGrid: { flexDirection: 'row', gap: spacing.sm },
  actionCard: { flex: 1, alignItems: 'center', minHeight: 138, padding: spacing.md },
  actionEmoji: { fontSize: 34 },
  actionTitle: { color: colors.text, fontSize: 16, fontWeight: '900', marginTop: spacing.sm },
  actionSub: { color: colors.muted, fontSize: 13, fontWeight: '700', marginTop: 4 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  quickAction: { color: colors.purple, fontSize: 14, fontWeight: '900', paddingVertical: 8 },
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
});
