
import React, { useState } from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import { BarChart2, TrendingUp, Layers, PieChart, Users, Zap, Download, Loader2, Calendar, Image as ImageIcon, Folder } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  twitter: 'Twitter / X',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  'genérico': 'Genérico',
};

const PERSONA_LABELS: Record<string, string> = {
  'especialista': 'Especialista',
  'mentor': 'Mentor',
  'provocador': 'Provocador',
  'humanizado': 'Humanizado',
  'inspirador': 'Inspirador',
};

const COLORS = [
  'from-cyber-purple to-cyber-blue',
  'from-cyber-electric to-cyber-cyan',
  'from-emerald-500 to-teal-400',
  'from-amber-500 to-orange-400',
  'from-pink-500 to-rose-400',
];

export const AnalyticsPage: React.FC = () => {
  const { items, folders } = useLibrary();
  const [isDownloading, setIsDownloading] = useState(false);

  // ---- Métricas ----
  const totalPosts = items.length;
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const postsThisWeek = items.filter(i => Number(i.timestamp) > oneWeekAgo).length;

  // Plataforma
  const platformCounts: Record<string, number> = {};
  items.forEach(item => {
    const pid = item.platformId || 'genérico';
    platformCounts[pid] = (platformCounts[pid] || 0) + 1;
  });
  const sortedPlatforms = Object.entries(platformCounts).sort((a, b) => b[1] - a[1]);
  const topPlatform = sortedPlatforms[0]?.[0] || 'N/A';

  // Persona
  const personaCounts: Record<string, number> = {};
  items.forEach(item => {
    if (item.personaId) {
      personaCounts[item.personaId] = (personaCounts[item.personaId] || 0) + 1;
    }
  });
  const topPersonaKey = Object.keys(personaCounts).length > 0
    ? Object.keys(personaCounts).reduce((a, b) => personaCounts[a] > personaCounts[b] ? a : b)
    : null;

  const formatLabel = (id: string) =>
    PLATFORM_LABELS[id] || PERSONA_LABELS[id] || (id ? id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ') : 'N/A');

  // Itens recentes (últimos 10)
  const recentItems = [...items]
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .slice(0, 8);

  const handleDownloadReport = () => {
    if (isDownloading || totalPosts === 0) return;
    setIsDownloading(true);
    try {
      const date = new Date().toLocaleDateString('pt-BR');
      const reportContent = `\
SHIVUK AI STUDIO - RELATÓRIO DE PERFORMANCE
Gerado em: ${date}
===========================================

RESUMO EXECUTIVO
----------------
Total de Ativos Criados : ${totalPosts}
Produção na Última Semana: ${postsThisWeek}
Plataforma Dominante    : ${formatLabel(topPlatform)}
Persona Mais Utilizada  : ${topPersonaKey ? formatLabel(topPersonaKey) : 'N/A'}
Total de Pastas         : ${folders.length}

DISTRIBUIÇÃO POR CANAL
----------------------
${sortedPlatforms.map(([pid, count]) => {
        const pct = ((count / totalPosts) * 100).toFixed(1);
        return `- ${formatLabel(pid)}: ${count} posts (${pct}%)`;
      }).join('\n')}

DISTRIBUIÇÃO POR PERSONA
------------------------
${Object.entries(personaCounts).sort((a, b) => b[1] - a[1]).map(([pid, count]) => {
        const pct = ((count / totalPosts) * 100).toFixed(1);
        return `- ${formatLabel(pid)}: ${count} posts (${pct}%)`;
      }).join('\n') || 'Sem dados de persona'}

HISTÓRICO RECENTE (Últimos 20 Itens)
------------------------------------
${items.slice(0, 20).map(item => {
        const dataStr = item.timestamp ? new Date(Number(item.timestamp)).toLocaleDateString('pt-BR') : 'Data N/A';
        return `- [${dataStr}] ${item.title || 'Sem Título'} (${formatLabel(item.platformId || 'N/A')})`;
      }).join('\n')}

===========================================
Shivuk AI 2.0 - Intelligence System`.trim();

      const blob = new Blob(['\uFEFF' + reportContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `shivuk-report-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); setIsDownloading(false); }, 100);
    } catch {
      setIsDownloading(false);
    }
  };

  const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-[28px] border border-white/5 relative overflow-hidden group"
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 ${color.replace('text-', 'bg-')} transition-transform group-hover:scale-110`} />
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-2xl ${color.replace('text-', 'bg-')}/10 flex items-center justify-center mb-4 ${color}`}>
          <Icon size={24} />
        </div>
        <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-4xl font-brand font-bold text-white mb-2">{value}</p>
        <p className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
          <TrendingUp size={10} className="text-emerald-500" /> {sub}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 pb-20">
      <header className="flex items-end justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">Performance Studio</h2>
          <p className="text-slate-400">Análise em tempo real da sua produção de conteúdo.</p>
        </div>
        <button
          onClick={handleDownloadReport}
          disabled={isDownloading || totalPosts === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          {isDownloading ? 'Gerando...' : 'Baixar Relatório'}
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total de Ativos" value={totalPosts} sub="Posts gerados" icon={Layers} color="text-cyber-purple" />
        <StatCard title="Produção Semanal" value={postsThisWeek} sub="Nos últimos 7 dias" icon={Zap} color="text-cyber-cyan" />
        <StatCard title="Plataforma Top" value={totalPosts > 0 ? formatLabel(topPlatform) : '—'} sub="Canal mais utilizado" icon={PieChart} color="text-emerald-400" />
        <StatCard title="Persona Favorita" value={topPersonaKey ? formatLabel(topPersonaKey) : '—'} sub="Tom de voz predominante" icon={Users} color="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Platform Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 glass border border-white/5 rounded-[32px] p-8 space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <BarChart2 className="text-cyber-purple" size={20} />
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Distribuição por Plataforma</h3>
          </div>

          <div className="space-y-5">
            {totalPosts === 0 ? (
              <div className="text-center py-12 text-slate-600">
                <Layers size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-xs uppercase tracking-widest">Gere seu primeiro post para ver os dados aqui.</p>
              </div>
            ) : (
              sortedPlatforms.map(([pid, count], idx) => {
                const percentage = Math.round((count / totalPosts) * 100);
                return (
                  <div key={pid} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-white uppercase tracking-wider">{formatLabel(pid)}</span>
                      <span className="text-slate-500">{count} posts ({percentage}%)</span>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className={`h-full bg-gradient-to-r ${COLORS[idx % COLORS.length]} rounded-full`}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Personas distribution */}
          {Object.keys(personaCounts).length > 0 && (
            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                <Users className="text-amber-400" size={16} />
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Distribuição por Persona</h4>
              </div>
              {Object.entries(personaCounts).sort((a, b) => b[1] - a[1]).map(([pid, count], idx) => {
                const percentage = Math.round((count / totalPosts) * 100);
                return (
                  <div key={pid} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-white">{formatLabel(pid)}</span>
                      <span className="text-slate-500">{count} ({percentage}%)</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Insight Card */}
        <div className="glass border border-white/5 rounded-[32px] p-8 space-y-5 bg-gradient-to-b from-white/[0.02] to-transparent flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyber-purple/10 flex items-center justify-center mb-4">
              <Zap size={24} className="text-cyber-purple" />
            </div>
            <h3 className="text-xl font-brand font-bold text-white mb-3">Insight do Diretor</h3>
            {totalPosts === 0 ? (
              <p className="text-slate-500 text-sm">Comece a gerar conteúdo para receber insights personalizados sobre sua produção.</p>
            ) : (
              <p className="text-slate-400 text-sm leading-relaxed">
                Você gerou <strong className="text-white">{totalPosts} ativos</strong> no total, sendo <strong className="text-white">{postsThisWeek}</strong> só nessa semana.
                Sua plataforma favorita é <strong className="text-cyber-electric">{formatLabel(topPlatform)}</strong>.
                {topPersonaKey && <> Você utiliza predominantemente o tom <strong className="text-amber-400">{formatLabel(topPersonaKey)}</strong>.</>}
                {' '}Experimente variar os formatos para alcançar novos públicos.
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1"><Folder size={12} /> Pastas criadas</span>
              <span className="font-bold text-white">{folders.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1"><ImageIcon size={12} /> Ativos esta semana</span>
              <span className="font-bold text-white">{postsThisWeek}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Items Table */}
      {recentItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border border-white/5 rounded-[32px] overflow-hidden"
        >
          <div className="flex items-center gap-3 px-8 py-5 border-b border-white/5">
            <Calendar className="text-cyber-cyan" size={18} />
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Histórico Recente</h3>
            <span className="ml-auto text-xs text-slate-600 font-bold">Últimos 8 ativos</span>
          </div>
          <div className="divide-y divide-white/5">
            <AnimatePresence>
              {recentItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.04 }}
                  className="flex items-center gap-4 px-8 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/10" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                      <ImageIcon size={16} className="text-slate-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-bold truncate">{item.title || 'Sem Título'}</p>
                    <p className="text-slate-500 text-xs truncate">{item.content?.slice(0, 80)}...</p>
                  </div>
                  <div className="shrink-0 text-right space-y-1">
                    {item.platformId && (
                      <span className="block text-[10px] font-black uppercase tracking-widest text-cyber-electric">{formatLabel(item.platformId)}</span>
                    )}
                    <span className="block text-[10px] text-slate-600">
                      {item.timestamp ? new Date(Number(item.timestamp)).toLocaleDateString('pt-BR') : '—'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
};
