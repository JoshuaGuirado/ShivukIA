
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Lightbulb, Users, Heart, Globe, Code, MapPin } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-20 pb-20">
      {/* Hero Header */}
      <motion.header 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 pt-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-purple/10 border border-cyber-purple/20 text-cyber-purple text-[10px] font-black uppercase tracking-[0.2em]">
          <Heart size={12} fill="currentColor" /> Nossa Essência
        </div>
        <h1 className="text-5xl md:text-6xl font-brand font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">Mais do que Código,</span><br />
          <span className="bg-gradient-to-r from-cyber-purple to-cyber-cyan bg-clip-text text-transparent uppercase">Uma Missão.</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Conheça a história por trás da inteligência que impulsiona o seu marketing e a visão que deu vida ao Shivuk AI.
        </p>
      </motion.header>

      {/* Founder Profile Card */}
      <motion.section 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/20 to-cyber-blue/20 blur-[80px] rounded-full opacity-50 group-hover:opacity-70 transition-opacity" />
        <div className="relative glass border border-white/10 rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center justify-center">
          
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="space-y-3">
              <div className="space-y-1">
                <h2 className="text-3xl font-brand font-extrabold text-white uppercase tracking-tight">Joshua Filipe Rodrigues Guirado</h2>
                <p className="text-cyber-purple font-black text-sm uppercase tracking-widest">CEO & Founder • 19 Anos</p>
              </div>
              
              {/* Est. 2026 Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400">
                <MapPin size={12} className="text-cyber-cyan" />
                <span className="text-[10px] font-black uppercase tracking-widest">Est. 2026 • Maringá, PR</span>
              </div>
            </div>
            
            <p className="text-slate-300 text-lg italic leading-relaxed font-light">
              "Acredito que a idade é apenas um número quando a vontade de mudar o mundo é gigante. Aos 19 anos, percebi que muitos talentos travavam na hora de colocar suas ideias no papel. O Shivuk nasceu dessa inquietação: e se a tecnologia pudesse ser a extensão da nossa imaginação?"
            </p>

            <div className="flex gap-4 pt-4 justify-center md:justify-start">
              <div className="flex flex-col">
                <span className="text-white font-black text-xl">Maringá</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1 justify-center md:justify-start">
                  <Globe size={10} /> Base Operacional
                </span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-white font-black text-xl">2026</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1 justify-center md:justify-start">
                  <Rocket size={10} /> Início da Jornada
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Purpose / Mission Grid */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {[
          {
            icon: Rocket,
            title: "Acelerar Resultados",
            desc: "O marketing não precisa ser lento. Automatizamos o processo para você focar na estratégia e no crescimento real.",
            color: "text-cyber-purple"
          },
          {
            icon: Lightbulb,
            title: "Desbloqueio Criativo",
            desc: "O fim da tela em branco. O Shivuk é a faísca que transforma 'não sei o que postar' em um post viral em segundos.",
            color: "text-cyber-cyan"
          },
          {
            icon: Users,
            title: "Democratizar a IA",
            desc: "Tecnologia de ponta não deve ser complicada. Tornamos a Inteligência Artificial acessível e intuitiva para todos.",
            color: "text-cyber-blue"
          }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="glass border border-white/5 p-8 rounded-[32px] space-y-4 hover:border-white/20 transition-all hover:bg-white/[0.04] group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                <Icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          );
        })}
      </motion.section>

      {/* Philosophy Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-12 rounded-[40px] bg-gradient-to-br from-cyber-purple/10 to-transparent border border-white/5 text-center space-y-8"
      >
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
          <Code className="text-cyber-purple" size={32} />
        </div>
        <div className="space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-brand font-bold text-white uppercase tracking-tight">Nossa Filosofia Digital</h2>
          <p className="text-slate-300 leading-relaxed text-lg">
            No Shivuk AI, não construímos apenas software. Construímos pontes entre a genialidade humana e a eficiência da máquina. Acreditamos que o futuro do marketing é híbrido: a sensibilidade do empreendedor guiada pela precisão da Inteligência Artificial.
          </p>
        </div>
      </motion.section>

      {/* Footer Branding */}
      <footer className="text-center pt-10">
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-8" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">
          Feito com <span className="text-cyber-purple">💜</span> em Maringá para o mundo.
        </p>
        <p className="text-[9px] text-slate-800 uppercase font-black tracking-widest mt-2">Shivuk AI Studio • All Rights Reserved 2026</p>
      </footer>
    </div>
  );
};
