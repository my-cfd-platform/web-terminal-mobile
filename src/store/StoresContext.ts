import { createContext } from 'react';
import { RootStore } from './RootStore';

export const StoresContext = createContext(new RootStore());

export type StoresContextType = typeof StoresContext;
