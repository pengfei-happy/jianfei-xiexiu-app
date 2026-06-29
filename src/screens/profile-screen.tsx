import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton, DataCard } from '../components/ui';
import { useAppActions, useAppStore } from '../store/app-store';
import { colors, spacing } from '../theme';
import { screen } from './home-screen';

export function ProfileScreen() {
  const state = useAppStore((value) => value);
  const actions = useAppActions();
  const [initialInput, setInitialInput] = useState('');
  const [targetInput, setTargetInput] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const weightValue = `初始 ${state.userSettings.weightSettings.initialWeightJin ?? '待填'} · 目标 ${state.userSettings.weightSettings.targetWeightJin ?? '待填'}`;
  const planValue = state.userSettings.currentPlan === 'qin_hao_15' ? '秦昊15天计划' : '大冰7天循环计划';
  const notice = [
    '每日饮水1800-2000ml；大冰循环每日饮水2000ml。',
    '称重建议固定起床后、如厕后、未进食时。',
    '无油少盐、无糖、无酱料，杜绝零食、奶茶、油炸、夜宵、酒精、精加工食品。',
    '大冰计划遵守16:8轻断食和进食顺序。',
  ].join('');
  const saveWeightSettings = () => {
    const saved: string[] = [];
    if (savePositive(initialInput, actions.setInitialWeight)) saved.push('初始体重');
    if (savePositive(targetInput, actions.setTargetWeight)) saved.push('目标体重');
    setInitialInput('');
    setTargetInput('');
    setSavedMessage(saved.length > 0 ? `${saved.join('、')}已保存` : '请输入大于 0 的体重');
  };

  return (
    <SafeAreaView style={screen.safe} edges={['top']}>
      <ScrollView contentContainerStyle={screen.content}>
        <View style={local.profileHero}>
          <View>
            <Text style={local.avatar}>👤</Text>
          </View>
          <View style={local.profileCopy}>
            <Text style={local.profileTitle}>我的减脂档案</Text>
            <Text style={local.profileSub}>{planValue} · 本地离线记录</Text>
          </View>
        </View>

        <View style={local.goalStrip}>
          <View style={local.goalItem}>
            <Text style={local.goalValue}>{state.userSettings.weightSettings.initialWeightJin ?? '--'}</Text>
            <Text style={local.goalLabel}>初始体重</Text>
          </View>
          <View style={local.goalItem}>
            <Text style={local.goalValue}>{state.userSettings.weightSettings.targetWeightJin ?? '--'}</Text>
            <Text style={local.goalLabel}>目标体重</Text>
          </View>
          <View style={local.goalItem}>
            <Text style={local.goalValue}>{state.getStreak(state.selectedDate)}</Text>
            <Text style={local.goalLabel}>连续天数</Text>
          </View>
        </View>

        <DataCard title="体重设置" subtitle="体重单位固定为斤。" value={weightValue}>
          <View style={local.formStack}>
            <TextInput
              value={initialInput}
              onChangeText={setInitialInput}
              placeholder="初始体重"
              keyboardType="decimal-pad"
              style={local.formInput}
            />
            <TextInput
              value={targetInput}
              onChangeText={setTargetInput}
              placeholder="目标体重"
              keyboardType="decimal-pad"
              style={local.formInput}
            />
            <ActionButton
              tone="purple"
              onPress={saveWeightSettings}
            >
              保存设置
            </ActionButton>
            {savedMessage ? <Text style={local.savedText}>{savedMessage}</Text> : null}
          </View>
        </DataCard>
        <DataCard title="计划切换" subtitle="切换计划不会删除历史记录。" value={planValue}>
          <View style={local.switchRow}>
            <ActionButton
              onPress={() => {
                actions.setCurrentPlan('qin_hao_15');
                setSavedMessage('已切换到秦昊15天计划');
              }}
            >
              秦昊15天
            </ActionButton>
            <ActionButton
              onPress={() => {
                actions.setCurrentPlan('dabing_7_cycle');
                setSavedMessage('已切换到大冰循环');
              }}
            >
              大冰循环
            </ActionButton>
          </View>
          {savedMessage ? <Text style={local.savedText}>{savedMessage}</Text> : null}
        </DataCard>
        <DataCard title="减脂须知" subtitle={notice} />
        <DataCard title="嘴馋解馋法则" subtitle="原文未补齐的内容标记为待确认，不编造。" status="pending" />
        <DataCard title="危险操作" status="warning" subtitle="所有重置操作必须二次确认。">
          <ActionButton
            tone="light"
            onPress={() => confirm('重置打卡和体重记录', actions.resetCheckInsAndWeights)}
          >
            重置打卡和体重记录
          </ActionButton>
          <ActionButton
            tone="light"
            onPress={() => confirm('重置全部本地数据', actions.resetAllLocalData)}
          >
            重置全部本地数据
          </ActionButton>
        </DataCard>
      </ScrollView>
    </SafeAreaView>
  );
}

function confirm(title: string, action: () => void) {
  Alert.alert(title, '该操作不可撤销，确认继续？', [
    { text: '取消', style: 'cancel' },
    { text: '确认', style: 'destructive', onPress: action },
  ]);
}

function savePositive(value: string, save: (weight: number) => void) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return false;
  save(parsed);
  return true;
}

const local = {
  profileHero: {
    minHeight: 142,
    borderRadius: 28,
    backgroundColor: colors.purple,
    padding: spacing.lg,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.md,
  },
  avatar: { fontSize: 54 },
  profileCopy: { flex: 1 },
  profileTitle: { color: colors.paper, fontSize: 25, fontWeight: '900' as const },
  profileSub: { color: '#E3DFFF', fontSize: 14, fontWeight: '800' as const, marginTop: 6 },
  goalStrip: { flexDirection: 'row' as const, gap: spacing.sm },
  goalItem: {
    flex: 1,
    minHeight: 86,
    borderRadius: 20,
    backgroundColor: colors.paper,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  goalValue: { color: colors.text, fontSize: 22, fontWeight: '900' as const },
  goalLabel: { color: colors.muted, fontSize: 12, fontWeight: '800' as const, marginTop: 4 },
  switchRow: { flexDirection: 'row' as const, gap: spacing.sm },
  formStack: { gap: spacing.sm },
  formInput: {
    minHeight: 46,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    color: colors.text,
    backgroundColor: colors.paper,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  savedText: { color: colors.greenDark, fontSize: 13, fontWeight: '900' as const },
};
