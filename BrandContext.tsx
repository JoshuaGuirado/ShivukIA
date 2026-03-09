import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';

interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface Brand {
  id: string;
  name: string;
  colors: BrandColors;
  logo: string | null;
  savedLogos: string[];
}

interface BrandContextType {
  brands: Brand[];
  activeBrandId: string;
  brand: Brand;

  activateBrand: (id: string) => void;
  addBrand: () => void;
  removeBrand: (id: string) => void;
  updateBrand: (id: string, updates: Partial<Brand>) => void;

  isLoading: boolean;
  isDirty: boolean; // Mantido para compatibilidade, mas sempre false no modo Firestore realtime
}

const DEFAULT_BRAND_ID = 'default-brand-placeholder';

// Fallback brand visual enquanto carrega
const LOADING_BRAND: Brand = {
  id: DEFAULT_BRAND_ID,
  name: 'Carregando...',
  colors: { primary: '#333', secondary: '#444', accent: '#555' },
  logo: null,
  savedLogos: [],
};

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeBrandId, setActiveBrandId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // 1. Subscribe to Supabase
  useEffect(() => {
    if (!user) {
      setBrands([]);
      setIsLoading(false);
      return;
    }

    const fetchBrands = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching brands", error);
        setIsLoading(false);
        return;
      }

      const loadedBrands = data || [];

      if (loadedBrands.length === 0) {
        await createDefaultBrand(user.id);
      } else {
        setBrands(loadedBrands as Brand[]);
        if (!activeBrandId || !loadedBrands.find(b => b.id === activeBrandId)) {
          const savedId = localStorage.getItem('shivuk_active_brand_id');
          if (savedId && loadedBrands.find(b => b.id === savedId)) {
            setActiveBrandId(savedId);
          } else {
            setActiveBrandId(loadedBrands[0].id);
          }
        }
      }
      setIsLoading(false);
    };

    fetchBrands();

    const subscription = supabase
      .channel('public:brand_settings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'brand_settings', filter: `user_id=eq.${user.id}` }, payload => {
        fetchBrands();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  const createDefaultBrand = async (uid: string) => {
    try {
      const newBrand = {
        user_id: uid,
        name: 'Minha Marca',
        colors: {
          primary: '#F1B701',
          secondary: '#F8851A',
          accent: '#FFB020',
        },
        logo: null,
        savedLogos: []
      };

      const { data, error } = await supabase.from('brand_settings').insert(newBrand).select();

      if (error) {
        console.error("Erro ao criar marca padrão no banco:", error.message);
      }

      if (data && data[0]) {
        setBrands([data[0] as Brand]);
        setActiveBrandId(data[0].id);
      }
    } catch (e) {
      console.error("Erro ao criar marca padrão", e);
    }
  };

  const activeBrand = brands.find(b => b.id === activeBrandId) || brands[0] || LOADING_BRAND;

  const activateBrand = (id: string) => {
    setActiveBrandId(id);
    localStorage.setItem('shivuk_active_brand_id', id);
  };

  const addBrand = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from('brand_settings').insert({
        user_id: user.id,
        name: 'Nova Marca',
        colors: {
          primary: '#000000',
          secondary: '#333333',
          accent: '#666666',
        },
        logo: null,
        savedLogos: []
      }).select();

      if (data && data[0]) {
        setBrands(prev => [...prev, data[0] as Brand]);
        activateBrand(data[0].id);
      }
    } catch (error) {
      console.error("Error adding brand: ", error);
    }
  };

  const removeBrand = async (idToDelete: string) => {
    if (!user) return;
    if (brands.length <= 1) {
      alert("Você precisa ter pelo menos um cliente na carteira.");
      return;
    }

    // Optimistic Update
    setBrands(prev => prev.filter(b => b.id !== idToDelete));
    if (activeBrandId === idToDelete) {
      activateBrand(brands.find(b => b.id !== idToDelete)?.id || "");
    }

    try {
      await supabase.from('brand_settings').delete().eq('id', idToDelete);
    } catch (error) {
      console.error("Error removing brand: ", error);
    }
  };

  const updateBrand = async (id: string, updates: Partial<Brand>) => {
    if (!user) return;

    // Optimistic Update
    setBrands(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));

    try {
      await supabase.from('brand_settings').update(updates).eq('id', id);
    } catch (error) {
      console.error("Error updating brand: ", error);
    }
  };

  return (
    <BrandContext.Provider value={{
      brands,
      activeBrandId,
      brand: activeBrand,
      activateBrand,
      addBrand,
      removeBrand,
      updateBrand,
      isLoading,
      isDirty: false // Firestore is realtime, no dirty state needed
    }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) throw new Error('useBrand must be used within a BrandProvider');
  return context;
};