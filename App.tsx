
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Tab, Quote, JournalEntry, User, BibleAffirmation, IconicQuote } from './types';
import { INITIAL_QUOTES, BIBLE_AFFIRMATIONS, ICONIC_QUOTES, CATEGORIES } from './constants';
import { supabase } from './services/supabase';
import SplashScreen from './views/SplashScreen';
import Onboarding from './views/Onboarding';
import Auth from './views/Auth';
import Home from './views/Home';
import Discover from './views/Discover';
import BibleView from './views/BibleView';
import LikkleBook from './views/LikkleBook';
import Profile from './views/Profile';
import AIWisdom from './views/AIWisdom';
import Settings from './views/Settings';
import PremiumUpgrade from './views/PremiumUpgrade';
import BottomNav from './components/BottomNav';
import CategoryResultsView from './views/CategoryResultsView';
import LegalView from './views/LegalView';

const App: React.FC = () => {
  const [view, setView] = useState<View>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);
  const [iconicQuotes, setIconicQuotes] = useState<IconicQuote[]>(ICONIC_QUOTES);
  const [bibleAffirmations, setBibleAffirmations] = useState<BibleAffirmation[]>(BIBLE_AFFIRMATIONS);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [bookmarkedVerses, setBookmarkedVerses] = useState<any[]>([]);

  // Effect to clear notifications automatically
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const dailyWisdom = useMemo(() => {
    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const fallbackQuote = quotes[0] || INITIAL_QUOTES[0];
    const fallbackVerse = bibleAffirmations[0] || BIBLE_AFFIRMATIONS[0];
    return {
      quote: quotes.length > 0 ? quotes[seed % quotes.length] : fallbackQuote,
      wisdom: quotes.length > 0 ? quotes[(seed + 7) % quotes.length] : fallbackQuote,
      verse: bibleAffirmations.length > 0 ? bibleAffirmations[seed % bibleAffirmations.length] : fallbackVerse
    };
  }, [quotes, bibleAffirmations]);

  const syncUserContent = useCallback(async (userId: string) => {
    if (!supabase) return;
    try {
      const { data: profile } = await supabase.from('profiles').select('is_premium').eq('id', userId).maybeSingle();
      const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', userId).maybeSingle();
      
      const isPremium = profile?.is_premium || !!sub;
      if (isPremium) {
        setUser(prev => prev ? { ...prev, isPremium: true } : null);
      }

      const { data: bookmarks } = await supabase.from('bookmarks').select('*').eq('user_id', userId);
      if (bookmarks) {
        const bookmarkedIds = new Set(bookmarks.map(b => b.item_id));
        setQuotes(prev => prev.map(q => ({ ...q, isFavorite: bookmarkedIds.has(q.id) })));
        setIconicQuotes(prev => prev.map(q => ({ ...q, isFavorite: bookmarkedIds.has(q.id) })));
        setBibleAffirmations(prev => prev.map(b => ({ ...b, isFavorite: bookmarkedIds.has(b.id) })));

        // Filter and set KJV Bible bookmarks
        const kjvBookmarks = bookmarks
          .filter(b => b.item_type === 'kjv')
          .map(b => ({
            id: b.item_id,
            text: b.metadata?.text || '',
            reference: b.metadata?.reference || '',
            timestamp: new Date(b.created_at).getTime()
          }));
        setBookmarkedVerses(kjvBookmarks);
      }

      const { data: entries } = await supabase.from('journal_entries').select('*').order('timestamp', { ascending: false });
      if (entries) setJournalEntries(entries);
    } catch (e) {
      console.error("Sync error (potential network issue):", e);
    }
  }, []);

  useEffect(() => {
    if (view === 'splash') {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              const hasOnboarded = localStorage.getItem('likkle_wisdom_onboarded');
              const sessionUser = localStorage.getItem('likkle_wisdom_user');
              if (sessionUser) {
                try {
                  const parsedUser = JSON.parse(sessionUser);
                  setUser(parsedUser);
                  if (!parsedUser.isGuest) syncUserContent(parsedUser.id);
                  setView('main');
                } catch (e) {
                  console.error("Auth session parse error:", e);
                  setView('auth');
                }
              } else if (hasOnboarded) {
                setView('auth');
              } else {
                setView('onboarding');
              }
            }, 600);
            return 100;
          }
          return prev + Math.floor(Math.random() * 12) + 4;
        });
      }, 120);
      return () => clearInterval(interval);
    }
  }, [view, syncUserContent]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const handleUpdateUser = async (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('likkle_wisdom_user', JSON.stringify(updatedUser));

    if (!user.isGuest && supabase) {
      try {
        await supabase.from('profiles').update({
          username: data.username || user.username,
          avatar_url: data.avatarUrl || user.avatarUrl,
          is_premium: data.isPremium !== undefined ? data.isPremium : user.isPremium
        }).eq('id', user.id);
        
        if (data.isPremium) {
          await supabase.from('subscriptions').upsert({ 
            user_id: user.id, 
            status: 'active', 
            amount: 5.00,
            payment_method: 'Verified Card/PayPal'
          });
        }
      } catch (e) {
        console.error("Profile update sync failed:", e);
      }
    }
  };

  const handleToggleFavorite = async (id: string, type: 'quote' | 'iconic' | 'bible') => {
    let newState = false;
    if (type === 'quote') {
      setQuotes(prev => prev.map(q => q.id === id ? { ...q, isFavorite: newState = !q.isFavorite, updatedAt: Date.now() } : q));
    } else if (type === 'iconic') {
      setIconicQuotes(prev => prev.map(q => q.id === id ? { ...q, isFavorite: newState = !q.isFavorite } : q));
    } else if (type === 'bible') {
      setBibleAffirmations(prev => prev.map(q => q.id === id ? { ...q, isFavorite: newState = !q.isFavorite } : q));
    }
    
    if (user && !user.isGuest && supabase) {
      try {
        if (newState) await supabase.from('bookmarks').insert({ user_id: user.id, item_id: id, item_type: type });
        else await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('item_id', id);
      } catch (e) {
        console.error("Bookmark sync failed:", e);
      }
    }
    setNotification(newState ? 'Saved to cabinet! ✨' : 'Removed from cabinet.');
  };

  const handleBookmarkBibleVerse = async (verse: any) => {
    const verseId = `kjv-${verse.book_id}-${verse.chapter}-${verse.verse}`;
    const reference = `${verse.book_name} ${verse.chapter}:${verse.verse}`;
    
    let exists = false;
    setBookmarkedVerses(prev => {
      const alreadyIn = prev.find(v => v.id === verseId);
      if (alreadyIn) {
        exists = true;
        return prev.filter(v => v.id !== verseId);
      }
      return [{ id: verseId, text: verse.text, reference, timestamp: Date.now() }, ...prev];
    });

    if (user && !user.isGuest && supabase) {
      try {
        if (!exists) {
          await supabase.from('bookmarks').insert({ 
            user_id: user.id, 
            item_id: verseId, 
            item_type: 'kjv',
            metadata: { text: verse.text, reference }
          });
        } else {
          await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('item_id', verseId);
        }
      } catch (e) {
        console.error("Bible bookmark sync failed:", e);
      }
    }
    setNotification(!exists ? 'Verse saved to cabinet! 📖' : 'Verse removed.');
  };

  const handleAddJournalEntry = async (title: string, text: string, mood: string) => {
    const newEntry: JournalEntry = { id: Date.now().toString(), title, text, mood, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(), timestamp: Date.now() };
    setJournalEntries(prev => [newEntry, ...prev]);
    if (user && !user.isGuest && supabase) {
      try {
        await supabase.from('journal_entries').insert({ user_id: user.id, title, text, mood, date: newEntry.date, timestamp: newEntry.timestamp });
      } catch (e) {
        console.error("Journal entry sync failed:", e);
      }
    }
    setNotification('Journal saved! ✍️');
  };

  const handleDeleteJournalEntry = async (id: string) => {
    setJournalEntries(prev => prev.filter(entry => entry.id !== id));
    if (user && !user.isGuest && supabase) {
      try {
        const { error } = await supabase.from('journal_entries').delete().eq('timestamp', parseInt(id));
        if (error) await supabase.from('journal_entries').delete().eq('id', id);
      } catch (e) {
        console.error("Journal delete sync failed:", e);
      }
    }
    setNotification('Entry removed! 🗑️');
  };

  const handleRemoveBookmark = async (id: string, type: string) => {
    if (type === 'kjv') setBookmarkedVerses(prev => prev.filter(v => v.id !== id));
    else if (type === 'quote' || type === 'wisdom') setQuotes(prev => prev.map(q => q.id === id ? { ...q, isFavorite: false } : q));
    else if (type === 'legend' || type === 'iconic') setIconicQuotes(prev => prev.map(q => q.id === id ? { ...q, isFavorite: false } : q));
    else if (type === 'verse' || type === 'bible') setBibleAffirmations(prev => prev.map(q => q.id === id ? { ...q, isFavorite: false } : q));
    
    if (user && !user.isGuest && supabase) {
      try {
        await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('item_id', id);
      } catch (e) {
        console.error("Remove bookmark sync failed:", e);
      }
    }
    setNotification('Removed! 🗑️');
  };

  const renderContent = () => {
    if (view === 'privacy') return <LegalView type="privacy" onClose={() => setView('main')} />;
    if (view === 'terms') return <LegalView type="terms" onClose={() => setView('main')} />;
    if (activeCategory) return <CategoryResultsView categoryId={activeCategory} onClose={() => setActiveCategory(null)} quotes={quotes} iconic={iconicQuotes} bible={bibleAffirmations} onFavorite={handleToggleFavorite} />;
    
    if (!user) return <Auth onAuthComplete={(u) => { 
      setUser(u); setView('main'); 
      localStorage.setItem('likkle_wisdom_user', JSON.stringify(u));
      if (!u.isGuest) syncUserContent(u.id);
    }} />;

    switch (activeTab) {
      case 'home': return <Home user={user} dailyItems={dailyWisdom} onTabChange={setActiveTab} onFavorite={handleToggleFavorite} onOpenAI={() => setShowAI(true)} />;
      case 'discover': return <Discover searchQuery={searchQuery} onSearchChange={setSearchQuery} onCategoryClick={setActiveCategory} />;
      case 'bible': return <BibleView user={user} onBookmark={handleBookmarkBibleVerse} onUpgrade={() => setShowPremium(true)} />;
      case 'book': return <LikkleBook entries={journalEntries} onAdd={handleAddJournalEntry} onDelete={handleDeleteJournalEntry} searchQuery={searchQuery} onSearchChange={setSearchQuery} />;
      case 'me': return <Profile user={user} entries={journalEntries} quotes={quotes} iconic={iconicQuotes} bible={bibleAffirmations} bookmarkedVerses={bookmarkedVerses} onOpenSettings={() => setShowSettings(true)} onStatClick={setActiveTab} onUpdateUser={handleUpdateUser} onRemoveBookmark={handleRemoveBookmark} />;
      default: return <Home user={user} dailyItems={dailyWisdom} onTabChange={setActiveTab} onFavorite={handleToggleFavorite} onOpenAI={() => setShowAI(true)} />;
    }
  };

  if (view === 'splash') return <SplashScreen progress={loadingProgress} />;

  return (
    <div className="relative flex flex-col h-screen max-w-[480px] mx-auto overflow-hidden bg-white dark:bg-background-dark shadow-2xl transition-colors duration-300">
      <div className="fixed inset-0 jamaica-gradient opacity-60 pointer-events-none z-0"></div>
      {notification && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[2000] animate-fade-in pointer-events-none w-fit px-8">
          <div className="bg-[#f4d125] py-2.5 px-4 rounded-full flex items-center gap-2 shadow-lg border border-black/10">
            <span className="material-symbols-outlined text-black font-black text-sm">check_circle</span>
            <p className="text-black font-black text-[9px] uppercase tracking-wider whitespace-nowrap">{notification}</p>
          </div>
        </div>
      )}
      <main className="flex-1 relative z-10 overflow-y-auto no-scrollbar scroll-smooth">{renderContent()}</main>
      
      {showSettings && user && (
        <Settings 
          user={user} 
          isDarkMode={isDarkMode} 
          onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
          onClose={() => setShowSettings(false)} 
          onUpgrade={() => setShowPremium(true)} 
          onSignOut={() => { setUser(null); setShowSettings(false); setView('auth'); }} 
          onUpdateUser={handleUpdateUser} 
          onOpenPrivacy={() => { setShowSettings(false); setView('privacy'); }} 
          onOpenTerms={() => { setShowSettings(false); setView('terms'); }} 
        />
      )}
      {showAI && user && (
        <AIWisdom 
          user={user} 
          onClose={() => setShowAI(false)} 
          onUpgrade={() => { setShowAI(false); setShowPremium(true); }} 
        />
      )}
      {showPremium && (
        <PremiumUpgrade 
          onClose={() => setShowPremium(false)} 
          onPurchaseSuccess={() => { handleUpdateUser({ isPremium: true }); setShowPremium(false); }} 
        />
      )}
      {view === 'main' && <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />}
    </div>
  );
};

export default App;
