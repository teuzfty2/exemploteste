// Libs
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
import type { FinanceEntry } from "../types/finance";

// Tipagem da store financeira
interface FinanceState {
  entries: FinanceEntry[];
  addEntry: (entry: FinanceEntry) => void;
  deleteEntry: (id: string) => void;
  getEntriesByDate: (date: string) => FinanceEntry[];
}


// Criação da store global
export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({

      // Estado inicial
      entries: [],

      // Adiciona nova entrada na lista
      addEntry: (entry) =>
        set((state) => ({ entries: [...state.entries, entry] })),

      // Remove entrada pelo ID
      deleteEntry: (id) =>
        set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),

      // Retorna entradas de uma data específica
      getEntriesByDate: (date) => get().entries.filter((e) => e.date === date),
    }),
    
    {
      // Nome salvo no localStorage
      name: "financa-diaria-storage",
    },
  ),
);
