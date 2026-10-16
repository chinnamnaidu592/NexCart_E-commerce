import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const useHasHydrated = () => (
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
);
