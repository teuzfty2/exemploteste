import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useFinanceStore } from '../store/useFinanceStore';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();
  const { entries } = useFinanceStore();

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const handleDayClick = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    navigate(`/dia/${dateStr}`);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full text-primary">
            <CalendarIcon size={20} className="md:w-6 md:h-6" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold capitalize text-slate-800 dark:text-white">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h2>
        </div>
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-end sm:self-auto">
          <button onClick={prevMonth} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all">
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1.5 text-xs md:text-sm font-medium hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
          >
            Hoje
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
            <div key={i} className="py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayEntries = entries.filter(e => e.date === dateStr);
            const hasGanhos = dayEntries.some(e => e.type === 'ganho');
            const hasGastos = dayEntries.some(e => e.type === 'gasto');
            
            return (
              <button
                key={idx}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "group relative h-20 sm:h-28 md:h-32 p-2 border-r border-b border-slate-100 dark:border-slate-800 flex flex-col items-center sm:items-start transition-all hover:bg-primary/5",
                  !isCurrentMonth && "bg-slate-50/50 dark:bg-slate-950/50 text-slate-300 dark:text-slate-700",
                  isToday && "bg-primary/5"
                )}
              >
                <span className={cn(
                  "text-xs sm:text-sm font-semibold w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full transition-colors",
                  isToday ? "bg-primary text-white shadow-md" : "group-hover:text-primary"
                )}>
                  {format(day, 'd')}
                </span>
                
                <div className="mt-auto flex gap-1 pb-1">
                  {hasGanhos && <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-500" />}
                  {hasGastos && <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-rose-500" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;