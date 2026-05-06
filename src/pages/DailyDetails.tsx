import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { FinanceEntry } from '../types/finance';

const DailyDetails = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'ganho' | 'gasto'>('ganho');

  // Carregar dados do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`finance_${date}`);
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, [date]);

  // Salvar dados no localStorage
  const saveEntries = (newEntries: FinanceEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem(`finance_${date}`, JSON.stringify(newEntries));
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newEntry: FinanceEntry = {
      id: crypto.randomUUID(),
      description,
      amount: parseFloat(amount),
      type,
      date: date!,
    };

    saveEntries([...entries, newEntry]);
    setDescription('');
    setAmount('');
  };

  const handleDeleteEntry = (id: string) => {
    saveEntries(entries.filter(e => e.id !== id));
  };

  const totalGanhos = entries
    .filter(e => e.type === 'ganho')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalGastos = entries
    .filter(e => e.type === 'gasto')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const saldo = totalGanhos - totalGastos;

  const formattedDate = date ? format(parseISO(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : '';

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Voltar ao calendário</span>
      </button>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-1 capitalize">{formattedDate}</h2>
        <p className="text-gray-500">Resumo financeiro do dia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Ganhos</p>
            <p className="text-xl font-bold text-green-600">R$ {totalGanhos.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-lg text-red-600">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Gastos</p>
            <p className="text-xl font-bold text-red-600">R$ {totalGastos.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Saldo Total</p>
            <p className={cn(
              "text-xl font-bold",
              saldo >= 0 ? "text-indigo-600" : "text-red-600"
            )}>
              R$ {saldo.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Novo Lançamento</h3>
        <form onSubmit={handleAddEntry} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="md:col-span-2 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Valor (R$)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
          <div className="flex gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'ganho' | 'gasto')}
              className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="ganho">Ganho</option>
              <option value="gasto">Gasto</option>
            </select>
            <button 
              type="submit"
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus size={24} />
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Valor</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                  Nenhum lançamento para este dia.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{entry.description}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-semibold",
                      entry.type === 'ganho' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {entry.type === 'ganho' ? 'Ganho' : 'Gasto'}
                    </span>
                  </td>
                  <td className={cn(
                    "px-6 py-4 text-right font-bold",
                    entry.type === 'ganho' ? "text-green-600" : "text-red-600"
                  )}>
                    {entry.type === 'ganho' ? '+' : '-'} R$ {entry.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyDetails;