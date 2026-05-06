export type EntryType = 'ganho' | 'gasto';

export interface FinanceEntry {
  id: string;
  description: string;
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