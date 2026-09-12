'use client';

import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';
import BookCard from '@/components/BookCard';
import { INITIAL_BOOKS, INITIAL_CORRIGES } from '@/lib/initial-data';

export default function HomePage() {
  const [activeCollection, setActiveCollection] = useState('all');

  const featuredBooks = INITIAL_BOOKS.filter((b) => b.is_featured);

  const collections = [
    { id: 'all', name: 'Tous les livres' },
    { id: 'Collection Succès', name: 'Collection Succès (Annales)' },
    { id: 'Collection Archives', name: 'Collection Archives (Histoire-Géo)' },
    { id: 'Collection Polyglotte', name: 'Collection Polyglotte (Anglais)' },
    { id: 'Collection Papyrus', name: 'Collection Papyrus (Littérature)' },
    { id: 'Collection École et Métiers', name: 'École & Métiers (CMC)' },
  ];

  const filteredBooks = activeCollection === 'all' 
    ? featuredBooks 
    : INITIAL_BOOKS.filter((b) => b.collection === activeCollection);

  const popularCorriges = INITIAL_CORRIGES.slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-950 via-slate-900 to-slate-950 text-white pt-12 pb-20 sm:py-24">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Les Éditions Phénix — La Maison du Succès</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-[1.15] text-white">
                La Maison du Succès pour vos Examens et <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 bg-clip-text text-transparent">Évaluations</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Découvrez les cahiers d'activités d'évaluation, annales méthodologiques (BEPC, BAC), guides pratiques et créations littéraires de <strong>Les Éditions Phénix</strong>. Téléchargez gratuitement les corrigés types et commandez vos ouvrages en direct via WhatsApp.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/catalogue"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Consulter le Catalogue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/corriges"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Télécharger les Corrigés</span>
                </Link>

                <a
                  href="https://wa.me/2250700000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Phone className="w-4 h-4" />
                  <span>Ventes WhatsApp</span>
                </a>
              </div>

              {/* Guarantees */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Évaluations ciblées</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Corrigés PDF & Word</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Expédition rapide</span>
                </div>
              </div>
            </div>

            {/* Right Showcase: 3D visual book presentation */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="relative w-72 sm:w-80 aspect-3/4 group">
                {/* Secondary book behind */}
                <div className="absolute -left-6 top-6 w-full h-full rounded-2xl bg-amber-900/40 border border-amber-500/20 shadow-2xl transform -rotate-6 transition-transform group-hover:-rotate-8">
                  <img
                    src="/covers/code-d-acces-annale-hg-tle.png"
                    alt="Annale HG Terminale"
                    className="w-full h-full object-cover rounded-2xl opacity-60"
                  />
                </div>

                {/* Primary featured book */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border-2 border-amber-500/30 transform group-hover:scale-105 transition-transform duration-300">
                  <img
                    src="/covers/code-d-acces-annale-hg-3e.png"
                    alt="Livre vedette Phénix"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      Ouvrage de Référence 2025
                    </span>
                    <h3 className="text-base font-bold text-white leading-tight">
                      Code d'Accès - Annale Histoire-Géo 3ème
                    </h3>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                      <span className="text-sm font-black text-amber-300">4 000 FCFA</span>
                      <Link
                        href="/catalogue/code-acces-annale-hg-3e"
                        className="text-xs bg-white text-slate-900 font-bold px-3 py-1 rounded-lg hover:bg-amber-300 transition-colors"
                      >
                        Commander
                      </Link>
                    </div>
                  </div>
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
            <div className="text-xs text-slate-600 font-medium mt-1">Corrigés Disponibles</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-900">6</div>
            <div className="text-xs text-slate-600 font-medium mt-1">Grandes Collections</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">0 F</div>
            <div className="text-xs text-slate-600 font-medium mt-1">Téléchargement Corrigé</div>
          </div>
        </div>
      </section>

      {/* SECTION CATALOGUE & COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-amber-700 flex items-center gap-1.5 mb-1">
              <BookMarked className="w-4 h-4" /> Notre Ligne Éditoriale
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
              Nos Livres Recommandés & Nouveautés
            </h2>
          </div>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-800 hover:text-amber-900 hover:underline"
          >
            <span>Voir tout le catalogue ({INITIAL_BOOKS.length} titres)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Collection Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => setActiveCollection(col.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCollection === col.id
                  ? 'bg-amber-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300'
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

        <div className="text-center mt-10">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-md transition-all hover:scale-105"
          >
            <span>Explorer tous les {INITIAL_BOOKS.length} livres du catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* SECTION CORRIGÉS & DOCUMENTS TÉLÉCHARGEABLES (Highlight) */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-white py-16 border-y border-amber-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left intro */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <Download className="w-3.5 h-3.5" />
                <span>Documents & Corrigés Gratuits</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 leading-tight">
                Téléchargez les Corrigés Officiels de nos Ouvrages
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Les Éditions Phénix mettent à la disposition des élèves, parents et enseignants les corrigés intégraux des exercices, dissertations et annales sous formats <strong>PDF</strong> et <strong>Word</strong>.
              </p>
              <div className="pt-2">
                <Link
                  href="/corriges"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.02]"
                >
                  <FileText className="w-4 h-4" />
                  <span>Accéder à tous les corrigés</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right list of corrigés */}
            <div className="lg:col-span-7 space-y-3">
              {popularCorriges.map((corrige) => (
                <div
                  key={corrige.id}
                  className="bg-white p-4 rounded-xl border border-slate-200/80 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                          {corrige.subject}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {corrige.level}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {corrige.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {corrige.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    <span className="text-[11px] font-medium text-slate-400 hidden md:inline">
                      {corrige.file_size}
                    </span>
                    <a
                      href={corrige.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW WHATSAPP ORDERING WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 mb-2">
            Simplicité & Rapidité
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
            Comment Commander vos Livres via WhatsApp ?
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Pas de démarches compliquées : commandez directement auprès de nos conseillers commerciaux en 3 étapes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Choisissez vos Livres
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Parcourez le catalogue et ajoutez les annales, cahiers d'activités d'évaluation ou guides souhaités à votre panier.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Génération du Message WhatsApp
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Cliquez sur "Commander sur WhatsApp". Un message pré-rempli avec le récapitulatif complet de vos livres et votre adresse est généré instantanément.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-lg mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Confirmation & Livraison
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Notre équipe commerciale confirme votre commande, convient avec vous du mode de paiement et organise la livraison ou le retrait.
            </p>
          </div>
        </div>

        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <h3 className="text-lg font-bold">Besoin d'une commande pour une école ou une librairie ?</h3>
            <p className="text-xs text-emerald-100 mt-1">
              Tarifs dégressifs et remises spéciales pour établissements scolaires et commandes en gros.
            </p>
          </div>
          <a
            href="https://wa.me/2250700000000?text=Bonjour,%20je%20suis%20un%20%C3%A9tablissement%20scolaire%20/%20librairie%20et%20je%20souhaite%20un%20devis%20de%20commande%20en%20gros."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50 transition-all shrink-0"
          >
            Demander un devis grossiste
          </a>
        </div>
      </section>
    </div>
  );
}
