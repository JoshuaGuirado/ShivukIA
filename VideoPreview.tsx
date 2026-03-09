
import React, { useState } from 'react';
import { Download, Film, Sparkles, AlertCircle, Type, Copy, Check, Hash, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoPreviewProps {
  videoUrl: string;
  caption: string;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ videoUrl, caption }) => {
  const [copied, setCopied] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleCopyCaption = () => {
    if (caption) {
      navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2 space-y-4">
            <div className="glass border border-white/10 rounded-[40px] p-2 bg-slate-900 overflow-hidden shadow-2xl relative">
                <div className="absolute top-6 left-6 z-10 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                    <Sparkles size={12} className="text-cyber-purple" /> Veo 3.1
                </div>
                
                {!hasError ? (
                    <video 
                        src={videoUrl} 
                        controls 
                        autoPlay 
                        muted 
                        loop 
                        playsInline
                        className="w-full rounded-[32px] aspect-video object-cover"
                        onError={() => setHasError(true)}
                    />
                ) : (
                    <div className="w-full aspect-video rounded-[32px] bg-black/50 flex flex-col items-center justify-center gap-4 text-red-400">
                        <AlertCircle size={40} />
                        <div className="text-center">
                            <p className="font-bold uppercase tracking-widest text-xs">Erro ao carregar vídeo</p>
                            <p className="text-[10px] opacity-70 mt-1">O link pode ter expirado ou falhado.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-6 bg-cyber-purple/5 border border-cyber-purple/10 rounded-[32px]">
                <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-cyber-purple/10 flex items-center justify-center text-cyber-purple">
                        <Film size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">Veo Production Ready</h3>
                        <p className="text-slate-400 text-xs">Vídeo MP4 em 1080p gerado com sucesso.</p>
                    </div>
                </div>
                
                <a 
                    href={videoUrl} 
                    download={`shivuk-veo-${Date.now()}.mp4`}
                    className="flex items-center gap-3 px-8 py-4 bg-white text-cyber-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-lg shadow-white/10"
                >
                    <Download size={18} /> Baixar MP4
                </a>
            </div>
        </div>

        {/* Caption Panel */}
        <div className="glass border border-white/10 rounded-[32px] p-6 flex flex-col h-full bg-white/[0.02]">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-cyber-purple text-xs font-black uppercase tracking-widest">
                    <Hash size={14} /> Legenda do Post
                </div>
                <button 
                    onClick={handleCopyCaption}
                    className="text-slate-400 hover:text-white transition-colors"
                    title="Copiar Legenda"
                >
                    {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
                {caption ? (
                    <p className="text-sm text-slate-300 font-medium whitespace-pre-wrap leading-relaxed">
                        {caption}
                    </p>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
                        <Type size={24} className="opacity-20" />
                        <span className="text-[10px] uppercase tracking-widest">Gerando Copy...</span>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-[10px] text-slate-500 leading-tight">
                    <strong className="text-cyber-purple">Dica:</strong> Copie esta legenda e use ao postar seu vídeo no Instagram ou TikTok para máximo engajamento.
                </p>
            </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-[10px] text-slate-500 justify-center">
        <AlertCircle size={12} />
        O vídeo é gerado pelo modelo Veo 3.1 da Google. A persistência do link é temporária. Baixe agora.
      </div>
    </div>
  );
};
