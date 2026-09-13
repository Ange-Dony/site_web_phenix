'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Phone, Eye, Sparkles, BookOpen } from 'lucide-react';
import { Book } from '@/types';
import { useCart } from '@/lib/cart-context';
import BookFlipbook from '@/components/BookFlipbook';

export default function BookCard({ book }: { book: Book }) {
  const { addToCart } = useCart();
  const [showFlipbook, setShowFlipbook] = useState(false);

  const generateSingleWhatsAppLink = (b: Book) => {
    const text = encodeURIComponent(
      `Bonjour Les Éditions Phénix - La Maison du Succès ! Je souhaite commander un exemplaire de cet ouvrage :\n\n` +
      `📖 *${b.title}*\n` +
      `💰 Prix : ${b.price.toLocaleString('fr-FR')} FCFA\n` +
      (b.author ? `Auteur : ${b.author}\n\n` : '\n') +
      `Pouvez-vous m'indiquer la disponibilité et les modalités de livraison svp ?`
    );
    return `https://wa.me/2250718784093?text=${text}`;
  };

  return (
    <>
      <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-amber-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
        {/* Cover image container */}
        <div className="relative aspect-3/4 w-full bg-slate-100 overflow-hidden flex items-center justify-center p-3">
          {/* Glow backdrop */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

          {/* Real book image */}
          <div className="relative w-full h-full shadow-md rounded-md overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Featured badge */}
          {book.is_featured && (
            <span className="absolute top-3 left-3 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-500 text-slate-950 shadow-md">
              <Sparkles className="w-3 h-3" /> Recommandé
            </span>
          )}

          {/* Collection badge */}
          {book.collection && (
            <span className="absolute bottom-3 left-3 z-20 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-900/80 backdrop-blur-md text-amber-200 border border-amber-400/30">
              {book.collection}
            </span>
          )}

          {/* Quick actions overlay */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/40 backdrop-blur-xs p-4">
            <button
              onClick={() => setShowFlipbook(true)}
              className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-transform hover:scale-105"
            >
              <BookOpen className="w-4 h-4" />
              <span>Feuilleter l'extrait</span>
            </button>
            <Link
              href={`/catalogue/${book.slug}`}
              className="w-full py-2 px-3 rounded-xl bg-white/90 hover:bg-white text-slate-900 font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-transform hover:scale-105"
            >
              <Eye className="w-4 h-4 text-amber-700" />
              <span>Fiche détaillée</span>
            </Link>
          </div>
        </div>

        {/* Book details */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-amber-800 font-medium mb-1">
              <span>{book.category}</span>
              {book.level && (
                <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                  {book.level}
                </span>
              )}
            </div>

            <Link href={`/catalogue/${book.slug}`}>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-2 leading-snug">
                {book.title}
              </h3>
            </Link>

            {book.author && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                Par {book.author}
              </p>
            )}
          </div>

          {/* Pricing & Actions */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-base font-black text-slate-900">
                  {book.price.toLocaleString('fr-FR')} FCFA
                </span>
                {book.old_price && (
                  <span className="text-xs text-slate-400 line-through">
                    {book.old_price.toLocaleString('fr-FR')} FCFA
                  </span>
                )}
              </div>
              {book.in_stock ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  En stock
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  Sur commande
                </span>
              )}
            </div>

            {/* Direct flip button */}
            <button
              onClick={() => setShowFlipbook(true)}
              className="w-full py-1.5 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors border border-amber-200/80"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>Feuilleter l'extrait (Flipbook 3D)</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => addToCart(book)}
                className="py-2 px-3 rounded-xl border border-amber-600 text-amber-800 hover:bg-amber-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Panier</span>
              </button>

              <a
                href={generateSingleWhatsAppLink(book)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs shadow-emerald-700/20 transition-all hover:scale-[1.02]"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Liseuse Flipbook si activée */}
      {showFlipbook && (
        <BookFlipbook
          book={book}
          onClose={() => setShowFlipbook(false)}
        />
      )}
    </>
  );
}
