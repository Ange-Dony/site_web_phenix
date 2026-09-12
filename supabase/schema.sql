-- ==============================================================================
-- SCHEMA SUPABASE : MAISON D'ÉDITION PHÉNIX
-- 100% Compatible Free Tier Supabase
-- Exécutez ce script dans l'éditeur SQL de votre projet Supabase (SQL Editor)
-- ==============================================================================

-- 1. Extension pour génération d'UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE DES LIVRES / CATALOGUE
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Général',
    level VARCHAR(100), -- ex: 3ème, Terminale, Université, Tout public
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    old_price NUMERIC(10, 2),
    cover_url TEXT,
    isbn VARCHAR(50),
    page_count INT,
    published_year INT DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    is_featured BOOLEAN DEFAULT false,
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLE DES CORRIGÉS & DOCUMENTS TÉLÉCHARGEABLES
CREATE TABLE IF NOT EXISTS public.corriges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(100), -- ex: Mathématiques, Français, SVT, Philosophie
    level VARCHAR(100),   -- ex: 6ème, 3ème, BAC, Université
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(20) DEFAULT 'pdf', -- 'pdf', 'docx', 'doc'
    file_size VARCHAR(50), -- ex: '2.4 Mo'
    download_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLE DES COMMANDES WHATSAPP (Sauvegarde interne)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    delivery_city VARCHAR(100) NOT NULL,
    delivery_address TEXT NOT NULL,
    notes TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'FCFA',
    status VARCHAR(50) DEFAULT 'en_attente', -- 'en_attente', 'confirmee', 'livree', 'annulee'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLE DES PARAMÈTRES DU SITE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    site_name VARCHAR(255) DEFAULT 'Éditions Phénix',
    site_tagline VARCHAR(255) DEFAULT 'L''excellence pédagogique et la passion des lettres',
    phone VARCHAR(50) DEFAULT '+225 07 00 00 00 00',
    whatsapp_number VARCHAR(50) DEFAULT '+2250700000000',
    email VARCHAR(255) DEFAULT 'contact@editions-phenix.com',
    address VARCHAR(255) DEFAULT 'Abidjan, Côte d''Ivoire',
    about_text TEXT DEFAULT 'Fondée avec la passion d''instruire et d''inspirer, notre maison d''édition s''engage à fournir des manuels, corrigés et ouvrages de qualité.',
    currency VARCHAR(10) DEFAULT 'FCFA',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. INSERTION DES PARAMÈTRES PAR DÉFAUT SI N'EXISTENT PAS
INSERT INTO public.site_settings (id, site_name, site_tagline, phone, whatsapp_number, email, address, currency)
VALUES (1, 'Éditions Phénix', 'L''excellence du livre et la réussite scolaire', '+225 07 00 00 00 00', '+2250700000000', 'contact@editions-phenix.com', 'Abidjan, Côte d''Ivoire', 'FCFA')
ON CONFLICT (id) DO NOTHING;

-- 7. ACTIVATION DE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corriges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- POLITIQUES DE LECTURE PUBLIQUE (Tout le monde peut voir les livres, corrigés et paramètres)
CREATE POLICY "Public read books" ON public.books FOR SELECT USING (true);
CREATE POLICY "Public read corriges" ON public.corriges FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);

-- POLITIQUE DE CRÉATION DE COMMANDE PUBLIQUE (Les clients peuvent enregistrer leur commande)
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);

-- POLITIQUES ADMIN POUR UTILISATEURS CONNECTÉS (Supabase Auth)
CREATE POLICY "Admin all books" ON public.books FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all corriges" ON public.corriges FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all orders" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. CRÉATION DES BUCKETS DE STOCKAGE (STORAGE)
-- Bucket pour les images de couverture
INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Bucket pour les documents et corrigés (PDF, Word)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Politiques de stockage
CREATE POLICY "Public read covers" ON storage.objects FOR SELECT USING (bucket_id = 'covers');
CREATE POLICY "Public read documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Admin upload covers" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'covers');
CREATE POLICY "Admin update covers" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'covers');
CREATE POLICY "Admin delete covers" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'covers');

CREATE POLICY "Admin upload documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents');
CREATE POLICY "Admin update documents" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'documents');
CREATE POLICY "Admin delete documents" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'documents');

-- 9. DONNÉES DE DÉMONSTRATION (Exemples de livres et de corrigés)
INSERT INTO public.books (title, slug, author, category, level, description, price, old_price, is_featured, in_stock, cover_url)
VALUES 
(
    'Objectif Réussite : Mathématiques 3ème',
    'objectif-reussite-maths-3eme',
    'Dr. Koffi Armand',
    'Scolaire',
    'Classe de 3ème (BEPC)',
    'Manuel complet conforme au programme officiel. Cours synthétiques, méthodes pas à pas et plus de 300 exercices progressifs pour réussir avec brio l''épreuve du BEPC.',
    4500,
    5000,
    true,
    true,
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'
),
(
    'Guide Méthodologique de Français Terminale',
    'guide-francais-terminale',
    'Prof. Aminata Touré',
    'Parascolaire',
    'Terminale A/C/D (BAC)',
    'Dissertation littéraire, commentaire composé et contraction de texte. L''ouvrage de référence pour décrocher la mention au Baccalauréat.',
    5000,
    6000,
    true,
    true,
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600'
),
(
    'Annales Corrigées Physique-Chimie Terminale C & D',
    'annales-physique-chimie-terminale',
    'Équipe Pédagogique Phénix',
    'Annales',
    'Terminale Scientifique',
    'Les 10 dernières sessions du Baccalauréat décortiquées, avec barèmes officiels et astuces de correction.',
    5500,
    null,
    true,
    true,
    'https://images.unsplash.com/photo-1532012164546-f432f2e372fe?auto=format&fit=crop&q=80&w=600'
),
(
    'Les Sentiers de l''Espérance (Roman)',
    'les-sentiers-de-lesperance',
    'Jean-Luc Akoto',
    'Littérature',
    'Tout public',
    'Une fresque vibrante sur la jeunesse, le courage et la quête d''un avenir meilleur au cœur de l''Afrique contemporaine.',
    4000,
    null,
    false,
    true,
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600'
)
ON CONFLICT (slug) DO NOTHING;

-- Insertion de corrigés téléchargeables liés
INSERT INTO public.corriges (title, description, subject, level, file_url, file_name, file_type, file_size, download_count)
VALUES 
(
    'Corrigé Officiel - Mathématiques 3ème (Chapitres 1 à 5)',
    'Solutions détaillées et rédactions modèles pour les exercices de calcul littéral, racines carrées et théorèmes de Thalès & Pythagore.',
    'Mathématiques',
    '3ème (BEPC)',
    'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    'Corrige_Maths_3eme_Ch1-5.pdf',
    'pdf',
    '1.8 Mo',
    142
),
(
    'Sujets & Corrigés Types - Commentaire de Français BAC',
    'Modèles types de commentaires rédigés intégralement avec grille d''évaluation des examinateurs.',
    'Français',
    'Terminale',
    'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    'Commentaires_Types_BAC.docx',
    'docx',
    '850 Ko',
    98
),
(
    'Fascicule Corrigé - Physique-Chimie : Électricité & Optique',
    'Corrigés exhaustifs des exercices de synthèse du manuel d''annales.',
    'Physique-Chimie',
    'Terminale C & D',
    'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    'Corrige_Physique_Electricite_BAC.pdf',
    'pdf',
    '2.5 Mo',
    215
)
ON CONFLICT DO NOTHING;
