import { Ionicons } from '@expo/vector-icons';
import { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors, radius, spacing } from '../theme';

export function DataCard({
  title,
  subtitle,
  value,
  status = 'default',
  children,
  onPress,
  style,
}: PropsWithChildren<{
  title?: string;
  subtitle?: string;
  value?: string;
  status?: 'default' | 'success' | 'warning' | 'pending';
  onPress?: () => void;
  style?: ViewStyle;
}>) {
  const body = (
    <View style={[styles.card, styles[`${status}Card`], style]}>
      {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
      {value ? <Text style={[styles.cardValue, styles[`${status}Text`]]}>{value}</Text> : null}
      {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
  if (!onPress) return body;
  return <Pressable onPress={onPress}>{body}</Pressable>;
}

export function SectionTitle({ children, action }: PropsWithChildren<{ action?: string }>) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

export function ProgressBar({ value, max = 1, label }: { value?: number; max?: number; label?: string }) {
  const ratio = value === undefined || max <= 0 ? undefined : value / max;
  const width = ratio === undefined ? 0 : Math.min(Math.max(ratio * 100, 0), 100);
  return (
    <View style={styles.progressWrap}>
      {label ? <Text style={styles.progressLabel}>{label}</Text> : null}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${width}%` }]} />
      </View>
      {ratio === undefined ? <Text style={styles.emptyText}>待记录体重后展示</Text> : null}
    </View>
  );
}

export function CheckInPill({ label, done, icon }: { label: string; done: boolean; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={[styles.pill, done && styles.pillDone]}>
      <Ionicons name={icon} size={16} color={done ? colors.paper : colors.muted} />
      <Text style={[styles.pillText, done && styles.pillTextDone]}>{label}</Text>
    </View>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

export function ActionButton({
  children,
  onPress,
  tone = 'purple',
}: PropsWithChildren<{
  onPress: () => void;
  tone?: 'purple' | 'red' | 'light';
}>) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        styles[`${tone}Button`],
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={[styles.actionButtonText, tone === 'light' && styles.lightButtonText]}>
        {children}
      </Text>
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
    shadowColor: colors.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  defaultCard: {},
  successCard: { backgroundColor: colors.greenSoft },
  warningCard: { backgroundColor: colors.redSoft },
  pendingCard: { backgroundColor: colors.purpleSoft },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  cardValue: { color: colors.text, fontSize: 28, fontWeight: '900' },
  defaultText: { color: colors.text },
  successText: { color: colors.greenDark },
  warningText: { color: colors.danger },
  pendingText: { color: colors.purple },
  cardSubtitle: { color: colors.muted, fontSize: 14, lineHeight: 22, fontWeight: '700' },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: { color: colors.text, fontSize: 22, fontWeight: '900' },
  action: { color: colors.purple, fontSize: 14, fontWeight: '900' },
  progressWrap: { gap: spacing.xs },
  progressLabel: { color: colors.muted, fontSize: 12 },
  track: { height: 10, borderRadius: radius.sm, backgroundColor: colors.oat, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.sm, backgroundColor: colors.red },
  pill: {
    minHeight: 36,
    borderRadius: radius.sm,
    borderWidth: 0,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.paper,
  },
  pillDone: { backgroundColor: colors.purple },
  pillText: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  pillTextDone: { color: colors.paper },
  empty: { alignItems: 'center', padding: spacing.lg, gap: spacing.xs },
  emptyTitle: { color: colors.text, fontSize: 16, fontWeight: '900' },
  emptyText: { color: colors.muted, fontSize: 13, lineHeight: 19, textAlign: 'center' },
  actionButton: {
    alignSelf: 'flex-start',
    minHeight: 44,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purpleButton: { backgroundColor: colors.purple },
  redButton: { backgroundColor: colors.red },
  lightButton: { backgroundColor: colors.paper },
  buttonPressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  actionButtonText: { color: colors.paper, fontSize: 15, fontWeight: '900' },
  lightButtonText: { color: colors.purple },
});
