import { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton, DataCard } from '../components/ui';
import { dabingRecipes, getRecipeVisual, qinHaoRecipes } from '../domain/recipes';
import { RecipeDay } from '../domain/types';
import { useTabNavigation } from '../navigation/tab-navigation';
import { useAppActions, useAppStore } from '../store/app-store';
import { colors, spacing } from '../theme';
import { screen } from './home-screen';

export function RecipePlanScreen() {
  const navigation = useTabNavigation();
  const selectedDate = useAppStore((state) => state.selectedDate);
  const daily = useAppStore((state) => state.dailyCheckIns[state.selectedDate]);
  const dietRecord = useAppStore((state) => state.dietCheckIns[state.selectedDate]);
  const currentPlan = useAppStore((state) => state.userSettings.currentPlan);
  const todayRecipe = useAppStore((state) => state.getTodayRecipe(state.selectedDate));
  const actions = useAppActions();
  const [expanded, setExpanded] = useState('qin-hao-1');
  const [saveMessage, setSaveMessage] = useState('');
  const recipes = currentPlan === 'qin_hao_15' ? qinHaoRecipes : dabingRecipes;
  const planLabel = currentPlan === 'qin_hao_15' ? '秦昊15天' : '大冰7天循环';
  const activeRecipe = recipes.find((recipe) => recipe.id === dietRecord?.recipeId) ?? todayRecipe ?? recipes[0];
  const activeVisual = getRecipeVisual(activeRecipe);

  useEffect(() => {
    if (activeRecipe?.id) setExpanded(activeRecipe.id);
  }, [activeRecipe?.id]);

  useEffect(() => {
    setSaveMessage('');
  }, [currentPlan]);

  const saveDiet = (recipe: RecipeDay, followedRecipe: boolean) => {
    actions.saveDietCheckIn({
      date: selectedDate,
      followedRecipe,
      recipeId: recipe.id,
      violationFoods: followedRecipe
        ? []
        : [{ id: `v-${Date.now()}`, date: selectedDate, foodName: '违规进食' }],
    });
    setExpanded(recipe.id);
    setSaveMessage(followedRecipe ? `${recipe.stageName} 已完成` : `${recipe.stageName} 已记录未按食谱`);
  };

  return (
    <SafeAreaView style={screen.safe} edges={['top']}>
      <ScrollView contentContainerStyle={screen.content}>
        <View style={local.navBar}>
          <Text accessibilityRole="button" onPress={() => navigation.navigate('Home')} style={local.navButton}>‹</Text>
          <Text style={local.navTitle}>饮食 & 食谱</Text>
          <Text accessibilityRole="button" onPress={() => setExpanded(recipes[0].id)} style={local.navButton}>⌕</Text>
        </View>

        <View style={local.sectionHeader}>
          <Text style={screen.title}>今日食谱</Text>
          <Text style={local.planBadge}>{planLabel}</Text>
        </View>

        <View style={local.todayCard}>
          <View style={local.todayCopy}>
            <Text style={local.todayTitle}>{recipeTitle(activeRecipe)}</Text>
            <Text style={local.todaySub}>{activeRecipe.meals.map((meal) => meal.content).slice(0, 2).join('；')}</Text>
            <ActionButton
              onPress={() => saveDiet(activeRecipe, true)}
            >
              {dietRecord?.recipeId === activeRecipe.id
                ? dietRecord.followedRecipe
                  ? '已按食谱完成'
                  : '已记录未按食谱'
                : daily?.hasDietRecord
                  ? '更新为此食谱'
                  : '+ 饮食打卡'}
            </ActionButton>
            {saveMessage ? <Text style={local.savedText}>{saveMessage}</Text> : null}
          </View>
          <View style={[local.foodBadge, local[`${activeVisual.tone}Badge`]]}>
            <Text style={local.foodEmoji}>{activeVisual.emoji}</Text>
            <Text style={local.foodLabel}>{activeVisual.label}</Text>
          </View>
        </View>

        <View style={local.tabs}>
          <Pressable
            style={[local.tab, currentPlan === 'qin_hao_15' && local.tabActive]}
            onPress={() => actions.setCurrentPlan('qin_hao_15')}
          >
            <Text style={[local.tabText, currentPlan === 'qin_hao_15' && local.tabTextActive]}>秦昊15天</Text>
          </Pressable>
          <Pressable
            style={[local.tab, currentPlan === 'dabing_7_cycle' && local.tabActive]}
            onPress={() => actions.setCurrentPlan('dabing_7_cycle')}
          >
            <Text style={[local.tabText, currentPlan === 'dabing_7_cycle' && local.tabTextActive]}>大冰7天循环</Text>
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
            record={dietRecord?.recipeId === recipe.id ? dietRecord : undefined}
            onPress={() => setExpanded(expanded === recipe.id ? '' : recipe.id)}
            onComplete={() => saveDiet(recipe, true)}
            onViolate={() => saveDiet(recipe, false)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function RecipeItem({
  recipe,
  expanded,
  record,
  onPress,
  onComplete,
  onViolate,
}: {
  recipe: RecipeDay;
  expanded: boolean;
  record?: { followedRecipe: boolean };
  onPress: () => void;
  onComplete: () => void;
  onViolate: () => void;
}) {
  const visual = getRecipeVisual(recipe);
  return (
    <DataCard
      title={`${recipe.planType === 'qin_hao_15' ? `Day ${recipe.day}` : `循环第${recipe.cycleDay}天`} · ${recipe.stageName}`}
      subtitle={
        recipe.estimatedWeightLossJin !== undefined
          ? `预计掉秤 ${recipe.estimatedWeightLossJin}斤`
          : recipe.estimatedWeightLossText
      }
      onPress={expanded ? undefined : onPress}
      style={expanded ? local.expandedCard : undefined}
    >
      {!expanded ? (
        <View style={local.collapsedRow}>
          <Text style={local.recipePreview}>{recipe.meals[0]?.content}</Text>
          <View style={[local.recipeBadge, local[`${visual.tone}Badge`]]}>
            <Text style={local.recipeEmoji}>{visual.emoji}</Text>
          </View>
        </View>
      ) : null}
      {record ? (
        <Text style={[local.recordStatus, record.followedRecipe ? local.recordDone : local.recordWarning]}>
          {record.followedRecipe ? '已按食谱完成' : '已记录未按食谱'}
        </Text>
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
            <ActionButton tone={record?.followedRecipe ? 'purple' : 'light'} onPress={onComplete}>
              {record?.followedRecipe ? '已完成' : '按食谱完成'}
            </ActionButton>
            <ActionButton tone={record && !record.followedRecipe ? 'red' : 'light'} onPress={onViolate}>
              {record && !record.followedRecipe ? '已记录未按食谱' : '记录未按食谱'}
            </ActionButton>
            <ActionButton tone="light" onPress={onPress}>收起</ActionButton>
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
  planBadge: {
    color: colors.purple,
    fontSize: 13,
    fontWeight: '900',
    backgroundColor: colors.purpleSoft,
    borderRadius: 14,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  todayCard: {
    minHeight: 184,
    borderRadius: 26,
    backgroundColor: colors.paper,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 12px 24px rgba(143, 151, 166, 0.16)' },
      default: {
        shadowColor: colors.shadow,
        shadowOpacity: 0.16,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 12 },
      },
    }),
    elevation: 4,
  },
  todayCopy: { flex: 1, minWidth: 0, gap: spacing.sm },
  todayTitle: { color: colors.text, fontSize: 21, fontWeight: '900' },
  todaySub: { color: colors.muted, fontSize: 14, lineHeight: 21, fontWeight: '800' },
  foodBadge: {
    width: 82,
    minHeight: 102,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    flexShrink: 0,
  },
  foodEmoji: { fontSize: 42, lineHeight: 50 },
  foodLabel: { color: colors.text, fontSize: 12, fontWeight: '900' },
  milkBadge: { backgroundColor: '#F1F6FF' },
  cornBadge: { backgroundColor: '#FFF3BF' },
  fruitBadge: { backgroundColor: '#FFE8EF' },
  proteinBadge: { backgroundColor: '#FFF0DB' },
  greensBadge: { backgroundColor: '#E6F8EA' },
  balancedBadge: { backgroundColor: '#EEF0FF' },
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
  collapsedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  recipePreview: { flex: 1, color: colors.muted, fontSize: 14, lineHeight: 20, fontWeight: '800' },
  recipeBadge: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  recipeEmoji: { fontSize: 28 },
  expandedCard: { backgroundColor: colors.paper },
  rule: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: spacing.sm },
  savedText: { color: colors.greenDark, fontSize: 13, fontWeight: '900' },
  recordStatus: {
    alignSelf: 'flex-start',
    borderRadius: 14,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: 13,
    fontWeight: '900',
  },
  recordDone: { color: colors.greenDark, backgroundColor: colors.greenSoft },
  recordWarning: { color: colors.danger, backgroundColor: colors.redSoft },
});

function recipeTitle(recipe: RecipeDay) {
  return `${recipe.planType === 'qin_hao_15' ? `第 ${recipe.day} 天` : `循环第${recipe.cycleDay}天`} · ${recipe.stageName}`;
}
