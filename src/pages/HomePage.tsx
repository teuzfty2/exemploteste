import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Wallet } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-primary/10 p-6 rounded-full text-primary mb-6">
        <Wallet size={48} className="md:w-16 md:h-16" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
        Controle Financeiro
      </h1>
      
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-md">
        Acompanhe suas entradas e saídas de forma simples, rápida e organizada.
      </p>

      <button 
        onClick={() => navigate('/financas')}
        className="group flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 active:scale-[0.98] transition-all shadow-xl shadow-primary/25 hover:shadow-primary/40"
      >
        Acessar Finanças
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default HomePage;