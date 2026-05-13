"use client";

// Libs
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  isSameMonth,
} from "date-fns";
import { twMerge } from "tailwind-merge";
import { ptBR } from "date-fns/locale";

// Icones
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowRight,
  ArrowLeft,
  PlusCircle,
  ChevronDown,
} from "lucide-react";

// Types
import { clsx, type ClassValue } from "clsx";

// Store
import { useFinanceStore } from "../store/useFinanceStore";

function cn(...inputs: ClassValue[]) {
  // Junta e otimiza classes do Tailwind
  return twMerge(clsx(inputs));
}

const DashboardPage = () => {
  // Mês atual exibido
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // Controla abertura do calendário
  const [showCalendar, setShowCalendar] = useState(false);
  // Navegação entre páginas
  const navigate = useNavigate();
  // Entradas financeiras da store
  const { entries } = useFinanceStore();

  // Avança para próximo mês
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  // Volta para mês anterior
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Formato do mês atual
  const currentMonthStr = format(currentMonth, "yyyy-MM");

  // Filtra registros do mês atual
  const monthEntries = entries.filter((e) =>
    e.date.startsWith(currentMonthStr),
  );

  // Soma total de ganhos
  const totalGanhos = monthEntries
    .filter((e) => e.type === "ganho")
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Soma total de gastos
  const totalGastos = monthEntries
    .filter((e) => e.type === "gasto")
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Saldo final do mês
  const saldo = totalGanhos - totalGastos;

  // Agrupa entradas por dia
  const daysMap = entries.reduce(
    (acc, entry) => {
      if (!acc[entry.date])
        acc[entry.date] = { ganhos: 0, gastos: 0, count: 0 };
      if (entry.type === "ganho") acc[entry.date].ganhos += entry.amount;
      else acc[entry.date].gastos += entry.amount;
      acc[entry.date].count += 1;
      return acc;
    },
    {} as Record<string, { ganhos: number; gastos: number; count: number }>,
  );

  // Dias ativos do mês atual
  const activeDays = Object.keys(daysMap)
    .filter((date) => date.startsWith(currentMonthStr))
    .sort((a, b) => b.localeCompare(a));

  // Vai para página do dia atual
  const handleGoToToday = () => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    navigate(`/dia/${todayStr}`);
  };

  // Início do mês
  const monthStart = startOfMonth(currentMonth);
  // Final do mês
  const monthEnd = endOfMonth(monthStart);
  // Primeiro dia da grade do calendário
  const startDate = startOfWeek(monthStart);
  // Último dia da grade do calendário
  const endDate = endOfWeek(monthEnd);
  // Lista completa de dias do calendário
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  // Nome dos dias da semana
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  
  // Nome do mês atual
  const monthName = format(currentMonth, "MMMM", { locale: ptBR });

  // Primeira letra maiúscula
  const capitalizedMonth =
    monthName.charAt(0).toUpperCase() + monthName.slice(1);

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto pb-20 md:pb-0">
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5 pointer-events-none">
          <CalendarIcon size={80} className="md:w-[120px] md:h-[120px]" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="shrink-0 p-3 bg-slate-50 dark:bg-slate-800 hover:bg-primary hover:text-white dark:hover:bg-primary text-slate-500 dark:text-slate-400 rounded-2xl transition-all shadow-sm group"
            >
              <ArrowLeft
                size={24}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </button>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="text-left group hover:opacity-80 transition-opacity w-fit min-w-0"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-tight flex items-center gap-2 whitespace-nowrap">
                {capitalizedMonth} de {format(currentMonth, "yyyy")}
                <ChevronDown
                  size={20}
                  className={cn(
                    "text-slate-400 transition-transform duration-300",
                    showCalendar && "rotate-180",
                  )}
                />
              </h2>
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium mt-1 truncate">
                Visão mensal
              </p>
            </button>
          </div>
          <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={prevMonth}
              className="p-2 md:p-3 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-slate-600 dark:text-slate-300"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"
            >
              Mês Atual
            </button>
            <button
              onClick={nextMonth}
              className="p-2 md:p-3 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-slate-600 dark:text-slate-300"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        {showCalendar && (
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 duration-300 relative z-10">
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {weekDays.map((d) => (
                <div key={d} className="text-xs font-bold text-slate-400 py-2">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {calendarDays.map((day, idx) => {
                const dateStr = format(day, "yyyy-MM-dd");
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
                        ? "text-slate-300 dark:text-slate-700"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
                      isTodayDate && "bg-primary/10 text-primary font-bold",
                    )}
                  >
                    <span className="text-sm md:text-base font-medium">
                      {format(day, "d")}
                    </span>
                    {dayData && isCurrentMonth && (
                      <div className="flex gap-0.5 mt-1">
                        {dayData.ganhos > 0 && (
                          <div className="w-1 h-1 rounded-full bg-emerald-500" />
                        )}
                        {dayData.gastos > 0 && (
                          <div className="w-1 h-1 rounded-full bg-rose-500" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={20} />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase">
              Entradas
            </span>
          </div>
          <p className="text-2xl md:text-3xl font-black">
            R${" "}
            {totalGanhos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-rose-100 dark:bg-rose-900/30 p-2.5 rounded-xl text-rose-600 dark:text-rose-400">
              <TrendingDown size={20} />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase">
              Saídas
            </span>
          </div>
          <p className="text-2xl md:text-3xl font-black">
            R${" "}
            {totalGastos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div
          className={cn(
            "p-5 md:p-6 rounded-3xl shadow-lg border transition-colors",
            saldo >= 0 ? "bg-primary text-white" : "bg-rose-600 text-white",
          )}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2.5 rounded-xl">
              <Wallet size={20} />
            </div>
            <span className="text-xs font-bold uppercase">Saldo</span>
          </div>
          <p className="text-2xl md:text-3xl font-black">
            R$ {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg md:text-xl font-bold">Movimentações</h3>
          <button
            onClick={handleGoToToday}
            className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl"
          >
            <PlusCircle size={18} /> Hoje
          </button>
        </div>
        <div className="grid gap-4">
          {activeDays.map((dateStr) => {
            const dayData = daysMap[dateStr];
            const dateObj = parseISO(dateStr);
            const daySaldo = dayData.ganhos - dayData.gastos;
            return (
              <button
                key={dateStr}
                onClick={() => navigate(`/dia/${dateStr}`)}
                className="w-full flex items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all text-left group"
              >
                <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 mr-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <span className="text-xs font-bold uppercase">
                    {format(dateObj, "EEE", { locale: ptBR })}
                  </span>
                  <span className="text-xl font-black">
                    {format(dateObj, "dd")}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">
                    {format(dateObj, "dd 'de' MMMM", { locale: ptBR })}
                  </h4>
                  <div className="flex gap-3 text-xs">
                    <span className="text-emerald-500">
                      R$ {dayData.ganhos.toFixed(2)}
                    </span>
                    <span className="text-rose-500">
                      R$ {dayData.gastos.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400">SALDO</p>
                    <p
                      className={cn(
                        "font-black",
                        daySaldo < 0 && "text-rose-500",
                      )}
                    >
                      R$ {daySaldo.toFixed(2)}
                    </p>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-slate-300 group-hover:text-primary transition-colors"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
