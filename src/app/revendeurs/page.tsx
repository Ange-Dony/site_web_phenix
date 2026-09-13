'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Store, 
  GraduationCap, 
  Search, 
  CheckCircle2, 
  Phone, 
  FileSpreadsheet, 
  Plus, 
  Minus, 
  Trash2, 
  RotateCcw,
  Sparkles,
  Truck,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Book, CollectionItem, DisciplineItem, ResellerOrderItem } from '@/types';
import { getBooks, getCollections, getDisciplines, saveResellerOrder } from '@/lib/supabase';

export default function RevendeursPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [disciplines, setDisciplines] = useState<DisciplineItem[]>([]);

  // Filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Quantités sélectionnées par book_id : { [bookId: string]: number }
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Formulaire revendeur
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<{ orderCode: string; message: string; totalCopies: number } | null>(null);

  useEffect(() => {
    async function load() {
      const [b, c, d] = await Promise.all([getBooks(), getCollections(), getDisciplines()]);
      setBooks(b);
      setCollections(c);
      setDisciplines(d);
    }
    load();
  }, []);

  // Gestion des quantités
  const handleQuantityChange = (bookId: string, qty: number) => {
    const val = Math.max(0, qty);
    setQuantities((prev) => {
      const next = { ...prev };
      if (val === 0) {
        delete next[bookId];
      } else {
        next[bookId] = val;
      }
      return next;
    });
  };

  const addBulkQuantity = (bookId: string, amount: number) => {
    const current = quantities[bookId] || 0;
    handleQuantityChange(bookId, current + amount);
  };

  const clearAllQuantities = () => {
    if (window.confirm('Voulez-vous réinitialiser le point de votre commande ?')) {
      setQuantities({});
    }
  };

  // Liste des articles sélectionnés
  const selectedItems: ResellerOrderItem[] = Object.entries(quantities)
    .filter(([_, qty]) => qty > 0)
    .map(([bookId, qty]) => {
      const b = books.find((x) => x.id === bookId);
      return {
        book_id: bookId,
        title: b ? b.title : 'Ouvrage inconnu',
        collection: b?.collection,
        discipline: b?.category,
        level: b?.level,
        quantity: qty,
      };
    });

  const totalCopies = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalReferences = selectedItems.length;

  // Soumission de la commande revendeur
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      alert('Veuillez sélectionner au moins un exemplaire à commander.');
      return;
    }

    if (!companyName.trim() || !contactName.trim() || !phone.trim() || !city.trim()) {
      alert('Veuillez remplir les informations de votre établissement ou librairie.');
      return;
    }

    setIsSubmitting(true);
    const orderCode = `REV-${Date.now().toString().slice(-6)}`;

    // Construction du message WhatsApp SANS PRIX (Strictement le point des documents et quantités)
    let msg = `📦 *BON DE COMMANDE REVENDEUR / GROSSISTE*\n`;
    msg += `🏛️ *LES ÉDITIONS PHÉNIX — La Maison du Succès*\n`;
    msg += `🔖 *Réf. Commande :* ${orderCode}\n\n`;

    msg += `🏢 *IDENTIFICATION DE LA STRUCTURE :*\n`;
    msg += `• *Structure / Librairie / École :* ${companyName.trim()}\n`;
    msg += `• *Responsable :* ${contactName.trim()}\n`;
    msg += `• *Téléphone / WhatsApp :* ${phone.trim()}\n`;
    if (email) msg += `• *Email :* ${email.trim()}\n`;
    msg += `• *Ville / Commune :* ${city.trim()}\n`;
    if (address) msg += `• *Lieu de livraison / Quartier :* ${address.trim()}\n`;
    if (notes) msg += `• *Remarques :* ${notes.trim()}\n`;

    msg += `\n📋 *POINT DES DOCUMENTS SOUHAITÉS (${totalCopies} EXEMPLAIRES AU TOTAL) :*\n`;
    selectedItems.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.title}*\n`;
      msg += `   👉 Niveau : ${item.level || 'Tous'} | Collection : ${item.collection || 'Phénix'}\n`;
      msg += `   📦 *Quantité demandée :* *${item.quantity} exemplaires*\n`;
    });

    msg += `\n📊 *RÉCAPITULATIF DU POINT :*\n`;
    msg += `• Nombre d'ouvrages distincts : *${totalReferences}*\n`;
    msg += `• Volume global demandé : *${totalCopies} exemplaires*\n\n`;
    msg += `Merci de nous faire parvenir la facture proforma et de convenir des modalités de livraison.`;

    // Sauvegarde dans Supabase
    await saveResellerOrder({
      order_code: orderCode,
      company_name: companyName,
      contact_name: contactName,
      phone: phone,
      email: email,
      city: city,
      address: address,
      notes: notes,
      items: selectedItems,
      total_copies: totalCopies,
      status: 'en_attente',
    });

    setIsSubmitting(false);
    setSubmittedOrder({
      orderCode,
      message: msg,
      totalCopies,
    });

    // Ouverture automatique de WhatsApp
    const waUrl = `https://wa.me/2250718784093?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  // Filtrage des documents dans le tableau
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
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-12 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
            <Store className="w-3.5 h-3.5" />
            Espace Professionnel • Librairies, Écoles & Grossistes
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
            Bon de Commande & Point des Documents
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Bienvenue dans l'espace réservé aux établissements scolaires, librairies partenaires et revendeurs des <strong>Éditions Phénix</strong>. Sélectionnez vos volumes d'activités d'évaluation, annales et guides pour transmettre instantanément votre bordereau de commande sans intermédiaire.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Priorité d'approvisionnement</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Devis proforma personnalisé</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Expédition sur tout le territoire</span>
            </div>
          </div>
        </div>
      </div>

      {submittedOrder ? (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-emerald-200 shadow-lg text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-black text-slate-900">
              Bon de commande revendeur généré avec succès !
            </h2>
            <p className="text-xs font-mono text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-lg inline-block font-bold">
              RÉFÉRENCE : {submittedOrder.orderCode}
            </p>
            <p className="text-sm text-slate-600">
              Votre point de <strong>{submittedOrder.totalCopies} exemplaires</strong> a été préparé pour être transmis à la direction commerciale. Si WhatsApp ne s'est pas ouvert automatiquement, cliquez ci-dessous :
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs font-mono whitespace-pre-wrap max-h-56 overflow-y-auto">
            {submittedOrder.message}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={`https://wa.me/2250718784093?text=${encodeURIComponent(submittedOrder.message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Envoyer sur WhatsApp (07 18 78 40 93)</span>
            </a>

            <button
              onClick={() => {
                setSubmittedOrder(null);
                setQuantities({});
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
            >
              Nouveau bon de commande
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tableau de sélection du point des documents */}
          <div className="lg:col-span-8 space-y-6">
            {/* Barre de Recherche et Filtres */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une activité, annale ou matière..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:border-amber-600"
                  >
                    <option value="all">Toutes collections</option>
                    {collections.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:border-amber-600"
                  >
                    <option value="all">Tous niveaux</option>
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

            {/* Tableau du Point des Documents (SANS AUCUN PRIX) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-amber-700" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Bordereau des Documents ({filteredBooks.length} références disponibles)
                  </h2>
                </div>
                {totalReferences > 0 && (
                  <button
                    onClick={clearAllQuantities}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Réinitialiser</span>
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 max-h-[650px] overflow-y-auto">
                {filteredBooks.map((book) => {
                  const qty = quantities[book.id] || 0;
                  return (
                    <div 
                      key={book.id}
                      className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                        qty > 0 ? 'bg-amber-50/40 border-l-4 border-l-amber-500' : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Document info */}
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-16 rounded-md overflow-hidden bg-slate-100 shrink-0 border border-slate-200 p-0.5">
                          <img
                            src={book.cover_url}
                            alt={book.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700">
                              {book.level || 'Tous'}
                            </span>
                            <span className="text-[10px] font-medium text-amber-700">
                              {book.collection || 'Collection Succès'}
                            </span>
                          </div>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                            {book.title}
                          </h3>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {book.description}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex flex-col sm:items-end gap-2 shrink-0">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(book.id, qty - 1)}
                            disabled={qty <= 0}
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors disabled:opacity-30"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <input
                            type="number"
                            min="0"
                            value={qty || ''}
                            placeholder="0"
                            onChange={(e) => handleQuantityChange(book.id, parseInt(e.target.value) || 0)}
                            className="w-16 py-1 text-center font-bold text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-amber-600 bg-white"
                          />

                          <button
                            type="button"
                            onClick={() => handleQuantityChange(book.id, qty + 1)}
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Quick bulk volume buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => addBulkQuantity(book.id, 10)}
                            className="px-1.5 py-0.5 rounded-sm bg-slate-100 hover:bg-amber-100 text-[10px] font-bold text-slate-600 hover:text-amber-800 transition-colors"
                          >
                            +10
                          </button>
                          <button
                            type="button"
                            onClick={() => addBulkQuantity(book.id, 25)}
                            className="px-1.5 py-0.5 rounded-sm bg-slate-100 hover:bg-amber-100 text-[10px] font-bold text-slate-600 hover:text-amber-800 transition-colors"
                          >
                            +25
                          </button>
                          <button
                            type="button"
                            onClick={() => addBulkQuantity(book.id, 50)}
                            className="px-1.5 py-0.5 rounded-sm bg-slate-100 hover:bg-amber-100 text-[10px] font-bold text-slate-600 hover:text-amber-800 transition-colors"
                          >
                            +50
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Panier & Formulaire Revendeur (Sidebar) */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            {/* Sommaire du point */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-sm text-white">Point de la Commande</h3>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                  B2B
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[11px] text-slate-400 block font-medium">Références</span>
                  <span className="text-2xl font-black text-amber-400">{totalReferences}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[11px] text-slate-400 block font-medium">Total Exemplaires</span>
                  <span className="text-2xl font-black text-emerald-400">{totalCopies}</span>
                </div>
              </div>

              {/* Mini-liste des documents sélectionnés */}
              {selectedItems.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedItems.map((item) => (
                    <div key={item.book_id} className="flex items-center justify-between text-xs py-1 border-b border-slate-800">
                      <span className="line-clamp-1 flex-1 pr-2 text-slate-300">{item.title}</span>
                      <span className="font-bold text-amber-400 font-mono shrink-0">
                        {item.quantity} ex.
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-slate-500">
                  Aucun exemplaire sélectionné pour le moment.
                </div>
              )}
            </div>

            {/* Formulaire de coordonnées revendeur */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Coordonnées de l'Établissement / Revendeur
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Nom de l'Établissement / Librairie *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ex: Librairie de France / Collège Moderne"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Nom & Prénom du Responsable *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ex: M. Kouassi Daniel"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Téléphone & WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07 00 00 00 00"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Ville & Commune *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ex: Bouaké, Abidjan..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Lieu précis de livraison / Quartier
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: Quartier Commerce, près de la poste"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Commentaires ou date souhaitée
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Rentrée scolaire, besoin de livraison avant le 15..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-amber-600 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || selectedItems.length === 0}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.01]"
              >
                <Phone className="w-4 h-4" />
                <span>Transmettre le Bon de Commande WhatsApp</span>
              </button>

              <p className="text-[11px] text-slate-400 text-center leading-tight">
                Transmission directe et sécurisée au service commercial des Éditions Phénix.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
