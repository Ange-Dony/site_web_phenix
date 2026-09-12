'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Phone, Mail, MapPin, Download, Shield, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-red-600 flex items-center justify-center text-white shadow-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-serif font-black tracking-tight text-white">
                ÉDITIONS PHÉNIX
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Maison d'édition engagée pour l'excellence pédagogique, la réussite scolaire aux examens nationaux (BEPC, BAC) et le rayonnement des belles lettres africaines.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/2250700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-600 hover:text-white transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Service Commercial WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              Nos Collections Phares
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalogue?collection=Collection+Succès" className="hover:text-white hover:underline transition-colors">
                  Collection Succès (Annales & Méthodologie)
                </Link>
              </li>
              <li>
                <Link href="/catalogue?collection=Collection+Archives" className="hover:text-white hover:underline transition-colors">
                  Collection Archives (Histoire-Géographie)
                </Link>
              </li>
              <li>
                <Link href="/catalogue?collection=Collection+Polyglotte" className="hover:text-white hover:underline transition-colors">
                  Collection Polyglotte (Anglais & Oral)
                </Link>
              </li>
              <li>
                <Link href="/catalogue?collection=Collection+Papyrus" className="hover:text-white hover:underline transition-colors">
                  Collection Papyrus (Littérature & Romans)
                </Link>
              </li>
              <li>
                <Link href="/catalogue?collection=Collection+École+et+Métiers" className="hover:text-white hover:underline transition-colors">
                  Collection École & Métiers (Filières CMC)
                </Link>
              </li>
            </ul>
          </div>

          {/* Accès Rapides & Corrigés */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              Espace Pédagogique
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/corriges" className="flex items-center gap-1.5 text-amber-300 font-semibold hover:text-amber-200">
                  <Download className="w-3.5 h-3.5" /> Corrigés Gratuits (PDF / Word)
                </Link>
              </li>
              <li>
                <Link href="/catalogue" className="hover:text-white transition-colors">
                  Catalogue Complet des Livres
                </Link>
              </li>
              <li>
                <Link href="/commande" className="hover:text-white transition-colors">
                  Passer une Commande Groupée
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="hover:text-white transition-colors">
                  À Propos de la Maison
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Soumettre un Manuscrit
                </Link>
              </li>
            </ul>
          </div>

          {/* Coordonnées */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              Contact & Siège
            </h3>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Abidjan, Côte d'Ivoire</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+225 07 00 00 00 00</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>contact@editions-phenix.com</span>
              </div>
              <div className="pt-2">
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-amber-300 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Administration du site</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Éditions Phénix. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            <span>Conçu avec excellence pour les Éditions Phénix</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
