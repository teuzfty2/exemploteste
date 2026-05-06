import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Plus, Trash2, TrendingUp, TrendingDown, Wallet, ReceiptText } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { FinanceEntry } from '../types/finance';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DailyDetails = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'ganho' | 'gasto'>('ganho');

  useEffect(() => {
    const saved = localStorage.getItem(`finance_${date}`);
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, [date]);

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
    <div className="space-y-8 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/')}
        className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium"
      >
        <div className="p-1.5 rounded-lg group-hover:bg-primary/10 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span>Voltar ao calendário</span>
      </button>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <ReceiptText size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 capitalize tracking-tight">
            {formattedDate}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Controle de fluxo de caixa diário</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 group hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Entradas</span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            R$ {totalGanhos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 group hover:border-rose-200 dark:hover:border-rose-900/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-rose-100 dark:bg-rose-900/30 p-3 rounded-xl text-rose-600 dark:text-rose-400">
              <TrendingDown size={24} />
            </div>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Saídas</span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            R$ {totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className={cn(
          "p-6 rounded-2xl shadow-lg transition-all border",
          saldo >= 0 
            ? "bg-primary text-white border-primary shadow-primary/20" 
            : "bg-rose-600 text-white border-rose-600 shadow-rose-600/20"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl text-white">
              <Wallet size={24} />
            </div>
            <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Saldo Final</span>
          </div>
          <p className="text-2xl font-black">
            R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
          <Plus size={20} className="text-primary" />
          Novo Lançamento
        </h3>
        <form onSubmit={handleAddEntry} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <input
              type="text"
              placeholder="O que você comprou ou recebeu?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              required
            />
          </div>
          <div className="md:col-span-3">
            <input
              type="number"
              step="0.01"
              placeholder="Valor (R$)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              required
            />
          </div>
          <div className="md:col-span-3">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'ganho' | 'gasto')}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="ganho">🟢 Ganho</option>
              <option value="gasto">🔴 Gasto</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <button 
              type="submit"
              className="w-full h-full bg-primary text-white p-3 rounded-xl hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center"
            >
              <Plus size={24} />
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Descrição</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Tipo</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Valor</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <ReceiptText size={48} strokeWidth={1} />
                      <p className="font-medium">Nenhum lançamento registrado hoje.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-5 font-semibold text-slate-700 dark:text-slate-200">{entry.description}</td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                        entry.type === 'ganho' 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                          : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                      )}>
                        {entry.type === 'ganho' ? 'Entrada' : 'Saída'}
                      </span>
                    </td>
                    <td className={cn(
                      "px-8 py-5 text-right font-bold tabular-nums",
                      entry.type === 'ganho' ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {entry.type === 'ganho' ? '+' : '-'} R$ {entry.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
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
    </div>
  );
};

export default DailyDetails;