
import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, Hash, Download, Loader2, Sparkles, ExternalLink, Smartphone, Monitor, Square, Ratio, CircleUser, Info, Wand2, Send, SlidersHorizontal, RotateCcw, Type, Move, Minus, Plus } from 'lucide-react';
import { useBrand } from '../contexts/BrandContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import { GroundingSource, editImage } from '../services/gemini';

interface PostPreviewProps {
  data: {
    title: string;
    content: string;
    hashtags: string;
    imagePrompt: string;
    generatedImageUrl?: string;
    sources?: GroundingSource[];
  };
  index: number;
}

type AspectRatio = '1/1' | '4/5' | '16/9' | '9/16' | 'profile';

interface ImageFilters {
  brightness: number;
  contrast: number;
  saturate: number;
  blur: number;
  sepia: number;
}

const DEFAULT_FILTERS: ImageFilters = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  blur: 0,
  sepia: 0
};

const FONTS = [
  { id: 'font-brand', label: 'Marca', class: 'font-brand' },
  { id: 'font-sans', label: 'Moderna', class: 'font-sans' },
  { id: 'font-serif', label: 'Elegante', class: 'font-serif' },
  { id: 'font-mono', label: 'Tech', class: 'font-mono' },
  { id: 'font-display', label: 'Impacto', class: 'font-display' },
];

export const PostPreview: React.FC<PostPreviewProps> = ({ data, index }) => {
  const { brand } = useBrand();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('4/5'); // Default to Portrait for optimal viewing
  
  // Image Editing States
  const [displayImage, setDisplayImage] = useState<string | undefined>(data.generatedImageUrl);
  const [isEditing, setIsEditing] = useState(false); // AI Edit Mode
  const [isManualEditing, setIsManualEditing] = useState(false); // Manual Sliders Mode
  const [isTextMode, setIsTextMode] = useState(false); // Text Overlay Mode
  
  const [editPrompt, setEditPrompt] = useState('');
  const [isProcessingEdit, setIsProcessingEdit] = useState(false);
  const [filters, setFilters] = useState<ImageFilters>(DEFAULT_FILTERS);

  // Text Overlay State
  const [overlayText, setOverlayText] = useState('');
  const [overlayColor, setOverlayColor] = useState('#ffffff');
  const [overlayFont, setOverlayFont] = useState('font-brand');
  const [overlaySize, setOverlaySize] = useState(48); // Default size
  
  useEffect(() => {
    setDisplayImage(data.generatedImageUrl);
    setFilters(DEFAULT_FILTERS); // Reset filters on new generation
    setOverlayText(''); // Reset text
  }, [data.generatedImageUrl]);
  
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    let text = `${data.title}\n\n${data.content}\n\n${data.hashtags}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditImage = async () => {
    if (!editPrompt.trim() || !displayImage) return;
    setIsProcessingEdit(true);
    try {
        const newImage = await editImage(displayImage, editPrompt);
        setDisplayImage(newImage);
        setIsEditing(false);
        setEditPrompt('');
    } catch (error) {
        console.error("Edit failed", error);
        alert("Falha ao editar a imagem. Tente novamente.");
    } finally {
        setIsProcessingEdit(false);
    }
  };

  const handleFilterChange = (key: keyof ImageFilters, value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      let width = 1080;
      let height = 1080;

      switch (aspectRatio) {
        case '4/5': width = 1080; height = 1350; break;
        case '16/9': width = 1200; height = 628; break;
        case '9/16': width = 1080; height = 1920; break;
        case 'profile': width = 800; height = 800; break;
        default: width = 1080; height = 1080; break;
      }

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        canvasWidth: width,
        canvasHeight: height,
        pixelRatio: 2,
        filter: (node) => {
           if (node.tagName === 'IMG') return true;
           return true;
        }
      });
      const link = document.createElement('a');
      link.download = `shivuk-post-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const ratios = [
    { id: '1/1', label: 'Quadrado', icon: Square, desc: 'Feed Instagram', res: '1080x1080px' },
    { id: '4/5', label: 'Retrato', icon: Ratio, desc: 'Alcance Máximo', res: '1080x1350px' },
    { id: '9/16', label: 'Story', icon: Smartphone, desc: 'Reels / TikTok', res: '1080x1920px' },
    { id: '16/9', label: 'Paisagem', icon: Monitor, desc: 'LinkedIn / Link', res: '1200x628px' },
    { id: 'profile', label: 'Perfil/Logo', icon: CircleUser, desc: 'Avatar Redondo', res: '800x800px' },
  ];

  const currentRatio = ratios.find(r => r.id === aspectRatio);
  const filterString = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) blur(${filters.blur}px) sepia(${filters.sepia}%)`;

  const toggleMode = (mode: 'ai' | 'manual' | 'text') => {
      setIsEditing(mode === 'ai' ? !isEditing : false);
      setIsManualEditing(mode === 'manual' ? !isManualEditing : false);
      setIsTextMode(mode === 'text' ? !isTextMode : false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Visual Canvas */}
      <div className="space-y-4">
        
        {/* Toolbar Inteligente */}
        <div className="bg-slate-900/50 p-2 rounded-2xl border border-white/5 space-y-3 shadow-inner">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex overflow-x-auto gap-1 pb-1 scrollbar-hide">
                {ratios.map((r) => {
                const Icon = r.icon;
                const isActive = aspectRatio === r.id;
                return (
                    <button
                    key={r.id}
                    onClick={() => setAspectRatio(r.id as AspectRatio)}
                    className={`flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-xl gap-1.5 transition-all min-w-[60px] border ${
                        isActive 
                        ? 'bg-cyber-purple text-white border-cyber-purple/50 shadow-lg shadow-cyber-purple/20' 
                        : 'text-slate-500 hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                    >
                    <Icon size={16} />
                    </button>
                )
                })}
            </div>
            
            <div className="w-px h-10 bg-white/10 mx-1" />
            
            <button
                onClick={() => toggleMode('ai')}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl gap-1.5 transition-all border ${
                    isEditing
                    ? 'bg-cyber-electric text-white border-cyber-electric/50' 
                    : 'text-cyber-electric bg-cyber-electric/10 hover:bg-cyber-electric/20 border-cyber-electric/20'
                }`}
                title="IA Magic Edit"
            >
                <Wand2 size={16} />
            </button>

             <button
                onClick={() => toggleMode('text')}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl gap-1.5 transition-all border ${
                    isTextMode
                    ? 'bg-white text-cyber-dark border-white' 
                    : 'text-slate-400 bg-white/5 hover:bg-white/10 border-white/5'
                }`}
                title="Adicionar Texto"
            >
                <Type size={16} />
            </button>

            <button
                onClick={() => toggleMode('manual')}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl gap-1.5 transition-all border ${
                    isManualEditing
                    ? 'bg-violet-600 text-white border-violet-600/50' 
                    : 'text-slate-400 bg-white/5 hover:bg-white/10 border-white/5'
                }`}
                title="Ajuste Manual"
            >
                <SlidersHorizontal size={16} />
            </button>
          </div>
          
          <div className="flex items-center justify-between px-2 pt-1 border-t border-white/5">
             <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                <Info size={12} className="text-cyber-cyan" />
                <span>Res: <strong className="text-white">{currentRatio?.res}</strong></span>
             </div>
             <span className="text-[9px] font-black uppercase tracking-widest text-cyber-purple/80">
               {currentRatio?.desc}
             </span>
          </div>
        </div>
        
        {/* AI Edit Input */}
        <AnimatePresence>
            {isEditing && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-cyber-dark/80 backdrop-blur-xl border border-cyber-electric/30 rounded-2xl p-3 overflow-hidden mb-2"
                >
                    <div className="flex items-center gap-2">
                        <Wand2 size={16} className="text-cyber-electric shrink-0" />
                        <input 
                            type="text" 
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            placeholder="Ex: Adicionar um brilho neon, mudar o fundo..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-white text-xs placeholder:text-slate-500"
                            onKeyDown={(e) => e.key === 'Enter' && handleEditImage()}
                        />
                        <button 
                            onClick={handleEditImage}
                            disabled={isProcessingEdit || !editPrompt}
                            className="p-2 bg-cyber-electric rounded-lg text-white hover:opacity-90 disabled:opacity-50"
                        >
                            {isProcessingEdit ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Text Overlay Controls */}
        <AnimatePresence>
            {isTextMode && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-4 overflow-hidden space-y-4 mb-2 shadow-2xl z-40 relative"
                >
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                            <Type size={14} className="text-cyber-cyan" /> Editor de Texto
                        </span>
                        <div className="flex items-center gap-2">
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cor:</label>
                            <div className="relative group overflow-hidden w-5 h-5 rounded-full border border-white/30 cursor-pointer">
                                <input 
                                    type="color" 
                                    value={overlayColor}
                                    onChange={(e) => setOverlayColor(e.target.value)}
                                    className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 p-0 m-0 border-none cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <input 
                        type="text" 
                        value={overlayText}
                        onChange={(e) => setOverlayText(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-cyber-cyan/50 font-bold placeholder:text-slate-500 transition-all"
                    />

                    {/* Font Family Selection */}
                    <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Fonte:</label>
                        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                            {FONTS.map(font => (
                                <button
                                    key={font.id}
                                    onClick={() => setOverlayFont(font.class)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] whitespace-nowrap border transition-all ${
                                        overlayFont === font.class 
                                        ? 'bg-cyber-cyan text-cyber-dark border-cyber-cyan font-black' 
                                        : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'
                                    } ${font.class}`}
                                >
                                    {font.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Font Size Slider */}
                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Tamanho:</label>
                            <span className="text-[9px] text-cyber-cyan font-mono">{overlaySize}px</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Minus size={12} className="text-slate-500 cursor-pointer" onClick={() => setOverlaySize(s => Math.max(12, s - 4))} />
                            <input 
                                type="range" 
                                min="12" 
                                max="128" 
                                value={overlaySize} 
                                onChange={(e) => setOverlaySize(parseInt(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
                            />
                            <Plus size={12} className="text-slate-500 cursor-pointer" onClick={() => setOverlaySize(s => Math.min(128, s + 4))} />
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 p-2 bg-white/5 rounded-lg border border-white/5 mt-1">
                         <Move size={12} className="text-cyber-cyan" />
                         <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Arraste o texto livremente</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Manual Sliders */}
        <AnimatePresence>
            {isManualEditing && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-slate-900/90 backdrop-blur-xl border border-violet-600/30 rounded-2xl p-4 overflow-hidden space-y-4 mb-2"
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-violet-500">Controle Manual</span>
                        <button onClick={resetFilters} className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1">
                            <RotateCcw size={10} /> Reset
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[9px] text-slate-400 font-bold uppercase flex justify-between">
                                Brilho <span>{filters.brightness}%</span>
                            </label>
                            <input 
                                type="range" min="0" max="200" value={filters.brightness} 
                                onChange={(e) => handleFilterChange('brightness', parseInt(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] text-slate-400 font-bold uppercase flex justify-between">
                                Contraste <span>{filters.contrast}%</span>
                            </label>
                            <input 
                                type="range" min="0" max="200" value={filters.contrast} 
                                onChange={(e) => handleFilterChange('contrast', parseInt(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] text-slate-400 font-bold uppercase flex justify-between">
                                Saturação <span>{filters.saturate}%</span>
                            </label>
                            <input 
                                type="range" min="0" max="200" value={filters.saturate} 
                                onChange={(e) => handleFilterChange('saturate', parseInt(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                            />
                        </div>
                         <div className="space-y-1">
                            <label className="text-[9px] text-slate-400 font-bold uppercase flex justify-between">
                                Blur <span>{filters.blur}px</span>
                            </label>
                            <input 
                                type="range" min="0" max="10" value={filters.blur} 
                                onChange={(e) => handleFilterChange('blur', parseInt(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <div 
          ref={cardRef}
          style={{ aspectRatio: aspectRatio === 'profile' ? '1/1' : aspectRatio }}
          className="relative overflow-hidden rounded-[32px] bg-slate-900 border border-black/5 dark:border-white/10 shadow-2xl group transition-all duration-500"
        >
          {displayImage ? (
            <>
              <img 
                src={displayImage} 
                alt={data.title} 
                crossOrigin="anonymous"
                style={{ filter: filterString }}
                className={`w-full h-full object-cover object-center pointer-events-none transition-transform duration-700 ${isProcessingEdit ? 'blur-sm grayscale' : ''}`}
              />
              
              {/* Draggable Text Overlay Layer */}
              {overlayText && (
                  <motion.div 
                    drag
                    dragMomentum={false}
                    initial={{ x: "-50%", y: "-50%" }}
                    style={{ left: "50%", top: "50%", position: "absolute" }}
                    className="z-30 cursor-move touch-none"
                  >
                      <h2 
                        className={`text-center drop-shadow-2xl select-none leading-tight ${overlayFont} whitespace-nowrap`}
                        style={{ 
                            color: overlayColor, 
                            fontSize: `${overlaySize}px`,
                            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            fontWeight: 900
                        }}
                      >
                          {overlayText}
                      </h2>
                  </motion.div>
              )}

              {isProcessingEdit && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-30">
                      <Loader2 size={32} className="animate-spin text-cyber-electric" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white mt-2">Editando Pixels...</span>
                  </div>
              )}

              {/* Máscara de Preview para Perfil */}
              {aspectRatio === 'profile' && (
                <div className="absolute inset-0 pointer-events-none z-20">
                   <div className="w-full h-full border-[20px] sm:border-[40px] border-slate-950/80 rounded-full scale-110" />
                   <div className="absolute inset-0 border-2 border-white/20 rounded-full m-4 border-dashed opacity-50" />
                   <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white text-[9px] px-3 py-1 rounded-full uppercase tracking-widest font-black whitespace-nowrap">
                     Visualização de Corte Circular
                   </div>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-500 gap-4">
              <Loader2 className="animate-spin" size={32} />
              <span className="text-[10px] font-black uppercase tracking-widest">Renderizando IA...</span>
            </div>
          )}

          {/* Logo Overlay */}
          {aspectRatio !== 'profile' && (
            <div className="absolute top-8 right-8 z-10 pointer-events-none">
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} className="h-10 w-auto object-contain drop-shadow-2xl" />
              ) : (
                <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                  {brand.name}
                </div>
              )}
            </div>
          )}
          
          {/* Bottom Branding (Only for Single Posts) */}
          {aspectRatio !== 'profile' && (
            <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none">
              <div className="flex gap-1.5 mb-4">
                <div className="h-1 w-12 rounded-full" style={{ backgroundColor: brand.colors.primary }} />
                <div className="h-1 w-4 rounded-full bg-white/20" />
              </div>
              <h3 className="text-white font-brand font-bold text-2xl leading-tight line-clamp-2 drop-shadow-lg">
                {data.title}
              </h3>
              <div className="mt-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-lg bg-cyber-purple/20 border border-cyber-purple/30 text-[8px] font-black uppercase tracking-widest text-cyber-purple flex items-center gap-1 backdrop-blur-md">
                  <Sparkles size={8} fill="currentColor" /> Neural Core 2026
                </span>
                
                <span className="px-2 py-0.5 rounded-lg bg-white/10 border border-white/10 text-[8px] font-black uppercase tracking-widest text-white flex items-center gap-1 backdrop-blur-md">
                   Shivuk Studio
                </span>
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={handleDownload}
          disabled={downloading || !displayImage || isProcessingEdit}
          className="w-full flex items-center justify-center gap-3 py-5 bg-violet-600 text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-violet-600/20 active:scale-[0.98] transition-all disabled:opacity-50 group hover:bg-violet-500 hover:shadow-2xl hover:shadow-violet-600/30"
        >
          {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} className="group-hover:scale-110 transition-transform" />}
          {downloading ? 'Renderizando Slide...' : `Baixar Slide Atual`}
        </button>
      </div>

      {/* Copywriting Section */}
      <div className="space-y-6">
        <div className="glass border border-black/5 dark:border-white/10 rounded-[40px] p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={14} className="text-cyber-purple" /> 
              Legenda do Post
            </h4>
            <button 
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                copied ? 'bg-emerald-500 text-white' : 'bg-black/5 dark:bg-white/5 text-slate-500 hover:text-white'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copiado!' : 'Copiar Texto'}
            </button>
          </div>

          <p className="text-slate-800 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
              {data.content}
          </p>

          <div 
              className="flex items-center gap-2 font-bold text-xs p-4 rounded-2xl bg-black/5 dark:bg-white/5"
              style={{ borderLeft: `4px solid ${brand.colors.primary}` }}
          >
              <Hash size={14} className="text-cyber-purple" />
              <span className="text-slate-600 dark:text-slate-400">{data.hashtags}</span>
          </div>
        </div>

        {/* Research Sources (Search Grounding) */}
        {data.sources && data.sources.length > 0 && (
          <div className="p-6 rounded-[32px] bg-cyber-cyan/5 border border-cyber-cyan/20 space-y-3">
            <div className="text-[9px] text-cyber-cyan uppercase font-black tracking-[0.2em] flex items-center gap-2">
              <ExternalLink size={12} /> Fontes de Pesquisa 2026:
            </div>
            <div className="flex flex-wrap gap-2">
              {data.sources.map((src, i) => (
                <a 
                  key={i}
                  href={src.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[9px] bg-cyber-cyan/10 border border-cyber-cyan/10 px-3 py-1.5 rounded-lg text-cyber-cyan hover:bg-cyber-cyan/20 transition-all font-bold"
                >
                  {src.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
