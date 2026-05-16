import { create } from "zustand";
import type { FinanceEntry } from "../types/finance";
import { postFinancas } from "../services/postFinancas";
import { deleteFinancas } from "../services/deleteFinancas";
import toast from "react-hot-toast";

interface FinanceState {
  entries: FinanceEntry[];
  setEntries: (entries: FinanceEntry[]) => void;
  addEntry: (entry: FinanceEntry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntriesByDate: (date: string) => FinanceEntry[];
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  entries: [],

  setEntries: (entries) => set({ entries }),

  addEntry: async (entry) => {
    const loadingToast = toast.loading("Salvando no banco...");
    try {
      await postFinancas(entry);
      set((state) => ({ entries: [...state.entries, entry] }));
      toast.success("Lançamento salvo!", { id: loadingToast });
    } catch (error) {
      console.error("Erro no Servidor (500):", error);
      toast.error("Erro no servidor ao salvar!", { id: loadingToast });
      throw error;
    }
  },

  deleteEntry: async (id) => {
    const loadingToast = toast.loading("Removendo...");
    try {
      await deleteFinancas(id);
      set((state) => ({ entries: state.entries.filter((e) => e.id !== id) }));
      toast.success("Removido com sucesso!", { id: loadingToast });
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Não foi possível deletar no servidor.", { id: loadingToast });
    }
  },

  getEntriesByDate: (date) => get().entries.filter((e) => e.date === date),
}));