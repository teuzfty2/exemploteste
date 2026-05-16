import api from './api';
import type { FinanceEntry } from '../types/finance';

export const postFinancas = async (entry: FinanceEntry) => {
  console.log("Enviando novo lançamento:", entry);
  const response = await api.post('/money/financas', entry);
  console.log("Resposta do servidor:", response.data);
  return response.data;
};