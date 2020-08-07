import { useContext } from 'react';
import { StoresContext } from '../store/StoresContext';

export const useStores = () => useContext(StoresContext);
