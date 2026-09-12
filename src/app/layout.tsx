import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/lib/cart-context';

export const metadata: Metadata = {
  title: "Éditions Phénix | Manuels Scolaires, Annales & Corrigés Pédagogiques",
  description: "Découvrez le catalogue des Éditions Phénix : annales de BEPC et BAC, Histoire-Géographie, Anglais, Philosophie, œuvres littéraires, téléchargement de corrigés officiels gratuits et commande directe via WhatsApp.",
  keywords: ["Éditions Phénix", "manuels scolaires", "corrigés BEPC", "corrigés BAC", "Histoire-Géographie", "annales", "Côte d'Ivoire", "livres scolaires", "WhatsApp"],
  openGraph: {
    title: "Éditions Phénix | L'Excellence Pédagogique",
    description: "Téléchargez des corrigés officiels et commandez vos manuels scolaires en direct via WhatsApp.",
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
