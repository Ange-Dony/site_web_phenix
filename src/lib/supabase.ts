import { createClient } from '@supabase/supabase-js';
import { Book, Corrige, SiteSettings, Order } from '@/types';
import { INITIAL_BOOKS, INITIAL_CORRIGES, INITIAL_SETTINGS } from './initial-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-url')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// FONCTIONS LIVRES (BOOKS)
// ==========================================
export async function getBooks(): Promise<Book[]> {
  if (!supabase) return INITIAL_BOOKS;

  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_BOOKS;
    }
    return data as Book[];
  } catch {
    return INITIAL_BOOKS;
  }
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  if (!supabase) {
    return INITIAL_BOOKS.find((b) => b.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return INITIAL_BOOKS.find((b) => b.slug === slug) || null;
    }
    return data as Book;
  } catch {
    return INITIAL_BOOKS.find((b) => b.slug === slug) || null;
  }
}

// ==========================================
// FONCTIONS CORRIGÉS (CORRIGES)
// ==========================================
export async function getCorriges(): Promise<Corrige[]> {
  if (!supabase) return INITIAL_CORRIGES;

  try {
    const { data, error } = await supabase
      .from('corriges')
      .select('*, books(title)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_CORRIGES;
    }

    return data.map((item: any) => ({
      ...item,
      book_title: item.books?.title || item.book_title || '',
    })) as Corrige[];
  } catch {
    return INITIAL_CORRIGES;
  }
}

export async function incrementDownloadCount(id: string) {
  if (!supabase) return;
  try {
    await supabase.rpc('increment_download_count', { row_id: id });
  } catch {
    // Silently ignore if RPC is not set up
  }
}

// ==========================================
// FONCTIONS PARAMÈTRES (SETTINGS)
// ==========================================
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!supabase) return INITIAL_SETTINGS;

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) {
      return INITIAL_SETTINGS;
    }
    return data as SiteSettings;
  } catch {
    return INITIAL_SETTINGS;
  }
}

// ==========================================
// ENREGISTREMENT COMMANDE (ORDERS)
// ==========================================
export async function saveOrder(order: Omit<Order, 'id' | 'created_at'>): Promise<{ success: boolean; id?: string }> {
  if (!supabase) {
    // Si pas de Supabase, on sauvegarde localement pour l'admin
    if (typeof window !== 'undefined') {
      const localOrders = JSON.parse(localStorage.getItem('phenix_local_orders') || '[]');
      const newOrder = { ...order, id: 'local_' + Date.now(), created_at: new Date().toISOString() };
      localStorage.setItem('phenix_local_orders', JSON.stringify([newOrder, ...localOrders]));
    }
    return { success: true, id: 'local_' + Date.now() };
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          order_code: order.order_code,
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          customer_email: order.customer_email || null,
          delivery_city: order.delivery_city,
          delivery_address: order.delivery_address,
          notes: order.notes || null,
          items: order.items,
          total_amount: order.total_amount,
          currency: order.currency,
          status: 'en_attente',
        },
      ])
      .select('id')
      .single();

    if (error) {
      console.warn('Error saving order to Supabase:', error.message);
      return { success: false };
    }
    return { success: true, id: data?.id };
  } catch (e) {
    console.warn('Failed to insert order:', e);
    return { success: false };
  }
}

// ==========================================
// UPLOAD DE FICHIERS SUPABASE STORAGE (ADMIN)
// ==========================================
export async function uploadFileToSupabase(
  file: File,
  bucket: 'covers' | 'documents'
): Promise<{ url: string | null; error: string | null }> {
  if (!supabase) {
    return {
      url: null,
      error: 'Supabase n\'est pas encore configuré dans .env.local',
    };
  }

  try {
    const cleanFileName = file.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, '-');
    
    const filePath = `${Date.now()}_${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || 'Erreur lors du téléversement' };
  }
}
