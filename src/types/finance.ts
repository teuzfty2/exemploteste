export type EntryType = "ganho" | "gasto";

export interface FinanceEntry {
  id: string;
  category: string; // Novo campo para o grupo (ex: Cartão, Supermercado)
  description: string; // Descrição detalhada
  amount: number;
  type: EntryType;
  date: string;
}

export interface DailySummary {
  date: string;
  totalGanhos: number;
  totalGastos: number;
  saldo: number;
}