'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3,
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Layers, 
  ShoppingBag, 
  ShieldCheck, 
  Database,
  Eye,
  Phone,
  Bookmark,
  Building2,
  ListOrdered,
  X,
  ArrowUp,
  ArrowDown,
  GraduationCap,
  LayoutTemplate
} from 'lucide-react';
import { Book, Corrige, Order, SiteSettings, CollectionItem, DisciplineItem, ResellerOrder, LevelItem, SectionContent } from '@/types';
import { 
  getBooks, 
  getCorriges, 
  getSiteSettings, 
  getCollections, 
  getDisciplines,
  getLevels,
  saveLevel,
  deleteLevel,
  getSectionContents,
  saveSectionContent,
  saveAllBooks,
  getResellerOrders,
  saveCollection,
  deleteCollection,
  saveDiscipline,
  deleteDiscipline,
  deleteBook,
  updateBook,
  deleteCorrige,
  uploadFileToSupabase, 
  supabase, 
  isSupabaseConfigured 
} from '@/lib/supabase';

type TabType = 'books' | 'levels' | 'sections' | 'collections' | 'disciplines' | 'corriges' | 'orders';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('books');

  // Données
  const [books, setBooks] = useState<Book[]>([]);
  const [levels, setLevels] = useState<LevelItem[]>([]);
  const [sections, setSections] = useState<SectionContent[]>([]);
  const [corriges, setCorriges] = useState<Corrige[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [disciplines, setDisciplines] = useState<DisciplineItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [resellerOrders, setResellerOrders] = useState<ResellerOrder[]>([]);
  const [orderSubTab, setOrderSubTab] = useState<'retail' | 'reseller'>('retail');

  // Formulaire d'ajout / modification de Livre
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '', // FACULTATIF STRICTEMENT RESPECTÉ
    collection: 'Collection Succès',
    category: 'Histoire-Géographie',
    level: '3ème (BEPC)',
    price: 4000,
    old_price: '',
    description: '',
    cover_url: '',
    page_count: 180,
    published_year: new Date().getFullYear(),
    order_index: 1,
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // Formulaire d'ajout / modification de Niveau (Classe)
  const [editingLevelId, setEditingLevelId] = useState<string | null>(null);
  const [levelForm, setLevelForm] = useState({
    name: '',
    cycle: 'Collège',
    order_index: 1,
    description: '',
  });

  // Formulaire de modification de Rubrique / Section
  const [editingSectionKey, setEditingSectionKey] = useState<string | null>(null);
  const [sectionForm, setSectionForm] = useState({
    section_key: '',
    title: '',
    subtitle: '',
    content: '',
    banner_text: '',
    order_index: 1,
    is_visible: true,
  });

  // Formulaire d'ajout / modification de Collection
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [colForm, setColForm] = useState({
    name: '',
    description: '',
    color: 'from-amber-600 to-amber-800',
  });

  // Formulaire d'ajout / modification de Discipline
  const [editingDiscId, setEditingDiscId] = useState<string | null>(null);
  const [discForm, setDiscForm] = useState({
    name: '',
    description: '',
  });

  // Formulaire d'ajout / modification de Corrigé
  const [editingCorrigeId, setEditingCorrigeId] = useState<string | null>(null);
  const [corrigeForm, setCorrigeForm] = useState({
    title: '',
    subject: 'Histoire-Géographie',
    level: '3ème (BEPC)',
    book_id: '',
    description: '',
    file_type: 'pdf' as 'pdf' | 'docx',
  });
  const [docFile, setDocFile] = useState<File | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Notification Toast
  const [notification, setNotification] = useState<string | null>(null);

  // Charger toutes les données
  useEffect(() => {
    async function loadData() {
      const [b, lvl, sec, c, col, d, resOrders] = await Promise.all([
        getBooks(),
        getLevels(),
        getSectionContents(),
        getCorriges(),
        getCollections(),
        getDisciplines(),
        getResellerOrders()
      ]);
      setBooks(b);
      setLevels(lvl);
      setSections(sec);
      setCorriges(c);
      setCollections(col);
      setDisciplines(d);
      setResellerOrders(resOrders);

      if (supabase && isSupabaseConfigured) {
        try {
          const { data: dbOrders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
          if (dbOrders && dbOrders.length > 0) {
            setOrders(dbOrders as Order[]);
          }
        } catch {}
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

  // =========================================================================
  // GESTION DE L'ORDRE DES LIVRES (REORDERING)
  // =========================================================================
  const handleMoveBookUp = async (index: number) => {
    if (index <= 0) return;
    const newBooks = [...books];
    const prev = newBooks[index - 1];
    const curr = newBooks[index];

    // Échanger les positions
    newBooks[index - 1] = curr;
    newBooks[index] = prev;

    // Réassigner order_index séquentiel
    const reordered = newBooks.map((b, idx) => ({
      ...b,
      order_index: idx + 1,
    }));

    setBooks(reordered);
    await saveAllBooks(reordered);
    showNotification(`L'ordre de "${curr.title}" a été déplacé vers le haut (#${index}).`);
  };

  const handleMoveBookDown = async (index: number) => {
    if (index >= books.length - 1) return;
    const newBooks = [...books];
    const curr = newBooks[index];
    const next = newBooks[index + 1];

    // Échanger les positions
    newBooks[index] = next;
    newBooks[index + 1] = curr;

    // Réassigner order_index séquentiel
    const reordered = newBooks.map((b, idx) => ({
      ...b,
      order_index: idx + 1,
    }));

    setBooks(reordered);
    await saveAllBooks(reordered);
    showNotification(`L'ordre de "${curr.title}" a été déplacé vers le bas (#${index + 2}).`);
  };

  // =========================================================================
  // GESTION DES LIVRES / DOCUMENTS
  // =========================================================================
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleStartEditBook = (b: Book) => {
    setEditingBookId(b.id);
    setBookForm({
      title: b.title,
      author: b.author || '',
      collection: b.collection || collections[0]?.name || 'Collection Succès',
      category: b.category || disciplines[0]?.name || 'Histoire-Géographie',
      level: b.level || levels[0]?.name || '3ème (BEPC)',
      price: b.price,
      old_price: b.old_price ? String(b.old_price) : '',
      description: b.description || '',
      cover_url: b.cover_url || '',
      page_count: b.page_count || 180,
      published_year: b.published_year || new Date().getFullYear(),
      order_index: b.order_index ?? (books.findIndex(item => item.id === b.id) + 1),
    });
    setCoverPreview(b.cover_url);
    setActiveTab('books');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEditBook = () => {
    setEditingBookId(null);
    setCoverFile(null);
    setCoverPreview(null);
    setBookForm({
      title: '',
      author: '',
      collection: collections[0]?.name || 'Collection Succès',
      category: disciplines[0]?.name || 'Histoire-Géographie',
      level: levels[0]?.name || '3ème (BEPC)',
      price: 4000,
      old_price: '',
      description: '',
      cover_url: '',
      page_count: 180,
      published_year: new Date().getFullYear(),
      order_index: books.length + 1,
    });
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title.trim()) {
      alert('Veuillez renseigner le titre du document / ouvrage.');
      return;
    }

    setIsUploadingCover(true);
    let finalCoverUrl = bookForm.cover_url || '/covers/code-d-acces-annale-hg-3e.png';

    if (coverFile) {
      if (isSupabaseConfigured) {
        const uploadRes = await uploadFileToSupabase(coverFile, 'covers');
        if (uploadRes.url) finalCoverUrl = uploadRes.url;
      } else if (coverPreview) {
        finalCoverUrl = coverPreview;
      }
    }

    const bookPayload: Partial<Book> = {
      title: bookForm.title.trim(),
      author: bookForm.author.trim() || undefined,
      collection: bookForm.collection,
      category: bookForm.category,
      discipline: bookForm.category,
      level: bookForm.level,
      price: Number(bookForm.price),
      old_price: bookForm.old_price ? Number(bookForm.old_price) : undefined,
      description: bookForm.description.trim(),
      cover_url: finalCoverUrl,
      cover_image: finalCoverUrl,
      page_count: Number(bookForm.page_count) || 180,
      published_year: Number(bookForm.published_year) || new Date().getFullYear(),
      order_index: Number(bookForm.order_index) || (books.length + 1),
    };

    if (editingBookId) {
      await updateBook(editingBookId, bookPayload);
      setBooks((prev) => {
        const updated = prev.map((b) => (b.id === editingBookId ? { ...b, ...bookPayload } as Book : b));
        return updated.sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999));
      });
      showNotification(`Ouvrage "${bookForm.title}" mis à jour avec succès !`);
    } else {
      const newBookRecord: Book = {
        id: `custom_${Date.now()}`,
        slug: bookForm.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        currency: 'FCFA',
        in_stock: true,
        is_featured: false,
        created_at: new Date().toISOString(),
        ...bookPayload,
      } as Book;

      const updatedList = [...books, newBookRecord].sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999));
      setBooks(updatedList);
      await saveAllBooks(updatedList);
      showNotification(`Document "${bookForm.title}" ajouté au catalogue !`);
    }

    setIsUploadingCover(false);
    handleCancelEditBook();
  };

  const handleDeleteBook = async (id: string, title: string) => {
    if (confirm(`Voulez-vous vraiment supprimer "${title}" du catalogue ?`)) {
      await deleteBook(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      showNotification(`Ouvrage "${title}" supprimé.`);
    }
  };

  // =========================================================================
  // GESTION DES NIVEAUX / CLASSES (CRUD)
  // =========================================================================
  const handleEditLevel = (lvl: LevelItem) => {
    setEditingLevelId(lvl.id);
    setLevelForm({
      name: lvl.name,
      cycle: lvl.cycle || 'Collège',
      order_index: lvl.order_index ?? 1,
      description: lvl.description || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEditLevel = () => {
    setEditingLevelId(null);
    setLevelForm({
      name: '',
      cycle: 'Collège',
      order_index: levels.length + 1,
      description: '',
    });
  };

  const handleSaveLevel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!levelForm.name.trim()) {
      alert('Veuillez renseigner le nom de la classe / niveau.');
      return;
    }

    const payload: LevelItem = {
      id: editingLevelId || `lvl_${Date.now()}`,
      name: levelForm.name.trim(),
      cycle: levelForm.cycle.trim() || undefined,
      order_index: Number(levelForm.order_index) || (levels.length + 1),
      description: levelForm.description.trim() || undefined,
    };

    await saveLevel(payload);
    const updated = await getLevels();
    setLevels(updated);
    showNotification(`Niveau "${payload.name}" enregistré avec succès !`);
    handleCancelEditLevel();
  };

  const handleDeleteLevel = async (id: string, name: string) => {
    if (confirm(`Voulez-vous supprimer le niveau / classe "${name}" ?`)) {
      await deleteLevel(id);
      setLevels((prev) => prev.filter((l) => l.id !== id));
      showNotification(`Niveau "${name}" supprimé.`);
    }
  };

  // =========================================================================
  // GESTION DES RUBRIQUES / CONTENUS DE PAGES (CRUD)
  // =========================================================================
  const handleEditSection = (sec: SectionContent) => {
    setEditingSectionKey(sec.section_key);
    setSectionForm({
      section_key: sec.section_key,
      title: sec.title,
      subtitle: sec.subtitle || '',
      content: sec.content || '',
      banner_text: sec.banner_text || '',
      order_index: sec.order_index ?? 1,
      is_visible: sec.is_visible ?? true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionForm.section_key) return;

    const payload: SectionContent = {
      section_key: sectionForm.section_key,
      title: sectionForm.title.trim(),
      subtitle: sectionForm.subtitle.trim() || undefined,
      content: sectionForm.content.trim() || undefined,
      banner_text: sectionForm.banner_text.trim() || undefined,
      order_index: Number(sectionForm.order_index) || 1,
      is_visible: sectionForm.is_visible,
      updated_at: new Date().toISOString(),
    };

    await saveSectionContent(payload);
    const updated = await getSectionContents();
    setSections(updated);
    showNotification(`Rubrique "${payload.section_key}" mise à jour !`);
    setEditingSectionKey(null);
  };

  // =========================================================================
  // GESTION DES COLLECTIONS
  // =========================================================================
  const handleEditCollection = (c: CollectionItem) => {
    setEditingColId(c.id);
    setColForm({
      name: c.name,
      description: c.description || '',
      color: c.color || 'from-amber-600 to-amber-800',
    });
  };

  const handleSaveCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colForm.name.trim()) return;

    const payload: CollectionItem = {
      id: editingColId || `col_${Date.now()}`,
      name: colForm.name.trim(),
      slug: colForm.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-'),
      description: colForm.description.trim() || undefined,
      color: colForm.color,
    };

    await saveCollection(payload);
    const updated = await getCollections();
    setCollections(updated);
    setEditingColId(null);
    setColForm({ name: '', description: '', color: 'from-amber-600 to-amber-800' });
    showNotification(`Collection "${payload.name}" enregistrée !`);
  };

  const handleDeleteCollection = async (id: string, name: string) => {
    if (confirm(`Voulez-vous supprimer la collection "${name}" ?`)) {
      await deleteCollection(id);
      setCollections((prev) => prev.filter((c) => c.id !== id));
      showNotification(`Collection "${name}" supprimée.`);
    }
  };

  // =========================================================================
  // GESTION DES DISCIPLINES
  // =========================================================================
  const handleEditDiscipline = (d: DisciplineItem) => {
    setEditingDiscId(d.id);
    setDiscForm({
      name: d.name,
      description: d.description || '',
    });
  };

  const handleSaveDiscipline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discForm.name.trim()) return;

    const payload: DisciplineItem = {
      id: editingDiscId || `disc_${Date.now()}`,
      name: discForm.name.trim(),
      slug: discForm.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-'),
      description: discForm.description.trim() || undefined,
    };

    await saveDiscipline(payload);
    const updated = await getDisciplines();
    setDisciplines(updated);
    setEditingDiscId(null);
    setDiscForm({ name: '', description: '' });
    showNotification(`Discipline "${payload.name}" enregistrée !`);
  };

  const handleDeleteDiscipline = async (id: string, name: string) => {
    if (confirm(`Voulez-vous supprimer la discipline "${name}" ?`)) {
      await deleteDiscipline(id);
      setDisciplines((prev) => prev.filter((d) => d.id !== id));
      showNotification(`Discipline "${name}" supprimée.`);
    }
  };

  // =========================================================================
  // GESTION DES CORRIGÉS
  // =========================================================================
  const handleDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocFile(file);
      if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        setCorrigeForm({ ...corrigeForm, file_type: 'docx' });
      } else {
        setCorrigeForm({ ...corrigeForm, file_type: 'pdf' });
      }
    }
  };

  const handleSaveCorrige = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!corrigeForm.title.trim()) {
      alert('Veuillez renseigner le titre du corrigé.');
      return;
    }

    setIsUploadingDoc(true);
    let finalDocUrl = 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf';
    let finalFileName = docFile ? docFile.name : 'corrige_officiel.pdf';
    let finalSize = docFile ? `${(docFile.size / (1024 * 1024)).toFixed(1)} Mo` : '1.5 Mo';

    if (docFile && isSupabaseConfigured) {
      const uploadRes = await uploadFileToSupabase(docFile, 'documents');
      if (uploadRes.url) finalDocUrl = uploadRes.url;
    }

    const newCorrigeRecord: Corrige = {
      id: editingCorrigeId || `c_${Date.now()}`,
      title: corrigeForm.title.trim(),
      subject: corrigeForm.subject,
      level: corrigeForm.level,
      book_id: corrigeForm.book_id || undefined,
      book_title: books.find((b) => b.id === corrigeForm.book_id)?.title,
      description: corrigeForm.description.trim() || undefined,
      file_url: finalDocUrl,
      file_name: finalFileName,
      file_size: finalSize,
      file_type: corrigeForm.file_type,
      download_count: 0,
      is_free: true,
      created_at: new Date().toISOString(),
    };

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('corriges').upsert(newCorrigeRecord);
        const updatedCorriges = await getCorriges();
        setCorriges(updatedCorriges);
      } catch {
        setCorriges([newCorrigeRecord, ...corriges]);
      }
    } else {
      setCorriges([newCorrigeRecord, ...corriges]);
      localStorage.setItem('phenix_custom_corriges', JSON.stringify([newCorrigeRecord, ...corriges]));
    }
    showNotification(`Corrigé "${corrigeForm.title}" publié avec succès !`);

    setIsUploadingDoc(false);
    setDocFile(null);
    setEditingCorrigeId(null);
    setCorrigeForm({
      title: '',
      subject: disciplines[0]?.name || 'Histoire-Géographie',
      level: '3ème (BEPC)',
      book_id: '',
      description: '',
      file_type: 'pdf',
    });
  };

  const handleDeleteCorrige = async (id: string, title: string) => {
    if (confirm(`Voulez-vous supprimer le corrigé "${title}" ?`)) {
      await deleteCorrige(id);
      setCorriges((prev) => prev.filter((c) => c.id !== id));
      showNotification(`Corrigé "${title}" supprimé.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Portail d'Administration • Les Éditions Phénix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
            Gestion du Catalogue, Niveaux, Rubriques & Commandes
          </h1>
        </div>

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

      {/* Notification Toast */}
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-600 text-white text-sm font-semibold flex items-center gap-2 shadow-lg animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation des Onglets */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('books')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'books'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Documents & Ouvrages ({books.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('levels')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'levels'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>Niveaux / Classes ({levels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'sections'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <LayoutTemplate className="w-4 h-4 text-purple-600" />
          <span>Rubriques & Textes ({sections.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('collections')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'collections'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Collections ({collections.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('disciplines')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'disciplines'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Matières / Disciplines ({disciplines.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('corriges')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'corriges'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Corrigés Gratuits ({corriges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'orders'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Commandes & Revendeurs</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* ONGLET 1 : DOCUMENTS & OUVRAGES (AVEC GESTION DE L'ORDRE)              */}
      {/* ===================================================================== */}
      {activeTab === 'books' && (
        <div className="space-y-8">
          {/* Formulaire d'ajout / modification */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600" />
                <span>{editingBookId ? 'Modifier l\'Ouvrage / Document' : 'Ajouter un Nouveau Document / Ouvrage'}</span>
              </h2>
              {editingBookId && (
                <button
                  onClick={handleCancelEditBook}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Annuler la modification</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSaveBook} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Titre */}
                <div className="sm:col-span-8">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Titre du Document / Ouvrage *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookForm.title}
                    onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                    placeholder="Ex : Activités d'Évaluation Histoire-Géographie 3ème"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-amber-600 font-semibold"
                  />
                </div>

                {/* Auteur (FACULTATIF STRICTEMENT RESPECTÉ) */}
                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Auteur <span className="text-slate-400 font-normal">(Facultatif)</span>
                  </label>
                  <input
                    type="text"
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    placeholder="Ex : Équipe Pédagogique Phénix"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {/* Collection dynamique */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Collection *
                  </label>
                  <select
                    value={bookForm.collection}
                    onChange={(e) => setBookForm({ ...bookForm, collection: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:border-amber-600 font-medium"
                  >
                    {collections.map((col) => (
                      <option key={col.id} value={col.name}>{col.name}</option>
                    ))}
                  </select>
                </div>

                {/* Matière / Discipline dynamique */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Matière / Discipline *
                  </label>
                  <select
                    value={bookForm.category}
                    onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:border-amber-600 font-medium"
                  >
                    {disciplines.map((disc) => (
                      <option key={disc.id} value={disc.name}>{disc.name}</option>
                    ))}
                  </select>
                </div>

                {/* Niveau dynamique */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Niveau / Classe *
                  </label>
                  <select
                    value={bookForm.level}
                    onChange={(e) => setBookForm({ ...bookForm, level: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:border-amber-600"
                  >
                    {levels.map((lvl) => (
                      <option key={lvl.id} value={lvl.name}>{lvl.name} {lvl.cycle ? `(${lvl.cycle})` : ''}</option>
                    ))}
                  </select>
                </div>

                {/* Prix Public (FCFA) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Prix Public (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="500"
                    value={bookForm.price}
                    onChange={(e) => setBookForm({ ...bookForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                {/* Ordre d'affichage */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Position (Ordre)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={bookForm.order_index}
                    onChange={(e) => setBookForm({ ...bookForm, order_index: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:outline-hidden focus:border-amber-600"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description Pédagogique
                </label>
                <textarea
                  rows={2}
                  value={bookForm.description}
                  onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                  placeholder="Points forts de l'ouvrage, modules traités, conformité APC..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-amber-600"
                />
              </div>

              {/* Couverture */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Image de Couverture (JPG, PNG, WebP)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverSelect}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                />
                {coverPreview && (
                  <div className="mt-3 w-20 h-28 rounded-lg overflow-hidden border border-slate-300 p-1 bg-white">
                    <img src={coverPreview} alt="Aperçu" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isUploadingCover}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-xs text-slate-950 flex items-center gap-2 shadow-sm transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingBookId ? 'Enregistrer les modifications' : 'Ajouter au catalogue'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Liste des livres avec réorganisation directe (Monter / Descendre) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Catalogue Actuel ({books.length} documents et activités)
                </h2>
                <p className="text-xs text-slate-500">
                  Utilisez les flèches ▲ et ▼ pour changer l'ordre d'affichage des documents sur le site.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {books.map((book, idx) => (
                <div key={book.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3.5">
                    {/* Position badge */}
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 font-mono font-black text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </div>

                    <div className="w-12 h-16 rounded-lg bg-slate-100 border border-slate-200 p-0.5 overflow-hidden shrink-0">
                      <img src={book.cover_url} alt={book.title} className="w-full h-full object-contain" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700">
                          {book.level}
                        </span>
                        <span className="text-[10px] font-medium text-amber-700">
                          {book.collection}
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                        {book.title}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {book.author ? `Auteur : ${book.author}` : 'Éditions Phénix'} • {book.price.toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Boutons d'ordonnancement */}
                    <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1 border border-slate-200">
                      <button
                        onClick={() => handleMoveBookUp(idx)}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg hover:bg-white text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Monter dans l'ordre"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveBookDown(idx)}
                        disabled={idx === books.length - 1}
                        className="p-1.5 rounded-lg hover:bg-white text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Descendre dans l'ordre"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <Link
                      href={`/catalogue/${book.slug}`}
                      target="_blank"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Voir sur le site"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleStartEditBook(book)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Modifier cet ouvrage"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Modifier</span>
                    </button>

                    <button
                      onClick={() => handleDeleteBook(book.id, book.title)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Supprimer cet ouvrage"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ONGLET 2 : NIVEAUX / CLASSES (CRUD)                                   */}
      {/* ===================================================================== */}
      {activeTab === 'levels' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Formulaire Niveau */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>{editingLevelId ? 'Modifier la Classe / Niveau' : 'Ajouter une Classe / Niveau'}</span>
              </h2>
              {editingLevelId && (
                <button
                  onClick={handleCancelEditLevel}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                >
                  Annuler
                </button>
              )}
            </div>

            <form onSubmit={handleSaveLevel} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nom du Niveau / Classe *</label>
                <input
                  type="text"
                  required
                  value={levelForm.name}
                  onChange={(e) => setLevelForm({ ...levelForm, name: e.target.value })}
                  placeholder="Ex : 3ème (BEPC), Terminale (BAC), 6ème..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-600 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cycle Scolaire</label>
                  <select
                    value={levelForm.cycle}
                    onChange={(e) => setLevelForm({ ...levelForm, cycle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-600 bg-white"
                  >
                    <option value="Collège">Collège (Premier cycle)</option>
                    <option value="Lycée">Lycée (Second cycle)</option>
                    <option value="Enseignement Technique">Enseignement Technique</option>
                    <option value="Général">Général / Tout public</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ordre de tri</label>
                  <input
                    type="number"
                    min="1"
                    value={levelForm.order_index}
                    onChange={(e) => setLevelForm({ ...levelForm, order_index: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Précisions</label>
                <textarea
                  rows={2}
                  value={levelForm.description}
                  onChange={(e) => setLevelForm({ ...levelForm, description: e.target.value })}
                  placeholder="Ex : Classe d'examen du Brevet d'Études du Premier Cycle..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{editingLevelId ? 'Enregistrer les modifications' : 'Ajouter le niveau'}</span>
              </button>
            </form>
          </div>

          {/* Liste des Niveaux */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Niveaux et Classes Définis ({levels.length})
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {levels.map((lvl) => (
                <div key={lvl.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {lvl.order_index ?? '-'}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        {lvl.name} {lvl.cycle ? <span className="text-xs font-normal text-slate-500">({lvl.cycle})</span> : ''}
                      </h3>
                      {lvl.description && (
                        <p className="text-xs text-slate-500 mt-0.5">{lvl.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEditLevel(lvl)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Modifier"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteLevel(lvl.id, lvl.name)}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ONGLET 3 : RUBRIQUES & TEXTES DU SITE (CRUD)                          */}
      {/* ===================================================================== */}
      {activeTab === 'sections' && (
        <div className="space-y-8">
          {/* Formulaire de modification de la rubrique active */}
          {editingSectionKey ? (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-purple-600" />
                  <span>Modifier la Rubrique : <code className="text-amber-800 font-mono">{sectionForm.section_key}</code></span>
                </h2>
                <button
                  onClick={() => setEditingSectionKey(null)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                >
                  Fermer
                </button>
              </div>

              <form onSubmit={handleSaveSection} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Titre Principal de la Rubrique *</label>
                    <input
                      type="text"
                      required
                      value={sectionForm.title}
                      onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-600 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Texte de Bannière / Badge</label>
                    <input
                      type="text"
                      value={sectionForm.banner_text}
                      onChange={(e) => setSectionForm({ ...sectionForm, banner_text: e.target.value })}
                      placeholder="Ex : Ressource 100% Gratuite"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sous-titre / Description Courte</label>
                  <textarea
                    rows={2}
                    value={sectionForm.subtitle}
                    onChange={(e) => setSectionForm({ ...sectionForm, subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Texte Détaillé / Contenu</label>
                  <textarea
                    rows={4}
                    value={sectionForm.content}
                    onChange={(e) => setSectionForm({ ...sectionForm, content: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-600 font-sans"
                  />
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Enregistrer les textes de cette rubrique</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingSectionKey(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          {/* Liste des Rubriques du site */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Rubriques et Textes Paramétrables du Site
              </h2>
              <p className="text-xs text-slate-500">
                Personnalisez les titres, sous-titres et messages affichés dans chaque section du site.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {sections.map((sec) => (
                <div key={sec.section_key} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-sm">
                        {sec.section_key}
                      </span>
                      {sec.banner_text && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          {sec.banner_text}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{sec.title}</h3>
                    {sec.subtitle && (
                      <p className="text-xs text-slate-600 max-w-2xl">{sec.subtitle}</p>
                    )}
                    {sec.content && (
                      <p className="text-xs text-slate-400 line-clamp-2 max-w-2xl mt-1">{sec.content}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleEditSection(sec)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Modifier les textes</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ONGLET 4 : COLLECTIONS                                                */}
      {/* ===================================================================== */}
      {activeTab === 'collections' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Formulaire Collection */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>{editingColId ? 'Modifier la Collection' : 'Créer une Collection'}</span>
              </h2>
              {editingColId && (
                <button
                  onClick={() => {
                    setEditingColId(null);
                    setColForm({ name: '', description: '', color: 'from-amber-600 to-amber-800' });
                  }}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                >
                  Annuler
                </button>
              )}
            </div>

            <form onSubmit={handleSaveCollection} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nom de la Collection *</label>
                <input
                  type="text"
                  required
                  value={colForm.name}
                  onChange={(e) => setColForm({ ...colForm, name: e.target.value })}
                  placeholder="Ex : Collection Polyglotte"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-600 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Objectif</label>
                <textarea
                  rows={3}
                  value={colForm.description}
                  onChange={(e) => setColForm({ ...colForm, description: e.target.value })}
                  placeholder="Ex : Guides et méthodes d'apprentissage des langues vivantes..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{editingColId ? 'Enregistrer les modifications' : 'Ajouter la collection'}</span>
              </button>
            </form>
          </div>

          {/* Liste des collections */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Collections Enregistrées ({collections.length})
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {collections.map((col) => (
                <div key={col.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{col.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{col.description || 'Aucune description'}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEditCollection(col)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Modifier"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCollection(col.id, col.name)}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ONGLET 5 : MATIÈRES / DISCIPLINES                                     */}
      {/* ===================================================================== */}
      {activeTab === 'disciplines' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Formulaire Discipline */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-600" />
                <span>{editingDiscId ? 'Modifier la Discipline' : 'Ajouter une Matière / Discipline'}</span>
              </h2>
              {editingDiscId && (
                <button
                  onClick={() => {
                    setEditingDiscId(null);
                    setDiscForm({ name: '', description: '' });
                  }}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                >
                  Annuler
                </button>
              )}
            </div>

            <form onSubmit={handleSaveDiscipline} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nom de la Matière / Discipline *</label>
                <input
                  type="text"
                  required
                  value={discForm.name}
                  onChange={(e) => setDiscForm({ ...discForm, name: e.target.value })}
                  placeholder="Ex : Sciences Physiques, Philosophie, SVT..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-600 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Précisions</label>
                <textarea
                  rows={3}
                  value={discForm.description}
                  onChange={(e) => setDiscForm({ ...discForm, description: e.target.value })}
                  placeholder="Ex : Sujets et programmes de sciences de la nature..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{editingDiscId ? 'Enregistrer les modifications' : 'Ajouter la matière'}</span>
              </button>
            </form>
          </div>

          {/* Liste des disciplines */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Matières & Disciplines Actuelles ({disciplines.length})
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {disciplines.map((disc) => (
                <div key={disc.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{disc.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{disc.description || 'Aucune description'}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEditDiscipline(disc)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Modifier"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDiscipline(disc.id, disc.name)}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ONGLET 6 : CORRIGÉS GRATUITS                                          */}
      {/* ===================================================================== */}
      {activeTab === 'corriges' && (
        <div className="space-y-8">
          {/* Formulaire ajout corrigé */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Publier un Nouveau Corrigé Officiel (PDF ou Word)</span>
            </h2>

            <form onSubmit={handleSaveCorrige} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Titre du Corrigé *
                  </label>
                  <input
                    type="text"
                    required
                    value={corrigeForm.title}
                    onChange={(e) => setCorrigeForm({ ...corrigeForm, title: e.target.value })}
                    placeholder="Ex : Corrigé Officiel - Annales Histoire-Géo BEPC"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rattacher à l'Ouvrage Officiel
                  </label>
                  <select
                    value={corrigeForm.book_id}
                    onChange={(e) => setCorrigeForm({ ...corrigeForm, book_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:border-amber-600"
                  >
                    <option value="">-- Sélectionner l'ouvrage associé --</option>
                    {books.map((b) => (
                      <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Matière *</label>
                  <select
                    value={corrigeForm.subject}
                    onChange={(e) => setCorrigeForm({ ...corrigeForm, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    {disciplines.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Niveau / Classe *</label>
                  <select
                    value={corrigeForm.level}
                    onChange={(e) => setCorrigeForm({ ...corrigeForm, level: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    {levels.map((lvl) => (
                      <option key={lvl.id} value={lvl.name}>{lvl.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fichier (PDF ou Word)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleDocSelect}
                    className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUploadingDoc}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isUploadingDoc ? 'Téléversement en cours...' : 'Publier le corrigé'}</span>
              </button>
            </form>
          </div>

          {/* Liste corrigés */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Corrigés Actuellement en Téléchargement ({corriges.length})
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {corriges.map((c) => (
                <div key={c.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700">
                        {c.level}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 uppercase">
                        {c.file_type}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{c.title}</h3>
                    <p className="text-[11px] text-slate-500">
                      Matière : {c.subject} {c.book_title ? `• Ouvrage : ${c.book_title}` : ''} • Téléchargements : {c.download_count || 0}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteCorrige(c.id, c.title)}
                    className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors shrink-0"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ONGLET 7 : COMMANDES & REVENDEURS                                     */}
      {/* ===================================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Sous-onglets : Particuliers vs Revendeurs */}
          <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
            <button
              onClick={() => setOrderSubTab('retail')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                orderSubTab === 'retail'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Commandes Particuliers ({orders.filter(o => !o.notes?.includes('[COMMANDE REVENDEUR')).length})
            </button>
            <button
              onClick={() => setOrderSubTab('reseller')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                orderSubTab === 'reseller'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Bons de Commande Revendeurs / Établissements ({resellerOrders.length})</span>
            </button>
          </div>

          {orderSubTab === 'reseller' ? (
            /* Tableau des commandes revendeurs B2B */
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">
                  Bordereaux de Commandes Revendeurs & Grossistes
                </h2>
                <span className="text-xs text-slate-500">Sans affichage des prix publics</span>
              </div>

              {resellerOrders.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {resellerOrders.map((ro) => (
                    <div key={ro.id} className="p-5 space-y-3 hover:bg-slate-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-sm">
                              {ro.order_code}
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              {ro.company_name}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Responsable : {ro.contact_name} • Ville : {ro.city} {ro.address ? `(${ro.address})` : ''}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs font-mono">
                            {ro.total_copies} exemplaires
                          </span>
                          <a
                            href={`https://wa.me/${ro.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                            title="Contacter sur WhatsApp"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      {/* Détail du point */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                        <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                          Point des documents commandés :
                        </span>
                        {ro.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-slate-600 text-xs">
                            <span>• {item.title}</span>
                            <span className="font-bold text-slate-900 font-mono">{item.quantity} ex.</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-slate-500">
                  Aucun bon de commande revendeur enregistré pour le moment.
                </div>
              )}
            </div>
          ) : (
            /* Tableau des commandes particuliers */
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">
                  Commandes Particuliers via WhatsApp ({orders.length})
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <div key={o.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-700">{o.order_code}</span>
                        <span className="text-xs font-bold text-slate-900">{o.customer_name}</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {o.customer_phone} • {o.delivery_city} • {o.total_amount ? `${o.total_amount.toLocaleString('fr-FR')} FCFA` : 'N/A'}
                      </p>
                    </div>

                    <a
                      href={`https://wa.me/${o.customer_phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors w-fit"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>WhatsApp Client</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
