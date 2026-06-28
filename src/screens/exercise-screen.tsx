import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton, DataCard, EmptyState } from '../components/ui';
import { useAppActions, useAppStore } from '../store/app-store';
import { colors, spacing } from '../theme';
import { screen } from './home-screen';

export function ExerciseScreen() {
  const state = useAppStore((value) => value);
  const actions = useAppActions();
  const today = state.selectedDate;
  const record = state.exerciseRecords[today];

  return (
    <SafeAreaView style={screen.safe} edges={['top']}>
      <ScrollView contentContainerStyle={screen.content}>
        <View style={local.navBar}>
          <Text style={local.navButton}>‹</Text>
          <Text style={local.navTitle}>饮食 & 运动</Text>
          <Text style={local.navButton}>⌕</Text>
        </View>

        <View style={local.sectionHeader}>
          <Text style={screen.title}>今日食谱</Text>
          <Text style={local.link}>15天计划</Text>
        </View>

        <DataCard title="第 1 天 · 纯半液断日" subtitle="无糖豆浆 500ml + 麦满分；午晚无糖茶/汤">
          <Text style={local.glass}>🥛</Text>
          <Text style={local.purpleButton}>+ 饮食打卡</Text>
        </DataCard>

        <Text style={local.sectionTitle}>营养概览</Text>
        <View style={local.colorMetrics}>
          <View style={[local.colorMetric, { backgroundColor: colors.purple }]}>
            <Text style={local.colorValue}>10+15</Text>
            <Text style={local.colorLabel}>分钟</Text>
          </View>
          <View style={[local.colorMetric, { backgroundColor: colors.cyan }]}>
            <Text style={local.colorValue}>中等</Text>
            <Text style={local.colorLabel}>难度</Text>
          </View>
          <View style={[local.colorMetric, { backgroundColor: colors.orange }]}>
            <Text style={local.colorValue}>待确认</Text>
            <Text style={local.colorLabel}>缺口</Text>
          </View>
        </View>

        <View style={local.sectionHeader}>
          <Text style={local.sectionTitle}>热门运动</Text>
          <Text style={local.link}>全部 ›</Text>
        </View>

        <View style={local.sportCard}>
          <Text style={local.sportTitle}>大基数爬坡快走</Text>
          <View style={local.sportPills}>
            <Text style={local.sportPill}>60 min</Text>
            <Text style={local.sportPill}>保护膝盖</Text>
            <ActionButton
              tone="light"
              onPress={() => actions.updateInclineWalk(today, true, 60)}
            >
              开始 ▶
            </ActionButton>
          </View>
          <Text style={local.walker}>🚶‍♀️</Text>
        </View>

        <View style={[local.sportCard, local.strengthCard]}>
          <Text style={local.sportTitle}>徒手力量塑形</Text>
          <View style={local.sportPills}>
            <Text style={local.sportPill}>30 min</Text>
            <Text style={local.sportPill}>无负重</Text>
            <ActionButton
              tone="light"
              onPress={() => actions.updateStrength(today, true, 30)}
            >
              开始 ▶
            </ActionButton>
          </View>
        </View>

        <DataCard title="运动备注" subtitle={record?.note ?? '当前版本不自动估算 kcal 消耗。'}>
          <ActionButton tone="light" onPress={() => actions.updateExerciseNote(today, '完成今日运动记录')}>
            保存备注
          </ActionButton>
        </DataCard>
        {Object.values(state.exerciseRecords).length === 0 ? (
          <EmptyState title="暂无运动历史" text="记录爬坡或力量任一项后，会触发当天 partial 打卡。" />
        ) : Object.values(state.exerciseRecords)
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((item) => (
              <DataCard
                key={item.date}
                title={item.date}
                subtitle={`爬坡 ${item.inclineWalkMinutes} 分钟 · 力量 ${item.strengthMinutes} 分钟`}
                value={item.isExerciseComplete ? '完整运动' : '已记录'}
              />
            ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const local = StyleSheet.create({
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: colors.paper,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 42,
    fontSize: 24,
    fontWeight: '900',
  },
  navTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  link: { color: colors.purple, fontSize: 14, fontWeight: '900' },
  glass: { position: 'absolute', right: 20, top: 26, fontSize: 58 },
  purpleButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    backgroundColor: colors.purple,
    color: colors.paper,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '900',
  },
  sectionTitle: { color: colors.text, fontSize: 22, fontWeight: '900' },
  colorMetrics: { flexDirection: 'row', gap: spacing.sm },
  colorMetric: {
    flex: 1,
    minHeight: 78,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorValue: { color: colors.paper, fontSize: 18, fontWeight: '900' },
  colorLabel: { color: colors.paper, fontSize: 13, fontWeight: '900', marginTop: 2 },
  sportCard: {
    minHeight: 176,
    borderRadius: 24,
    backgroundColor: '#BFEAFF',
    padding: spacing.lg,
    overflow: 'hidden',
  },
  strengthCard: { backgroundColor: '#EABAF3' },
  sportTitle: { color: colors.text, fontSize: 19, fontWeight: '900' },
  sportPills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xl },
  sportPill: {
    backgroundColor: colors.paper,
    color: colors.muted,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontWeight: '900',
  },
  walker: { position: 'absolute', right: 18, bottom: 8, fontSize: 58 },
});
