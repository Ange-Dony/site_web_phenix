'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Phone, 
  CheckCircle2, 
  Download, 
  FileText, 
  BookOpen, 
  Share2, 
  Plus, 
  Minus,
  Sparkles
} from 'lucide-react';
import { INITIAL_BOOKS, INITIAL_CORRIGES } from '@/lib/initial-data';
import { useCart } from '@/lib/cart-context';
import BookCard from '@/components/BookCard';

export default function BookDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const book = INITIAL_BOOKS.find((b) => b.slug === slug);

  if (!book) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Livre introuvable</h1>
        <p className="text-sm text-slate-500 mb-6">
          L'ouvrage demandé n'existe pas ou a été déplacé.
        </p>
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-800 text-white font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Retour au catalogue
        </Link>
      </div>
    );
  }

  // Corrigés associés à ce livre
  const associatedCorriges = INITIAL_CORRIGES.filter(
    (c) => c.book_id === book.id || c.title.toLowerCase().includes(book.title.toLowerCase().slice(0, 15))
  );

  // Livres similaires (même collection ou catégorie)
  const relatedBooks = INITIAL_BOOKS.filter(
    (b) => b.id !== book.id && (b.collection === book.collection || b.category === book.category)
  ).slice(0, 4);

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Bonjour Les Éditions Phénix - La Maison du Succès ! Je souhaite commander cet ouvrage :\n\n` +
      `📖 *${book.title}*\n` +
      `Quantité : ${quantity} exemplaire(s)\n` +
      `💰 Prix unitaire : ${book.price.toLocaleString('fr-FR')} FCFA\n` +
      `💵 Total : ${(book.price * quantity).toLocaleString('fr-FR')} FCFA\n` +
      `Auteur : ${book.author}\n` +
      `Collection : ${book.collection || 'Générale'}\n\n` +
      `Pouvez-vous me donner les détails pour la livraison et le règlement svp ?`
    );
    window.open(`https://wa.me/2250718784093?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back button */}
      <div>
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-amber-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour au catalogue
        </Link>
      </div>

      {/* Main Book Presentation Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: Big Book Cover */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-64 sm:w-80 aspect-3/4 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
              <img
                src={book.cover_url}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
            {book.collection && (
              <div className="mt-4 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                {book.collection}
              </div>
            )}
          </div>

          {/* Right: Info, Price, Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">
                  {book.category}
                </span>
                {book.level && (
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                    {book.level}
                  </span>
                )}
                {book.in_stock ? (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> En stock
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                    Sur commande
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 leading-tight">
                {book.title}
              </h1>

              <p className="text-sm font-medium text-slate-500 mt-2">
                Auteur(s) : <strong className="text-slate-800">{book.author}</strong>
              </p>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block">Prix unitaire</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900">
                    {book.price.toLocaleString('fr-FR')} FCFA
                  </span>
                  {book.old_price && (
                    <span className="text-sm text-slate-400 line-through">
                      {book.old_price.toLocaleString('fr-FR')} FCFA
                    </span>
                  )}
                </div>
              </div>

              {book.old_price && (
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-lg">
                  Économisez {(book.old_price - book.price).toLocaleString('fr-FR')} FCFA
                </span>
              )}
            </div>

            {/* Synopsis / Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Description & Présentation Pédagogique
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Technical details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
              {book.isbn && (
                <div>
                  <span className="text-slate-400 block">ISBN</span>
                  <span className="font-semibold text-slate-800">{book.isbn}</span>
                </div>
              )}
              {book.page_count && (
                <div>
                  <span className="text-slate-400 block">Pagination</span>
                  <span className="font-semibold text-slate-800">{book.page_count} pages</span>
                </div>
              )}
              {book.published_year && (
                <div>
                  <span className="text-slate-400 block">Année d'édition</span>
                  <span className="font-semibold text-slate-800">{book.published_year}</span>
                </div>
              )}
            </div>

            {/* Action buttons (Quantity + Cart + WhatsApp) */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Quantity selector */}
                <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-sm text-slate-900 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => addToCart(book, quantity)}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-xl border-2 border-amber-700 text-amber-800 hover:bg-amber-50 font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Ajouter au panier ({quantity})</span>
                </button>
              </div>

              {/* Direct WhatsApp Order */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <Phone className="w-4 h-4" />
                <span>Commander immédiatement {quantity} exemplaire(s) sur WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Associated Corrigés Section */}
      {associatedCorriges.length > 0 && (
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-800">
            <Sparkles className="w-4 h-4 text-emerald-600" /> Corrigé Officiel Disponible
          </div>
          <h2 className="text-xl font-serif font-black text-slate-900">
            Téléchargez le corrigé gratuit associé à cet ouvrage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {associatedCorriges.map((corrige) => (
              <div
                key={corrige.id}
                className="bg-white p-4 rounded-2xl border border-emerald-200 flex items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {corrige.title}
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      Format {corrige.file_type.toUpperCase()} • {corrige.file_size}
                    </span>
                  </div>
                </div>
                <a
                  href={corrige.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-serif font-black text-slate-900">
            Dans la même collection ou matière
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedBooks.map((relBook) => (
              <BookCard key={relBook.id} book={relBook} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
