
import React, { useState } from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import { Trash2, Copy, Check, Search, Calendar, FolderOpen, ExternalLink, Image as ImageIcon, FolderPlus, ArrowLeft, Folder, Maximize2, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LibraryItem } from '../types';

export const LibraryPage: React.FC = () => {
  const { items, folders, removeItem, clearLibrary, createFolder, deleteFolder } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<LibraryItem | null>(null);
  
  // Folder Navigation State
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Filter items based on current folder
  const currentItems = items.filter(item => {
    if (currentFolderId) {
        return item.folderId === currentFolderId;
    }
    return !item.folderId; 
  });

  const filteredItems = currentItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentFolder = folders.find(f => f.id === currentFolderId);

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeItem(id);
    if (selectedAsset?.id === id) setSelectedAsset(null);
  };

  const handleDownloadImage = (e: React.MouseEvent, imageUrl: string, title: string) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `shivuk-asset-${title.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.click();
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName);
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             {currentFolderId && (
                 <button 
                    onClick={() => setCurrentFolderId(null)}
                    className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-white"
                 >
                     <ArrowLeft size={20} />
                 </button>
             )}
             <h2 className="text-3xl font-display font-bold text-white tracking-tight">
                {currentFolder ? currentFolder.name : 'Biblioteca de Ativos'}
             </h2>
          </div>
          <p className="text-slate-400">
             {currentFolderId 
                ? 'Visualizando arquivos nesta pasta.'
                : 'Gerencie posts e pastas da sua agência.'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyber-purple/50 w-48 lg:w-64 transition-all"
            />
          </div>
          
          <button 
            onClick={() => setIsCreatingFolder(!isCreatingFolder)}
            className={`p-2.5 rounded-xl transition-all ${isCreatingFolder ? 'bg-cyber-electric text-cyber-dark' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            title="Criar Pasta"
          >
            <FolderPlus size={20} />
          </button>

          {items.length > 0 && !currentFolderId && (
            <button 
              onClick={() => { if(confirm('Excluir todos os registros permanentemente?')) clearLibrary(); }}
              className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              title="Limpar Biblioteca"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </header>
      
      {/* Folder Creation Input */}
      <AnimatePresence>
        {isCreatingFolder && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
            >
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <FolderPlus size={24} className="text-cyber-electric" />
                    <input 
                        type="text" 
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Nome da Pasta (ex: Cliente X, Campanha Y)..."
                        className="flex-1 bg-transparent border-none text-white focus:ring-0 placeholder:text-slate-600 font-bold"
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                    />
                    <button 
                        onClick={handleCreateFolder}
                        className="px-4 py-2 bg-cyber-electric text-cyber-dark rounded-xl font-bold text-xs uppercase tracking-wider"
                    >
                        Criar Pasta
                    </button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Folders Grid */}
      {!currentFolderId && folders.length > 0 && (
          <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Folder size={14} /> Pastas & Projetos
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {folders.map(folder => (
                      <motion.div
                          key={folder.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setCurrentFolderId(folder.id)}
                          className="group p-4 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-white/10 transition-all flex flex-col justify-between h-32 relative"
                      >
                          <Folder size={32} className="text-cyber-electric mb-2 group-hover:text-white transition-colors" />
                          <span className="font-bold text-slate-300 group-hover:text-white truncate text-sm">{folder.name}</span>
                          
                          <button 
                             onClick={(e) => { e.stopPropagation(); if(confirm('Apagar pasta?')) deleteFolder(folder.id); }}
                             className="absolute top-2 right-2 p-1 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                             <Trash2 size={14} />
                          </button>
                      </motion.div>
                  ))}
              </div>
          </div>
      )}

      {/* Items Grid */}
      <div className="space-y-4">
           {currentFolderId && (
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon size={14} /> Arquivos
               </h3>
           )}

          {filteredItems.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-white/5 rounded-[32px]">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-slate-600 mb-2">
                <FolderOpen size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-400">Esta pasta está vazia</h3>
              <p className="text-slate-600 max-w-xs text-sm">
                Selecione esta pasta no chat antes de gerar conteúdo para salvar aqui.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    onClick={() => setSelectedAsset(item)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group glass border border-white/5 rounded-[24px] overflow-hidden flex flex-col h-full hover:border-cyber-electric/30 transition-all shadow-lg hover:shadow-cyber-electric/5 cursor-pointer"
                  >
                    {/* Header info */}
                    <div className="p-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.brandColor }} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.brandName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
                        <Calendar size={10} />
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Content Thumbnail */}
                    <div className="p-5 space-y-4 flex-1">
                      {/* Image Thumbnail if available */}
                      {item.imageUrl && (
                          <div className="w-full h-32 rounded-xl overflow-hidden mb-3 relative">
                              <img src={item.imageUrl} alt="Asset" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Maximize2 className="text-white" size={24} />
                              </div>
                          </div>
                      )}

                      <h4 className="text-white font-bold leading-tight group-hover:text-cyber-electric transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                        {item.content}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {item.hashtags.split(' ').slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[10px] text-cyber-galaxy font-bold">{tag}</span>
                        ))}
                      </div>
                    </div>

                    {/* Footer actions */}
                    <div className="p-4 bg-white/[0.03] border-t border-white/5 flex items-center justify-between">
                      <div className="flex gap-1">
                        <button 
                          onClick={(e) => handleCopy(e, `${item.title}\n\n${item.content}\n\n${item.hashtags}`, item.id)}
                          className={`p-2 rounded-lg transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${
                            copiedId === item.id ? 'bg-emerald-500 text-white' : 'hover:bg-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                          {copiedId === item.id ? 'Copiado' : 'Copiar'}
                        </button>
                      </div>
                      <div className="flex gap-1">
                         {item.imageUrl && (
                            <button 
                                onClick={(e) => handleDownloadImage(e, item.imageUrl!, item.title)}
                                className="p-2 text-slate-600 hover:text-cyber-electric hover:bg-cyber-electric/10 rounded-lg transition-all"
                                title="Baixar Imagem"
                            >
                                <Download size={16} />
                            </button>
                         )}
                        <button 
                          onClick={(e) => handleDelete(e, item.id)}
                          className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedAsset && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedAsset(null)}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-cyber-dark/80 border border-white/10 rounded-[32px] overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row shadow-2xl relative"
                >
                    <button 
                        onClick={() => setSelectedAsset(null)}
                        className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-red-500 rounded-full text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Image Section */}
                    {selectedAsset.imageUrl ? (
                        <div className="flex-1 bg-black flex items-center justify-center relative group min-h-[300px] md:min-h-full">
                            <img src={selectedAsset.imageUrl} alt="Asset Full" className="max-w-full max-h-[85vh] object-contain" />
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={(e) => handleDownloadImage(e, selectedAsset.imageUrl!, selectedAsset.title)}
                                    className="flex items-center gap-2 px-4 py-2 bg-cyber-electric text-cyber-dark font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
                                >
                                    <Download size={14} /> Download
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-1/3 bg-white/5 flex items-center justify-center flex-col gap-4 text-slate-600 hidden md:flex">
                             <ImageIcon size={48} className="opacity-20" />
                             <span className="text-xs font-black uppercase tracking-widest">Sem Imagem</span>
                        </div>
                    )}

                    {/* Content Section */}
                    <div className="w-full md:w-[400px] flex flex-col border-l border-white/10 bg-cyber-light/95">
                        <div className="p-6 border-b border-white/5 space-y-2">
                             <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedAsset.brandColor }} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-cyber-electric">{selectedAsset.brandName}</span>
                            </div>
                            <h3 className="text-xl font-brand font-bold text-white">{selectedAsset.title}</h3>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={12} /> {new Date(selectedAsset.timestamp).toLocaleString()}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Legenda</label>
                                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedAsset.content}</p>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Hashtags</label>
                                <p className="text-cyber-galaxy text-xs font-bold">{selectedAsset.hashtags}</p>
                            </div>

                             {selectedAsset.imageSearchTerm && (
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Prompt Visual (Ref)</label>
                                    <p className="text-slate-600 text-xs italic bg-black/20 p-3 rounded-lg">{selectedAsset.imageSearchTerm}</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-white/5 bg-black/10 flex gap-2">
                            <button 
                                onClick={(e) => handleCopy(e, `${selectedAsset.title}\n\n${selectedAsset.content}\n\n${selectedAsset.hashtags}`, selectedAsset.id)}
                                className={`flex-1 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${
                                    copiedId === selectedAsset.id ? 'bg-emerald-500 text-white' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                                }`}
                            >
                                {copiedId === selectedAsset.id ? <Check size={14} /> : <Copy size={14} />}
                                {copiedId === selectedAsset.id ? 'Copiado!' : 'Copiar Texto'}
                            </button>
                            <button 
                                onClick={(e) => handleDelete(e, selectedAsset.id)}
                                className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
