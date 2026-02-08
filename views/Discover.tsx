
import React from 'react';
import { CATEGORIES, ICONIC_QUOTES } from '../constants';

interface DiscoverProps {
  onCategoryClick: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const Discover: React.FC<DiscoverProps> = ({ onCategoryClick, searchQuery, onSearchChange }) => {
  return (
    <div className="p-6 pb-24 animate-fade-in">
      <header className="py-12 flex flex-col gap-2">
         <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Wisdom Market</span>
         <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Pick Yuh Vibe</h1>
         <p className="text-slate-500 dark:text-slate-400 font-medium">Find di inspiration weh fit yuh spirit.</p>
      </header>

      <div className="relative mb-10">
        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary/40">search</span>
        <input 
          className="w-full bg-white/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-5 pl-14 pr-6 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all shadow-xl" 
          placeholder="Search wisdom, verses, or tags..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-12">
        {CATEGORIES.map(cat => (
          <div 
            key={cat.id} 
            onClick={() => onCategoryClick(cat.id)}
            className="glass rounded-[2rem] p-6 aspect-square relative overflow-hidden group flex flex-col justify-between cursor-pointer active:scale-95 transition-all border-white/5 shadow-xl"
          >
            <div className={`size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-lg group-hover:bg-primary group-hover:text-background-dark transition-colors`}>
              <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
            </div>
            <div className="relative z-10">
              <h2 className="text-slate-900 dark:text-white text-lg font-black leading-tight tracking-tight group-hover:text-primary transition-colors">{cat.name}</h2>
              <p className={`text-slate-900/30 dark:text-white/30 text-[9px] font-black uppercase tracking-widest mt-1`}>{cat.description}</p>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <span className="material-symbols-outlined text-9xl">{cat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Iconic Wisdom</h3>
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">From Legends</span>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 snap-x snap-mandatory">
          {ICONIC_QUOTES.map(iq => (
            <div key={iq.id} className="min-w-[280px] snap-center glass rounded-[2.5rem] p-8 relative overflow-hidden border-white/5 shadow-2xl bg-gradient-to-tr from-accent-gold/10 to-transparent">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                 <span className="material-symbols-outlined text-6xl">stars</span>
              </div>
              <span className="material-symbols-outlined text-accent-gold text-4xl mb-6 opacity-60">format_quote</span>
              <p className="text-slate-900 dark:text-white text-lg font-bold leading-relaxed mb-6 italic">"{iq.text}"</p>
              <div className="flex items-center gap-3 mt-auto">
                 <div className="size-10 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold font-black border border-accent-gold/20">
                    {iq.author[0]}
                 </div>
                 <p className="text-xs font-black uppercase tracking-widest text-slate-900/60 dark:text-white/60">{iq.author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-4">
        <h3 className="text-slate-900 dark:text-white text-xl font-black mb-6 px-2">Daily Featured</h3>
        <div className="glass rounded-[2rem] p-8 relative overflow-hidden flex items-center gap-6 border-white/5 shadow-2xl bg-gradient-to-br from-primary/5 to-transparent">
          <div className="size-20 shrink-0 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl rotate-3">
            <img src="https://picsum.photos/seed/reggae/200" alt="Island" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Editor's Pick</span>
            <h4 className="text-slate-900 dark:text-white font-black text-xl leading-tight">"Nuh badda fret."</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic">Don't worry about it.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
