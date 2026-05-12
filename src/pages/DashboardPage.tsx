import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  format, 
  addMonths, 
  subMonths, 
  parseISO, 
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Receipt,
  ArrowRight,
  ArrowLeft,
  PlusCircle,
  ChevronDown
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useFinanceStore } from '../store/useFinanceStore';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DashboardPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const navigate = useNavigate();
  const { entries } = useFinanceStore();

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Filtrar dados do mês atual
  const currentMonthStr = format(currentMonth, 'yyyy-MM');
  const monthEntries = entries.filter(e => e.date.startsWith(currentMonthStr));

  // Resumos do mês
  const totalGanhos = monthEntries
    .filter(e => e.type === 'ganho')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalGastos = monthEntries
    .filter(e => e.type === 'gasto')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const saldo = totalGanhos - totalGastos;

  // Agrupar dias que tem movimentação para listar e mostrar no calendário
  const daysMap = entries.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = { ganhos: 0, gastos: 0, count: 0 };
    if (entry.type === 'ganho') acc[entry.date].ganhos += entry.amount;
    else acc[entry.date].gastos += entry.amount;
    acc[entry.date].count += 1;
    return acc;
  }, {} as Record<string, { ganhos: number, gastos: number, count: number }>);

  // Filtrar apenas os dias do mês atual que têm movimentação para a lista de cards
  const activeDays = Object.keys(daysMap)
    .filter(date => date.startsWith(currentMonthStr))
    .sort((a, b) => b.localeCompare(a));

  const handleGoToToday = () => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    navigate(`/dia/${todayStr}`);
  };

  // Lógica do Calendário (Grid)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto pb-20 md:pb-0">
      
      {/* Botão Voltar */}
      <button 
        onClick={() => navigate('/')}
        className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium -mb-2"
      >
        <div className="p-1.5 rounded-lg group-hover:bg-primary/10 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span>Voltar para o Início</span>
      </button>

      {/* Header com Navegação de Meses */}
      <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <button 
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center gap-3 text-left group hover:opacity-80 transition-opacity"
          >
            <div className="bg-primary/10 p-3 rounded-2xl text-primary group-hover:scale-105 transition-transform">
              <CalendarIcon size={24} />
            </div>
            <div className="flex items-center gap-2">
              <div>
                <h2 className="text-xl md:text-2xl font-black capitalize text-slate-800 dark:text-white leading-tight">
                  {format(currentMonth, 'MMMM', { locale: ptBR })}
                </h2>
                <p className="text-sm font-medium text-slate-500">{format(currentMonth, 'yyyy')}</p>
              </div>
              <ChevronDown 
                size={20} 
                className={cn(
                  "text-slate-400 transition-transform duration-300 ml-1", 
                  showCalendar && "rotate-180"
                )} 
              />
            </div>
          </button>

          <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-2xl self-end sm:self-auto border border-slate-100 dark:border-slate-800">
            <button onClick={prevMonth} className="p-2 md:p-3 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all hover:shadow-sm text-slate-600 dark:text-slate-300">
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setCurrentMonth(new Date())}
              className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all hover:shadow-sm"
            >
              Mês Atual
            </button>
            <button onClick={nextMonth} className="p-2 md:p-3 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all hover:shadow-sm text-slate-600 dark:text-slate-300">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Dropdown do Calendário Interativo */}
        {showCalendar && (
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {weekDays.map(d => (
                <div key={d} className="text-xs font-bold text-slate-400 py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {calendarDays.map((day, idx) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const dayData = daysMap[dateStr];
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isTodayDate = isSameDay(day, new Date());

                return (
                  <button
                    key={idx}
                    onClick={() => navigate(`/dia/${dateStr}`)}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-2xl h-12 md:h-14 transition-all relative group",
                      !isCurrentMonth 
                        ? "text-slate-300 dark:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50" 
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
                      isTodayDate && "bg-primary/10 text-primary font-bold hover:bg-primary/20",
                      "hover:scale-105 active:scale-95"
                    )}
                  >
                    <span className="text-sm md:text-base font-medium">{format(day, 'd')}</span>
                    
                    {/* Pontinhos indicadores se houver movimentação */}
                    {dayData && isCurrentMonth && (
                      <div className="flex gap-0.5 mt-1">
                        {dayData.ganhos > 0 && <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-emerald-500" />}
                        {dayData.gastos > 0 && <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-rose-500" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Cards de Resumo Mensal */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={20} />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Entradas do Mês</span>
          </div>
          <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            R$ {totalGanhos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-rose-100 dark:bg-rose-900/30 p-2.5 rounded-xl text-rose-600 dark:text-rose-400">
              <TrendingDown size={20} />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saídas do Mês</span>
          </div>
          <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            R$ {totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className={cn(
          "p-5 md:p-6 rounded-3xl shadow-lg border transition-colors relative overflow-hidden",
          saldo >= 0 
            ? "bg-primary border-primary" 
            : "bg-rose-600 border-rose-600"
        )}>
          <div className="absolute -right-4 -top-4 opacity-10">
            <Wallet size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2.5 rounded-xl text-white">
                <Wallet size={20} />
              </div>
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider">Saldo do Mês</span>
            </div>
            <p className="text-2xl md:text-3xl font-black text-white">
              R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Dias Movimentados */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
            Movimentações por Dia
          </h3>
          <button 
            onClick={handleGoToToday}
            className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors"
          >
            <PlusCircle size={18} />
            <span className="hidden sm:inline">Lançamento de Hoje</span>
            <span className="sm:hidden">Hoje</span>
          </button>
        </div>

        {activeDays.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center shadow-sm">
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-full mb-4">
              <Receipt size={40} className="text-slate-400" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Nenhum registro este mês</h4>
            <p className="text-slate-500 max-w-sm mb-6">
              Você ainda não registrou nenhuma entrada ou saída no mês de {format(currentMonth, 'MMMM', { locale: ptBR })}.
            </p>
            <button 
              onClick={handleGoToToday}
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors"
            >
              Registrar Lançamento
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {activeDays.map(dateStr => {
              const dayData = daysMap[dateStr];
              const dateObj = parseISO(dateStr);
              const daySaldo = dayData.ganhos - dayData.gastos;
              const isToday = isSameDay(dateObj, new Date());

              return (
                <button
                  key={dateStr}
                  onClick={() => navigate(`/dia/${dateStr}`)}
                  className="w-full flex items-center bg-white dark:bg-slate-900 p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-md transition-all group text-left"
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 mr-4 transition-colors",
                    isToday ? "bg-primary text-white shadow-md" : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-primary/10 group-hover:text-primary"
                  )}>
                    <span className="text-xs font-bold uppercase tracking-widest">{format(dateObj, 'EEE', { locale: ptBR })}</span>
                    <span className="text-xl font-black leading-none">{format(dateObj, 'dd')}</span>
                  </div>

                  <div className="flex-1 mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {isToday ? 'Hoje' : format(dateObj, "dd 'de' MMMM", { locale: ptBR })}
                      </h4>
                      <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                        {dayData.count} mov.
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs md:text-sm font-medium">
                      {dayData.ganhos > 0 && (
                        <span className="text-emerald-500 flex items-center gap-1">
                          <TrendingUp size={14} /> R$ {dayData.ganhos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                      {dayData.gastos > 0 && (
                        <span className="text-rose-500 flex items-center gap-1">
                          <TrendingDown size={14} /> R$ {dayData.gastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div className="hidden sm:block">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Saldo do dia</p>
                      <p className={cn(
                        "font-black",
                        daySaldo >= 0 ? "text-slate-900 dark:text-white" : "text-rose-500"
                      )}>
                        R$ {daySaldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;