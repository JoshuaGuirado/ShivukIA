
import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  Send, User, Monitor, Palette, Sparkles, CheckCircle,
  Loader2, RefreshCw, Zap, Video, Image as ImageIcon, Key, Layers,
  Mic, MicOff, Paperclip, X, Wand2, Type, Briefcase, FolderOpen,
  MessageSquarePlus, AlertTriangle
} from 'lucide-react';
import { PostPreview } from './PostPreview';
import { VideoPreview } from './VideoPreview';
import { useGeneration, Persona, Platform, GenerationMode } from '../contexts/GenerationContext';
import { useSettings } from '../contexts/SettingsContext';
import { useBrand } from '../contexts/BrandContext';
import { useLibrary } from '../contexts/LibraryContext';
import { motion, AnimatePresence } from 'framer-motion';

export function MainChat({ initialPrompt, onClearInitialPrompt }: { initialPrompt?: string | null, onClearInitialPrompt?: () => void }) {
  const {
    mode, setMode,
    persona, setPersona,
    platform, setPlatform,
    style, setStyle,
    prompt, setPrompt,
    attachedImage, setAttachedImage,
    targetFolderId, setTargetFolderId,
    isGenerating, pipelineStep,
    sessionPosts, sessionCaptions, sessionVideos,
    startGeneration, resetResult
  } = useGeneration();

  const { t } = useSettings();
  const { brands, activeBrandId, activateBrand } = useBrand();
  const { folders } = useLibrary();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Error Message State
  const [generationError, setGenerationError] = useState<string | null>(null);

  const PERSONAS: Persona[] = useMemo(() => [
    { id: 'joshua', label: t.personas.joshua, desc: t.personas.joshuaDesc },
    { id: 'gabriel', label: t.personas.gabriel, desc: t.personas.gabrielDesc },
    { id: 'caelum', label: t.personas.caelum, desc: t.personas.caelumDesc },
    { id: 'nyx', label: t.personas.nyx, desc: t.personas.nyxDesc },
    { id: 'ziggy', label: t.personas.ziggy, desc: t.personas.ziggyDesc }, // Humor & Relatable
    { id: 'kai', label: t.personas.kai, desc: t.personas.kaiDesc }, // Viral & Trends
    { id: 'solara', label: t.personas.solara, desc: t.personas.solaraDesc } // Sophistication
  ], [t]);

  const PLATFORMS: Platform[] = [
    { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { id: 'instagram', label: 'Instagram', icon: '📸' },
    { id: 'stories', label: 'Stories', icon: '📱' },
    { id: 'tiktok', label: 'TikTok', icon: '🎵' },
    { id: 'twitter', label: 'Twitter/X', icon: '🐦' }
  ];

  const STYLES = ['Minimalista (Apple Style)', 'Neon Cyberpunk (Futurista)', 'Corporativo Clean', 'Fotografia Realista', 'Ilustração 3D', 'Cinematográfico (Video Only)', 'Animação 3D (Video Only)'];

  const PIPELINE_STEPS = [
    { id: 1, label: 'SCAN', sub: 'Limpando contexto...' },
    { id: 2, label: 'BUILD', sub: 'Estruturando ideia...' },
    { id: 3, label: 'RENDER', sub: 'Processando pixels...' },
    { id: 4, label: 'FINISH', sub: 'Finalizando ativo...' }
  ];

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt, onClearInitialPrompt]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'pt-BR'; // Default to PT-BR based on app context

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setPrompt(prev => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleGeneration = async () => {
    setGenerationError(null);
    if (mode === 'caption' && !attachedImage) {
      // Trigger file upload if user forgets
      fileInputRef.current?.click();
      return;
    }

    try {
      await startGeneration();
    } catch (error: any) {
      console.error("MainChat detected error:", error);
      setGenerationError(error.message || "Falha na geração");
    }
  };

  const handleNewChat = () => {
    if (confirm("Iniciar novo chat? O conteúdo atual já está salvo na Biblioteca.")) {
      resetResult();
      setPrompt('');
      setAttachedImage(null);
      setGenerationError(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Imagem muito grande (Max 5MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Clear input value to allow same file upload again if needed
    e.target.value = '';
  };

  const getPlaceholder = () => {
    if (isListening) return "Ouvindo sua voz...";
    if (mode === 'video') return t.mainChat.placeholderVideo;
    if (mode === 'caption') return t.mainChat.placeholderCaption;
    return `${t.mainChat.placeholderPost} ${platform.label}?`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col gap-8 overflow-y-auto pb-32 animate-fade-in text-cyber-electric dark:text-white">

      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-brand font-extrabold text-cyber-electric dark:text-white tracking-tight uppercase">
            Shivuk AI Studio
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.mainChat.subtitle}</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="px-3 py-1.5 rounded-full bg-cyber-electric/10 border border-cyber-electric/20 text-cyber-electric dark:text-cyber-electric text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Zap size={12} fill="currentColor" /> {t.mainChat.context}
          </div>

          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-4 py-2 bg-cyber-electric hover:bg-cyber-electric/90 text-cyber-dark rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-cyber-electric/10"
            title="Novo Chat (Limpar Tela)"
          >
            <MessageSquarePlus size={14} /> Novo Chat
          </button>
        </div>
      </header>

      {/* Mode Switcher */}
      <div className="flex p-1 bg-cyber-light rounded-2xl w-fit self-center border border-white/5 flex-wrap justify-center gap-1">
        <button
          onClick={() => setMode('post')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'post'
              ? 'bg-cyber-electric text-cyber-dark shadow-lg'
              : 'text-slate-500 hover:text-cyber-electric'
            }`}
        >
          <ImageIcon size={14} /> {t.mainChat.socialPost}
        </button>
        <button
          onClick={() => setMode('video')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'video'
              ? 'bg-gradient-to-r from-cyber-electric to-cyber-galaxy text-cyber-dark shadow-lg shadow-cyber-electric/20'
              : 'text-slate-500 hover:text-cyber-electric'
            }`}
        >
          <Video size={14} /> {t.mainChat.veoVideo}
        </button>

        {/* Caption Mode Button */}
        <button
          onClick={() => setMode('caption')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'caption'
              ? 'bg-gradient-to-r from-cyber-indigo to-cyber-galaxy text-cyber-dark shadow-lg shadow-cyber-indigo/20'
              : 'text-slate-500 hover:text-cyber-electric'
            }`}
        >
          <Wand2 size={14} /> {t.mainChat.captionMode}
        </button>
      </div>

      {/* Control Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Brand Selector */}
        <div className="glass border border-white/5 p-4 rounded-2xl space-y-3">
          <label className="text-[10px] font-black text-cyber-electric dark:text-cyber-electric uppercase tracking-widest flex items-center gap-2">
            <Briefcase size={14} /> Cliente (Marca)
          </label>
          <select
            className="w-full bg-cyber-light hover:bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-cyber-electric/50 text-white transition-all appearance-none cursor-pointer"
            value={activeBrandId}
            onChange={(e) => activateBrand(e.target.value)}
          >
            {brands.map((b) => <option key={b.id} value={b.id} className="bg-cyber-dark text-white">{b.name}</option>)}
          </select>
        </div>

        {/* Folder Selector (Destination) */}
        <div className="glass border border-white/5 p-4 rounded-2xl space-y-3">
          <label className="text-[10px] font-black text-cyber-electric dark:text-cyber-electric uppercase tracking-widest flex items-center gap-2">
            <FolderOpen size={14} /> Salvar em
          </label>
          <select
            className="w-full bg-cyber-light hover:bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-cyber-electric/50 text-white transition-all appearance-none cursor-pointer"
            value={targetFolderId || ''}
            onChange={(e) => setTargetFolderId(e.target.value || undefined)}
          >
            <option value="" className="bg-cyber-dark text-white">Raiz (Biblioteca)</option>
            {folders.map((f) => <option key={f.id} value={f.id} className="bg-cyber-dark text-white">{f.name}</option>)}
          </select>
        </div>

        {mode === 'post' && (
          <>
            <div className="glass border border-white/5 p-4 rounded-2xl space-y-3">
              <label className="text-[10px] font-black text-cyber-electric dark:text-cyber-electric uppercase tracking-widest flex items-center gap-2">
                <User size={14} /> {t.mainChat.persona}
              </label>
              <select
                className="w-full bg-cyber-light hover:bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-cyber-electric/50 text-white transition-all appearance-none cursor-pointer"
                value={PERSONAS.findIndex(p => p.id === persona.id)}
                onChange={(e) => setPersona(PERSONAS[parseInt(e.target.value)])}
              >
                {PERSONAS.map((p, idx) => <option key={p.id} value={idx} className="bg-cyber-dark text-white">{p.label}</option>)}
              </select>
            </div>

            <div className="glass border border-white/5 p-4 rounded-2xl space-y-3">
              <label className="text-[10px] font-black text-cyber-electric dark:text-cyber-electric uppercase tracking-widest flex items-center gap-2">
                <Monitor size={14} /> {t.mainChat.platform}
              </label>
              <select
                className="w-full bg-cyber-light hover:bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-cyber-electric/50 text-white transition-all appearance-none cursor-pointer"
                value={PLATFORMS.findIndex(p => p.id === platform.id)}
                onChange={(e) => setPlatform(PLATFORMS[parseInt(e.target.value)])}
              >
                {PLATFORMS.map((p, idx) => <option key={p.id} value={idx} className="bg-cyber-dark text-white">{p.label}</option>)}
              </select>
            </div>
          </>
        )}

        <div className={`glass border border-white/5 p-4 rounded-2xl space-y-3 ${mode === 'video' ? 'col-span-1 md:col-span-2' : mode === 'caption' ? 'col-span-full md:col-span-2' : 'col-span-full'}`}>
          <label className="text-[10px] font-black text-cyber-galaxy uppercase tracking-widest flex items-center gap-2">
            <Palette size={14} /> {mode === 'video' ? t.mainChat.cineStyle : mode === 'caption' ? 'Estilo da Legenda' : t.mainChat.visualStyle}
          </label>
          {mode !== 'caption' ? (
            <select
              className="w-full bg-cyber-light hover:bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-cyber-galaxy/50 text-white transition-all appearance-none cursor-pointer"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              {STYLES.map(s => <option key={s} value={s} className="bg-cyber-dark text-white">{s}</option>)}
            </select>
          ) : (
            <div className="w-full bg-cyber-light border border-white/10 rounded-xl p-2.5 text-xs font-bold text-slate-500 flex items-center gap-2">
              <Sparkles size={12} className="text-cyber-galaxy" /> A IA detectará automaticamente o estilo visual da sua foto.
            </div>
          )}
        </div>
      </div>

      {/* Input Section */}
      <div className="relative group">
        <div className={`absolute inset-0 blur-2xl rounded-[40px] group-focus-within:opacity-100 opacity-50 transition-all ${mode === 'video' ? 'bg-gradient-to-r from-cyber-electric/20 to-cyber-galaxy/20' : mode === 'caption' ? 'bg-cyber-indigo/10' : 'bg-cyber-electric/5'}`} />
        <div className="relative glass border-2 border-white/5 rounded-[32px] p-6 shadow-2xl space-y-4 bg-cyber-light/50">

          {/* Image Preview Area */}
          <AnimatePresence>
            {attachedImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, height: 0 }}
                animate={{ opacity: 1, scale: 1, height: 'auto' }}
                exit={{ opacity: 0, scale: 0.9, height: 0 }}
                className="relative w-fit mb-2"
              >
                <img src={attachedImage} alt="Uploaded context" className="h-20 w-auto rounded-xl border border-white/20 shadow-lg" />
                <button
                  onClick={() => setAttachedImage(null)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md"
                >
                  <X size={12} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full h-32 bg-transparent resize-none text-xl font-medium outline-none placeholder:text-slate-600 dark:text-white text-cyber-electric"
          />

          <AnimatePresence>
            {generationError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex flex-col gap-2 text-red-500 text-xs font-bold"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle size={16} />
                  {generationError}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-3">
              {/* Voice Input Button */}
              <button
                onClick={toggleListening}
                className={`p-3 rounded-xl transition-all ${isListening
                    ? 'bg-red-500/10 text-red-500 animate-pulse border border-red-500/30'
                    : 'bg-cyber-light text-slate-400 hover:text-cyber-electric hover:bg-cyber-electric/10'
                  }`}
                title="Digitação por Voz"
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              {/* Image Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`p-3 rounded-xl transition-all ${mode === 'caption' && !attachedImage
                    ? 'bg-cyber-indigo text-cyber-dark animate-pulse shadow-lg shadow-cyber-indigo/30'
                    : 'bg-cyber-light text-slate-400 hover:text-cyber-electric hover:bg-cyber-electric/10'
                  }`}
                title="Anexar Imagem"
              >
                <Paperclip size={18} />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
              </button>

              <div className="h-8 w-px bg-white/10 mx-2" />

              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                {prompt.length} / {mode === 'video' ? '300' : '1000'} {t.mainChat.chars}
                {mode === 'video' && <span className="text-cyber-electric"> • {t.mainChat.veoReady}</span>}
                {mode === 'caption' && <span className="text-cyber-indigo"> • {t.mainChat.visionReady}</span>}
              </div>
            </div>

            <button
              onClick={handleGeneration}
              disabled={isGenerating || (mode === 'post' && !prompt) || (mode === 'video' && !prompt)}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl active:scale-95 ${isGenerating || (mode !== 'caption' && !prompt && !attachedImage)
                  ? 'bg-cyber-light text-slate-600 cursor-not-allowed'
                  : mode === 'caption'
                    ? 'bg-gradient-to-r from-cyber-indigo to-cyber-galaxy text-cyber-dark shadow-cyber-indigo/20'
                    : 'bg-gradient-to-r from-cyber-electric to-cyber-galaxy text-cyber-dark shadow-cyber-electric/20'
                }`}
            >
              {isGenerating ? <Loader2 size={18} className="animate-spin" /> : mode === 'video' ? <Video size={18} /> : mode === 'caption' ? <Wand2 size={18} /> : <Send size={18} />}
              {isGenerating
                ? t.mainChat.generating
                : mode === 'video'
                  ? t.mainChat.generateVideo
                  : mode === 'caption'
                    ? (!attachedImage ? t.mainChat.uploadRequired : t.mainChat.generateCaption)
                    : t.mainChat.generateContent}
            </button>
          </div>
        </div>
      </div>

      {/* Pipeline Status (Only shown when generating) */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 rounded-[32px] bg-cyber-light border border-white/10 space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className={`text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2 ${mode === 'video' ? 'text-cyber-galaxy' : 'text-cyber-electric'}`}>
                <Loader2 size={14} className="animate-spin" /> {mode === 'video' ? 'Veo 3.1 Rendering Engine' : t.mainChat.pipeline}
              </h3>
              <div className="text-[9px] font-mono text-slate-600">SHIVUK_PIPELINE_STABLE</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PIPELINE_STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`relative p-4 rounded-2xl border transition-all duration-700 overflow-hidden ${pipelineStep >= step.id
                      ? (mode === 'video' ? 'bg-cyber-galaxy/10 border-cyber-galaxy text-cyber-galaxy' : 'bg-cyber-electric/10 border-cyber-electric text-cyber-electric')
                      : 'bg-white/5 border-white/5 text-slate-600'
                    }`}
                >
                  {pipelineStep === step.id && (
                    <motion.div
                      layoutId="activeStep"
                      className={`absolute inset-0 animate-pulse ${mode === 'video' ? 'bg-cyber-galaxy/5' : 'bg-cyber-electric/5'}`}
                    />
                  )}
                  <span className="text-[9px] font-black opacity-50 block mb-1">0{step.id}</span>
                  <div className="text-xs font-black uppercase tracking-widest">{step.label}</div>
                  <div className="text-[9px] opacity-70 truncate">{step.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FEED DE RESULTADOS (POSTS) - Somente se mode === 'post' */}
      {mode === 'post' && sessionPosts.length > 0 && (
        <div className="space-y-12">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xl font-brand font-bold uppercase tracking-tight flex items-center gap-2 dark:text-white text-cyber-electric">
              <Layers className="text-cyber-electric" /> Histórico de Posts Sociais
            </h2>
            <span className="text-xs font-bold text-slate-500">{sessionPosts.length} posts criados</span>
          </div>

          <AnimatePresence>
            {sessionPosts.map((post, index) => (
              <motion.div
                key={post.id || index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Número do Post no Feed */}
                <div className="absolute -left-4 top-0 -translate-x-full hidden lg:flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-slate-500">
                    #{sessionPosts.length - index}
                  </div>
                  <div className="w-px h-full bg-white/5" />
                </div>

                <PostPreview data={post} index={index} />

                {/* Separator se não for o último */}
                {index < sessionPosts.length - 1 && (
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-12" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* FEED DE RESULTADOS (LEGENDAS) - Somente se mode === 'caption' */}
      {mode === 'caption' && sessionCaptions.length > 0 && (
        <div className="space-y-12">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xl font-brand font-bold uppercase tracking-tight flex items-center gap-2 dark:text-white text-cyber-electric">
              <Type className="text-cyber-indigo" /> Histórico de Legendas
            </h2>
            <span className="text-xs font-bold text-slate-500">{sessionCaptions.length} legendas geradas</span>
          </div>

          <AnimatePresence>
            {sessionCaptions.map((caption, index) => (
              <motion.div
                key={caption.id || index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute -left-4 top-0 -translate-x-full hidden lg:flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-slate-500">
                    #{sessionCaptions.length - index}
                  </div>
                  <div className="w-px h-full bg-white/5" />
                </div>

                <PostPreview data={caption} index={index} />

                {index < sessionCaptions.length - 1 && (
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-12" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* FEED DE RESULTADOS (VIDEOS) */}
      {mode === 'video' && sessionVideos.length > 0 && (
        <div className="space-y-12">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xl font-brand font-bold uppercase tracking-tight flex items-center gap-2 text-cyber-electric dark:text-white">
              <Video className="text-cyber-electric dark:text-white" /> Galeria de Vídeos da Sessão
            </h2>
            <span className="text-xs font-bold text-slate-500">{sessionVideos.length} vídeos renderizados</span>
          </div>

          <AnimatePresence>
            {sessionVideos.map((video, index) => (
              <motion.div
                key={video.id || index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <VideoPreview videoUrl={video.url} caption={video.caption} />

                {index < sessionVideos.length - 1 && (
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-12" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
