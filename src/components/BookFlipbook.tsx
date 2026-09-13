'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  RotateCcw,
  Sparkles,
  Download,
  Phone
} from 'lucide-react';
import { Book } from '@/types';

interface BookFlipbookProps {
  book: Book;
  onClose?: () => void;
}

export default function BookFlipbook({ book, onClose }: BookFlipbookProps) {
  // Mode son de feuilletage
  const [soundEnabled, setSoundEnabled] = useState(true);
  // Mode plein écran
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Zoom
  const [zoomLevel, setZoomLevel] = useState(1);
  // Page actuelle (index basé sur 0). Sur grand écran, on avance par 2 (spread)
  const [currentPage, setCurrentPage] = useState(0);
  // Animation en cours
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Génération ou récupération des pages d'extrait
  // Si le livre a des images d'extraits configurées, on les utilise, sinon on génère un bel extrait pédagogique
  const pages = book.extract_pages && book.extract_pages.length > 0
    ? [book.cover_url, ...book.extract_pages]
    : [
        book.cover_url, // Page 1: Couverture officielle
        '__generated_intro__', // Page 2: Fiche & Mot des Auteurs
        '__generated_sommaire__', // Page 3: Sommaire & Organisation APC
        '__generated_methodo__', // Page 4: Fiche Méthodologique & Conseils
        '__generated_activite1__', // Page 5: Situation d'Évaluation Type
        '__generated_activite2__', // Page 6: Sujet Guidé & Barème d'Examen
      ];

  const totalPages = pages.length;

  // Jouer un son de papier réaliste grâce au Web Audio API
  const playPageFlipSound = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Génération d'un bruit blanc filtré imitant le froissement du papier
      const bufferSize = ctx.sampleRate * 0.15; // 150ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      setTimeout(() => {
        try { ctx.close(); } catch {}
      }, 200);
    } catch {
      // Ignorer si audio non autorisé
    }
  };

  // Naviguer vers la page suivante
  const goToNextPage = () => {
    if (currentPage >= totalPages - 1 || isFlipping) return;
    setIsFlipping(true);
    setFlipDirection('next');
    playPageFlipSound();

    setTimeout(() => {
      setCurrentPage((prev) => Math.min(prev + 2, totalPages - 1));
      setIsFlipping(false);
      setFlipDirection(null);
    }, 400);
  };

  // Naviguer vers la page précédente
  const goToPrevPage = () => {
    if (currentPage <= 0 || isFlipping) return;
    setIsFlipping(true);
    setFlipDirection('prev');
    playPageFlipSound();

    setTimeout(() => {
      setCurrentPage((prev) => Math.max(prev - 2, 0));
      setIsFlipping(false);
      setFlipDirection(null);
    }, 400);
  };

  // Gestion des touches du clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft') {
        goToPrevPage();
      } else if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isFlipping, totalPages]);

  // Plein écran
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Rendu d'une page
  const renderPageContent = (pageIndex: number, isRightPage: boolean) => {
    if (pageIndex >= totalPages || pageIndex < 0) {
      return (
        <div className="w-full h-full bg-amber-50/50 flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <BookOpen className="w-12 h-12 mb-3 text-amber-200" />
          <p className="text-xs font-serif italic">Fin de l'extrait de découverte</p>
          <p className="text-[11px] text-slate-400 mt-2">
            Procurez-vous l'ouvrage complet aux Éditions Phénix.
          </p>
        </div>
      );
    }

    const content = pages[pageIndex];

    // Si c'est une image (couverture ou page scannée)
    if (typeof content === 'string' && (content.startsWith('/') || content.startsWith('http'))) {
      return (
        <div className="w-full h-full relative bg-white flex items-center justify-center p-2 sm:p-4 overflow-hidden shadow-inner">
          <img
            src={content}
            alt={`${book.title} - Page ${pageIndex + 1}`}
            className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-mono">
            {pageIndex + 1}
          </div>
        </div>
      );
    }

    // Page de contenu simulé riche pour l'extrait (conforme aux activités & programmes)
    if (content === '__generated_intro__') {
      return (
        <div className="w-full h-full bg-[#faf8f5] p-6 sm:p-8 flex flex-col justify-between text-slate-800 font-serif leading-relaxed select-none">
          <div className="space-y-4">
            <div className="border-b-2 border-amber-800/20 pb-3">
              <span className="text-[10px] font-sans font-black tracking-widest text-amber-800 uppercase">
                LES ÉDITIONS PHÉNIX — EXTRAIT DE DÉCOUVERTE
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1 leading-tight">
                {book.title}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 font-sans">
                <span className="px-2 py-0.5 rounded-sm bg-amber-100 font-bold text-amber-900 text-[10px]">
                  {book.level || 'Tous Niveaux'}
                </span>
                <span>• {book.collection || 'Collection Succès'}</span>
              </div>
            </div>

            <div className="text-xs space-y-3 pt-2">
              <h3 className="font-bold text-slate-900 font-sans uppercase text-[11px] tracking-wider text-amber-800">
                Note de l'Équipe Pédagogique
              </h3>
              <p className="text-justify text-slate-700">
                Cet ouvrage a été pensé et conçu par un collectif de professeurs certifiés et d'inspecteurs de l'enseignement secondaire pour répondre aux exigences strictes de l'Approche Par les Compétences (APC).
              </p>
              <p className="text-justify text-slate-700">
                Chaque chapitre s'articule autour de rappels méthodologiques, d'activités d'évaluation progressives et de situations concrètes permettant à l'élève d'ancrer durablement ses réflexes d'examen.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] font-sans text-slate-400">
            <span>Les Éditions Phénix — La Maison du Succès</span>
            <span className="font-mono">{pageIndex + 1}</span>
          </div>
        </div>
      );
    }

    if (content === '__generated_sommaire__') {
      return (
        <div className="w-full h-full bg-[#faf8f5] p-6 sm:p-8 flex flex-col justify-between text-slate-800 font-serif select-none">
          <div className="space-y-4">
            <div className="border-b border-amber-900/10 pb-2">
              <span className="text-xs font-sans font-bold text-amber-800 uppercase tracking-wider">
                Table des Matières & Progression
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1">
                <span className="font-bold">Partie 1 : Méthodologie Générale & Conseils d'Examen</span>
                <span className="font-mono text-slate-500">p. 07</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1">
                <span>• Module 1 : Analyse des consignes et barèmes officiels</span>
                <span className="font-mono text-slate-500">p. 14</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1">
                <span className="font-bold">Partie 2 : Activités d'Évaluation & Situations Problèmes</span>
                <span className="font-mono text-slate-500">p. 25</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1">
                <span>• Module 2 : Entraînement guidé avec amorces de corrigés</span>
                <span className="font-mono text-slate-500">p. 52</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1">
                <span className="font-bold">Partie 3 : Annales & Sujets Types Session 2025</span>
                <span className="font-mono text-slate-500">p. 88</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1">
                <span>• Module 3 : Sujets d'examen blancs complets chronométrés</span>
                <span className="font-mono text-slate-500">p. 134</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] font-sans text-slate-400">
            <span>Sommaire Analytique</span>
            <span className="font-mono">{pageIndex + 1}</span>
          </div>
        </div>
      );
    }

    if (content === '__generated_methodo__') {
      return (
        <div className="w-full h-full bg-[#faf8f5] p-6 sm:p-8 flex flex-col justify-between text-slate-800 font-serif select-none">
          <div className="space-y-3">
            <div className="bg-amber-100/70 p-3 rounded-lg border border-amber-300/60 font-sans">
              <span className="text-[10px] font-bold text-amber-900 uppercase">Fiche Clé N°1</span>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">
                La Démarche de Résolution en Évaluation Continue
              </h3>
            </div>

            <div className="text-xs space-y-2 text-justify text-slate-700 leading-relaxed">
              <p>
                <strong>Étape 1 : Décoder le contexte.</strong> L'élève doit repérer avec précision le lieu, les acteurs et l'enjeu posé par la situation d'évaluation.
              </p>
              <p>
                <strong>Étape 2 : Mobiliser les connaissances ressources.</strong> Il ne s'agit pas de réciter passivement la leçon, mais de sélectionner les concepts exacts pour résoudre la tâche demandée.
              </p>
              <p>
                <strong>Étape 3 : Structurer sa réponse.</strong> Organiser les arguments par paragraphe avec des connecteurs logiques clairs.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 font-sans text-[11px] text-emerald-900">
              💡 <strong>Astuce Phénix :</strong> Les corrigés complets étape par étape de chaque exercice sont disponibles gratuitement en PDF sur notre site web !
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] font-sans text-slate-400">
            <span>Méthodologie Phénix</span>
            <span className="font-mono">{pageIndex + 1}</span>
          </div>
        </div>
      );
    }

    // Par défaut, page d'activité type
    return (
      <div className="w-full h-full bg-[#faf8f5] p-6 sm:p-8 flex flex-col justify-between text-slate-800 font-serif select-none">
        <div className="space-y-4">
          <div className="border-b border-amber-800/20 pb-2 flex justify-between items-center font-sans">
            <span className="text-[10px] font-bold text-amber-800 uppercase">
              Activité d'Évaluation Type
            </span>
            <span className="text-[10px] text-slate-500 font-bold">Barème : 20 pts</span>
          </div>

          <div className="space-y-3 text-xs leading-relaxed">
            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs text-slate-700">
              <h4 className="font-bold text-slate-900 font-sans text-[11px] mb-1">
                Situation d'apprentissage :
              </h4>
              <p className="italic">
                « Pendant les révisions pour l'examen blanc, un groupe d'élèves constate des difficultés à interpréter les données d'un document historique et sollicite votre contribution méthodique... »
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <p className="font-bold font-sans text-slate-900 text-[11px]">Consignes :</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-700">
                <li>Identifier la nature et l'idée générale du document présenté. (4 pts)</li>
                <li>Expliquer deux causes majeures liées à l'événement en vous appuyant sur vos cours. (8 pts)</li>
                <li>Proposer une appréciation critique argumentée en 8 lignes maximum. (8 pts)</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] font-sans text-slate-400">
          <span>{book.title.slice(0, 30)}...</span>
          <span className="font-mono">{pageIndex + 1}</span>
        </div>
      </div>
    );
  };

  const leftPageIndex = currentPage;
  const rightPageIndex = currentPage + 1;

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-between p-2 sm:p-6 text-white ${
        isFullscreen ? 'w-screen h-screen' : ''
      }`}
    >
      {/* Top Bar Header */}
      <div className="w-full max-w-5xl flex items-center justify-between py-2 px-4 bg-slate-900/80 rounded-2xl border border-slate-800 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
              {book.title}
            </h3>
            <p className="text-[11px] text-amber-400 font-medium">
              Extrait interactif à feuilleter • {book.collection || 'Les Éditions Phénix'}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* Son ON / OFF */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={soundEnabled ? 'Désactiver le son du papier' : 'Activer le son du papier'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Zoom */}
          <button
            onClick={() => setZoomLevel((z) => (z >= 1.3 ? 1 : z + 0.15))}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors hidden sm:flex"
            title="Agrandir / Zoom"
          >
            {zoomLevel > 1 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>

          {/* Plein écran */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Plein écran"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Fermer */}
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition-colors ml-2"
            >
              Fermer
            </button>
          )}
        </div>
      </div>

      {/* Main Book Flip Container with 3D perspective */}
      <div className="flex-1 w-full max-w-5xl flex items-center justify-center relative overflow-hidden py-2">
        {/* Flèche Gauche */}
        <button
          onClick={goToPrevPage}
          disabled={currentPage <= 0 || isFlipping}
          className={`absolute left-2 sm:left-4 z-30 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-slate-900/90 hover:bg-amber-600 border border-slate-700 text-white flex items-center justify-center transition-all shadow-xl hover:scale-110 ${
            currentPage <= 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-90'
          }`}
          title="Page précédente (Flèche gauche)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Flèche Droite */}
        <button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages - 1 || isFlipping}
          className={`absolute right-2 sm:right-4 z-30 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-slate-900/90 hover:bg-amber-600 border border-slate-700 text-white flex items-center justify-center transition-all shadow-xl hover:scale-110 ${
            currentPage >= totalPages - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-90'
          }`}
          title="Page suivante (Flèche droite)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* 3D Realistic Book Stage */}
        <div 
          className="relative transition-transform duration-300 flex items-center justify-center shadow-2xl"
          style={{ 
            transform: `scale(${zoomLevel})`,
            perspective: '2000px',
            width: '100%',
            maxWidth: '900px',
            height: '100%',
            maxHeight: '580px',
          }}
        >
          {/* Book Spine Center Shadow */}
          <div className="absolute top-0 bottom-0 left-1/2 w-8 -ml-4 z-20 pointer-events-none hidden sm:block bg-gradient-to-r from-black/25 via-black/40 to-black/25 shadow-2xl" />

          {/* Dual Page Book Spreads for Desktop, Single page for Mobile */}
          <div className="w-full h-full flex flex-col sm:flex-row bg-[#2b2b2b] rounded-2xl p-1.5 sm:p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-slate-700">
            {/* Left Page (ou Page Seule sur petit écran) */}
            <div 
              onClick={goToPrevPage}
              className={`flex-1 h-full rounded-l-xl overflow-hidden relative cursor-pointer border-r border-slate-300/40 bg-white transition-all duration-300 ${
                isFlipping && flipDirection === 'prev' ? 'brightness-90' : ''
              }`}
            >
              {renderPageContent(leftPageIndex, false)}
            </div>

            {/* Right Page (sur grand écran) */}
            <div 
              onClick={goToNextPage}
              className={`flex-1 h-full rounded-r-xl overflow-hidden relative cursor-pointer bg-white transition-all duration-300 hidden sm:block ${
                isFlipping && flipDirection === 'next' ? 'brightness-90' : ''
              }`}
            >
              {renderPageContent(rightPageIndex, true)}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="w-full max-w-5xl py-3 px-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 text-slate-300">
          <span className="font-semibold text-white">
            Pages {currentPage + 1} {rightPageIndex < totalPages ? ` - ${rightPageIndex + 1}` : ''}
          </span>
          <span className="text-slate-500">sur {totalPages}</span>

          <button
            onClick={() => {
              setCurrentPage(0);
              playPageFlipSound();
            }}
            className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 transition-colors ml-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Revenir au début</span>
          </button>
        </div>

        {/* Page progress scrub bar */}
        <div className="w-full sm:w-64 flex items-center gap-2">
          <input
            type="range"
            min="0"
            max={Math.max(totalPages - 1, 1)}
            step="2"
            value={currentPage}
            onChange={(e) => {
              setCurrentPage(parseInt(e.target.value));
              playPageFlipSound();
            }}
            className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Action directes : Commander le livre complet / Télécharger le corrigé */}
        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/2250718784093?text=${encodeURIComponent(`Bonjour, j'ai feuilleté l'extrait de "${book.title}" et je souhaite commander l'ouvrage complet.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Commander l'ouvrage complet</span>
          </a>

          <a
            href="/corriges"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-[11px] flex items-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Corrigé gratuit</span>
          </a>
        </div>
      </div>
    </div>
  );
}
