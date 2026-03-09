import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Shield, Crown } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export const PlansPage: React.FC = () => {
  const { t } = useSettings();

  const plans = [
    {
      id: 'starter',
      name: t.plans.starter,
      price: 'R$ 0',
      period: t.plans.month,
      desc: t.plans.starterDesc,
      features: [
        '50 post generations',
        'Standard AI Models',
        'Limited Library',
        'Email Support'
      ],
      color: 'text-slate-400',
      button: t.plans.currentPlan,
      highlight: false
    },
    {
      id: 'pro',
      name: t.plans.pro,
      price: 'R$ 97',
      period: t.plans.month,
      desc: t.plans.proDesc,
      features: [
        'Unlimited Generations',
        'Gemini 3.0 Pro Access',
        'Veo Video Generation',
        'Multi-Brand Management',
        'Advanced Analytics'
      ],
      color: 'text-cyber-accent',
      button: t.plans.upgrade,
      highlight: true
    },
    {
      id: 'agency',
      name: t.plans.agency,
      price: t.plans.consult,
      period: '',
      desc: t.plans.agencyDesc,
      features: [
        'Multiple Users',
        'Dedicated API',
        'Custom Persona Training',
        'Dedicated Account Manager',
        'Whitelabel'
      ],
      color: 'text-cyber-beige',
      button: t.plans.contactSales,
      highlight: false
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 pb-32 animate-fade-in text-cyber-green dark:text-white">
      <header className="text-center space-y-4 py-8">
        <h2 className="text-4xl md:text-5xl font-brand font-extrabold text-cyber-green dark:text-white tracking-tight uppercase">
          {t.plans.title}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
          {t.plans.subtitle}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative p-8 rounded-[40px] border flex flex-col h-full transition-all duration-300 ${
              plan.highlight 
              ? 'bg-cyber-green text-white border-cyber-accent shadow-2xl shadow-cyber-green/20 scale-105 z-10 dark:bg-white dark:text-cyber-green dark:border-cyber-accent' 
              : 'glass border-cyber-green/5 dark:border-white/10 bg-white/50 dark:bg-white/[0.02]'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyber-accent text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                <Star size={12} fill="currentColor" /> {t.plans.recommended}
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div className={`w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center ${plan.color}`}>
                {plan.id === 'agency' ? <Shield size={24} /> : plan.id === 'pro' ? <Zap size={24} fill="currentColor" /> : <Crown size={24} />}
              </div>
              <div>
                <h3 className={`text-xl font-bold uppercase tracking-tight ${plan.highlight ? 'text-white dark:text-cyber-green' : 'text-cyber-green dark:text-white'}`}>{plan.name}</h3>
                <p className={`text-xs mt-1 ${plan.highlight ? 'text-white/80 dark:text-cyber-green/80' : 'text-slate-500 dark:text-slate-400'}`}>{plan.desc}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-brand font-black ${plan.highlight ? 'text-white dark:text-cyber-green' : 'text-cyber-green dark:text-white'}`}>{plan.price}</span>
                <span className={`text-sm font-bold ${plan.highlight ? 'text-white/70 dark:text-cyber-green/70' : 'text-slate-500'}`}>{plan.period}</span>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {plan.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 p-0.5 rounded-full ${plan.highlight ? 'bg-white text-cyber-green dark:bg-cyber-green dark:text-white' : 'bg-black/10 dark:bg-white/10 text-slate-400'}`}>
                    <Check size={10} strokeWidth={4} />
                  </div>
                  <span className={`text-sm font-medium ${plan.highlight ? 'text-white dark:text-cyber-green' : 'text-slate-700 dark:text-slate-300'}`}>{feat}</span>
                </div>
              ))}
            </div>

            <button 
              className={`w-full mt-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                plan.highlight 
                ? 'bg-white text-cyber-green hover:bg-cyber-beige dark:bg-cyber-green dark:text-white dark:hover:bg-cyber-green/90 shadow-lg' 
                : 'bg-black/5 dark:bg-white/5 text-cyber-green dark:text-white hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5'
              }`}
            >
              {plan.button}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};