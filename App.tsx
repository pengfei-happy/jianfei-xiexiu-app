import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { AppProvider } from './src/store/app-store';
import { DashboardScreen } from './src/screens/dashboard-screen';
import { ExerciseScreen } from './src/screens/exercise-screen';
import { HomeScreen } from './src/screens/home-screen';
import { ProfileScreen } from './src/screens/profile-screen';
import { RecipePlanScreen } from './src/screens/recipe-plan-screen';
import { colors } from './src/theme';
import { RootStackParamList, TabParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: route.name === 'Home' ? colors.red : colors.purple,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          height: 82,
          paddingTop: 8,
          paddingBottom: 20,
          borderTopWidth: 0,
          backgroundColor: colors.paper,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '800' },
        tabBarIcon: ({ focused }) => {
          const icons: Record<keyof TabParamList, string> = {
            Home: '🏠',
            Dashboard: '📊',
            Exercise: '🏋️',
            Recipes: '🥗',
            Profile: '👤',
          };
          return <Text style={[styles.tabEmoji, focused && styles.tabEmojiActive]}>{icons[route.name]}</Text>;
        },
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} options={{ title: '首页' }} />
      <Tabs.Screen name="Dashboard" component={DashboardScreen} options={{ title: '数据看板' }} />
      <Tabs.Screen name="Exercise" component={ExerciseScreen} options={{ title: '运动记录' }} />
      <Tabs.Screen name="Recipes" component={RecipePlanScreen} options={{ title: '饮食' }} />
      <Tabs.Screen name="Profile" component={ProfileScreen} options={{ title: '我的' }} />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <View style={styles.stage}>
          <View style={styles.appFrame}>
            <NavigationContainer>
              <StatusBar style="dark" />
              <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
                <Stack.Screen name="Main" component={MainTabs} />
              </Stack.Navigator>
            </NavigationContainer>
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
    shadowColor: '#A7B1C2',
    shadowOpacity: Platform.OS === 'web' ? 0.2 : 0,
    shadowRadius: 30,
  },
  tabEmoji: {
    fontSize: 22,
    opacity: 0.72,
  },
  tabEmojiActive: {
    opacity: 1,
  },
});
