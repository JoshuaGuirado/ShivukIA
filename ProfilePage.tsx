
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Briefcase, 
  FileText, 
  Camera, 
  Save, 
  Check, 
  AlertCircle,
  Loader2,
  ShieldCheck,
  Maximize
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  // 1. Gerenciamento de Estado com fallback para strings vazias
  const [name, setName] = useState(() => localStorage.getItem('shivuk_user_name') || '');
  const [email, setEmail] = useState(() => localStorage.getItem('shivuk_user_email') || '');
  const [role, setRole] = useState(() => localStorage.getItem('shivuk_user_role') || '');
  const [bio, setBio] = useState(() => localStorage.getItem('shivuk_user_bio') || '');
  const [avatar, setAvatar] = useState(() => localStorage.getItem('shivuk_user_avatar') || '');
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronização de dados legados se houver
  useEffect(() => {
    if (!name) {
      const legacy = localStorage.getItem('shivuk_user_profile');
      if (legacy) {
        try {
          const parsed = JSON.parse(legacy);
          setName(parsed.name || '');
          setEmail(parsed.email || '');
          setRole(parsed.role || '');
          setBio(parsed.bio || '');
          setAvatar(parsed.avatar || '');
        } catch (e) {}
      }
    }
  }, []);

  // 3. Salvar Dados (Save)
  const handleSave = () => {
    setIsSaving(true);
    
    // Persistência em chaves individuais para maior robustez
    setTimeout(() => {
      localStorage.setItem('shivuk_user_name', name);
      localStorage.setItem('shivuk_user_email', email);
      localStorage.setItem('shivuk_user_role', role);
      localStorage.setItem('shivuk_user_bio', bio);
      localStorage.setItem('shivuk_user_avatar', avatar);

      // Também mantendo o objeto JSON para compatibilidade
      localStorage.setItem('shivuk_user_profile', JSON.stringify({
        name, email, role, bio, avatar
      }));

      setIsSaving(false);
      setShowSuccess(true);
      
      // Sincronização Global para outros componentes (ex: Header)
      window.dispatchEvent(new Event('user-updated'));
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  // 4. Upload de Foto
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 pb-32 animate-fade-in text-cyber-green dark:text-white">
      <header className="space-y-2 text-center md:text-left">
        <h2 className="text-3xl font-brand font-extrabold text-cyber-green dark:text-white tracking-tight uppercase">Meu Perfil</h2>
        <p className="text-slate-500 dark:text-slate-400">Gerencie sua identidade visual e informações profissionais.</p>
      </header>

      {/* Grid Responsivo: Coluna Esquerda (Visual) | Coluna Direita (Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Coluna Esquerda: Cartão Visual */}
        <div className="space-y-6 lg:sticky lg:top-8">
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass border border-cyber-electric/20 rounded-[40px] p-8 flex flex-col items-center text-center space-y-6 relative overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent"
          >
            {/* Faixa Superior Dourada */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyber-electric via-cyber-galaxy to-cyber-electric" />
            
            {/* Avatar Grande com Upload Oculto */}
            <div className="relative group">
              <div className="w-48 h-48 rounded-[48px] overflow-hidden border-4 border-cyber-electric/20 bg-slate-100 dark:bg-black/40 shadow-2xl relative transition-transform duration-500 group-hover:scale-105 flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-cyber-electric/5 text-cyber-electric/40">
                    <User size={80} strokeWidth={1} />
                  </div>
                )}
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-cyber-dark/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <Camera size={32} className="text-cyber-electric" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Upload de Foto</span>
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
              
              {/* Badge de Verificação */}
              <div className="absolute -bottom-2 -right-2 bg-cyber-electric text-cyber-dark p-2 rounded-2xl border-4 border-white dark:border-cyber-dark shadow-lg">
                <ShieldCheck size={20} fill="currentColor" />
              </div>
            </div>

            <div className="space-y-1">
               {/* Resolution Suggestion */}
               <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/5 rounded-full px-3 py-1 mb-2">
                 <Maximize size={10} className="text-slate-400" />
                 <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                   Sugestão: 800x800px (1:1)
                 </span>
               </div>
              <h3 className="text-2xl font-brand font-bold text-cyber-green dark:text-white tracking-tight">{name || 'Visitante'}</h3>
              <p className="text-cyber-electric font-black text-xs uppercase tracking-widest leading-none">{role || 'Creative Member'}</p>
            </div>

            <div className="w-full pt-6 border-t border-white/5 flex flex-col gap-3">
              <div className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-2xl text-left border border-white/5">
                <Mail size={16} className="text-cyber-galaxy" />
                <span className="text-xs text-slate-700 dark:text-slate-300 truncate font-medium">{email || 'sem email configurado'}</span>
              </div>
            </div>
          </motion.section>

          {/* Feedback de Salvamento */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="p-5 bg-cyber-electric/10 border border-cyber-electric/20 rounded-3xl flex items-center gap-4 text-cyber-electric"
              >
                <div className="bg-cyber-electric text-cyber-dark p-1 rounded-lg">
                   <Check size={16} strokeWidth={4} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase tracking-widest">Sincronizado!</span>
                  <span className="text-[10px] opacity-70">Dados persistidos no navegador.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Coluna Direita: Formulário de Edição */}
        <div className="lg:col-span-2 space-y-8">
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass border border-white/10 rounded-[40px] p-8 md:p-12 space-y-10"
          >
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
              <div className="w-10 h-10 rounded-xl bg-cyber-electric/10 flex items-center justify-center text-cyber-electric">
                <User size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-cyber-green dark:text-white uppercase tracking-tight">Dados Pessoais</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Informações visíveis no seu estúdio</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Nome */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Nome Completo</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyber-electric transition-colors" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-[20px] py-4 pl-14 pr-6 text-cyber-green dark:text-white focus:outline-none focus:border-cyber-electric/50 focus:ring-4 focus:ring-cyber-electric/5 transition-all text-sm font-medium"
                    placeholder="Ex: Joshua Filipe Rodrigues"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">E-mail Profissional</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyber-electric transition-colors" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-[20px] py-4 pl-14 pr-6 text-cyber-green dark:text-white focus:outline-none focus:border-cyber-electric/50 focus:ring-4 focus:ring-cyber-electric/5 transition-all text-sm font-medium"
                    placeholder="email@dominio.ai"
                  />
                </div>
              </div>

              {/* Cargo */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Cargo ou Título</label>
                <div className="relative group">
                  <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyber-electric transition-colors" size={18} />
                  <input 
                    type="text" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-[20px] py-4 pl-14 pr-6 text-cyber-green dark:text-white focus:outline-none focus:border-cyber-electric/50 focus:ring-4 focus:ring-cyber-electric/5 transition-all text-sm font-medium"
                    placeholder="Ex: CEO, Creative Lead, Social Media..."
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Sobre Mim (Bio)</label>
                <div className="relative group">
                  <FileText className="absolute left-5 top-5 text-slate-400 group-focus-within:text-cyber-electric transition-colors" size={18} />
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={5}
                    className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-[20px] py-4 pl-14 pr-6 text-cyber-green dark:text-white focus:outline-none focus:border-cyber-electric/50 focus:ring-4 focus:ring-cyber-electric/5 transition-all text-sm font-medium resize-none leading-relaxed"
                    placeholder="Conte um pouco sobre sua carreira e objetivos no Shivuk AI..."
                  />
                </div>
              </div>
            </div>

            {/* Botão de Salvar */}
            <div className="flex justify-end pt-6">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className={`group relative overflow-hidden flex items-center gap-4 px-12 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl active:scale-[0.97] ${
                  isSaving 
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-wait' 
                  : 'bg-gradient-to-r from-cyber-electric to-cyber-galaxy text-cyber-dark hover:brightness-110 shadow-cyber-electric/20'
                }`}
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} className="transition-transform group-hover:scale-110" />
                )}
                {isSaving ? 'Processando...' : 'Salvar Alterações'}
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
              </button>
            </div>
          </motion.section>

          {/* Aviso de Privacidade */}
          <div className="p-6 rounded-[32px] bg-cyber-electric/5 border border-white/5 flex gap-5 items-center">
             <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                <AlertCircle className="text-cyber-galaxy" size={24} />
             </div>
             <div className="space-y-1">
                <p className="text-[11px] font-black text-cyber-green dark:text-white uppercase tracking-widest">Controle Total de Privacidade</p>
                <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-tight font-medium">
                  Seus dados e foto são salvos exclusivamente no seu cache local. O Shivuk AI 2.0 não envia suas informações pessoais para servidores externos, garantindo anonimato total.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
