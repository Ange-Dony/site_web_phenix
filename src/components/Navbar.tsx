'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  FileText, 
  ShoppingCart, 
  Menu, 
  X, 
  Phone, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();

  const navLinks: { name: string; href: string; highlight?: boolean }[] = [
    { name: 'Accueil', href: '/' },
    { name: 'Catalogue', href: '/catalogue' },
    { name: 'Corrigés', href: '/corriges' },
    { name: 'Espace Revendeurs', href: '/revendeurs' },
    { name: 'À Propos', href: '/a-propos' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs transition-all">
      {/* Top micro-bar */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-amber-50 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Les Éditions Phénix — La Maison du Succès | Évaluations, Annales & Corrigés Officiels</span>
          </div>
          <div className="flex items-center gap-4 hidden sm:flex">
            <Link
              href="/revendeurs"
              className="text-amber-300 hover:text-white transition-colors flex items-center gap-1 font-bold"
            >
              <span>Espace Revendeurs / Écoles</span>
            </Link>
            <a 
              href="https://wa.me/2250718784093" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-amber-200 transition-colors flex items-center gap-1 font-medium"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>Assistance : 07 18 78 40 93</span>
            </a>
            <Link 
              href="/admin/dashboard" 
              className="hover:text-amber-200 transition-colors flex items-center gap-1 opacity-70 hover:opacity-100"
              title="Espace Administrateur"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-13 h-13 rounded-xl overflow-hidden bg-white flex items-center justify-center p-0.5 shadow-sm border border-slate-200/80 group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="Les Éditions Phénix - La Maison du Succès"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-serif font-black tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors">
                LES ÉDITIONS PHÉNIX
              </span>
              <span className="text-[11px] font-bold tracking-wider uppercase text-amber-700">
                La Maison du Succès
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-amber-100/70 text-amber-900 shadow-xs'
                      : 'text-slate-700 hover:text-amber-800 hover:bg-amber-50/60'
                  }`}
                >
                  {link.highlight && (
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Cart & WhatsApp CTA */}
          <div className="flex items-center gap-3">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-amber-800 hover:border-amber-400 hover:bg-amber-50 transition-all flex items-center"
              aria-label="Voir le panier"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Quick WhatsApp order button */}
            <Link
              href="/commande"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm shadow-emerald-700/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Commander</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 md:hidden transition-colors"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                  active
                    ? 'bg-amber-100 text-amber-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/commande"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-xs"
            >
              Finaliser une commande WhatsApp
            </Link>
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium text-xs hover:bg-slate-50"
            >
              Administration du site
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
