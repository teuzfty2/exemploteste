import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FinanceEntry } from '../types/finance';

interface FinanceState {
  entries: FinanceEntry[];
  addEntry: (entry: FinanceEntry) => void;
  deleteEntry: (id: string) => void;
  getEntriesByDate: (date: string) => FinanceEntry[];
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: (entry) => 
        set((state) => ({ entries: [...state.entries, entry] })),
      deleteEntry: (id) => 
        set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),
      getEntriesByDate: (date) => 
        get().entries.filter((e) => e.date === date),
    }),
    {
      name: 'financa-diaria-storage',
    }
  )
);