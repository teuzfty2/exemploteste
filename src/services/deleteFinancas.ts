import api from './api';

export const deleteFinancas = async (id: string) => {
  console.log("Deletando lançamento ID:", id);
  // Geralmente o ID é enviado na URL para deleção
  const response = await api.delete(`/money/financas/${id}`);
  console.log("Resposta da deleção:", response.data);
  return response.data;
};