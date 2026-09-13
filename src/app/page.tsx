'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Download, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  GraduationCap, 
  Search,
  BookMarked,
  ShieldCheck,
  TrendingUp,
  FileText,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import BookCard from '@/components/BookCard';
import BookFlipbook from '@/components/BookFlipbook';
import { INITIAL_BOOKS, INITIAL_CORRIGES } from '@/lib/initial-data';
import { Book } from '@/types';

export default function HomePage() {
  const [activeCollection, setActiveCollection] = useState('all');
  const [flipbookBook, setFlipbookBook] = useState<Book | null>(null);

  // Définition ordonnée stricte des 7 collections demandées :
  // Archives → École et Métiers → Jeune Citoyen → Succès → Polyglotte → Racines → Papyrus
  const heroCarouselSlides = [
    {
      id: 'col-archives',
      collectionName: 'Collection Archives',
      shortName: 'Archives',
      title: 'Histoire-Géographie 3ème - Activités d\'Évaluation & Exercices',
      subtitle: 'Cahiers d\'Activités d\'Évaluation & Situations d\'Apprentissage',
      badge: 'Histoire-Géo • Approche APC',
      level: 'Classe de 3ème (BEPC)',
      price: '4 800 FCFA',
      cover: '/covers/hg-couverture-3e-1ere-couv.webp',
      color: 'from-blue-600/30 to-indigo-950/80 border-blue-500/40',
      tagColor: 'bg-blue-500 text-white',
      slug: 'hg-manuel-3e',
      bookId: 'b10',
    },
    {
      id: 'col-ecole-metiers',
      collectionName: 'Collection École et Métiers',
      shortName: 'École et Métiers',
      title: 'Communication & Méthodes Commerciales (CMC) Terminale',
      subtitle: 'Filières Professionnelles & Techniques Tertiaires',
      badge: 'Filières Tertiaires • BAC G1 / G2 / AB',
      level: 'Terminale Technique',
      price: '6 000 FCFA',
      cover: '/covers/couverture-cmc-tle-1ere-couv.webp',
      color: 'from-teal-600/30 to-slate-950/80 border-teal-500/40',
      tagColor: 'bg-teal-500 text-white',
      slug: 'couverture-cmc-tle',
      bookId: 'b22',
    },
    {
      id: 'col-jeune-citoyen',
      collectionName: 'Collection Jeune Citoyen',
      shortName: 'Jeune Citoyen',
      title: 'Éducation aux Droits de l\'Homme et Citoyenneté (EDHC)',
      subtitle: 'Guide Pratique du Jeune Citoyen Responsable',
      badge: 'EDHC • Citoyenneté & Paix',
      level: 'Collège & Lycée',
      price: '3 500 FCFA',
      cover: '/covers/code-d-acces-annale-hg-3e.png',
      color: 'from-amber-600/30 to-orange-950/80 border-amber-500/40',
      tagColor: 'bg-amber-500 text-slate-950',
      slug: 'edhc-guide-jeune-citoyen',
      bookId: 'b24',
    },
    {
      id: 'col-succes',
      collectionName: 'Collection Succès',
      shortName: 'Succès',
      title: 'Code d\'Accès - Annale Histoire-Géographie Terminale (BAC)',
      subtitle: 'Annales Officielles & Sujets Types Commentés',
      badge: 'Annales d\'Examen • Baccalauréat',
      level: 'Terminale BAC (Toutes séries)',
      price: '5 000 FCFA',
      cover: '/covers/code-d-acces-annale-hg-tle.png',
      color: 'from-amber-500/30 to-slate-950/80 border-amber-400/40',
      tagColor: 'bg-amber-400 text-slate-950',
      slug: 'code-acces-annale-hg-tle',
      bookId: 'b2',
    },
    {
      id: 'col-polyglotte',
      collectionName: 'Collection Polyglotte',
      shortName: 'Polyglotte',
      title: 'English Oral Skills for BEPC - Audio & Practice',
      subtitle: 'Guides d\'Anglais & Pratique Intensive de l\'Oral',
      badge: 'Langues Vivantes • Épreuve Orale',
      level: '3ème (BEPC)',
      price: '3 500 FCFA',
      cover: '/covers/anglais-oral-bepc.png',
      color: 'from-emerald-600/30 to-teal-950/80 border-emerald-500/40',
      tagColor: 'bg-emerald-500 text-white',
      slug: 'anglais-oral-bepc',
      bookId: 'b14',
    },
    {
      id: 'col-racines',
      collectionName: 'Collection Racines',
      shortName: 'Racines',
      title: 'Dictée - Questions & Analyse de Texte (Collège)',
      subtitle: 'Maîtrise de la Langue Française & Récits Culturels',
      badge: 'Français & Dictée • 6e à 3e',
      level: 'Premier Cycle (Collège)',
      price: '3 500 FCFA',
      cover: '/covers/couverture-dq-1ere-couv.webp',
      color: 'from-rose-600/30 to-red-950/80 border-rose-500/40',
      tagColor: 'bg-rose-500 text-white',
      slug: 'couverture-dq-college',
      bookId: 'b23',
    },
    {
      id: 'col-papyrus',
      collectionName: 'Collection Papyrus',
      shortName: 'Papyrus',
      title: 'Soir d\'un Monde (Roman d\'Aimé C. Tanoh)',
      subtitle: 'Créations Littéraires & Romans Inspirants',
      badge: 'Littérature Africaine • Roman',
      level: 'Lycée & Tout Public',
      price: '4 500 FCFA',
      cover: '/covers/soir-d-un-monde.webp',
      color: 'from-purple-600/30 to-indigo-950/80 border-purple-500/40',
      tagColor: 'bg-purple-500 text-white',
      slug: 'soir-dun-monde',
      bookId: 'b18',
    },
  ];

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play du carrousel toutes les 4.5s sauf si souris dessus
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroCarouselSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, heroCarouselSlides.length]);

  const activeSlide = heroCarouselSlides[currentSlide];

  // Navigation carrousel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroCarouselSlides.length);
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroCarouselSlides.length) % heroCarouselSlides.length);
  };

  // Trouver le livre associé au slide actif pour la liseuse Flipbook
  const currentSlideBook = INITIAL_BOOKS.find((b) => b.id === activeSlide.bookId || b.slug === activeSlide.slug) || INITIAL_BOOKS[0];

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

  const featuredBooks = INITIAL_BOOKS.filter((b) => b.is_featured);
  const filteredBooks = activeCollection === 'all' 
    ? featuredBooks 
    : INITIAL_BOOKS.filter((b) => b.collection === activeCollection);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION AVEC CARROUSEL DES 7 COLLECTIONS */}
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
                La Maison du Succès pour vos Examens et <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 bg-clip-text text-transparent">Évaluations</span>.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Explorez nos activités d'évaluation, annales méthodologiques (BEPC, BAC), guides pratiques et créations littéraires. Feuilletez des extraits en 3D et commandez en direct via WhatsApp.
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
                  href="/extraits"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Feuilleter en 3D (Flipbook)</span>
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

            {/* Colonne Droite : CARROUSEL HERO DES 7 COLLECTIONS DANS L'ORDRE */}
            <div 
              className="lg:col-span-6 relative flex flex-col items-center"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Pills Sélecteurs des 7 Collections (Ordre Strict) */}
              <div className="w-full max-w-lg mb-3 flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px] font-bold">
                {heroCarouselSlides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`px-2 py-1 rounded-md transition-all whitespace-nowrap ${
                      currentSlide === idx
                        ? 'bg-amber-400 text-slate-950 font-black shadow-xs scale-105'
                        : 'bg-slate-800/70 text-slate-400 hover:text-white'
                    }`}
                  >
                    {idx + 1}. {slide.shortName}
                  </button>
                ))}
              </div>

              {/* Carte Slide Active avec effets 3D et Couverture */}
              <div className="w-full max-w-lg relative bg-slate-900/90 rounded-3xl border border-slate-700/80 p-5 sm:p-7 shadow-2xl overflow-hidden backdrop-blur-md transition-all">
                {/* Flèches de navigation */}
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-amber-500 text-white hover:text-slate-950 border border-slate-700 flex items-center justify-center transition-all shadow-md"
                  aria-label="Collection précédente"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-amber-500 text-white hover:text-slate-950 border border-slate-700 flex items-center justify-center transition-all shadow-md"
                  aria-label="Collection suivante"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                  {/* Visuel Couverture */}
                  <div className="sm:col-span-5 flex justify-center">
                    <div 
                      onClick={() => setFlipbookBook(currentSlideBook)}
                      className="relative w-36 sm:w-40 aspect-3/4 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 cursor-pointer group transform hover:scale-105 transition-transform"
                    >
                      <img
                        src={activeSlide.cover}
                        alt={activeSlide.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="p-2 rounded-full bg-amber-500 text-slate-950 shadow-lg">
                          <Eye className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Infos de la Collection et de l'Ouvrage */}
                  <div className="sm:col-span-7 space-y-2.5 text-left">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-sm ${activeSlide.tagColor}`}>
                        {activeSlide.badge}
                      </span>
                      <span className="text-[10px] font-mono text-amber-300">
                        {currentSlide + 1} / {heroCarouselSlides.length}
                      </span>
                    </div>

                    <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                      {activeSlide.collectionName}
                    </h3>

                    <h4 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2">
                      {activeSlide.title}
                    </h4>

                    <p className="text-[11px] text-slate-300 line-clamp-2">
                      {activeSlide.subtitle}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setFlipbookBook(currentSlideBook)}
                        className="py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Feuilleter en 3D</span>
                      </button>

                      <Link
                        href={`/catalogue?collection=${encodeURIComponent(activeSlide.collectionName)}`}
                        className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                      >
                        Voir la collection
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Progress bar indicateur en bas de carte */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Ordre officiel : Archives → École et Métiers → Jeune Citoyen → Succès → Polyglotte → Racines → Papyrus</span>
                  <span className="font-mono text-amber-400">{currentSlide + 1}/7</span>
                </div>
              </div>
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

      {/* EXPLORER PAR COLLECTION (MÊME ORDRE STRICT) */}
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
            <span>Voir tout le catalogue ({INITIAL_BOOKS.length} parutions)</span>
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
                href="/extraits"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
              >
                Feuilleter des extraits
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Liseuse Flipbook si activée depuis le carrousel */}
      {flipbookBook && (
        <BookFlipbook
          book={flipbookBook}
          onClose={() => setFlipbookBook(null)}
        />
      )}
    </div>
  );
}
