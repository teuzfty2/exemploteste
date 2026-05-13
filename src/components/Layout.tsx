
// Libs
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

// Icone
import { Wallet } from 'lucide-react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
              <Wallet size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              Finança<span className="text-primary">Diária</span>
            </span>
          </Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
};

export default Layout;