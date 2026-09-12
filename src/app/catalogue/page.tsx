'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, BookOpen, SlidersHorizontal } from 'lucide-react';
import BookCard from '@/components/BookCard';
import { INITIAL_BOOKS } from '@/lib/initial-data';
import { getBooks } from '@/lib/supabase';
import { Book } from '@/types';

export default function CataloguePage() {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    getBooks().then((data) => {
      if (data && data.length > 0) setBooks(data);
    });
  }, []);

  const collections = [
    { id: 'all', name: 'Toutes les collections' },
    { id: 'Collection Succès', name: 'Collection Succès (Annales)' },
    { id: 'Collection Archives', name: 'Collection Archives (Histoire-Géo)' },
    { id: 'Collection Polyglotte', name: 'Collection Polyglotte (Anglais)' },
    { id: 'Collection Papyrus', name: 'Collection Papyrus (Littérature)' },
    { id: 'Collection École et Métiers', name: 'École & Métiers (CMC)' },
    { id: 'Collection Racines', name: 'Collection Racines (Français)' },
  ];

  const levels = [
    { id: 'all', name: 'Tous les niveaux' },
    { id: 'Collège', name: 'Collège (6e à 3e - BEPC)' },
    { id: 'Lycée', name: 'Lycée (2nde à Terminale - BAC)' },
    { id: 'Littérature', name: 'Littérature / Tout public' },
  ];

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.collection && book.collection.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCollection =
        selectedCollection === 'all' || book.collection === selectedCollection;

      const matchLevel =
        selectedLevel === 'all' ||
        (selectedLevel === 'Collège' && (book.level?.includes('6') || book.level?.includes('5') || book.level?.includes('4') || book.level?.includes('3') || book.level?.includes('BEPC') || book.level?.includes('Collège'))) ||
        (selectedLevel === 'Lycée' && (book.level?.includes('2nde') || book.level?.includes('1ère') || book.level?.includes('1ere') || book.level?.includes('Terminale') || book.level?.includes('BAC') || book.level?.includes('Lycée') || book.level?.includes('Première') || book.level?.includes('Seconde'))) ||
        (selectedLevel === 'Littérature' && (book.category?.includes('Littérature') || book.level?.includes('public')));

      return matchSearch && matchCollection && matchLevel;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [searchTerm, selectedCollection, selectedLevel, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-amber-700 mb-1">
          <BookOpen className="w-4 h-4" /> Catalogue Officiel — La Maison du Succès
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-slate-900">
          Nos Activités d'Évaluation, Annales & Guides
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl mt-1">
          Explorez l'ensemble des titres édités par <strong>Les Éditions Phénix</strong> : cahiers d'activités d'évaluation, guides méthodologiques, annales d'examens (BEPC, BAC) et œuvres littéraires.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par titre, auteur, matière..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Collection Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-amber-600 bg-white"
            >
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-amber-600 bg-white"
            >
              {levels.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-amber-600 bg-white"
            >
              <option value="default">Tri par défaut</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="title">Titre alphabétique</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            {filteredBooks.length} ouvrage{filteredBooks.length > 1 ? 's' : ''} trouvé{filteredBooks.length > 1 ? 's' : ''}
          </span>
          {(searchTerm || selectedCollection !== 'all' || selectedLevel !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCollection('all');
                setSelectedLevel('all');
                setSortBy('default');
              }}
              className="text-amber-700 hover:underline font-semibold"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            Aucun ouvrage ne correspond à vos critères
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Essayez de modifier vos filtres ou effectuez une recherche plus large.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCollection('all');
              setSelectedLevel('all');
            }}
            className="px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-bold hover:bg-amber-900 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
