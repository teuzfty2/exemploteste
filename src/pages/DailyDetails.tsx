"use client";

// Libs
import { useState, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO, addDays, subDays } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

// Icones
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
  Calendar,
  Tag
} from 'lucide-react';

// Types
import { clsx, type ClassValue } from 'clsx';
import type { FinanceEntry } from '../types/finance';

// Store
import { useFinanceStore } from '../store/useFinanceStore';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DailyDetails = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { addEntry, deleteEntry, entries: allEntries } = useFinanceStore();
  
  // Estados do formulário
  const [category, setCategory] = useState(''); // Novo: Categoria/Grupo
  const [description, setDescription] = useState(''); // Descrição detalhada
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'ganho' | 'gasto'>('ganho');
  
  const entries = allEntries.filter(e => e.date === date);

  const handleAddEntry = (e: FormEvent) => {
    e.preventDefault();
    if (!category || !amount) return;

    const newEntry: FinanceEntry = {
      id: crypto.randomUUID(),
      category,
      description,
      amount: parseFloat(amount),
      type,
      date: date!,
    };

    addEntry(newEntry);

    // Limpa formulário
    setCategory('');
    setDescription('');
    setAmount('');
  };

  const totalGanhos = entries.filter(e => e.type === 'ganho').reduce((acc, curr) => acc + curr.amount, 0);
  const totalGastos = entries.filter(e => e.type === 'gasto').reduce((acc, curr) => acc + curr.amount, 0);
  const saldo = totalGanhos - totalGastos;

  const currentDateObj = date ? parseISO(date) : new Date();
  const formattedDate = format(currentDateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const prevDayStr = format(subDays(currentDateObj, 1), 'yyyy-MM-dd');
  const nextDayStr = format(addDays(currentDateObj, 1), 'yyyy-MM-dd');

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 md:space-y-8 max-w-4xl mx-auto pb-20 md:pb-0">
      {/* Cabeçalho */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5 pointer-events-none">
          <ReceiptText size={80} className="md:w-[120px] md:h-[120px]" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/financas')} className="shrink-0 p-3 bg-slate-50 dark:bg-slate-800 hover:bg-primary hover:text-white dark:hover:bg-primary text-slate-500 dark:text-slate-400 rounded-2xl transition-all shadow-sm group">
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{formattedDate}</h2>
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium mt-1">Fluxo de caixa diário</p>
            </div>
          </div>
          <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <button onClick={() => navigate(`/dia/${prevDayStr}`)} className="p-2 md:p-3 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-slate-600 dark:text-slate-300">
              <ChevronLeft size={18} />
            </button>
            <div className="relative flex px-4 py-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer group text-slate-700 dark:text-slate-200">
              <Calendar size={18} className="mr-2 text-slate-500 group-hover:text-primary" />
              <span className="text-sm font-bold">Calendário</span>
              <input type="date" value={date} onChange={(e) => { if(e.target.value) navigate(`/dia/${e.target.value}`) }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
            <button onClick={() => navigate(`/dia/${nextDayStr}`)} className="p-2 md:p-3 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-slate-600 dark:text-slate-300">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: "Entradas", value: totalGanhos, icon: <TrendingUp size={20} />, color: "emerald" },
          { label: "Saídas", value: totalGastos, icon: <TrendingDown size={20} />, color: "rose" },
          { label: "Saldo", value: saldo, icon: <Wallet size={20} />, isSaldo: true }
        ].map((card, idx) => (
          <motion.div key={idx} variants={itemVariants} className={cn("p-5 md:p-6 rounded-2xl border shadow-sm overflow-hidden", card.isSaldo ? (saldo >= 0 ? "bg-primary text-white border-primary shadow-primary/20 shadow-lg" : "bg-rose-600 text-white border-rose-600 shadow-rose-600/20 shadow-lg") : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800")}>
            <div className="flex items-center justify-between mb-3">
              <div className={cn("p-2 rounded-xl", card.isSaldo ? "bg-white/20 text-white" : `bg-${card.color}-100 dark:bg-${card.color}-900/30 text-${card.color}-600 dark:text-${card.color}-400`)}>{card.icon}</div>
              <span className={cn("text-[10px] font-bold uppercase", card.isSaldo ? "text-white/80" : `text-${card.color}-600`)}>{card.label}</span>
            </div>
            <p className="text-xl md:text-2xl font-black truncate">R$ {card.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </motion.div>
        ))}
      </div>

      {/* Formulário Novo Lançamento */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
          <Plus size={18} className="text-primary" />
          Novo Lançamento
        </h3>
        <form onSubmit={handleAddEntry} className="flex flex-col gap-4">
          {/* Categoria/Grupo */}
          <div className="relative">
            <Tag size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Grupo (ex: Cartão, Supermercado, Salário...)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-11 p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <option value="gasto">🔴 Perda / Gasto</option>
            </select>
          </div>

          {/* Descrição Detalhada */}
          <textarea
            placeholder="Descrição: (ex: gastei comprando uma porção de fritas)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[80px] resize-none"
          />

          <button type="submit" className="w-full bg-primary text-white p-4 rounded-xl font-bold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
            <Plus size={20} />
            Adicionar Lançamento
          </button>
        </form>
      </motion.div>

      {/* Lista de Lançamentos */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white">Lançamentos deste dia</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[400px] overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {entries.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center text-slate-400">
                <ReceiptText size={40} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">Nenhum registro encontrado.</p>
              </motion.div>
            ) : (
              entries.map((entry) => (
                <motion.div key={entry.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="p-4 md:p-6 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex flex-col gap-1 min-w-0 flex-1 mr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100 uppercase text-xs tracking-wider">{entry.category}</span>
                      <span className={cn("text-[10px] font-black uppercase px-1.5 py-0.5 rounded", entry.type === 'ganho' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30")}>
                        {entry.type === 'ganho' ? 'Ganho' : 'Perda'}
                      </span>
                    </div>
                    {entry.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate italic">
                        {entry.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn("font-bold tabular-nums whitespace-nowrap", entry.type === 'ganho' ? "text-emerald-600" : "text-rose-600")}>
                      {entry.type === 'ganho' ? '+' : '-'} R$ {entry.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <button onClick={() => deleteEntry(entry.id)} className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DailyDetails;