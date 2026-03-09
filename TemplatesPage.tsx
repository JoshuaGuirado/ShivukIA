
import React from 'react';
import { TEMPLATES } from '../data/templates';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface TemplatesPageProps {
  onSelectTemplate: (prompt: string) => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({ onSelectTemplate }) => {
  const categories = Array.from(new Set(TEMPLATES.map(t => t.category)));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 pb-20">
      <header className="space-y-2">
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">Menu de Ideias</h2>
        <p className="text-slate-400">Escolha um template estrategicamente desenhado para converter e engajar.</p>
      </header>

      {categories.map((cat) => (
        <section key={cat} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyber-purple">{cat}</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.filter(t => t.category === cat).map((template) => {
              const Icon = template.icon;
              return (
                <motion.button
                  key={template.id}
                  whileHover={{ y: -4 }}
                  onClick={() => onSelectTemplate(template.prompt)}
                  className="group relative p-6 glass border border-white/5 rounded-[32px] text-left hover:border-cyber-purple/40 transition-all hover:bg-white/[0.04]"
                >
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-cyber-purple">
                    <ArrowRight size={20} />
                  </div>
                  
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-cyber-purple/10 group-hover:text-cyber-purple transition-colors">
                    <Icon size={24} />
                  </div>
                  
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-cyber-purple transition-colors">
                    {template.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-cyber-cyan transition-colors">
                    <Sparkles size={12} />
                    Usar este template
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};
