'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Sparkles, 
  Eye, 
  Search, 
  Filter, 
  Download, 
  Phone, 
  CheckCircle2, 
  ArrowRight,
  Volume2
} from 'lucide-react';
import { Book, CollectionItem, DisciplineItem } from '@/types';
import { getBooks, getCollections, getDisciplines } from '@/lib/supabase';
import BookFlipbook from '@/components/BookFlipbook';

export default function ExtraitsPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [disciplines, setDisciplines] = useState<DisciplineItem[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  useEffect(() => {
    async function load() {
      const bList = await getBooks();
      const cList = await getCollections();
      const dList = await getDisciplines();
      setBooks(bList);
      setCollections(cList);
      setDisciplines(dList);

      // Ouvrir par défaut le premier livre si le paramètre url le demande
      const params = new URLSearchParams(window.location.search);
      const bookSlug = params.get('livre');
      if (bookSlug) {
        const found = bList.find((b) => b.slug === bookSlug);
        if (found) setSelectedBook(found);
      }
    }
    load();
  }, []);

  // Filtrage des ouvrages
  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.collection && book.collection.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (book.level && book.level.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCollection = selectedCollection === 'all' || book.collection === selectedCollection;
    const matchesLevel = selectedLevel === 'all' || (book.level && book.level.includes(selectedLevel));

    return matchesSearch && matchesCollection && matchesLevel;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
          <span>Liseuse Virtuelle Interactive • Flipbook 3D</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-slate-900 tracking-tight leading-tight">
          Feuilletez les Extraits de nos Ouvrages
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Découvrez les activités d'évaluation, annales d'examens et guides méthodologiques des <strong>Éditions Phénix</strong> comme si vous aviez le livre entre vos mains, avec rotation 3D des pages et son réaliste de feuilletage.
        </p>
      </div>

      {/* Guide & Avantages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Lecture Immersive</h3>
            <p className="text-xs text-slate-500 mt-1">
              Tournez les pages d'un simple clic ou avec les flèches du clavier pour examiner la qualité éditoriale.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Son Réaliste de Papier</h3>
            <p className="text-xs text-slate-500 mt-1">
              Une ambiance de bibliothèque vivante avec effet sonore doux de froissement de page activable à volonté.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Corrigés Disponibles</h3>
            <p className="text-xs text-slate-500 mt-1">
              Retrouvez immédiatement le lien vers le corrigé officiel gratuit associé à chaque activité feuilletée.
            </p>
          </div>
        </div>
      </div>

      {/* Barre de Recherche & Filtres */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Recherche */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre, matière ou examen (ex: BEPC, BAC, HG, Philo)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-amber-600"
            />
          </div>

          {/* Filtre Collection */}
          <div className="md:col-span-3">
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-amber-600 bg-white"
            >
              <option value="all">Toutes les collections ({collections.length})</option>
              {collections.map((col) => (
                <option key={col.id} value={col.name}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre Niveau */}
          <div className="md:col-span-3">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-amber-600 bg-white"
            >
              <option value="all">Tous les niveaux scolaires</option>
              <option value="6ème">6ème</option>
              <option value="5ème">5ème</option>
              <option value="4ème">4ème</option>
              <option value="3ème">3ème (BEPC)</option>
              <option value="2nde">Seconde</option>
              <option value="1ère">Première</option>
              <option value="Terminale">Terminale (BAC)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grille des Ouvrages à Feuilleter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-amber-400 hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              {/* Cover with interactive badge */}
              <div 
                onClick={() => setSelectedBook(book)}
                className="relative aspect-3/4 bg-slate-100 cursor-pointer overflow-hidden p-4 flex items-center justify-center"
              >
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-white text-center gap-2 backdrop-blur-xs">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg transform group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">Feuilleter l'extrait</span>
                  <span className="text-[11px] text-amber-200">Animation 3D des pages</span>
                </div>

                {book.level && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-xs">
                    {book.level}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-700">
                    {book.collection || 'Les Éditions Phénix'}
                  </span>
                  {book.published_year && (
                    <span className="text-slate-400 font-mono">{book.published_year}</span>
                  )}
                </div>

                <h3 
                  onClick={() => setSelectedBook(book)}
                  className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2 cursor-pointer"
                >
                  {book.title}
                </h3>

                {book.author && (
                  <p className="text-xs text-slate-500">Par {book.author}</p>
                )}

                <p className="text-xs text-slate-600 line-clamp-2 pt-1 leading-relaxed">
                  {book.description}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 pt-0 border-t border-slate-100 mt-2 space-y-2">
              <button
                onClick={() => setSelectedBook(book)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span>Ouvrir & Feuilleter l'extrait (Flipbook)</span>
              </button>

              <div className="flex items-center gap-2 pt-1">
                <Link
                  href={`/catalogue/${book.slug}`}
                  className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold text-center transition-colors"
                >
                  Fiche complète
                </Link>
                <a
                  href={`https://wa.me/2250718784093?text=${encodeURIComponent(`Bonjour, je souhaite commander l'ouvrage "${book.title}".`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                  title="Commander sur WhatsApp"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Aucun extrait ne correspond à votre recherche</h3>
          <p className="text-xs text-slate-500 mt-1">
            Essayez de réinitialiser vos filtres ou effectuez une autre recherche.
          </p>
        </div>
      )}

      {/* Visionneuse Flipbook interactive si un livre est sélectionné */}
      {selectedBook && (
        <BookFlipbook 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
        />
      )}
    </div>
  );
}
