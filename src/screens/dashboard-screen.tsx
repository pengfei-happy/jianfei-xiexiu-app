import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DataCard, EmptyState, ProgressBar, SectionTitle } from '../components/ui';
import { calculateDailyWeightChange, getLatestWeightByDate } from '../domain/metrics';
import { useAppStore } from '../store/app-store';
import { colors, spacing } from '../theme';
import { screen } from './home-screen';

export function DashboardScreen() {
  const state = useAppStore((value) => value);
  const stats = state.getCompletionStats(state.selectedDate);
  const currentLoss = state.getCurrentLoss();
  const dates = [...new Set(state.weightRecords.map((record) => record.date))].sort().reverse();

  return (
    <SafeAreaView style={screen.safe} edges={['top']}>
      <ScrollView contentContainerStyle={screen.content}>
        <View style={local.navBar}>
          <Text style={local.navButton}>‹</Text>
          <Text style={local.navTitle}>减脂数据看板</Text>
          <Text style={local.navButton}>···</Text>
        </View>

        <View style={local.hero}>
          <View style={local.ring}>
            <Text style={local.ringText}>{Math.round((state.getPlanProgressRatio() ?? 0) * 100)}%</Text>
          </View>
          <View style={local.heroCopy}>
            <Text style={local.heroTitle}>不是天赋，是强制养成</Text>
            <Text style={local.heroSub}>
              距目标体重还差 {currentLoss === undefined ? '待记录' : `${Math.max(11.3 - currentLoss, 0).toFixed(1)} 斤`}
            </Text>
          </View>
        </View>

        <SectionTitle>核心数据</SectionTitle>
        <View style={local.metricGrid}>
          <Metric title="真实减重" value={currentLoss === undefined ? '--' : currentLoss.toFixed(1)} unit="斤" accent={colors.greenDark} />
          <Metric title="饮食完成" value={`${Math.round(stats.dietCompletionRate * 100)}`} unit="%" accent={colors.text} />
          <Metric title="运动完成" value={`${Math.round(stats.exerciseCompletionRate * 100)}`} unit="%" accent={colors.green} />
          <Metric title="连续打卡" value={`${state.getStreak(state.selectedDate)}`} unit="天" accent={colors.red} />
        </View>

        <DataCard title="体重趋势" subtitle="周/月/年">
          <View style={local.chartCard}>
            <View style={local.chartLine} />
            <View style={[local.chartDot, { left: '30%', bottom: 46 }]} />
            <View style={[local.chartDot, { left: '62%', bottom: 70 }]} />
            <View style={[local.chartDot, { left: '88%', bottom: 90 }]} />
          </View>
        </DataCard>

        <DataCard
          title="体重记录"
          subtitle="周/月视图使用用户真实录入体重；缺失日期不补造数据。"
        >
          {dates.length === 0 ? (
            <EmptyState title="暂无体重记录" text="记录体重后，这里会展示历史变化。" />
          ) : dates.slice(0, 30).map((date) => {
              const record = getLatestWeightByDate(state.weightRecords, date);
              const change = calculateDailyWeightChange(state.weightRecords, date);
              const changeText = change === undefined ? '首条记录' : `${change.toFixed(1)}斤`;
              return (
                <Text key={date} style={screen.mealText}>
                  {date} · {record?.weightJin}斤 · {changeText}
                </Text>
              );
            })}
        </DataCard>
        <SectionTitle>历史打卡</SectionTitle>
        {Object.values(state.dailyCheckIns).length === 0 ? (
          <EmptyState title="暂无打卡" text="完成体重、饮食或运动任一项即可生成历史。" />
        ) : Object.values(state.dailyCheckIns)
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((record) => (
              <DataCard
                key={record.date}
                title={record.date}
                subtitle={`饮食 ${record.hasDietRecord ? '已记录' : '未记录'} · 运动 ${record.hasExerciseRecord ? '已记录' : '未记录'}`}
                value={record.isComplete ? '完整打卡' : record.isSuccessful ? '成功打卡' : '未打卡'}
              />
            ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Metric({ title, value, unit, accent }: { title: string; value: string; unit: string; accent: string }) {
  return (
    <DataCard style={local.metricCard}>
      <Text style={local.metricTitle}>{title}</Text>
      <Text style={[local.metricValue, { color: accent }]}>{value}</Text>
      <Text style={local.metricUnit}>{unit}</Text>
    </DataCard>
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
  navTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  hero: {
    minHeight: 202,
    borderRadius: 26,
    backgroundColor: colors.purple,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  ring: {
    width: 106,
    height: 106,
    borderRadius: 53,
    borderWidth: 12,
    borderColor: '#FFFFFF88',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringText: { color: colors.paper, fontSize: 27, fontWeight: '900' },
  heroCopy: { flex: 1, gap: spacing.sm },
  heroTitle: { color: colors.paper, fontSize: 25, lineHeight: 34, fontWeight: '900' },
  heroSub: { color: '#E3DFFF', fontSize: 16, fontWeight: '800' },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  metricCard: { width: '47%', minHeight: 114 },
  metricTitle: { color: colors.muted, fontSize: 13, fontWeight: '800' },
  metricValue: { fontSize: 28, fontWeight: '900' },
  metricUnit: { color: colors.text, fontSize: 14, fontWeight: '800' },
  chartCard: {
    height: 160,
    borderRadius: 22,
    backgroundColor: '#FFF4F4',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  chartLine: {
    height: 7,
    width: '92%',
    borderRadius: 7,
    backgroundColor: colors.red,
    marginHorizontal: '4%',
    marginBottom: 62,
    transform: [{ rotate: '-8deg' }],
  },
  chartDot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.green,
  },
});
