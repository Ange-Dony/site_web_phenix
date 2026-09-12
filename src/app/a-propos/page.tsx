import React from 'react';
import Link from 'next/link';
import { BookOpen, GraduationCap, Award, Users, HeartHandshake, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AProposPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Notre Histoire & Notre Vocation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-slate-900 leading-tight">
          Bâtir l'Avenir par le Livre et l'Excellence du Savoir
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Fondées avec la passion inaltérable de transmettre, les <strong>Éditions Phénix</strong> œuvrent chaque jour aux côtés de la communauté éducative, des enseignants, des élèves et des passionnés de littérature.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Rigueur & Programmes Officiels</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Chaque manuel et annale est élaboré en étroite concertation avec des inspecteurs généraux et des professeurs chevronnés, garantissant une parfaite conformité avec les programmes éducatifs en vigueur.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Corrigés & Pédagogie Ouverte</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Nous croyons qu'un bon manuel doit être accompagné d'outils d'évaluation fiables. C'est pourquoi nous mettons à disposition des corrigés types et détaillés en téléchargement libre.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-800 flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Promotion des Auteurs</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Au-delà des matières scolaires, nous valorisons la création littéraire contemporaine à travers des récits, romans et poésies qui éveillent l'imaginaire et la sensibilité de la jeunesse.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-slate-950 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <h2 className="text-2xl font-serif font-bold">Vous êtes enseignant ou auteur ?</h2>
          <p className="text-sm text-amber-200">
            Rejoignez notre comité de relecture ou soumettez-nous votre projet de manuel ou d'œuvre littéraire.
          </p>
        </div>
        <Link
          href="/contact"
          className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all shrink-0"
        >
          Nous Contacter
        </Link>
      </div>
    </div>
  );
}
