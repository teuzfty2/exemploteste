import { create } from "zustand";
import type { FinanceEntry } from "../types/finance";
import { postFinancas } from "../services/postFinancas";

interface FinanceState {
  entries: FinanceEntry[];
  setEntries: (entries: FinanceEntry[]) => void;
  addEntry: (entry: FinanceEntry) => Promise<void>;
  deleteEntry: (id: string) => void;
  getEntriesByDate: (date: string) => FinanceEntry[];
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  entries: [],

  setEntries: (entries) => set({ entries }),

  addEntry: async (entry) => {
    try {
      await postFinancas(entry);
      set((state) => ({ entries: [...state.entries, entry] }));
    } catch (error) {
      console.error("Erro ao salvar no banco:", error);
      throw error;
    }
  },

  deleteEntry: (id) =>
    set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),

  getEntriesByDate: (date) => get().entries.filter((e) => e.date === date),
}));