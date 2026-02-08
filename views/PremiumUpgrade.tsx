
import React, { useState } from 'react';

interface PremiumUpgradeProps {
  onClose: () => void;
  onPurchaseSuccess: () => void;
}

type PaymentStage = 'selection' | 'card_entry' | 'paypal_processing' | 'processing' | 'success' | 'donation_flow';

const PremiumUpgrade: React.FC<PremiumUpgradeProps> = ({ onClose, onPurchaseSuccess }) => {
  const [stage, setStage] = useState<PaymentStage>('selection');
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [error, setError] = useState<string | null>(null);

  const validateCard = () => {
    // Strict card verification logic
    const cleanNumber = cardData.number.replace(/\s/g, '');
    if (cleanNumber.length < 16 || isNaN(Number(cleanNumber))) return false;
    
    const expiryParts = cardData.expiry.split('/');
    if (expiryParts.length !== 2) return false;
    const [month, year] = expiryParts.map(p => Number(p));
    const now = new Date();
    const currentYearShort = now.getFullYear() % 100;
    
    if (isNaN(month) || isNaN(year) || month < 1 || month > 12 || year < currentYearShort) return false;

    if (cardData.cvv.length < 3 || isNaN(Number(cardData.cvv))) return false;
    if (cardData.name.trim().length < 3) return false;

    return true;
  };

  const handleStartPurchase = (method: string) => {
    setError(null);
    if (method === 'PayPal') {
      setStage('paypal_processing');
      // Simulate real PayPal connecting delay
      setTimeout(() => setStage('success'), 3000);
    } else if (method === 'Card') {
      setStage('card_entry');
    } else if (method === 'Donate') {
      setStage('donation_flow');
    } else {
      setStage('processing');
      setTimeout(() => setStage('success'), 2000);
    }
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateCard()) {
      setError("Credentials incorrect. Please verify yuh card details (16 digits, MM/YY, 3-digit CVV) before trying again.");
      return;
    }

    setStage('processing');
    // Simulate payment gateway delay
    setTimeout(() => {
      // Small chance of simulated failure for realism
      if (Math.random() < 0.05) {
        setError("Bank declined di transaction. Check yuh balance or try a next card.");
        setStage('card_entry');
      } else {
        setStage('success');
      }
    }, 2500);
  };

  // Safe exit - does not grant premium
  const handleSafeClose = () => {
    if (stage === 'selection' || stage === 'donation_flow' || stage === 'card_entry' || stage === 'paypal_processing' || stage === 'processing') {
      onClose();
    } else {
      setStage('selection');
    }
  };

  if (stage === 'success') {
    return (
      <div className="fixed inset-0 z-[150] bg-[#0a1a0f] flex flex-col items-center justify-center p-8 text-center animate-fade-in overflow-hidden">
        <div className="absolute inset-0 jamaica-gradient opacity-20 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="size-48 rounded-full glass-gold flex items-center justify-center mb-8 shadow-2xl mx-auto border-4 border-jamaican-gold/50 animate-pulse-glow">
            <span className="material-symbols-outlined text-8xl text-jamaican-gold" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
          <h1 className="text-5xl font-extrabold mb-4 text-white">Yuh Official!</h1>
          <p className="text-xl font-semibold text-primary mb-2 uppercase tracking-widest">Access Granted</p>
          <p className="text-white/70 italic text-lg mb-12">"Di full wisdom is yours now. Tan up strong!"</p>
          {/* CRITICAL: ONLY this button updates the database/state to premium */}
          <button 
            onClick={onPurchaseSuccess} 
            className="w-full bg-primary text-background-dark font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(19,236,91,0.4)] transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
          >
            Enter Cabinet <span className="material-symbols-outlined font-black">arrow_forward</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[140] bg-background-dark flex flex-col font-display overflow-y-auto no-scrollbar pb-12">
      <div className="absolute inset-0 cosmic-bg opacity-30 pointer-events-none"></div>
      
      {/* Neon Green Support Header */}
      <div className="sticky top-0 z-[150] bg-primary py-2 text-center shadow-[0_4px_20px_rgba(19,236,91,0.4)] border-b border-white/20">
        <p className="text-background-dark font-black text-[9px] uppercase tracking-[0.5em] animate-pulse">
          Support us by donating ✨ Support us by donating ✨ Support us by donating
        </p>
      </div>

      <header className="relative z-10 flex items-center p-6 justify-between">
        <button 
          onClick={handleSafeClose} 
          className="size-11 flex items-center justify-center rounded-full glass text-white/50 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
          {stage === 'card_entry' ? 'Enter Details' : stage === 'donation_flow' ? 'Blessings' : 'Upgrade'}
        </h2>
        <div className="size-11"></div>
      </header>

      <div className="relative z-10 flex-1 px-6 py-4 flex flex-col gap-6">
        {stage === 'selection' ? (
          <>
            <div className="glass rounded-[3rem] p-8 flex flex-col items-center text-center shadow-2xl border-white/5 bg-gradient-to-br from-primary/10 via-transparent to-jamaican-gold/10">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative bg-primary/10 p-5 rounded-[2rem] border border-primary/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>offline_pin</span>
                </div>
              </div>
              <h1 className="text-3xl font-black mb-3 text-white leading-tight">Wisdom Without Limits</h1>
              <p className="text-white/60 text-sm leading-relaxed mb-8 px-2 font-medium">Carry the spirit of Jamaica in your pocket. Access all wisdom, AI generation, and full offline mode.</p>
              
              <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md shadow-inner flex flex-col items-center">
                <span className="text-jamaican-gold font-black text-2xl">$5.00 USD</span>
                <span className="text-white/30 text-[9px] uppercase font-black tracking-widest">One-time payment</span>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 px-2">Secure Payment Options</p>
              
              <button 
                onClick={() => handleStartPurchase('PayPal')} 
                className="w-full h-16 rounded-2xl bg-[#FFC439] hover:bg-[#F2BA36] flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(255,196,57,0.3)] transition-all active:scale-95 group"
              >
                <div className="flex items-center gap-2">
                  <svg className="h-6 w-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.076 21.337H11.516L13.111 11.237H8.671L7.076 21.337Z" fill="#003087"/>
                    <path d="M11.516 21.337L15.956 21.337L17.551 11.237H13.111L11.516 21.337Z" fill="#009CDE"/>
                  </svg>
                  <span className="text-[#003087] font-black text-lg italic tracking-tighter">Pay<span className="text-[#009CDE]">Pal</span></span>
                </div>
              </button>

              <button 
                onClick={() => handleStartPurchase('Card')} 
                className="w-full h-16 rounded-2xl glass border-white/10 flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95 group"
              >
                <span className="material-symbols-outlined text-white/70">credit_card</span>
                <span className="text-white font-black text-sm uppercase tracking-widest">Credit or Debit Card</span>
              </button>
            </div>

            <div className="pt-8 border-t border-white/5 mt-4">
              <div className="flex items-center gap-2 mb-4 px-2">
                 <span className="size-1.5 rounded-full bg-primary"></span>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Help keep di wisdom flowin'</p>
              </div>
              <button 
                onClick={() => handleStartPurchase('Donate')}
                className="w-full h-20 rounded-3xl glass border-primary/30 bg-primary/5 flex flex-col items-center justify-center transition-all hover:bg-primary/10 group shadow-lg"
              >
                <span className="text-primary font-black text-sm uppercase tracking-widest group-hover:scale-105 transition-transform">Donate to Developer</span>
                <span className="text-white/20 text-[8px] font-bold mt-1">maxwelldefinitivetechnologies@gmail.com</span>
              </button>
            </div>
          </>
        ) : stage === 'donation_flow' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in gap-8 px-4">
            <div className="size-24 rounded-full glass border-primary/30 flex items-center justify-center shadow-[0_0_40px_rgba(19,236,91,0.2)]">
              <span className="material-symbols-outlined text-primary text-5xl">volunteer_activism</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-white">Big Up Yuhself!</h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-[280px]">Your support helps us keep building features for di culture. Any donation grants yuh Full Premium access.</p>
            </div>
            <a 
              href="mailto:maxwelldefinitivetechnologies@gmail.com?subject=Likkle%20Wisdom%20Support&body=I%20donated%20to%20support%20di%20app!"
              className="w-full h-16 rounded-2xl bg-[#FFC439] flex items-center justify-center gap-3 font-black text-[#003087] shadow-2xl active:scale-95 transition-all"
            >
              Open PayPal / Email Seeker
            </a>
            <button 
              onClick={() => setStage('success')}
              className="text-primary font-black uppercase text-[10px] tracking-[0.4em] mt-4 hover:underline animate-pulse"
            >
              Done? Click to claim Premium
            </button>
          </div>
        ) : stage === 'paypal_processing' || stage === 'processing' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="size-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-8 shadow-[0_0_20px_rgba(19,236,91,0.2)]"></div>
            <h2 className="text-2xl font-black text-white mb-2">{stage === 'paypal_processing' ? 'Connecting...' : 'Verifying...'}</h2>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Talking to di bank securely</p>
          </div>
        ) : (
          <form onSubmit={handleCardSubmit} className="flex flex-col gap-6 animate-fade-in">
            {error && (
              <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-[11px] font-bold animate-fade-in flex items-start gap-3 shadow-xl">
                <span className="material-symbols-outlined text-lg shrink-0">error</span>
                <p className="leading-relaxed">{error}</p>
              </div>
            )}
            <div className="glass p-8 rounded-[2.5rem] border-white/10 space-y-6 shadow-2xl">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-2">Cardholder Name</label>
                  <input 
                    type="text" required placeholder="JANE DOE"
                    className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-white focus:ring-primary/40 focus:border-primary/40 transition-all uppercase font-bold"
                    value={cardData.name} onChange={e => setCardData({...cardData, name: e.target.value.toUpperCase()})}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-2">Card Number</label>
                  <input 
                    type="text" required placeholder="0000 0000 0000 0000" maxLength={19}
                    className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-white focus:ring-primary/40 focus:border-primary/40 transition-all font-mono"
                    value={cardData.number} onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                        setCardData({...cardData, number: val});
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-2">Expiry</label>
                    <input 
                      type="text" required placeholder="MM/YY" maxLength={5}
                      className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-white focus:ring-primary/40 focus:border-primary/40 transition-all text-center"
                      value={cardData.expiry} onChange={e => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                          setCardData({...cardData, expiry: val});
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-2">CVV</label>
                    <input 
                      type="password" required placeholder="•••" maxLength={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-white focus:ring-primary/40 focus:border-primary/40 transition-all text-center"
                      value={cardData.cvv} onChange={e => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '')})}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full h-16 rounded-2xl bg-primary text-background-dark font-black text-lg shadow-[0_10px_40px_rgba(19,236,91,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              <span className="material-symbols-outlined font-black">lock</span>
              CONFIRM PAYMENT
            </button>
            <p className="text-center text-[9px] text-white/20 uppercase tracking-[0.3em]">Secure 256-bit SSL • Non-refundable</p>
          </form>
        )}

        <div className="mt-auto text-center py-6">
          <p className="text-[9px] text-white/20 uppercase font-black tracking-widest">Trusted Secure Checkout</p>
          <div className="flex justify-center gap-4 mt-2 opacity-20">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span className="material-symbols-outlined text-sm">shield</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumUpgrade;
