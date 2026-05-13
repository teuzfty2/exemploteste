import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">
        Controle Financeiro
      </h1>
      
      <button 
        onClick={() => navigate('/financas')}
        className="group relative flex flex-col items-center bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 w-full max-w-sm"
      >
        <div className="absolute top-6 right-6 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">
          <ChevronRight size={24} />
        </div>
        
        <div className="w-28 h-28 mb-5 rounded-full overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-md group-hover:scale-105 transition-transform duration-300 bg-slate-100 dark:bg-slate-800">
          <img 
            src="https://ui-avatars.com/api/?name=Matheus+Filipe&background=8b5cf6&color=fff&size=256&font-size=0.4" 
            alt="Matheus Filipe" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Matheus Filipe
        </h2>
        
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          Acessar minhas finanças
        </p>
      </button>

    </div>
  );
};

export default HomePage;