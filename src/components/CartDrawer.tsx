'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    totalPrice, 
    totalItems,
    clearCart 
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-800" />
              <h2 className="text-lg font-bold text-slate-900">
                Mon Panier d'Achat ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  Votre panier est vide
                </h3>
                <p className="text-sm text-slate-500 max-w-xs mb-6">
                  Découvrez notre catalogue de manuels, annales d'examens et œuvres littéraires.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-amber-800 text-white text-sm font-semibold hover:bg-amber-900 transition-colors"
                >
                  Explorer le catalogue
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 text-xs text-slate-500">
                  <span>Articles sélectionnés</span>
                  <button 
                    onClick={clearCart}
                    className="text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Vider le panier
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.book.id}
                    className="flex gap-4 p-3 rounded-xl border border-slate-100 hover:border-amber-200 bg-slate-50/50 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-16 h-22 rounded-md overflow-hidden bg-slate-200 shrink-0 shadow-xs">
                      <img
                        src={item.book.cover_url}
                        alt={item.book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                          {item.book.title}
                        </h4>
                        <p className="text-xs text-amber-800 font-medium mt-0.5">
                          {item.book.level || item.book.category}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity selector */}
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                          <button
                            onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                            className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-l-lg transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                            className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-r-lg transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-900">
                            {(item.book.price * item.quantity).toLocaleString('fr-FR')} FCFA
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-[10px] text-slate-400">
                              {item.book.price.toLocaleString('fr-FR')} F / unité
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.book.id)}
                      className="text-slate-400 hover:text-red-600 self-start p-1 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/80 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Sous-total</span>
                  <span>{totalPrice.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Frais de livraison</span>
                  <span className="text-emerald-700 font-medium">À convenir avec le vendeur</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total estimé</span>
                  <span className="text-amber-900 text-lg">
                    {totalPrice.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>

              <Link
                href="/commande"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Finaliser la commande sur WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-[11px] text-center text-slate-500">
                Commande directe et sans intermédiaire auprès du service commercial.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
