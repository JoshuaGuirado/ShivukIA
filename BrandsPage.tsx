import React, { useRef, useState } from 'react';
import { useBrand, Brand } from '../contexts/BrandContext';
import { Upload, Trash2, Palette, Type, CheckCircle2, Save, Check, Plus, AlertCircle, Info, Briefcase, LayoutGrid, Star, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BrandsPage: React.FC = () => {
  const {
    brands,
    activeBrandId,
    activateBrand,
    addBrand,
    removeBrand,
    updateBrand,
    isLoading
  } = useBrand();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fallback seguro se não houver marca carregada ainda
  const editingBrand = brands.find(b => b.id === activeBrandId) || brands[0];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingBrand) {
      if (file.size > 2 * 1024 * 1024) {
        alert("O arquivo é muito grande (Máx 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Atualização direta no Firestore
        updateBrand(editingBrand.id, {
          savedLogos: [base64, ...editingBrand.savedLogos],
          logo: editingBrand.logo || base64
        });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const removeLogo = (logoToRemove: string) => {
    if (!editingBrand) return;
    const newSavedLogos = editingBrand.savedLogos.filter(l => l !== logoToRemove);
    const newActiveLogo = editingBrand.logo === logoToRemove ? (newSavedLogos[0] || null) : editingBrand.logo;

    updateBrand(editingBrand.id, {
      savedLogos: newSavedLogos,
      logo: newActiveLogo
    });
  };

  const handleDeleteBrand = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm("Tem certeza que deseja apagar este cliente permanentemente?")) {
      removeBrand(id);
    }
  };

  const selectLogo = (selected: string) => {
    if (!editingBrand) return;
    updateBrand(editingBrand.id, { logo: selected });
  };

  const updateColor = (key: 'primary' | 'secondary' | 'accent', value: string) => {
    if (!editingBrand) return;
    updateBrand(editingBrand.id, {
      colors: { ...editingBrand.colors, [key]: value }
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-slate-500 gap-3">
        <Loader2 className="animate-spin" /> Carregando Marcas...
      </div>
    );
  }

  if (!editingBrand) {
    return (
      <div className="flex h-full items-center justify-center text-slate-500 gap-3">
        Ops! Nenhuma marca encontrada. Crie uma para começar.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col gap-6 overflow-hidden">

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div className="space-y-2">
          <h2 className="text-3xl font-brand font-extrabold text-white tracking-tight uppercase">Minhas Marcas</h2>
          <p className="text-slate-400">Gerencie múltiplos clientes. Alterações são salvas automaticamente.</p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
          <CheckCircle2 size={12} /> Autosave Ativo
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden min-h-0 pb-10">

        {/* LEFT: Brand List */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Briefcase size={14} /> Carteira de Clientes
            </h3>
            <button
              onClick={addBrand}
              className="p-2 bg-cyber-electric hover:bg-cyber-electric/90 text-cyber-dark rounded-lg transition-colors"
              title="Criar Nova Marca"
            >
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>

          {brands.map((brand) => {
            const isActive = activeBrandId === brand.id;
            return (
              <motion.div
                layout
                key={brand.id}
                onClick={() => activateBrand(brand.id)}
                className={`group relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 ${isActive
                  ? 'bg-cyber-electric/10 border-cyber-electric shadow-lg shadow-cyber-electric/5'
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center border border-white/5 overflow-hidden">
                      {brand.logo ? (
                        <img src={brand.logo} className="w-full h-full object-contain" alt="logo" />
                      ) : (
                        <span className="text-xs font-bold text-slate-500">{brand.name ? brand.name.substring(0, 2).toUpperCase() : '??'}</span>
                      )}
                    </div>
                    <div>
                      <h4 className={`font-bold leading-tight ${isActive ? 'text-cyber-electric' : 'text-slate-300'}`}>
                        {brand.name}
                      </h4>
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">
                        {brand.savedLogos?.length || 0} Variações
                      </p>
                    </div>
                  </div>

                  {isActive && (
                    <div className="px-2 py-1 bg-cyber-electric text-cyber-dark text-[8px] font-black uppercase tracking-widest rounded-md flex items-center gap-1">
                      <Star size={8} fill="currentColor" /> Ativa
                    </div>
                  )}
                </div>

                <div className="flex gap-1.5 mt-1">
                  <div className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: brand.colors.primary }} />
                  <div className="h-1.5 w-4 rounded-full" style={{ backgroundColor: brand.colors.secondary }} />
                  <div className="h-1.5 w-4 rounded-full" style={{ backgroundColor: brand.colors.accent }} />
                </div>

                {brands.length > 1 && (
                  <button
                    onClick={(e) => handleDeleteBrand(e, brand.id)}
                    className="absolute top-2 right-2 p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 z-30"
                    title="Apagar este cliente permanentemente"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* RIGHT: Editor Area */}
        <div className="lg:col-span-8 overflow-y-auto pr-2 custom-scrollbar space-y-8">

          <section className="glass border border-white/5 p-8 rounded-[32px] space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="w-8 h-8 rounded-lg bg-cyber-electric/20 flex items-center justify-center text-cyber-electric">
                <Type size={16} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">Identidade: {editingBrand.name}</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Configurações principais desta marca</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome da Marca</label>
              <input
                type="text"
                key={`name-input-${editingBrand.id}`}
                defaultValue={editingBrand.name}
                onBlur={(e) => {
                  if (e.target.value.trim() !== '' && e.target.value !== editingBrand.name) {
                    updateBrand(editingBrand.id, { name: e.target.value });
                  } else if (e.target.value.trim() === '') {
                    // Reset if emptied but not saved
                    e.target.value = editingBrand.name;
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  }
                }}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-cyber-electric/50 transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['primary', 'secondary', 'accent'] as const).map((colorKey) => (
                <div key={colorKey} className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    {colorKey === 'primary' ? 'Primária' : colorKey === 'secondary' ? 'Secundária' : 'Acento'}
                  </label>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-white/20 transition-all">
                    <input
                      type="color"
                      value={editingBrand.colors[colorKey]}
                      onChange={(e) => updateColor(colorKey, e.target.value)}
                      className="w-10 h-10 bg-transparent border-none cursor-pointer rounded-lg overflow-hidden shrink-0"
                    />
                    <input
                      type="text"
                      value={editingBrand.colors[colorKey].toUpperCase()}
                      onChange={(e) => updateColor(colorKey, e.target.value)}
                      className="bg-transparent border-none focus:ring-0 text-xs font-mono text-slate-300 w-full"
                      maxLength={7}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass border border-white/5 p-8 rounded-[32px] space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyber-galaxy/20 flex items-center justify-center text-cyber-galaxy">
                  <LayoutGrid size={16} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">Acervo de Logos</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Gerencie variações (Escuro, Claro, Ícone)</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-cyber-electric hover:bg-cyber-electric/90 text-cyber-dark rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <Upload size={14} /> Upload Logo
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>

            {!editingBrand.savedLogos || editingBrand.savedLogos.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-slate-600 space-y-3 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                <Upload size={24} />
                <p className="text-xs font-bold uppercase tracking-widest">Nenhuma logo enviada para esta marca</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {editingBrand.savedLogos.map((logo, idx) => {
                  const isSelected = editingBrand.logo === logo;
                  return (
                    <motion.div
                      key={idx}
                      layout
                      onClick={() => selectLogo(logo)}
                      className={`relative group aspect-square rounded-2xl border-2 transition-all p-4 flex items-center justify-center overflow-hidden cursor-pointer bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] ${isSelected
                        ? 'border-cyber-electric bg-cyber-electric/5 shadow-lg shadow-cyber-electric/10'
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                        }`}
                    >
                      <img src={logo} alt={`Logo Variation ${idx}`} className="max-w-full max-h-full object-contain" />

                      {isSelected && (
                        <div className="absolute top-2 right-2 p-1 bg-cyber-electric text-cyber-dark rounded-full shadow-lg z-10">
                          <Check size={10} strokeWidth={4} />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 z-20">
                        <span className="text-[8px] font-black uppercase text-white tracking-widest mb-1">
                          {isSelected ? 'Selecionado' : 'Usar Esta'}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeLogo(logo); }}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-red-600 flex items-center gap-1"
                        >
                          <Trash2 size={10} /> Apagar
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};