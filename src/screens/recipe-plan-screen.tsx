import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton, DataCard } from '../components/ui';
import { dabingRecipes, qinHaoRecipes } from '../domain/recipes';
import { PlanType, RecipeDay } from '../domain/types';
import { useAppActions } from '../store/app-store';
import { colors, spacing } from '../theme';
import { screen } from './home-screen';

export function RecipePlanScreen() {
  const actions = useAppActions();
  const [plan, setPlan] = useState<PlanType>('qin_hao_15');
  const [expanded, setExpanded] = useState('qin-hao-1');
  const recipes = plan === 'qin_hao_15' ? qinHaoRecipes : dabingRecipes;

  return (
    <SafeAreaView style={screen.safe} edges={['top']}>
      <ScrollView contentContainerStyle={screen.content}>
        <View style={local.navBar}>
          <Text style={local.navButton}>‹</Text>
          <Text style={local.navTitle}>饮食 & 食谱</Text>
          <Text style={local.navButton}>⌕</Text>
        </View>

        <View style={local.sectionHeader}>
          <Text style={screen.title}>今日食谱</Text>
          <Text style={local.link}>{plan === 'qin_hao_15' ? '15天计划' : '7天循环'}</Text>
        </View>

        <View style={local.todayCard}>
          <View style={local.todayCopy}>
            <Text style={local.todayTitle}>{recipes[0].day === 1 ? '第 1 天 · ' : ''}{recipes[0].stageName}</Text>
            <Text style={local.todaySub}>{recipes[0].meals.map((meal) => meal.content).slice(0, 2).join('；')}</Text>
            <ActionButton
              onPress={() => actions.saveDietCheckIn({
                date: actions.selectedDate,
                followedRecipe: true,
                violationFoods: [],
              })}
            >
              + 饮食打卡
            </ActionButton>
          </View>
          <Text style={local.foodEmoji}>{plan === 'qin_hao_15' ? '🥛' : '🍲'}</Text>
        </View>

        <View style={local.tabs}>
          <Pressable
            style={[local.tab, plan === 'qin_hao_15' && local.tabActive]}
            onPress={() => setPlan('qin_hao_15')}
          >
            <Text style={[local.tabText, plan === 'qin_hao_15' && local.tabTextActive]}>秦昊15天</Text>
          </Pressable>
          <Pressable
            style={[local.tab, plan === 'dabing_7_cycle' && local.tabActive]}
            onPress={() => setPlan('dabing_7_cycle')}
          >
            <Text style={[local.tabText, plan === 'dabing_7_cycle' && local.tabTextActive]}>大冰7天循环</Text>
          </Pressable>
        </View>

        <View style={local.mealTabs}>
          {['全部', '早餐', '午餐', '晚餐', '加餐'].map((item, index) => (
            <Text key={item} style={[local.mealTab, index === 0 && local.mealTabActive]}>{item}</Text>
          ))}
        </View>

        {recipes.map((recipe) => (
          <RecipeItem
            key={recipe.id}
            recipe={recipe}
            expanded={expanded === recipe.id}
            onPress={() => setExpanded(expanded === recipe.id ? '' : recipe.id)}
            onComplete={() => actions.saveDietCheckIn({
              date: actions.selectedDate,
              followedRecipe: true,
              violationFoods: [],
            })}
            onViolate={() => actions.saveDietCheckIn({
              date: actions.selectedDate,
              followedRecipe: false,
              violationFoods: [{
                id: `v-${Date.now()}`,
                date: actions.selectedDate,
                foodName: '违规进食',
              }],
            })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function RecipeItem({
  recipe,
  expanded,
  onPress,
  onComplete,
  onViolate,
}: {
  recipe: RecipeDay;
  expanded: boolean;
  onPress: () => void;
  onComplete: () => void;
  onViolate: () => void;
}) {
  return (
    <DataCard
      title={`${recipe.planType === 'qin_hao_15' ? `Day ${recipe.day}` : `循环第${recipe.cycleDay}天`} · ${recipe.stageName}`}
      subtitle={
        recipe.estimatedWeightLossJin !== undefined
          ? `预计掉秤 ${recipe.estimatedWeightLossJin}斤`
          : recipe.estimatedWeightLossText
      }
      onPress={onPress}
      style={expanded ? local.expandedCard : undefined}
    >
      {!expanded ? (
        <View style={local.collapsedRow}>
          <Text style={local.recipePreview}>{recipe.meals[0]?.content}</Text>
          <Text style={local.recipeEmoji}>{recipe.planType === 'qin_hao_15' ? '🥗' : '🍵'}</Text>
        </View>
      ) : null}
      {expanded ? (
        <>
          {recipe.meals.map((meal) => (
            <View key={meal.type} style={screen.mealRow}>
              <Text style={screen.mealLabel}>{meal.label}</Text>
              <Text style={screen.mealText}>{meal.content}</Text>
            </View>
          ))}
          <Text style={local.rule}>{recipe.coreRule}</Text>
          <View style={screen.quickRow}>
            <ActionButton tone="light" onPress={onComplete}>按食谱完成</ActionButton>
            <ActionButton tone="light" onPress={onViolate}>记录未按食谱</ActionButton>
          </View>
        </>
      ) : null}
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
  navTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  link: { color: colors.purple, fontSize: 14, fontWeight: '900' },
  todayCard: {
    minHeight: 184,
    borderRadius: 26,
    backgroundColor: colors.paper,
    padding: spacing.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  todayCopy: { flex: 1, gap: spacing.sm },
  todayTitle: { color: colors.text, fontSize: 21, fontWeight: '900' },
  todaySub: { color: colors.muted, fontSize: 14, lineHeight: 21, fontWeight: '800' },
  foodEmoji: { position: 'absolute', right: 22, top: 42, fontSize: 68 },
  tabs: { flexDirection: 'row', gap: spacing.sm },
  tab: {
    flex: 1,
    borderRadius: 18,
    padding: spacing.md,
    alignItems: 'center',
    backgroundColor: '#ECEFF6',
  },
  tabActive: { backgroundColor: colors.purple },
  tabText: { color: colors.muted, fontWeight: '800' },
  tabTextActive: { color: colors.paper },
  mealTabs: { flexDirection: 'row', gap: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.line },
  mealTab: { color: colors.muted, fontSize: 14, fontWeight: '900', paddingBottom: spacing.sm },
  mealTabActive: { color: colors.purple, borderBottomWidth: 3, borderBottomColor: colors.purple },
  collapsedRow: { flexDirection: 'row', alignItems: 'center' },
  recipePreview: { flex: 1, color: colors.muted, fontSize: 14, lineHeight: 20, fontWeight: '800' },
  recipeEmoji: { fontSize: 42 },
  expandedCard: { backgroundColor: colors.paper },
  rule: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: spacing.sm },
});
