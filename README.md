# 📚 Site Web : Les Éditions Phénix — La Maison du Succès

Site web moderne, rapide et optimisé SEO pour la maison d'édition **Les Éditions Phénix** (*La Maison du Succès*), conçu avec **Next.js 15**, **Supabase** et hébergeable gratuitement sur **Vercel** sans dépenser un seul centime (0 €).

---

## 🎯 Fonctionnalités Principales

1. **Vitrine & Catalogue Complet des Ouvrages**
   - Présentation des 6 collections phares : *Collection Succès (Annales & Examens)*, *Collection Archives (Cahiers d'Activités & Évaluation Histoire-Géographie)*, *Collection Polyglotte (Guides d'Anglais)*, *Collection Papyrus (Littérature & Romans)*, *Collection École & Métiers (CMC)*, *Collection Racines (Français & Dictée-Questions)*.
   - Filtres interactifs instantanés par collection, matière, niveau (6e, 5e, 4e, 3e BEPC, 2nde, 1ère, Terminale BAC) et tri par prix.
   - Fiches détaillées par livre avec aperçu de couverture, pagination, ISBN et description pédagogique.

2. **Espace Téléchargement des Corrigés & Documents (Gratuit)**
   - Téléchargement libre et direct des corrigés officiels des livres vendus (formats **PDF** et **Word .docx**).
   - Moteur de recherche et filtres par discipline et niveau.
   - Liaison directe entre chaque livre et son corrigé officiel.

3. **Tunnel de Commande Direct via WhatsApp**
   - Panier d'achat interactif avec calcul automatique des montants.
   - Formulaire de renseignements client (Nom, Téléphone, Ville/Commune, Adresse de livraison, Remarques).
   - Génération automatique du bon de commande récapitulatif complet et redirection directe vers l'application WhatsApp du vendeur (`https://wa.me/...`).
   - Sauvegarde simultanée dans Supabase pour garder un historique client.

4. **Interface d'Administration Complète (Back-office)**
   - Accessible sur `/admin/dashboard`.
   - **Ajout facile de nouveaux livres** avec téléversement direct de la couverture (images JPG, PNG, WebP).
   - **Ajout facile de nouveaux corrigés** avec téléversement direct des documents (fichiers PDF ou Word).
   - Consultation et suivi des commandes clients reçues.
   - Configuration du numéro WhatsApp commercial et des informations de contact.

---

## 🚀 Démarrage Rapide en Local

```bash
# 1. Aller dans le dossier du projet
cd site_web_phenix

# 2. Lancer le serveur de développement
npm run dev
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le site en direct.

---

## 🗄️ Configuration de Supabase (0 €)

1. Rendez-vous sur [supabase.com](https://supabase.com) et créez un compte gratuit.
2. Cliquez sur **"New Project"** (Nom : `editions-phenix`).
3. Allez dans le **SQL Editor** (icône `>_` à gauche).
4. Ouvrez le fichier `supabase/schema.sql` présent dans ce projet, copiez l'intégralité de son contenu et collez-le dans l'éditeur SQL de Supabase, puis cliquez sur **"Run"**.
   - Cela crée automatiquement vos tables, vos dossiers de stockage de fichiers (`covers` et `documents`), ainsi que les exemples de livres.
5. Allez dans **Project Settings** > **API** et copiez :
   - `Project URL`
   - `anon public key`
6. Créez un fichier `.env.local` à la racine de votre projet avec ces valeurs :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://votre-id-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon-publique
   ```

*(Note : Même sans configurer Supabase immédiatement, le site fonctionne parfaitement grâce aux données de secours déjà intégrées).*

---

## ☁️ Déploiement Gratuit sur Vercel (0 €)

1. Publiez votre projet sur un dépôt **GitHub** (public ou privé).
2. Rendez-vous sur [vercel.com](https://vercel.com) et connectez-vous avec votre compte GitHub.
3. Cliquez sur **"Add New..."** > **"Project"**.
4. Sélectionnez votre dépôt `site_web_phenix`.
5. Dans la section **"Environment Variables"**, ajoutez :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Cliquez sur **"Deploy"**. En moins de 2 minutes, votre site est en ligne avec HTTPS mondial et un domaine gratuit `mon-site.vercel.app` (personnalisable avec votre propre nom de domaine gratuitement).
