import { createContext } from 'react';

export const SneakPeakContext = createContext<[boolean, (value: boolean) => void]>([false, () => {}]);
