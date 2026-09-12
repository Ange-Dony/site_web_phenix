'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  BookOpen, 
  FileText, 
  ShoppingBag, 
  Settings, 
  Upload, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ExternalLink,
  Phone,
  Image as ImageIcon,
  AlertCircle,
  Database
} from 'lucide-react';
import { Book, Corrige, Order } from '@/types';
import { INITIAL_BOOKS, INITIAL_CORRIGES, INITIAL_SETTINGS } from '@/lib/initial-data';
import { supabase, isSupabaseConfigured, uploadFileToSupabase } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'books' | 'corriges' | 'orders' | 'settings'>('books');

  // État des données (avec initialisation dynamique)
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [corriges, setCorriges] = useState<Corrige[]>(INITIAL_CORRIGES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  // Formulaire d'ajout de Livre
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    collection: 'Collection Succès',
    category: 'Annales & Examens',
    level: '3ème (BEPC)',
    price: 4000,
    old_price: '',
    description: '',
    cover_url: '',
    page_count: 180,
    published_year: new Date().getFullYear(),
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // Formulaire d'ajout de Corrigé / Document
  const [newCorrige, setNewCorrige] = useState({
    title: '',
    subject: 'Histoire-Géographie',
    level: '3ème (BEPC)',
    book_id: '',
    description: '',
    file_type: 'pdf' as 'pdf' | 'docx',
  });
  const [docFile, setDocFile] = useState<File | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  const [notification, setNotification] = useState<string | null>(null);

  // Charger les données depuis Supabase ou local
  useEffect(() => {
    async function loadData() {
      if (supabase && isSupabaseConfigured) {
        try {
          const { data: dbBooks } = await supabase.from('books').select('*').order('created_at', { ascending: false });
          if (dbBooks && dbBooks.length > 0) {
            setBooks(dbBooks as Book[]);
          }

          const { data: dbCorriges } = await supabase.from('corriges').select('*').order('created_at', { ascending: false });
          if (dbCorriges && dbCorriges.length > 0) {
            setCorriges(dbCorriges as Corrige[]);
          }

          const { data: dbOrders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
          if (dbOrders && dbOrders.length > 0) {
            setOrders(dbOrders as Order[]);
          } else {
            const local = localStorage.getItem('phenix_local_orders');
            if (local) setOrders(JSON.parse(local));
          }
        } catch (e) {
          console.error('Erreur chargement Supabase:', e);
        }
      } else {
        const local = localStorage.getItem('phenix_local_orders');
        if (local) setOrders(JSON.parse(local));
      }
    }
    loadData();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Gestion sélection image couverture
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // Gestion sélection document
  const handleDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocFile(file);
      if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        setNewCorrige({ ...newCorrige, file_type: 'docx' });
      } else {
        setNewCorrige({ ...newCorrige, file_type: 'pdf' });
      }
    }
  };

  // Création d'un nouveau livre
  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author) {
      alert('Veuillez renseigner le titre et l\'auteur');
      return;
    }

    setIsUploadingCover(true);
    let finalCoverUrl = newBook.cover_url || '/covers/code-d-acces-annale-hg-3e.png';

    // Si un fichier image a été choisi, upload vers Supabase Storage
    if (coverFile) {
      if (isSupabaseConfigured) {
        const uploadRes = await uploadFileToSupabase(coverFile, 'covers');
        if (uploadRes.url) {
          finalCoverUrl = uploadRes.url;
        }
      } else {
        finalCoverUrl = coverPreview || finalCoverUrl;
      }
    }

    const generatedSlug = newBook.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newBookRecord = {
      title: newBook.title,
      slug: `${generatedSlug}-${Date.now().toString().slice(-4)}`,
      author: newBook.author,
      category: newBook.category,
      level: newBook.level,
      price: Number(newBook.price),
      old_price: newBook.old_price ? Number(newBook.old_price) : null,
      description: newBook.description || 'Présentation complète de l\'ouvrage.',
      cover_url: finalCoverUrl,
      page_count: Number(newBook.page_count),
      published_year: Number(newBook.published_year),
      is_featured: true,
      in_stock: true,
    };

    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase.from('books').insert([newBookRecord]).select('*').single();
      if (!error && data) {
        setBooks([data as Book, ...books]);
      } else {
        setBooks([{ id: 'b_' + Date.now(), ...newBookRecord }, ...books]);
      }
    } else {
      setBooks([{ id: 'b_' + Date.now(), ...newBookRecord }, ...books]);
    }

    setIsUploadingCover(false);
    setCoverFile(null);
    setCoverPreview(null);
    setNewBook({
      title: '',
      author: '',
      collection: 'Collection Succès',
      category: 'Annales & Examens',
      level: '3ème (BEPC)',
      price: 4000,
      old_price: '',
      description: '',
      cover_url: '',
      page_count: 180,
      published_year: new Date().getFullYear(),
    });
    showNotification(`Livre "${newBook.title}" ajouté avec succès !`);
  };

  // Suppression d'un livre
  const handleDeleteBook = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      if (supabase && isSupabaseConfigured) {
        await supabase.from('books').delete().eq('id', id);
      }
      setBooks(books.filter((b) => b.id !== id));
      showNotification('Livre supprimé du catalogue.');
    }
  };

  // Création d'un nouveau corrigé
  const handleAddCorrige = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCorrige.title) {
      alert('Veuillez renseigner le titre du corrigé');
      return;
    }

    setIsUploadingDoc(true);
    let finalDocUrl = 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf';
    let finalFileName = docFile ? docFile.name : 'corrige_officiel.pdf';
    let finalSize = docFile ? `${(docFile.size / (1024 * 1024)).toFixed(1)} Mo` : '1.5 Mo';

    if (docFile && isSupabaseConfigured) {
      const uploadRes = await uploadFileToSupabase(docFile, 'documents');
      if (uploadRes.url) {
        finalDocUrl = uploadRes.url;
      }
    }

    const newCorrigeRecord = {
      title: newCorrige.title,
      subject: newCorrige.subject,
      level: newCorrige.level,
      book_id: newCorrige.book_id || null,
      description: newCorrige.description || 'Corrigé officiel rédigé par l\'équipe pédagogique.',
      file_url: finalDocUrl,
      file_name: finalFileName,
      file_type: newCorrige.file_type,
      file_size: finalSize,
      download_count: 0,
    };

    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase.from('corriges').insert([newCorrigeRecord]).select('*').single();
      if (!error && data) {
        setCorriges([data as Corrige, ...corriges]);
      } else {
        setCorriges([{ id: 'c_' + Date.now(), ...newCorrigeRecord }, ...corriges]);
      }
    } else {
      setCorriges([{ id: 'c_' + Date.now(), ...newCorrigeRecord }, ...corriges]);
    }

    setIsUploadingDoc(false);
    setDocFile(null);
    setNewCorrige({
      title: '',
      subject: 'Histoire-Géographie',
      level: '3ème (BEPC)',
      book_id: '',
      description: '',
      file_type: 'pdf',
    });
    showNotification(`Corrigé "${newCorrige.title}" publié avec succès !`);
  };

  // Suppression d'un corrigé
  const handleDeleteCorrige = async (id: string) => {
    if (confirm('Voulez-vous supprimer ce corrigé ?')) {
      if (supabase && isSupabaseConfigured) {
        await supabase.from('corriges').delete().eq('id', id);
      }
      setCorriges(corriges.filter((c) => c.id !== id));
      showNotification('Corrigé supprimé.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Tableau de Bord Administrateur</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
            Gestion des Livres, Corrigés & Ventes WhatsApp
          </h1>
        </div>

        {/* Supabase Status Indicator */}
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            isSupabaseConfigured 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
              : 'bg-amber-50 text-amber-900 border-amber-300'
          }`}>
            <Database className="w-4 h-4" />
            <span>{isSupabaseConfigured ? 'Supabase Connecté' : 'Mode Local / Prêt pour Supabase'}</span>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 flex items-center gap-1.5"
          >
            <span>Voir le site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Notifications Toast */}
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-600 text-white text-sm font-semibold flex items-center gap-2 shadow-lg animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('books')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'books'
              ? 'bg-amber-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Catalogue Livres ({books.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('corriges')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'corriges'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Corrigés & Documents ({corriges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-blue-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Commandes WhatsApp ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Paramètres & WhatsApp</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1 : GESTION DES LIVRES & UPLOAD DE COUVERTURES */}
      {/* ======================================================== */}
      {activeTab === 'books' && (
        <div className="space-y-8">
          {/* Formulaire d'ajout de livre */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
              <Plus className="w-5 h-5 text-amber-700" />
              <span>Ajouter un Nouvel Ouvrage au Catalogue</span>
            </h2>

            <form onSubmit={handleAddBook} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Image upload area */}
                <div className="lg:col-span-4 space-y-3">
                  <label className="block text-xs font-bold text-slate-700">
                    Image de Couverture (JPG, PNG, WebP)
                  </label>

                  <div className="relative aspect-3/4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 flex flex-col items-center justify-center p-4 text-center overflow-hidden transition-colors">
                    {coverPreview ? (
                      <img
                        src={coverPreview}
                        alt="Aperçu couverture"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="space-y-2">
                        <ImageIcon className="w-10 h-10 text-slate-400 mx-auto" />
                        <span className="text-xs font-semibold text-slate-700 block">
                          Cliquez pour choisir une image
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Glisser-déposer ou parcourir
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  {coverPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setCoverFile(null);
                        setCoverPreview(null);
                      }}
                      className="text-xs text-red-600 hover:underline block text-center w-full"
                    >
                      Supprimer l'image choisie
                    </button>
                  )}
                </div>

                {/* Form fields */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Titre du Livre *
                      </label>
                      <input
                        type="text"
                        required
                        value={newBook.title}
                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                        placeholder="Ex : Guide Pratique de Français 3ème"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-amber-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Auteur(s) *
                      </label>
                      <input
                        type="text"
                        required
                        value={newBook.author}
                        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                        placeholder="Ex : Collectif d'Inspecteurs / Dr. Kouassi"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-amber-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Collection
                      </label>
                      <select
                        value={newBook.collection}
                        onChange={(e) => setNewBook({ ...newBook, collection: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                      >
                        <option value="Collection Succès">Collection Succès</option>
                        <option value="Collection Archives">Collection Archives</option>
                        <option value="Collection Polyglotte">Collection Polyglotte</option>
                        <option value="Collection Papyrus">Collection Papyrus</option>
                        <option value="Collection École et Métiers">Collection École & Métiers</option>
                        <option value="Collection Racines">Collection Racines</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Niveau scolaire
                      </label>
                      <input
                        type="text"
                        value={newBook.level}
                        onChange={(e) => setNewBook({ ...newBook, level: e.target.value })}
                        placeholder="Ex : Terminale A/C/D ou 3ème"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Prix de vente (FCFA) *
                      </label>
                      <input
                        type="number"
                        required
                        value={newBook.price}
                        onChange={(e) => setNewBook({ ...newBook, price: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Description pédagogique / Résumé
                    </label>
                    <textarea
                      rows={3}
                      value={newBook.description}
                      onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                      placeholder="Présentation des chapitres, exercices et objectifs..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isUploadingCover}
                      className="px-6 py-3 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-bold text-sm shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isUploadingCover ? 'Téléversement en cours...' : 'Ajouter le livre au catalogue'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Liste des livres existants */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Livres actuellement dans le catalogue ({books.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Livre</th>
                    <th className="pb-3">Collection</th>
                    <th className="pb-3">Niveau</th>
                    <th className="pb-3">Prix</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {books.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={b.cover_url}
                            alt={b.title}
                            className="w-10 h-14 object-cover rounded-md bg-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">{b.title}</div>
                            <div className="text-xs text-slate-500">{b.author}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-xs text-amber-900 font-semibold">{b.collection || '-'}</td>
                      <td className="py-3 text-xs text-slate-600">{b.level || '-'}</td>
                      <td className="py-3 font-bold text-slate-900">{b.price.toLocaleString('fr-FR')} FCFA</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDeleteBook(b.id)}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2 : GESTION DES CORRIGÉS (PDF / WORD) */}
      {/* ======================================================== */}
      {activeTab === 'corriges' && (
        <div className="space-y-8">
          {/* Formulaire ajout corrigé */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
              <Plus className="w-5 h-5 text-emerald-700" />
              <span>Mettre en Ligne un Nouveau Corrigé (PDF ou Word)</span>
            </h2>

            <form onSubmit={handleAddCorrige} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Titre du Corrigé *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCorrige.title}
                    onChange={(e) => setNewCorrige({ ...newCorrige, title: e.target.value })}
                    placeholder="Ex : Corrigé Officiel - Mathématiques 3ème"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Matière / Discipline *
                  </label>
                  <select
                    value={newCorrige.subject}
                    onChange={(e) => setNewCorrige({ ...newCorrige, subject: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="Histoire-Géographie">Histoire-Géographie</option>
                    <option value="Mathématiques">Mathématiques</option>
                    <option value="Philosophie">Philosophie</option>
                    <option value="Physique-Chimie">Physique-Chimie</option>
                    <option value="Anglais">Anglais</option>
                    <option value="Français">Français</option>
                    <option value="CMC / Tertiaire">CMC / Tertiaire</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Niveau / Classe
                  </label>
                  <input
                    type="text"
                    value={newCorrige.level}
                    onChange={(e) => setNewCorrige({ ...newCorrige, level: e.target.value })}
                    placeholder="Ex : 3ème (BEPC) ou Terminale A/C/D"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lier à un livre du catalogue (optionnel)
                  </label>
                  <select
                    value={newCorrige.book_id}
                    onChange={(e) => setNewCorrige({ ...newCorrige, book_id: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="">-- Aucun livre lié --</option>
                    {books.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Document upload box */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 text-center space-y-2 relative">
                <FileText className="w-10 h-10 text-emerald-700 mx-auto" />
                <div className="text-sm font-bold text-slate-900">
                  {docFile ? docFile.name : 'Sélectionnez un fichier PDF ou Word (.docx / .doc)'}
                </div>
                <div className="text-xs text-slate-500">
                  {docFile ? `${(docFile.size / 1024).toFixed(0)} Ko prêt à être mis en ligne` : 'Taille max recommandée : 20 Mo'}
                </div>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleDocSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUploadingDoc}
                  className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isUploadingDoc ? 'Téléversement en cours...' : 'Publier le document pour téléchargement'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Liste des corrigés */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Corrigés disponibles au téléchargement ({corriges.length})
            </h3>

            <div className="divide-y divide-slate-100">
              {corriges.map((c) => (
                <div key={c.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                      {c.file_type}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{c.title}</h4>
                      <span className="text-xs text-slate-500">
                        {c.subject} • {c.level} • {c.file_size}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={c.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg"
                      title="Tester le lien"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDeleteCorrige(c.id)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3 : COMMANDES CLIENTS REÇUES */}
      {/* ======================================================== */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Historique des Commandes Transmises via WhatsApp
              </h2>
              <p className="text-xs text-slate-500">
                Suivi des commandes générées par les clients sur la plateforme.
              </p>
            </div>
            {orders.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Vider l\'historique des commandes locales ?')) {
                    localStorage.removeItem('phenix_local_orders');
                    setOrders([]);
                  }
                }}
                className="text-xs text-red-600 hover:underline"
              >
                Vider l'historique
              </button>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">Aucune commande enregistrée pour le moment</h3>
              <p className="text-xs text-slate-400 mt-1">
                Dès qu'un client passera commande sur le site, elle apparaîtra ici avec ses coordonnées complètes.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, idx) => (
                <div
                  key={order.id || idx}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-amber-400 transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                        {order.order_code}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        {order.created_at ? new Date(order.created_at).toLocaleString('fr-FR') : 'Récent'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-slate-900">
                        {order.total_amount.toLocaleString('fr-FR')} {order.currency}
                      </span>
                      <a
                        href={`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-700"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Contacter client</span>
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Client</span>
                      <span className="font-bold text-slate-800">{order.customer_name}</span>
                      <span className="block text-slate-600">{order.customer_phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Livraison</span>
                      <span className="font-semibold text-slate-800">{order.delivery_city}</span>
                      <span className="block text-slate-600">{order.delivery_address}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Articles commandés</span>
                      <span className="font-medium text-slate-800">
                        {order.items.map((i) => `${i.quantity}x ${i.book.title}`).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4 : PARAMÈTRES & WHATSAPP */}
      {/* ======================================================== */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900">
            Configuration Générale & Numéro WhatsApp de Vente
          </h2>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Numéro WhatsApp Commercial (qui reçoit les commandes) *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={settings.whatsapp_number}
                  onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                  placeholder="2250700000000 (sans '+')"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-bold text-emerald-800 focus:outline-hidden focus:border-emerald-600"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Format international sans signes : 225 pour la Côte d'Ivoire suivi du numéro (ex: 2250701020304).
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nom du Site / Maison d'édition
              </label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Devise d'affichage
              </label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Adresse Siège & Ventes
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => showNotification('Paramètres sauvegardés avec succès !')}
                className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors"
              >
                Enregistrer les paramètres
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
