export interface Book {
  id: string;
  title: string;
  slug: string;
  author?: string; // Facultatif selon la demande
  category: string;
  collection?: string;
  discipline?: string; // Matière / Discipline
  level?: string;
  description: string;
  price: number;
  old_price?: number | null;
  cover_url: string;
  isbn?: string;
  page_count?: number;
  published_year?: number;
  is_featured?: boolean;
  in_stock?: boolean;
  extract_pages?: string[]; // Liste des URLs d'images pour le feuilletage Flipbook
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
  created_at?: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  description?: string;
  color?: string;
  created_at?: string;
}

export interface DisciplineItem {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
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
  status: 'en_attente' | 'confirmee' | 'livree' | 'annulee';
  created_at?: string;
}

export interface ResellerOrderItem {
  book_id: string;
  title: string;
  collection?: string;
  discipline?: string;
  level?: string;
  quantity: number;
}

export interface ResellerOrder {
  id?: string;
  order_code: string;
  company_name: string;
  contact_name: string;
  phone: string;
  email?: string;
  city: string;
  address?: string;
  notes?: string;
  items: ResellerOrderItem[];
  total_copies: number;
  status: 'en_attente' | 'confirmee' | 'traitee' | 'annulee';
  created_at?: string;
}
