import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ReceiptText,
  ChevronLeft,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useFinanceStore } from '../store/useFinanceStore';
import type { FinanceEntry } from '../types/finance';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DailyDetails = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { addEntry, deleteEntry, entries: allEntries } = useFinanceStore();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'ganho' | 'gasto'>('ganho');

  const entries = allEntries.filter(e => e.date === date);

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

    addEntry(newEntry);
    setDescription('');
    setAmount('');
  };

  const totalGanhos = entries
    .filter(e => e.type === 'ganho')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalGastos = entries
    .filter(e => e.type === 'gasto')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const saldo = totalGanhos - totalGastos;

  const currentDateObj = date ? parseISO(date) : new Date();
  // Removida a classe capitalize depois, então aqui fica no formato padrão natural
  const formattedDate = format(currentDateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  // Datas para navegação rápida
  const prevDayStr = format(subDays(currentDateObj, 1), 'yyyy-MM-dd');
  const nextDayStr = format(addDays(currentDateObj, 1), 'yyyy-MM-dd');

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto pb-20 md:pb-0">
      <button 
        onClick={() => navigate('/financas')}
        className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium"
      >
        <div className="p-1.5 rounded-lg group-hover:bg-primary/10 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span>Voltar para Visão Mensal</span>
      </button>

      {/* Header com Navegação de Data Embutida */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5 pointer-events-none">
          <ReceiptText size={80} className="md:w-[120px] md:h-[120px]" />
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            {/* Wrapper invisível com overflow-hidden para dar o efeito de "recorte" da roleta do relógio */}
            <div className="overflow-hidden pb-1">
              <h2 
                key={date} // A chave muda quando a data muda, forçando o React a recriar e rodar a animação
                className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight animate-in fade-in slide-in-from-top-8 duration-300"
              >
                {formattedDate}
              </h2>
            </div>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium mt-1">Fluxo de caixa diário</p>
          </div>

          {/* Controles de Calendário na aba do Dia */}
          <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 w-full sm:w-auto justify-between sm:justify-start">
            <button 
              onClick={() => navigate(`/dia/${prevDayStr}`)}
              className="p-2 md:p-3 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all hover:shadow-sm text-slate-600 dark:text-slate-300"
              title="Dia anterior"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div 
              className="relative flex-1 sm:flex-none flex items-center justify-center px-4 py-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all hover:shadow-sm cursor-pointer group text-slate-700 dark:text-slate-200" 
              title="Escolher outra data"
            >
              <Calendar size={18} className="mr-2 text-slate-500 group-hover:text-primary transition-colors" />
              <span className="text-sm font-bold">Calendário</span>
              <input 
                type="date" 
                value={date}
                onChange={(e) => { if(e.target.value) navigate(`/dia/${e.target.value}`) }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            <button 
              onClick={() => navigate(`/dia/${nextDayStr}`)}
              className="p-2 md:p-3 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all hover:shadow-sm text-slate-600 dark:text-slate-300"
              title="Próximo dia"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 md:p-3 rounded-xl text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Entradas</span>
          </div>
          <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            R$ {totalGanhos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="bg-rose-100 dark:bg-rose-900/30 p-2 md:p-3 rounded-xl text-rose-600 dark:text-rose-400">
              <TrendingDown size={20} />
            </div>
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Saídas</span>
          </div>
          <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            R$ {totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className={cn(
          "p-5 md:p-6 rounded-2xl shadow-lg border transition-colors",
          saldo >= 0 
            ? "bg-primary text-white border-primary shadow-primary/20" 
            : "bg-rose-600 text-white border-rose-600 shadow-rose-600/20"
        )}>
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="bg-white/20 p-2 md:p-3 rounded-xl text-white">
              <Wallet size={20} />
            </div>
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Saldo</span>
          </div>
          <p className="text-xl md:text-2xl font-black">
            R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
          <Plus size={18} className="text-primary" />
          Novo Lançamento
        </h3>
        <form onSubmit={handleAddEntry} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              step="0.01"
              placeholder="Valor (R$)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              required
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'ganho' | 'gasto')}
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
            >
              <option value="ganho">🟢 Ganho</option>
              <option value="gasto">🔴 Gasto</option>
            </select>
          </div>
          <button 
            type="submit"
            className="w-full bg-primary text-white p-4 rounded-xl font-bold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Adicionar
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white">Lançamentos deste dia</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {entries.length === 0 ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <ReceiptText size={40} strokeWidth={1.5} />
                <p className="text-sm font-medium">Nenhum registro encontrado para este dia.</p>
              </div>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="p-4 md:p-6 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{entry.description}</span>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-wider w-fit px-2 py-0.5 rounded-md",
                    entry.type === 'ganho' 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                      : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                  )}>
                    {entry.type === 'ganho' ? 'Entrada' : 'Saída'}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={cn(
                    "font-bold tabular-nums text-sm md:text-base",
                    entry.type === 'ganho' ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {entry.type === 'ganho' ? '+' : '-'} R$ {entry.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <button 
                    onClick={() => deleteEntry(entry.id)}
                    className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyDetails;