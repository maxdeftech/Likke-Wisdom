import React, { useState } from 'react';
import { Quote, User, Tab, BibleAffirmation } from '../types';
import { CATEGORIES } from '../constants';

interface HomeProps {
  user: User;
  dailyItems: { quote: Quote; wisdom: Quote; verse: BibleAffirmation };
  onFavorite: (id: string, type: 'quote' | 'iconic' | 'bible') => void;
  onOpenAI: () => void;
  onTabChange: (tab: Tab) => void;
}

const Home: React.FC<HomeProps> = ({ user, dailyItems, onFavorite, onOpenAI, onTabChange }) => {
  const [activeDaily, setActiveDaily] = useState<'quote' | 'wisdom' | 'verse'>('quote');
  const [reveal, setReveal] = useState(false);

  // Safety check for user.username to prevent TypeErrors
  const firstName = user?.username?.split(' ')[0] || 'Seeker';

  const currentItem = activeDaily === 'quote' ? dailyItems.quote : activeDaily === 'wisdom' ? dailyItems.wisdom : dailyItems.verse;

  if (!currentItem) return (
    <div className="flex items-center justify-center h-full opacity-20">
      <span className="material-symbols-outlined animate-spin text-4xl">sync</span>
    </div>
  );

  return (
    <div className="p-6 pb-24 animate-fade-in">
      <header className="flex items-center justify-between mb-8 pt-6">
        <div className="flex flex-col">
          <span className="text-sm font-medium opacity-70 text-slate-900 dark:text-white/70">Wha Gwan,</span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{firstName}</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onTabChange('discover')} className="size-11 rounded-full glass flex items-center justify-center text-slate-900 dark:text-white">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button 
            onClick={() => onTabChange('me')}
            className="size-11 rounded-full border-2 border-primary overflow-hidden active:scale-90 transition-transform"
          >
            <img 
              className="w-full h-full object-cover" 
              src={user.avatarUrl || `https://picsum.photos/seed/${user.id}/200`} 
              alt="Profile" 
            />
          </button>
        </div>
      </header>

      {/* Triple Daily Switcher */}
      <section className="mb-10">
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'quote', label: 'Quote', icon: 'wb_sunny' },
            { id: 'wisdom', label: 'Wisdom', icon: 'auto_stories' },
            { id: 'verse', label: 'Verse', icon: 'menu_book' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveDaily(tab.id as any); setReveal(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeDaily === tab.id ? 'bg-primary text-background-dark shadow-lg scale-105' : 'glass text-slate-900/40 dark:text-white/40'}`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="glass rounded-[2rem] p-8 flex flex-col items-center text-center gap-6 shadow-2xl relative overflow-hidden border-white/5 bg-gradient-to-br from-primary/5 to-transparent min-h-[420px] justify-center">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>
               {activeDaily === 'quote' ? 'wb_sunny' : activeDaily === 'wisdom' ? 'auto_stories' : 'menu_book'}
             </span>
          </div>

          <span className="material-symbols-outlined text-primary text-5xl opacity-40">
            format_quote
          </span>

          <div className="space-y-4">
            <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white px-2">
              "{currentItem.patois}"
            </h2>
            {activeDaily === 'verse' && (
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                {(dailyItems.verse as any).reference}
              </p>
            )}
          </div>
          
          <div className="w-full space-y-4 mt-4">
            {!reveal ? (
              <button 
                onClick={() => setReveal(true)}
                className="w-full bg-primary text-background-dark font-black py-5 rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                <span className="material-symbols-outlined text-lg">translate</span>
                <span>Reveal Meaning</span>
              </button>
            ) : (
              <div className="space-y-6 animate-fade-in w-full">
                <div className="glass border-white/10 p-6 rounded-2xl">
                  <p className="text-slate-900/70 dark:text-white/70 italic text-lg leading-snug">
                    "{activeDaily === 'verse' ? (dailyItems.verse as any).kjv : (currentItem as Quote).english}"
                  </p>
                </div>
                <div className="flex gap-3">
                   <button className="flex-1 glass py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 hover:bg-white/10 transition-colors text-slate-900 dark:text-white">
                      <span className="material-symbols-outlined text-lg">volume_up</span> Listen
                   </button>
                   <button 
                    onClick={() => onFavorite(currentItem.id, activeDaily === 'verse' ? 'bible' : 'quote')}
                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 transition-all ${'isFavorite' in currentItem && currentItem.isFavorite ? 'bg-primary text-background-dark' : 'glass text-slate-900 dark:text-white'}`}
                   >
                      <span className={`material-symbols-outlined text-lg ${'isFavorite' in currentItem && currentItem.isFavorite ? 'fill-1' : ''}`}>favorite</span> 
                      {'isFavorite' in currentItem && currentItem.isFavorite ? 'Saved' : 'Save'}
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Island Vibes</h2>
          <button onClick={() => onTabChange('discover')} className="text-sm font-semibold text-primary">Explore Categories</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.slice(0, 2).map(cat => (
            <div 
              key={cat.id} 
              onClick={() => onTabChange('discover')}
              className="glass p-5 rounded-[2rem] flex flex-col gap-3 group active:scale-95 transition-all border-white/5 cursor-pointer"
            >
              <div className={`size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20`}>
                <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white">{cat.name}</h3>
                <p className="text-[9px] text-slate-900/40 dark:text-white/40 uppercase tracking-widest font-bold">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section 
        onClick={onOpenAI}
        className="glass rounded-[2rem] overflow-hidden relative group cursor-pointer mb-10 border-white/5 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
        <img className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700" src="https://images.unsplash.com/photo-1541410965313-d53b3c16ef17?q=80&w=800&auto=format&fit=crop" alt="Island" />
        <div className="absolute bottom-6 left-6 z-20 w-full flex justify-between pr-12 items-end">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-1">
               AI Magic <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </p>
            <h3 className="text-2xl font-black text-white leading-none">Craft Yuh Own Wisdom</h3>
          </div>
          <div className="size-12 glass rounded-2xl flex items-center justify-center text-primary border-primary/30">
             <span className="material-symbols-outlined text-xl">{user.isPremium ? 'verified' : 'lock'}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;