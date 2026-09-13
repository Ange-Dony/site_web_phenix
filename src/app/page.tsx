'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Eye,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  PhoneCall
} from 'lucide-react';
import BookCard from '@/components/BookCard';
import { INITIAL_BOOKS } from '@/lib/initial-data';
import { getBooks, getSectionContentByKey } from '@/lib/supabase';
import { Book, SectionContent } from '@/types';

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [heroSection, setHeroSection] = useState<SectionContent | null>(null);
  const [activeCollection, setActiveCollection] = useState('all');

  useEffect(() => {
    async function loadData() {
      try {
        const loadedBooks = await getBooks();
        if (loadedBooks && loadedBooks.length > 0) {
          setBooks(loadedBooks);
        }
        const section = await getSectionContentByKey('hero');
        if (section) {
          setHeroSection(section);
        }
      } catch (e) {
        console.error('Erreur chargement page accueil:', e);
      }
    }
    loadData();
  }, []);

  // Filtrer UNIQUEMENT les documents de la "Collection Archives" pour le carrousel principal
  const archivesBooks = books
    .filter((b) => b.collection === 'Collection Archives')
    .sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999));

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = archivesBooks.length > 0 ? archivesBooks.length : 1;

  // Auto-play du carrousel toutes les 4.5s sauf si survolé
  useEffect(() => {
    if (isPaused || archivesBooks.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % archivesBooks.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, archivesBooks.length]);

  const activeBook = archivesBooks[currentSlide] || archivesBooks[0] || books[0];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Ordre strict des collections pour le filtre du bas
  const collections = [
    { id: 'all', name: 'Tous les livres' },
    { id: 'Collection Archives', name: 'Archives (Histoire-Géo)' },
    { id: 'Collection École et Métiers', name: 'École & Métiers (CMC)' },
    { id: 'Collection Jeune Citoyen', name: 'Jeune Citoyen (EDHC)' },
    { id: 'Collection Succès', name: 'Succès (Annales)' },
    { id: 'Collection Polyglotte', name: 'Polyglotte (Anglais)' },
    { id: 'Collection Racines', name: 'Racines (Français & Dictée)' },
    { id: 'Collection Papyrus', name: 'Papyrus (Romans)' },
  ];

  const featuredBooks = books.filter((b) => b.is_featured);
  const filteredBooks = activeCollection === 'all' 
    ? featuredBooks 
    : books.filter((b) => b.collection === activeCollection);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION AVEC CARROUSEL EXCLUSIF COLLECTION ARCHIVES */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-950 via-slate-900 to-slate-950 text-white pt-10 pb-20 sm:py-20">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Colonne Gauche : Présentation & Accès Rapides */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Les Éditions Phénix — La Maison du Succès</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-serif font-black tracking-tight leading-[1.15] text-white">
                {heroSection?.title || (
                  <>
                    La Maison du Succès pour vos Examens et <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 bg-clip-text text-transparent">Évaluations</span>.
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {heroSection?.subtitle || "Explorez nos activités d'évaluation, annales méthodologiques (BEPC, BAC), guides pratiques et créations littéraires conçus pour la réussite de chaque élève."}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
                <Link
                  href="/catalogue"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Consulter le Catalogue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/corriges"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Corrigés Gratuits</span>
                </Link>

                <Link
                  href="/revendeurs"
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 backdrop-blur-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <span>Espace Revendeurs</span>
                </Link>
              </div>

              {/* Reassurance points */}
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-3 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Conforme APC</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Corrigés Gratuits</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Livraison Côte d'Ivoire</span>
                </div>
              </div>
            </div>

            {/* Colonne Droite : CARROUSEL EXCLUSIF DES OUVRAGES DE LA COLLECTION ARCHIVES */}
            <div 
              className="lg:col-span-6 relative flex flex-col items-center"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* En-tête du carrousel Archives */}
              <div className="w-full max-w-lg mb-2 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                    Collection Archives — Histoire-Géographie
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {currentSlide + 1} / {archivesBooks.length}
                </span>
              </div>

              {/* Sélecteurs rapides de niveau pour la collection Archives */}
              <div className="w-full max-w-lg mb-3 flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px] font-bold">
                {archivesBooks.map((book, idx) => (
                  <button
                    key={book.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                      currentSlide === idx
                        ? 'bg-amber-400 text-slate-950 font-black shadow-sm scale-105'
                        : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {book.level}
                  </button>
                ))}
              </div>

              {/* Carte Slide de l'ouvrage actif */}
              {activeBook && (
                <div className="w-full max-w-lg relative bg-slate-900/90 rounded-3xl border border-amber-500/30 p-5 sm:p-7 shadow-2xl overflow-hidden backdrop-blur-md transition-all">
                  {/* Flèches de navigation */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950/85 hover:bg-amber-500 text-white hover:text-slate-950 border border-slate-700 flex items-center justify-center transition-all shadow-md"
                    aria-label="Ouvrage précédent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950/85 hover:bg-amber-500 text-white hover:text-slate-950 border border-slate-700 flex items-center justify-center transition-all shadow-md"
                    aria-label="Ouvrage suivant"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                    {/* Visuel Couverture */}
                    <div className="sm:col-span-5 flex justify-center">
                      <Link 
                        href={`/catalogue/${activeBook.slug}`}
                        className="relative w-36 sm:w-40 aspect-3/4 rounded-xl overflow-hidden shadow-2xl border-2 border-amber-500/40 cursor-pointer group transform hover:scale-105 transition-transform"
                      >
                        <img
                          src={activeBook.cover_image}
                          alt={activeBook.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="p-2 rounded-full bg-amber-500 text-slate-950 shadow-lg">
                            <Eye className="w-4 h-4" />
                          </span>
                        </div>
                      </Link>
                    </div>

                    {/* Détails de l'Ouvrage */}
                    <div className="sm:col-span-7 space-y-2.5 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-sm bg-amber-500 text-slate-950">
                          {activeBook.level}
                        </span>
                        <span className="text-[10px] font-mono text-amber-300">
                          {activeBook.discipline}
                        </span>
                      </div>

                      <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                        {activeBook.collection}
                      </h3>

                      <h4 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2">
                        {activeBook.title}
                      </h4>

                      <p className="text-[11px] text-slate-300 line-clamp-2">
                        {activeBook.subtitle || activeBook.description}
                      </p>

                      <div className="text-base font-black text-amber-400 pt-1">
                        {activeBook.price.toLocaleString('fr-FR')} {activeBook.currency}
                      </div>

                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        <Link
                          href={`/catalogue/${activeBook.slug}`}
                          className="py-2 px-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Voir les détails</span>
                        </Link>

                        <Link
                          href={`/commande?book=${activeBook.id}`}
                          className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1 transition-colors"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
                          <span>Commander</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar indicateur en bas de carte */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Cahiers d'Activités d'Évaluation & Situations d'Apprentissage</span>
                    <span className="font-mono text-amber-400">{currentSlide + 1} / {archivesBooks.length}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-900">+25</div>
            <div className="text-xs text-slate-600 font-medium mt-1">Ouvrages Édités</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-900">100%</div>
            <div className="text-xs text-slate-600 font-medium mt-1">Conformes aux Programmes</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">Gratuit</div>
            <div className="text-xs text-slate-600 font-medium mt-1">Téléchargement des Corrigés</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">Direct</div>
            <div className="text-xs text-slate-600 font-medium mt-1">Commande WhatsApp</div>
          </div>
        </div>
      </section>

      {/* EXPLORER PAR COLLECTION (ORDRE STRICT DES 7 COLLECTIONS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
              Collections Pédagogiques & Littéraires
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
              Nos Ouvrages Phares du Moment
            </h2>
          </div>
          <Link
            href="/catalogue"
            className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 group"
          >
            <span>Voir tout le catalogue ({books.length} parutions)</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Filter Pills des Collections (Ordre Strict) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => setActiveCollection(col.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCollection === col.id
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {col.name}
            </button>
          ))}
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.slice(0, 8).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* ESPACE CORRIGÉS HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
              Ressource 100% Gratuite
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black">
              Téléchargez Librement les Corrigés Officiels
            </h2>
            <p className="text-sm text-emerald-100 leading-relaxed">
              Pour soutenir les élèves et les enseignants, <strong>Les Éditions Phénix</strong> mettent à disposition les corrigés complets de tous les devoirs et annales au format PDF et Word.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/corriges"
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
              >
                Accéder aux Corrigés
              </Link>
              <Link
                href="/catalogue"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
              >
                Consulter les Ouvrages
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
