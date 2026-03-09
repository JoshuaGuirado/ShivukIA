import React, { createContext, useContext, useState, useEffect } from 'react';
import { LibraryItem, LibraryFolder } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../config/supabase';

interface LibraryContextType {
  items: LibraryItem[];
  folders: LibraryFolder[];
  addItem: (item: Omit<LibraryItem, 'id' | 'timestamp'>) => Promise<void>;
  removeItem: (id: string) => void;
  clearLibrary: () => void;
  createFolder: (name: string, brandId?: string) => Promise<void>;
  deleteFolder: (id: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [folders, setFolders] = useState<LibraryFolder[]>([]);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setFolders([]);
      return;
    }

    const fetchInitialData = async () => {
      const { data: itemsData, error: itemsError } = await supabase
        .from('library_items')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (itemsError) {
        console.error("Erro ao buscar library_items:", itemsError.message);
      }

      if (itemsData) {
        const mappedItems = itemsData.map(row => ({
          id: row.id,
          title: row.title || '',
          content: row.content || '',
          hashtags: row.hashtags || '',
          imageSearchTerm: row.imageSearchTerm || '',
          imageUrl: row.imageUrl || null,
          overlayImageUrl: row.overlayImageUrl || null,
          brandName: row.brandName || '',
          brandColor: row.brandColor || '#000',
          platformId: row.platformId,
          personaId: row.personaId,
          timestamp: Number(row.timestamp),
          folderId: row.folder_id || undefined,
        }));
        setItems(mappedItems as LibraryItem[]);
      }

      const { data: foldersData, error: foldersError } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', user.id)
        .order('createdAt', { ascending: false });

      if (foldersError) {
        console.error("Erro ao buscar folders:", foldersError.message);
      }

      if (foldersData) setFolders(foldersData as LibraryFolder[]);
    };

    fetchInitialData();

  }, [user]);

  const addItem = async (itemData: Omit<LibraryItem, 'id' | 'timestamp'>) => {
    if (!user) return;
    try {
      const timestamp = Date.now();
      const { folderId, ...rest } = itemData;

      const insertPayload = {
        user_id: user.id,
        timestamp,
        folder_id: folderId || null,
        title: rest.title || null,
        content: rest.content || '',
        hashtags: rest.hashtags || null,
        imageSearchTerm: rest.imageSearchTerm || null,
        imageUrl: rest.imageUrl || null,
        overlayImageUrl: rest.overlayImageUrl || null,
        brandName: rest.brandName || null,
        brandColor: rest.brandColor || null,
        platformId: rest.platformId || null,
        personaId: rest.personaId || null,
      };

      console.log("Inserindo na biblioteca:", insertPayload);

      const { data, error } = await supabase
        .from('library_items')
        .insert(insertPayload)
        .select();

      if (error) {
        console.error("Erro ao salvar item na biblioteca:", error.message, error.details, error.hint);
        return;
      }

      if (data && data[0]) {
        const row = data[0];
        const newItem: LibraryItem = {
          id: row.id,
          title: row.title || '',
          content: row.content || '',
          hashtags: row.hashtags || '',
          imageSearchTerm: row.imageSearchTerm || '',
          imageUrl: row.imageUrl,
          overlayImageUrl: row.overlayImageUrl,
          brandName: row.brandName || '',
          brandColor: row.brandColor || '#000',
          platformId: row.platformId,
          personaId: row.personaId,
          timestamp: Number(row.timestamp),
          folderId: row.folder_id || undefined,
        };
        setItems(prev => [newItem, ...prev]);
      }
    } catch (error) {
      console.error("Erro inesperado ao adicionar item:", error);
    }
  };

  const removeItem = async (id: string) => {
    if (!user) return;
    setItems(prev => prev.filter(item => item.id !== id));
    try {
      await supabase.from('library_items').delete().eq('id', id);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const clearLibrary = async () => {
    if (!user) return;
    items.forEach(async (item) => {
      await removeItem(item.id);
    });
  };

  const createFolder = async (name: string, brandId?: string) => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from('folders').insert({
        name,
        brandId: brandId || null,
        user_id: user.id,
        createdAt: Date.now()
      }).select();

      if (error) console.error("Erro ao criar pasta:", error.message);
      if (data && data[0]) {
        setFolders(prev => [data[0] as LibraryFolder, ...prev]);
      }
    } catch (error) {
      console.error("Error creating folder: ", error);
    }
  };

  const deleteFolder = async (id: string) => {
    if (!user) return;
    setFolders(prev => prev.filter(f => f.id !== id));
    try {
      await supabase.from('folders').delete().eq('id', id);
    } catch (error) {
      console.error("Error deleting folder: ", error);
    }
  };

  return (
    <LibraryContext.Provider value={{ items, folders, addItem, removeItem, clearLibrary, createFolder, deleteFolder }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within a LibraryProvider');
  return context;
};