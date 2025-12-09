import { supabase } from './supabaseClient';
import { Exhibitor, GalleryPhoto } from '../types';

// ==================== HELPERS ====================

// Converter camelCase do frontend para snake_case do banco
const exhibitorToDb = (exhibitor: Omit<Exhibitor, 'id'>) => ({
  name: exhibitor.name,
  type: exhibitor.type,
  products: exhibitor.products,
  city: exhibitor.city,
  business_volume: exhibitor.businessVolume, // businessVolume → business_volume
  visitors: exhibitor.visitors,
});

// Converter snake_case do banco para camelCase do frontend
const dbToExhibitor = (data: any): Exhibitor => ({
  id: data.id,
  name: data.name,
  type: data.type,
  products: data.products,
  city: data.city,
  businessVolume: data.business_volume, // business_volume → businessVolume
  visitors: data.visitors,
});

// ==================== EXHIBITORS ====================

export const fetchExhibitors = async (): Promise<Exhibitor[]> => {
  try {
    const { data, error } = await supabase
      .from('exhibitors')
      .select('*');
    
    if (error) {
      console.error('Erro ao buscar expositores:', error);
      return [];
    }
    
    // Converter cada expositor do banco para o formato do app
    return (data || []).map(dbToExhibitor);
  } catch (err) {
    console.error('Erro na conexão ao buscar expositores:', err);
    return [];
  }
};

export const addExhibitor = async (exhibitor: Omit<Exhibitor, 'id'>) => {
  try {
    // Converter para formato do banco
    const dbExhibitor = exhibitorToDb(exhibitor);
    
    const { data, error } = await supabase
      .from('exhibitors')
      .insert([dbExhibitor])
      .select();
    
    if (error) {
      console.error('Erro ao adicionar expositor:', error);
      throw error;
    }
    
    // Converter resultado para formato do app
    return dbToExhibitor(data?.[0]);
  } catch (err) {
    console.error('Erro na conexão ao adicionar expositor:', err);
    throw err;
  }
};

export const updateExhibitor = async (id: string, exhibitor: Omit<Exhibitor, 'id'>) => {
  try {
    // Converter para formato do banco
    const dbExhibitor = exhibitorToDb(exhibitor);
    
    const { data, error } = await supabase
      .from('exhibitors')
      .update(dbExhibitor)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Erro ao atualizar expositor:', error);
      throw error;
    }
    
    // Converter resultado para formato do app
    return dbToExhibitor(data?.[0]);
  } catch (err) {
    console.error('Erro na conexão ao atualizar expositor:', err);
    throw err;
  }
};

export const deleteExhibitor = async (id: string) => {
  try {
    const { error } = await supabase
      .from('exhibitors')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar expositor:', error);
      throw error;
    }
  } catch (err) {
    console.error('Erro na conexão ao deletar expositor:', err);
    throw err;
  }
};

// ==================== GALLERY PHOTOS ====================

export const fetchPhotos = async (): Promise<GalleryPhoto[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery_photos')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar fotos:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Erro na conexão ao buscar fotos:', err);
    return [];
  }
};

export const addPhoto = async (photo: GalleryPhoto) => {
  try {
    const { data, error } = await supabase
      .from('gallery_photos')
      .insert([photo])
      .select();
    
    if (error) {
      console.error('Erro ao adicionar foto:', error);
      throw error;
    }
    
    return data?.[0] as GalleryPhoto;
  } catch (err) {
    console.error('Erro na conexão ao adicionar foto:', err);
    throw err;
  }
};

export const deletePhoto = async (id: string) => {
  try {
    // Se a foto está armazenada em Storage, também delete o arquivo
    // const { error: storageError } = await supabase.storage
    //   .from('gallery')
    //   .remove([`photos/${id}`]);
    
    const { error } = await supabase
      .from('gallery_photos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar foto:', error);
      throw error;
    }
  } catch (err) {
    console.error('Erro na conexão ao deletar foto:', err);
    throw err;
  }
};

// ==================== REAL-TIME SUBSCRIPTIONS ====================
// Para habilitar real-time, configure em: https://supabase.com/dashboard/project/_/database/replication

export const subscribeToExhibitors = (callback: (exhibitors: Exhibitor[]) => void) => {
  // Real-time subscriptions podem ser habilitadas manualmente no Supabase
  // Por enquanto, polling a cada 5 segundos como fallback
  const interval = setInterval(() => {
    fetchExhibitors().then(callback);
  }, 5000);
  
  return () => clearInterval(interval);
};

export const subscribeToPhotos = (callback: (photos: GalleryPhoto[]) => void) => {
  // Real-time subscriptions podem ser habilitadas manualmente no Supabase
  // Por enquanto, polling a cada 5 segundos como fallback
  const interval = setInterval(() => {
    fetchPhotos().then(callback);
  }, 5000);
  
  return () => clearInterval(interval);
};
