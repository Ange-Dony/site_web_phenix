export interface Book {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  author?: string; // Facultatif
  category: string;
  collection?: string;
  discipline?: string; // Matière / Discipline
  level?: string;
  description: string;
  price: number;
  old_price?: number | null;
  currency?: string;
  cover_url: string;
  cover_image?: string;
  isbn?: string;
  page_count?: number;
  published_year?: number;
  is_featured?: boolean;
  in_stock?: boolean;
  order_index?: number; // Ordre d'affichage défini par l'administrateur
  extract_pages?: string[];
  created_at?: string;
}

export interface Corrige {
  id: string;
  book_id?: string | null;
  book_title?: string;
  title: string;
  description?: string;
  subject: string;
  level: string;
  file_url: string;
  file_name: string;
  file_type: 'pdf' | 'docx' | 'doc';
  file_size?: string;
  download_count?: number;
  is_free?: boolean;
  created_at?: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  created_at?: string;
}

export interface DisciplineItem {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  created_at?: string;
}

export interface LevelItem {
  id: string;
  name: string;
  cycle?: string; // Collège, Lycée, Supérieur, etc.
  order_index?: number;
  description?: string;
  created_at?: string;
}

export interface SectionContent {
  id?: string;
  section_key: string; // 'hero', 'catalogue', 'corriges', 'revendeurs', 'a_propos'
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  content?: string;
  banner_text?: string;
  order_index?: number;
  is_visible?: boolean;
  updated_at?: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface SiteSettings {
  id?: number;
  site_name: string;
  site_tagline: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  about_text: string;
  currency: string;
}

export interface Order {
  id?: string;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_city: string;
  delivery_address: string;
  notes?: string;
  items: CartItem[];
  total_amount: number;
  currency: string;
  status?: 'en_attente' | 'validee' | 'livree' | 'annulee';
  created_at?: string;
}

export interface ResellerOrderItem {
  book_id: string;
  title: string;
  quantity: number;
  level?: string;
  collection?: string;
}

export interface ResellerOrder {
  id?: string;
  order_code: string;
  company_name: string; // Librairie ou Établissement
  contact_name: string;
  phone: string;
  email?: string;
  city: string;
  address?: string;
  notes?: string;
  items: ResellerOrderItem[];
  total_copies: number;
  status?: string;
  created_at?: string;
}
