import AsyncStorage from '@react-native-async-storage/async-storage';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useSyncExternalStore } from 'react';

import { SlimState, createSlimStore } from './slim-store';

const storageKey = 'slim_app:state:v1';
const store = createSlimStore();
const StoreContext = createContext(store);

type PersistedState = Pick<SlimState, 'userSettings' | 'weightRecords' | 'dietCheckIns' | 'exerciseRecords' | 'dailyCheckIns' | 'selectedDate'>;

export function AppProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    AsyncStorage.getItem(storageKey)
      .then((value) => {
        if (!value) return;
        store.setState(JSON.parse(value) as PersistedState);
      })
      .catch(() => undefined);

    return store.subscribe((state) => {
      const snapshot: PersistedState = {
        userSettings: state.userSettings,
        weightRecords: state.weightRecords,
        dietCheckIns: state.dietCheckIns,
        exerciseRecords: state.exerciseRecords,
        dailyCheckIns: state.dailyCheckIns,
        selectedDate: state.selectedDate,
      };
      AsyncStorage.setItem(storageKey, JSON.stringify(snapshot)).catch(() => undefined);
    });
  }, []);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useAppStore<T>(selector: (state: SlimState) => T): T {
  const currentStore = useContext(StoreContext);
  return useSyncExternalStore(
    currentStore.subscribe,
    () => selector(currentStore.getState()),
    () => selector(currentStore.getState())
  );
}

export function useAppActions() {
  const currentStore = useContext(StoreContext);
  return useMemo(() => currentStore.getState(), [currentStore]);
}
