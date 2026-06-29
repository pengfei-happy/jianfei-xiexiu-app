import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppProvider } from './src/store/app-store';
import { DashboardScreen } from './src/screens/dashboard-screen';
import { ExerciseScreen } from './src/screens/exercise-screen';
import { HomeScreen } from './src/screens/home-screen';
import { ProfileScreen } from './src/screens/profile-screen';
import { RecipePlanScreen } from './src/screens/recipe-plan-screen';
import { colors } from './src/theme';
import { TabNavigationProvider } from './src/navigation/tab-navigation';
import { TabParamList } from './src/types/navigation';

type TabName = keyof TabParamList;

const tabs: Array<{ name: TabName; title: string; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap }> = [
  { name: 'Home', title: '首页', icon: 'home-outline', activeIcon: 'home' },
  { name: 'Dashboard', title: '数据看板', icon: 'bar-chart-outline', activeIcon: 'bar-chart' },
  { name: 'Exercise', title: '运动记录', icon: 'barbell-outline', activeIcon: 'barbell' },
  { name: 'Recipes', title: '饮食', icon: 'restaurant-outline', activeIcon: 'restaurant' },
  { name: 'Profile', title: '我的', icon: 'person-outline', activeIcon: 'person' },
];

function MainTabs() {
  const [activeTab, setActiveTab] = useState<TabName>('Home');
  const ActiveScreen = {
    Home: HomeScreen,
    Dashboard: DashboardScreen,
    Exercise: ExerciseScreen,
    Recipes: RecipePlanScreen,
    Profile: ProfileScreen,
  }[activeTab];

  return (
    <TabNavigationProvider navigate={setActiveTab}>
      <View style={styles.tabShell}>
        <View style={styles.scene}>
          <ActiveScreen />
        </View>
        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const focused = activeTab === tab.name;
            const color = focused ? colors.purple : colors.muted;
            return (
              <Pressable
                key={tab.name}
                accessibilityRole="button"
                accessibilityState={{ selected: focused }}
                onPress={() => setActiveTab(tab.name)}
                style={({ pressed }) => [styles.tabItem, pressed && styles.tabPressed]}
              >
                <Ionicons name={focused ? tab.activeIcon : tab.icon} size={23} color={color} />
                <Text style={[styles.tabLabel, { color }, focused && styles.tabLabelActive]}>{tab.title}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </TabNavigationProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <View style={styles.stage}>
          <View style={styles.appFrame}>
            <StatusBar style="dark" />
            <MainTabs />
          </View>
        </View>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Platform.OS === 'web' ? '#DEE5EF' : colors.background,
  },
  appFrame: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 520 : undefined,
    backgroundColor: colors.background,
    ...Platform.select({
      web: { boxShadow: '0 18px 38px rgba(90, 101, 122, 0.20)' },
      default: {
        shadowColor: '#A7B1C2',
        shadowOpacity: 0,
        shadowRadius: 30,
      },
    }),
  },
  tabShell: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scene: {
    flex: 1,
  },
  tabBar: {
    height: 82,
    paddingTop: 8,
    paddingBottom: 20,
    borderTopWidth: 0,
    backgroundColor: colors.paper,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    minWidth: 58,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    ...Platform.select({ web: { cursor: 'pointer' }, default: {} }),
  },
  tabPressed: {
    opacity: 0.72,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
  tabLabelActive: {
    color: colors.purple,
  },
});
