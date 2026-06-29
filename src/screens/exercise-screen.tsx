import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton, DataCard, EmptyState } from '../components/ui';
import { useAppActions, useAppStore } from '../store/app-store';
import { useTabNavigation } from '../navigation/tab-navigation';
import { colors, spacing } from '../theme';
import { screen } from './home-screen';

export function ExerciseScreen() {
  const navigation = useTabNavigation();
  const state = useAppStore((value) => value);
  const actions = useAppActions();
  const today = state.selectedDate;
  const record = state.exerciseRecords[today];
  const [runningTimers, setRunningTimers] = useState({ inclineWalk: false, strength: false });
  const [elapsedSeconds, setElapsedSeconds] = useState({ inclineWalk: 0, strength: 0 });
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (!runningTimers.inclineWalk && !runningTimers.strength) return undefined;
    const timer = setInterval(() => {
      setElapsedSeconds((value) => ({
        inclineWalk: runningTimers.inclineWalk ? value.inclineWalk + 1 : value.inclineWalk,
        strength: runningTimers.strength ? value.strength + 1 : value.strength,
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [runningTimers.inclineWalk, runningTimers.strength]);

  const startTimer = (type: 'inclineWalk' | 'strength') => {
    setRunningTimers((value) => ({ ...value, [type]: true }));
    setSaveMessage('');
  };
  const pauseTimer = (type: 'inclineWalk' | 'strength') => {
    setRunningTimers((value) => ({ ...value, [type]: false }));
  };
  const finishTimer = (type: 'inclineWalk' | 'strength') => {
    const seconds = Math.max(elapsedSeconds[type], 1);
    actions.completeTimedExercise(today, type, seconds);
    setSaveMessage(`${type === 'inclineWalk' ? '爬坡快走' : '徒手力量'}已保存：${formatDuration(seconds)}`);
    setRunningTimers((value) => ({ ...value, [type]: false }));
    setElapsedSeconds((value) => ({ ...value, [type]: 0 }));
  };

  return (
    <SafeAreaView style={screen.safe} edges={['top']}>
      <ScrollView contentContainerStyle={screen.content}>
        <View style={local.navBar}>
          <Text accessibilityRole="button" onPress={() => navigation.navigate('Home')} style={local.navButton}>‹</Text>
          <Text style={local.navTitle}>饮食 & 运动</Text>
          <Text accessibilityRole="button" onPress={() => navigation.navigate('Recipes')} style={local.navButton}>⌕</Text>
        </View>

        <Text style={local.sectionTitle}>营养概览</Text>
        <View style={local.colorMetrics}>
          <View style={[local.colorMetric, { backgroundColor: colors.purple }]}>
            <Text style={local.colorValue}>60+30</Text>
            <Text style={local.colorLabel}>运动目标</Text>
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
        {saveMessage ? <Text style={local.savedText}>{saveMessage}</Text> : null}

        <View style={local.sectionHeader}>
          <Text style={local.sectionTitle}>热门运动</Text>
          <Text accessibilityRole="button" onPress={() => navigation.navigate('Recipes')} style={local.link}>全部 ›</Text>
        </View>

        <View style={local.sportCard}>
          <Text style={local.sportTitle}>大基数爬坡快走</Text>
          {record?.inclineWalkMinutes ? (
            <Text style={local.savedText}>今日已保存：{record.inclineWalkMinutes} 分钟</Text>
          ) : null}
          <Text style={local.cardTimer}>{formatDuration(elapsedSeconds.inclineWalk)}</Text>
          <View style={local.sportPills}>
            <Text style={local.sportPill}>60 min</Text>
            <Text style={local.sportPill}>保护膝盖</Text>
            <ActionButton
              tone={runningTimers.inclineWalk ? 'red' : 'light'}
              onPress={() => startTimer('inclineWalk')}
            >
              {runningTimers.inclineWalk ? '计时中' : '开始计时 ▶'}
            </ActionButton>
            <ActionButton
              tone="light"
              disabled={!runningTimers.inclineWalk}
              onPress={() => pauseTimer('inclineWalk')}
            >
              暂停
            </ActionButton>
            <ActionButton
              tone="purple"
              disabled={elapsedSeconds.inclineWalk === 0}
              onPress={() => finishTimer('inclineWalk')}
            >
              完成保存
            </ActionButton>
          </View>
          <Text style={local.walker}>🚶‍♀️</Text>
        </View>

        <View style={[local.sportCard, local.strengthCard]}>
          <Text style={local.sportTitle}>徒手力量塑形</Text>
          {record?.strengthMinutes ? (
            <Text style={local.savedText}>今日已保存：{record.strengthMinutes} 分钟</Text>
          ) : null}
          <Text style={local.cardTimer}>{formatDuration(elapsedSeconds.strength)}</Text>
          <View style={local.sportPills}>
            <Text style={local.sportPill}>30 min</Text>
            <Text style={local.sportPill}>无负重</Text>
            <ActionButton
              tone={runningTimers.strength ? 'red' : 'light'}
              onPress={() => startTimer('strength')}
            >
              {runningTimers.strength ? '计时中' : '开始计时 ▶'}
            </ActionButton>
            <ActionButton
              tone="light"
              disabled={!runningTimers.strength}
              onPress={() => pauseTimer('strength')}
            >
              暂停
            </ActionButton>
            <ActionButton
              tone="purple"
              disabled={elapsedSeconds.strength === 0}
              onPress={() => finishTimer('strength')}
            >
              完成保存
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
  cardTimer: { color: colors.text, fontSize: 34, fontWeight: '900', letterSpacing: 0, marginTop: spacing.md },
  savedText: { color: colors.greenDark, fontSize: 13, fontWeight: '900' },
});

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
