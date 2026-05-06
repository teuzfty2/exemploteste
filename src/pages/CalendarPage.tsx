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

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();

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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full text-primary">
            <CalendarIcon size={24} />
          </div>
          <h2 className="text-2xl font-bold capitalize text-slate-800 dark:text-white">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h2>
        </div>
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all shadow-none hover:shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentMonth(new Date())}
            className="px-4 py-2 text-sm font-medium hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
          >
            Hoje
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all shadow-none hover:shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            
            return (
              <button
                key={idx}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "group relative h-28 md:h-32 p-3 border-r border-b border-slate-100 dark:border-slate-800 flex flex-col items-start transition-all hover:bg-primary/5",
                  !isCurrentMonth && "bg-slate-50/50 dark:bg-slate-950/50 text-slate-300 dark:text-slate-700",
                  isToday && "bg-primary/5"
                )}
              >
                <span className={cn(
                  "text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-full transition-colors",
                  isToday ? "bg-primary text-white shadow-lg shadow-primary/30" : "group-hover:text-primary"
                )}>
                  {format(day, 'd')}
                </span>
                
                {/* Indicador de que há lançamentos (exemplo visual) */}
                <div className="mt-auto flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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