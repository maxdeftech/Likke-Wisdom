
import React from 'react';
import { Tab } from '../types';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'discover', label: 'Explore', icon: 'explore' },
    { id: 'bible', label: 'Bible', icon: 'auto_stories' },
    { id: 'book', label: 'Journal', icon: 'edit_note' },
    { id: 'me', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 glass border-t border-white/10 z-50 flex items-center justify-around px-2 max-w-[480px] mx-auto rounded-t-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center gap-0.5 transition-all duration-300 flex-1 py-1 ${
            activeTab === tab.id ? 'text-primary' : 'text-white/40'
          }`}
        >
          <div className={`transition-all duration-300 ${activeTab === tab.id ? 'scale-105' : 'scale-100'}`}>
            <span className={`material-symbols-outlined text-[22px] ${activeTab === tab.id ? 'fill-1' : ''}`}>
              {tab.icon}
            </span>
          </div>
          <span className="text-[8px] font-black uppercase tracking-tighter">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
