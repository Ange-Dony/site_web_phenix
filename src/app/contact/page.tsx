'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare, BookOpen, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Commande de livres');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Bonjour les Éditions Phénix !\n\n` +
      `👤 Nom : ${name}\n` +
      `📞 Téléphone : ${phone}\n` +
      `📌 Objet : ${subject}\n\n` +
      `💬 Message :\n${message}`
    );
    window.open(`https://wa.me/2250700000000?text=${text}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-slate-900">
          Contactez les Éditions Phénix
        </h1>
        <p className="text-sm text-slate-600">
          Une question sur nos manuels, besoin d'un devis pour un établissement scolaire ou envie de soumettre un manuscrit ? Notre équipe vous répond avec plaisir.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Nos Coordonnées Directes</h2>

            <div className="space-y-4 text-sm text-slate-600">
              <a
                href="https://wa.me/2250700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3 text-emerald-900 font-semibold hover:bg-emerald-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-emerald-700 block font-normal">WhatsApp Ventes & Service Client</span>
                  <span>+225 07 00 00 00 00</span>
                </div>
              </a>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-700 text-white flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Adresse Email</span>
                  <span className="font-semibold text-slate-800">contact@editions-phenix.com</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Siège Éditorial</span>
                  <span className="font-semibold text-slate-800">Abidjan, Côte d'Ivoire</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <span className="font-bold block text-slate-700">Horaires d'ouverture :</span>
              <p>Du Lundi au Vendredi : 08h00 - 18h00</p>
              <p>Samedi : 09h00 - 14h00</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Envoyez-nous un Message</h2>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-900">Votre message a été transmis !</h3>
                <p className="text-xs text-emerald-700">
                  La conversation WhatsApp a été ouverte. Notre équipe commerciale va vous répondre dans les plus brefs délais.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold text-emerald-800 underline mt-2"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Votre Nom & Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex : M. Kouassi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Numéro de Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex : 07 00 00 00 00"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Objet de votre demande *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="Commande de livres">Commande de livres / Renseignements</option>
                    <option value="Devis Établissement / Librairie">Devis pour établissement scolaire ou librairie</option>
                    <option value="Question sur un corrigé">Question sur un corrigé téléchargeable</option>
                    <option value="Soumission de manuscrit">Soumission d'un manuscrit / Auteur</option>
                    <option value="Autre demande">Autre demande</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Votre Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écrivez votre message ici..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer directement via WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
