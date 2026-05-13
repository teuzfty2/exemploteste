"use client";

// Lib
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Icone
import { ChevronRight } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
    >
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">
        Controle Financeiro
      </h1>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/financas")}
        className="group relative flex flex-col items-center bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all duration-300 w-full max-w-sm"
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
      </motion.button>
    </motion.div>
  );
};

export default HomePage;