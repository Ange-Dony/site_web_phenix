import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/lib/cart-context';

export const metadata: Metadata = {
  title: "Les Éditions Phénix | La Maison du Succès — Activités d'Évaluation, Annales & Corrigés",
  description: "Découvrez Les Éditions Phénix - La Maison du Succès : annales de BEPC et BAC, cahiers d'activités d'évaluation en Histoire-Géographie, guides d'Anglais et de Philosophie, téléchargement de corrigés officiels gratuits et commande directe via WhatsApp.",
  keywords: ["Les Éditions Phénix", "La Maison du Succès", "activités d'évaluation", "annales BEPC", "annales BAC", "Histoire-Géographie", "corrigés officiels", "Côte d'Ivoire", "WhatsApp"],
  openGraph: {
    title: "Les Éditions Phénix | La Maison du Succès",
    description: "Téléchargez des corrigés officiels et commandez vos ouvrages (activités d'évaluation, annales, guides) en direct via WhatsApp.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full scroll-smooth" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col bg-[#faf9f6] text-slate-900 font-sans antialiased selection:bg-amber-500 selection:text-white">
        <CartProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
