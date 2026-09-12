'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Phone, 
  MapPin, 
  User, 
  Mail, 
  FileText, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { saveOrder } from '@/lib/supabase';

export default function CommandePage() {
  const { cart, totalPrice, totalItems, updateQuantity, removeFromCart, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<{ code: string; message: string } | null>(null);

  // Numéro WhatsApp vendeur
  const sellerWhatsApp = '2250700000000';

  const generateOrderMessage = (orderCode: string) => {
    let msg = `🌟 *NOUVELLE COMMANDE - LES ÉDITIONS PHÉNIX*\n`;
    msg += `🏆 *La Maison du Succès*\n`;
    msg += `🔖 *Réf. Commande :* ${orderCode}\n\n`;
    msg += `👤 *INFORMATIONS DU CLIENT :*\n`;
    msg += `• *Nom :* ${customerName.trim()}\n`;
    msg += `• *Téléphone :* ${customerPhone.trim()}\n`;
    if (customerEmail) msg += `• *Email :* ${customerEmail.trim()}\n`;
    msg += `• *Ville / Commune :* ${deliveryCity.trim()}\n`;
    msg += `• *Adresse / Lieu :* ${deliveryAddress.trim()}\n`;
    if (notes) msg += `• *Remarques :* ${notes.trim()}\n`;

    msg += `\n📚 *ARTICLES COMMANDÉS :*\n`;
    cart.forEach((item, index) => {
      msg += `${index + 1}. *${item.book.title}*\n`;
      msg += `   👉 Quantité : ${item.quantity} x ${item.book.price.toLocaleString('fr-FR')} FCFA = ${(item.book.price * item.quantity).toLocaleString('fr-FR')} FCFA\n`;
    });

    msg += `\n💰 *MONTANT TOTAL ESTIMÉ :* *${totalPrice.toLocaleString('fr-FR')} FCFA*\n\n`;
    msg += `Merci de me confirmer la prise en charge et le délai de livraison.`;

    return msg;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerPhone || !deliveryCity || !deliveryAddress) {
      alert('Veuillez remplir tous les champs obligatoires (*)');
      return;
    }

    if (cart.length === 0) {
      alert('Votre panier est vide.');
      return;
    }

    setIsSubmitting(true);

    const orderCode = `PHX-${Date.now().toString().slice(-6)}`;
    const orderText = generateOrderMessage(orderCode);

    try {
      // Enregistrement silencieux dans Supabase
      await saveOrder({
        order_code: orderCode,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        delivery_city: deliveryCity,
        delivery_address: deliveryAddress,
        notes: notes,
        items: cart,
        total_amount: totalPrice,
        currency: 'FCFA',
        status: 'en_attente',
      });
    } catch {
      // Poursuivre même si Supabase n'est pas encore connecté
    }

    setOrderCompleted({
      code: orderCode,
      message: orderText,
    });

    setIsSubmitting(false);

    // Ouvrir WhatsApp avec le message pré-rempli
    const waUrl = `https://wa.me/${sellerWhatsApp}?text=${encodeURIComponent(orderText)}`;
    window.open(waUrl, '_blank');
  };

  if (orderCompleted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Commande transmise avec succès
          </span>
          <h1 className="text-3xl font-serif font-black text-slate-900">
            Merci pour votre commande !
          </h1>
          <p className="text-sm text-slate-600">
            Référence de commande : <strong className="text-amber-800 font-mono">{orderCompleted.code}</strong>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-left space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800">
            Votre message WhatsApp a été préparé :
          </h3>
          <pre className="text-xs bg-slate-50 p-4 rounded-xl text-slate-700 whitespace-pre-wrap font-sans border border-slate-100 max-h-60 overflow-y-auto">
            {orderCompleted.message}
          </pre>

          <a
            href={`https://wa.me/${sellerWhatsApp}?text=${encodeURIComponent(orderCompleted.message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>Rouvrir la discussion WhatsApp</span>
          </a>
        </div>

        <div className="pt-4 flex justify-center gap-4">
          <Link
            href="/catalogue"
            onClick={() => clearCart()}
            className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
          >
            Retourner au catalogue
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h1 className="text-2xl font-serif font-black text-slate-900">
          Votre Panier est Actuellement Vide
        </h1>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Vous n'avez pas encore sélectionné d'annales d'examen, d'activités d'évaluation ou de guides à commander.
        </p>
        <div className="pt-4">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-800 text-white font-bold text-sm hover:bg-amber-900 transition-colors shadow-md"
          >
            <span>Découvrir nos livres</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-emerald-700 mb-1">
          <Phone className="w-4 h-4" /> Tunnel de Commande
        </div>
        <h1 className="text-3xl font-serif font-black text-slate-900">
          Finaliser votre Commande via WhatsApp
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Renseignez vos coordonnées de livraison. Votre bon de commande sera transmis instantanément à nos équipes sur WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Formulaire Client */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmitOrder} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-amber-800" />
              <span>Vos Informations de Contact & Livraison</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom et Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex : Kouamé Jean-Marc"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Numéro de Téléphone (WhatsApp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ex : 07 00 00 00 00"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Adresse Email (optionnel)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Ex : jean@exemple.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ville ou Commune <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    placeholder="Ex : Abidjan - Cocody, Yopougon, Bouaké..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quartier / Repère précis <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Ex : Près de la Pharmacie Saint-Jean"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instructions de livraison ou commentaires
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex : Horaires préférés pour la livraison, commande pour un établissement scolaire..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Paiement à la livraison ou via Mobile Money</span>
              </div>
              <p className="text-amber-800">
                Vous conviendrez directement du mode de règlement (Wave, Orange Money, MTN Money, espèces à la livraison) avec notre vendeur sur WhatsApp.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              <Phone className="w-5 h-5" />
              <span>Transmettre ma commande sur WhatsApp</span>
            </button>
          </form>
        </div>

        {/* Récapitulatif du Panier */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-800" />
                <span>Articles ({totalItems})</span>
              </h2>
              <button
                onClick={clearCart}
                className="text-xs text-red-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Vider
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={item.book.id}
                  className="flex gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50"
                >
                  <img
                    src={item.book.cover_url}
                    alt={item.book.title}
                    className="w-14 h-18 object-cover rounded-md bg-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                        {item.book.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {item.book.level || item.book.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center border border-slate-200 rounded-md bg-white">
                        <button
                          onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                          className="p-0.5 text-slate-500 hover:text-slate-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                          className="p-0.5 text-slate-500 hover:text-slate-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-slate-900">
                        {(item.book.price * item.quantity).toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.book.id)}
                    className="text-slate-300 hover:text-red-600 p-1 self-start"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Sous-total livres</span>
                <span>{totalPrice.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Frais de livraison</span>
                <span className="text-emerald-700 font-medium">À convenir avec le vendeur</span>
              </div>
              <div className="flex justify-between text-lg font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total estimé</span>
                <span className="text-amber-900">
                  {totalPrice.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
