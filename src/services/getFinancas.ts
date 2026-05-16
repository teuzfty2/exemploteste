import api from './api';
import type { FinanceEntry } from '../types/finance';

export const getFinancas = async (): Promise<FinanceEntry[]> => {
  console.log("Buscando finanças no servidor...");
  const response = await api.get('/money/financas');
  console.log("Dados recebidos:", response.data);
  return response.data;
};