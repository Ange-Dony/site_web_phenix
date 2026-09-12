'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Download, 
  FileText, 
  Search, 
  Filter, 
  BookOpen, 
  Sparkles,
  CheckCircle2,
  FileCode,
  FileCheck
} from 'lucide-react';
import { INITIAL_CORRIGES, INITIAL_BOOKS } from '@/lib/initial-data';
import { getCorriges } from '@/lib/supabase';
import { Corrige } from '@/types';

export default function CorrigesPage() {
  const [corriges, setCorriges] = useState<Corrige[]>(INITIAL_CORRIGES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');

  useEffect(() => {
    getCorriges().then((data) => {
      if (data && data.length > 0) setCorriges(data);
    });
  }, []);

  const subjects = [
    { id: 'all', name: 'Toutes les matières' },
    { id: 'Histoire-Géographie', name: 'Histoire-Géographie' },
    { id: 'Mathématiques', name: 'Mathématiques' },
    { id: 'Philosophie', name: 'Philosophie' },
    { id: 'Physique-Chimie', name: 'Physique-Chimie' },
    { id: 'Anglais', name: 'Anglais' },
    { id: 'Français', name: 'Français' },
    { id: 'CMC / Tertiaire', name: 'CMC / Tertiaire' },
  ];

  const levels = [
    { id: 'all', name: 'Tous les niveaux' },
    { id: 'Collège', name: 'Collège (6e à 3e - BEPC)' },
    { id: 'Lycée', name: 'Lycée (2nde à Terminale - BAC)' },
  ];

  const filteredCorriges = useMemo(() => {
    return corriges.filter((corrige) => {
      const matchSearch =
        corrige.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        corrige.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        corrige.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (corrige.description && corrige.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchSubject =
        selectedSubject === 'all' || corrige.subject === selectedSubject;

      const matchLevel =
        selectedLevel === 'all' ||
        (selectedLevel === 'Collège' && (corrige.level.includes('6') || corrige.level.includes('5') || corrige.level.includes('4') || corrige.level.includes('3') || corrige.level.includes('BEPC') || corrige.level.includes('Collège'))) ||
        (selectedLevel === 'Lycée' && (corrige.level.includes('Terminale') || corrige.level.includes('BAC') || corrige.level.includes('2nde') || corrige.level.includes('1ère')));

      const matchFormat =
        selectedFormat === 'all' || corrige.file_type === selectedFormat;

      return matchSearch && matchSubject && matchLevel && matchFormat;
    });
  }, [searchTerm, selectedSubject, selectedLevel, selectedFormat]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Accès Libre & Gratuit</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight leading-tight">
            Espace de Téléchargement des Corrigés Officiels
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Retrouvez les corrigés modèles, fiches d'évaluation et solutions rédigées pour les manuels et annales d'examens des <strong>Éditions Phénix</strong>. Disponibles en formats <strong>PDF</strong> et <strong>Word (.docx)</strong>.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par matière, livre ou niveau..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Subject */}
          <div className="md:col-span-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-600 bg-white"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div className="md:col-span-2">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-600 bg-white"
            >
              {levels.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.name}
                </option>
              ))}
            </select>
          </div>

          {/* Format (PDF/Word) */}
          <div className="md:col-span-2">
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-600 bg-white"
            >
              <option value="all">Tous formats</option>
              <option value="pdf">Format PDF (.pdf)</option>
              <option value="docx">Format Word (.docx)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            {filteredCorriges.length} corrigé{filteredCorriges.length > 1 ? 's' : ''} disponible{filteredCorriges.length > 1 ? 's' : ''}
          </span>
          {(searchTerm || selectedSubject !== 'all' || selectedLevel !== 'all' || selectedFormat !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSubject('all');
                setSelectedLevel('all');
                setSelectedFormat('all');
              }}
              className="text-emerald-700 hover:underline font-semibold"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {/* Corrigés List */}
      <div className="space-y-4">
        {filteredCorriges.length > 0 ? (
          filteredCorriges.map((corrige) => {
            const linkedBook = INITIAL_BOOKS.find((b) => b.id === corrige.book_id);

            return (
              <div
                key={corrige.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-400 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  {/* Icon format */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    corrige.file_type === 'pdf' 
                      ? 'bg-red-50 text-red-600' 
                      : 'bg-blue-50 text-blue-600'
                  }`}>
                    {corrige.file_type === 'pdf' ? (
                      <FileText className="w-6 h-6 stroke-[1.8]" />
                    ) : (
                      <FileCheck className="w-6 h-6 stroke-[1.8]" />
                    )}
                  </div>

                  {/* Information */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md">
                        {corrige.subject}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {corrige.level}
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                        corrige.file_type === 'pdf'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {corrige.file_type}
                      </span>
                      {corrige.file_size && (
                        <span className="text-xs text-slate-400">
                          {corrige.file_size}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {corrige.title}
                    </h3>

                    {corrige.description && (
                      <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                        {corrige.description}
                      </p>
                    )}

                    {linkedBook && (
                      <div className="pt-1 text-xs text-slate-500">
                        Ouvrage lié :{' '}
                        <Link
                          href={`/catalogue/${linkedBook.slug}`}
                          className="font-bold text-amber-800 hover:underline inline-flex items-center gap-1"
                        >
                          <BookOpen className="w-3 h-3" /> {linkedBook.title}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-3 sm:self-center shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <a
                    href={corrige.file_url}
                    download={corrige.file_name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger ({corrige.file_type.toUpperCase()})</span>
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              Aucun document ne correspond à votre recherche
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Vérifiez l'orthographe ou réinitialisez les filtres.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSubject('all');
                setSelectedLevel('all');
                setSelectedFormat('all');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors"
            >
              Voir tous les corrigés
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
