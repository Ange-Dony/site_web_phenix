import { createClient } from '@supabase/supabase-js';
import { Book, Corrige, SiteSettings, Order, CollectionItem, DisciplineItem, ResellerOrder, LevelItem, SectionContent } from '@/types';
import { INITIAL_BOOKS, INITIAL_CORRIGES, INITIAL_SETTINGS, INITIAL_COLLECTIONS, INITIAL_DISCIPLINES, INITIAL_LEVELS, INITIAL_SECTIONS } from './initial-data';

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
  if (!supabase) return getSortedBooks(getLocalOrInitialBooks());

  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('order_index', { ascending: true, nullsFirst: false });

    if (error || !data || data.length === 0) {
      return getSortedBooks(getLocalOrInitialBooks());
    }
    return getSortedBooks(data as Book[]);
  } catch {
    return getSortedBooks(getLocalOrInitialBooks());
  }
}

function getSortedBooks(books: Book[]): Book[] {
  return [...books].sort((a, b) => {
    const orderA = a.order_index ?? 9999;
    const orderB = b.order_index ?? 9999;
    if (orderA !== orderB) return orderA - orderB;
    return (a.title || '').localeCompare(b.title || '');
  });
}

function getLocalOrInitialBooks(): Book[] {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('phenix_custom_books');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
  }
  return INITIAL_BOOKS;
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  const books = await getBooks();
  return books.find((b) => b.slug === slug) || null;
}

export async function deleteBook(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('books').delete().eq('id', id);
      if (!error) return true;
    } catch {}
  }
  if (typeof window !== 'undefined') {
    const books = getLocalOrInitialBooks().filter((b) => b.id !== id);
    localStorage.setItem('phenix_custom_books', JSON.stringify(books));
  }
  return true;
}

export async function updateBook(id: string, updates: Partial<Book>): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('books').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
      if (!error) return true;
    } catch {}
  }
  if (typeof window !== 'undefined') {
    const books = getLocalOrInitialBooks().map((b) => b.id === id ? { ...b, ...updates } : b);
    localStorage.setItem('phenix_custom_books', JSON.stringify(books));
  }
  return true;
}

export async function saveAllBooks(books: Book[]): Promise<boolean> {
  if (typeof window !== 'undefined') {
    localStorage.setItem('phenix_custom_books', JSON.stringify(books));
  }
  if (supabase) {
    try {
      for (const b of books) {
        await supabase.from('books').upsert(b);
      }
    } catch {}
  }
  return true;
}

// ==========================================
// FONCTIONS COLLECTIONS
// ==========================================
export async function getCollections(): Promise<CollectionItem[]> {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('phenix_collections');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
  }

  if (supabase) {
    try {
      const { data, error } = await supabase.from('collections').select('*').order('name', { ascending: true });
      if (!error && data && data.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('phenix_collections', JSON.stringify(data));
        }
        return data as CollectionItem[];
      }
    } catch {}
  }

  return INITIAL_COLLECTIONS;
}

export async function saveCollection(collection: CollectionItem): Promise<boolean> {
  let list = await getCollections();
  const existingIdx = list.findIndex(c => c.id === collection.id);
  if (existingIdx >= 0) {
    list[existingIdx] = collection;
  } else {
    list.push(collection);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('phenix_collections', JSON.stringify(list));
  }

  if (supabase) {
    try {
      await supabase.from('collections').upsert(collection);
    } catch {}
  }
  return true;
}

export async function deleteCollection(id: string): Promise<boolean> {
  let list = await getCollections();
  list = list.filter(c => c.id !== id);

  if (typeof window !== 'undefined') {
    localStorage.setItem('phenix_collections', JSON.stringify(list));
  }

  if (supabase) {
    try {
      await supabase.from('collections').delete().eq('id', id);
    } catch {}
  }
  return true;
}

// ==========================================
// FONCTIONS DISCIPLINES / MATIÈRES
// ==========================================
export async function getDisciplines(): Promise<DisciplineItem[]> {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('phenix_disciplines');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
  }

  if (supabase) {
    try {
      const { data, error } = await supabase.from('disciplines').select('*').order('name', { ascending: true });
      if (!error && data && data.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('phenix_disciplines', JSON.stringify(data));
        }
        return data as DisciplineItem[];
      }
    } catch {}
  }

  return INITIAL_DISCIPLINES;
}

export async function saveDiscipline(discipline: DisciplineItem): Promise<boolean> {
  let list = await getDisciplines();
  const existingIdx = list.findIndex(d => d.id === discipline.id);
  if (existingIdx >= 0) {
    list[existingIdx] = discipline;
  } else {
    list.push(discipline);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('phenix_disciplines', JSON.stringify(list));
  }

  if (supabase) {
    try {
      await supabase.from('disciplines').upsert(discipline);
    } catch {}
  }
  return true;
}

export async function deleteDiscipline(id: string): Promise<boolean> {
  let list = await getDisciplines();
  list = list.filter(d => d.id !== id);

  if (typeof window !== 'undefined') {
    localStorage.setItem('phenix_disciplines', JSON.stringify(list));
  }

  if (supabase) {
    try {
      await supabase.from('disciplines').delete().eq('id', id);
    } catch {}
  }
  return true;
}

// ==========================================
// FONCTIONS NIVEAUX / CLASSES (LEVELS)
// ==========================================
export async function getLevels(): Promise<LevelItem[]> {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('phenix_levels');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('levels')
        .select('*')
        .order('order_index', { ascending: true });
      if (!error && data && data.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('phenix_levels', JSON.stringify(data));
        }
        return data as LevelItem[];
      }
    } catch {}
  }

  return INITIAL_LEVELS;
}

export async function saveLevel(level: LevelItem): Promise<boolean> {
  let list = await getLevels();
  const existingIdx = list.findIndex(l => l.id === level.id);
  if (existingIdx >= 0) {
    list[existingIdx] = level;
  } else {
    list.push(level);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('phenix_levels', JSON.stringify(list));
  }

  if (supabase) {
    try {
      await supabase.from('levels').upsert(level);
    } catch {}
  }
  return true;
}

export async function deleteLevel(id: string): Promise<boolean> {
  let list = await getLevels();
  list = list.filter(l => l.id !== id);

  if (typeof window !== 'undefined') {
    localStorage.setItem('phenix_levels', JSON.stringify(list));
  }

  if (supabase) {
    try {
      await supabase.from('levels').delete().eq('id', id);
    } catch {}
  }
  return true;
}

// ==========================================
// FONCTIONS RUBRIQUES / CONTENUS DE PAGES (SECTIONS)
// ==========================================
export async function getSectionContents(): Promise<SectionContent[]> {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('phenix_sections');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('section_contents')
        .select('*')
        .order('section_key', { ascending: true });
      if (!error && data && data.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('phenix_sections', JSON.stringify(data));
        }
        return data as SectionContent[];
      }
    } catch {}
  }

  return INITIAL_SECTIONS;
}

export async function getSectionContentByKey(key: string): Promise<SectionContent | null> {
  const sections = await getSectionContents();
  return sections.find(s => s.section_key === key) || null;
}

export async function saveSectionContent(section: SectionContent): Promise<boolean> {
  let list = await getSectionContents();
  const existingIdx = list.findIndex(s => s.section_key === section.section_key);
  if (existingIdx >= 0) {
    list[existingIdx] = { ...section, updated_at: new Date().toISOString() };
  } else {
    list.push({ ...section, updated_at: new Date().toISOString() });
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('phenix_sections', JSON.stringify(list));
  }

  if (supabase) {
    try {
      await supabase.from('section_contents').upsert(section);
    } catch {}
  }
  return true;
}

// ==========================================
// FONCTIONS CORRIGÉS (CORRIGES)
// ==========================================
export async function getCorriges(): Promise<Corrige[]> {
  if (!supabase) return getLocalOrInitialCorriges();

  try {
    const { data, error } = await supabase
      .from('corriges')
      .select('*, books(title)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return getLocalOrInitialCorriges();
    }

    return data.map((item: any) => ({
      ...item,
      book_title: item.books?.title || item.book_title || '',
    })) as Corrige[];
  } catch {
    return getLocalOrInitialCorriges();
  }
}

function getLocalOrInitialCorriges(): Corrige[] {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('phenix_custom_corriges');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
  }
  return INITIAL_CORRIGES;
}

export async function deleteCorrige(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('corriges').delete().eq('id', id);
      if (!error) return true;
    } catch {}
  }
  if (typeof window !== 'undefined') {
    const corriges = getLocalOrInitialCorriges().filter((c) => c.id !== id);
    localStorage.setItem('phenix_custom_corriges', JSON.stringify(corriges));
  }
  return true;
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
// ENREGISTREMENT COMMANDE CLIENT (ORDERS)
// ==========================================
export async function saveOrder(order: Omit<Order, 'id' | 'created_at'>): Promise<{ success: boolean; id?: string }> {
  if (typeof window !== 'undefined') {
    const localOrders = JSON.parse(localStorage.getItem('phenix_local_orders') || '[]');
    const newOrder = { ...order, id: 'local_' + Date.now(), created_at: new Date().toISOString() };
    localStorage.setItem('phenix_local_orders', JSON.stringify([newOrder, ...localOrders]));
  }

  if (!supabase) {
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
      return { success: true };
    }
    return { success: true, id: data?.id };
  } catch (e) {
    console.warn('Failed to insert order:', e);
    return { success: true };
  }
}

// ==========================================
// ENREGISTREMENT COMMANDE REVENDEUR (B2B)
// ==========================================
export async function saveResellerOrder(order: Omit<ResellerOrder, 'id' | 'created_at'>): Promise<{ success: boolean; id?: string }> {
  if (typeof window !== 'undefined') {
    const localReseller = JSON.parse(localStorage.getItem('phenix_reseller_orders') || '[]');
    const newResellerOrder = { ...order, id: 'reseller_' + Date.now(), created_at: new Date().toISOString() };
    localStorage.setItem('phenix_reseller_orders', JSON.stringify([newResellerOrder, ...localReseller]));
  }

  if (!supabase) {
    return { success: true, id: 'reseller_' + Date.now() };
  }

  try {
    // Sauvegarder dans la table orders avec status='revendeur'
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          order_code: order.order_code,
          customer_name: `${order.company_name} (${order.contact_name})`,
          customer_phone: order.phone,
          customer_email: order.email || null,
          delivery_city: order.city,
          delivery_address: order.address || 'Non spécifié',
          notes: `[COMMANDE REVENDEUR - TOTAL: ${order.total_copies} EX.] ${order.notes || ''}`,
          items: order.items,
          total_amount: 0, // Pas de prix public
          currency: 'FCFA',
          status: 'en_attente',
        },
      ])
      .select('id')
      .single();

    if (error) {
      console.warn('Error saving reseller order to Supabase:', error.message);
      return { success: true };
    }
    return { success: true, id: data?.id };
  } catch (e) {
    console.warn('Failed to insert reseller order:', e);
    return { success: true };
  }
}

export async function getResellerOrders(): Promise<ResellerOrder[]> {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('phenix_reseller_orders');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
  }
  return [];
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
