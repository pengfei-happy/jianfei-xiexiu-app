import { createContext, PropsWithChildren, useContext } from 'react';

import { TabParamList } from '../types/navigation';

type TabName = keyof TabParamList;

const TabNavigationContext = createContext<{ navigate: (screen: TabName) => void } | undefined>(undefined);

export function TabNavigationProvider({
  children,
  navigate,
}: PropsWithChildren<{ navigate: (screen: TabName) => void }>) {
  return <TabNavigationContext.Provider value={{ navigate }}>{children}</TabNavigationContext.Provider>;
}

export function useTabNavigation() {
  const context = useContext(TabNavigationContext);
  if (!context) {
    throw new Error('useTabNavigation must be used inside TabNavigationProvider');
  }
  return context;
}
