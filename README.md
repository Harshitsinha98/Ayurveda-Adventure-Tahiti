# Ayurveda Tahiti

Site, réservations et paiements en ligne d’Ayurveda Tahiti (Eliane, Punaauia).
Remplace le site Wix www.ayurveda-tahiti.com.

- **Site** : Next.js 16 (React 19), Tailwind CSS 4, Framer Motion
- **Tableau de bord** : Payload CMS 3 (en français), dans la même application, sur `/admin`
- **Paiement** : Mobupay (carte bancaire en XPF, 3-D Secure, webhooks signés)
- **E-mails et newsletter** : Brevo
- **Hébergement** : Vercel + PostgreSQL (Neon) + Vercel Blob pour les images

## Démarrer en local

```bash
cp .env.example .env          # puis compléter PAYLOAD_SECRET
npm install
npm run seed                  # importe le contenu migré depuis Wix (SQLite local)
npm run dev                   # http://localhost:3000  ·  admin : /admin
```

`npm run seed` crée un administrateur si `SEED_ADMIN_EMAIL` et `SEED_ADMIN_PASSWORD` sont définis.
Le contenu importé (textes, 7 services, 2 carnets, 2 voyages avec itinéraires, 7 articles, 3 témoignages,
photos d’Eliane) se trouve dans `scripts/seed-data.ts`, `seed/posts.json` et `seed/images/`.

## Mobupay : où mettre les clés

1. Espace marchand Mobupay → **Développeur → Clés API** → créer une clé (permissions *Full access*).
   La valeur complète ne s’affiche qu’une fois.
2. Dans `.env` (local) ou dans Vercel → *Settings → Environment Variables* :
   ```
   MOBUPAY_SECRET_KEY=sk_test_…
   ```
3. Récupérer le secret de signature des webhooks :
   ```bash
   npm run mobupay:secret      # affiche MOBUPAY_WEBHOOK_SECRET=…
   ```
   puis ajouter `MOBUPAY_WEBHOOK_SECRET=…`. La clé test et la clé live ont des secrets différents.
4. L’adresse de notification est envoyée automatiquement à chaque paiement :
   `https://<votre-domaine>/api/payments/mobupay/webhook`. Pour la tester en local, le site doit être
   joignable depuis Internet (déploiement de prévisualisation Vercel ou tunnel).
5. Cartes de test : https://docs.mobupay.nc/docs/test-cards (ex. `4970 1090 0000 0007`, 12/30, CVV 123).

Passage en production : terminer l’inscription dans Mobupay (structure **Ayurveda Adventure Tahiti**,
numéro TAHITI F38758), attendre l’acceptation du contrat d’encaissement, puis remplacer par la clé
`sk_live_…` et son secret.

### Fonctionnement du paiement

1. Le client choisit une date ou un créneau, ses options, puis « Payer ».
2. Le serveur recalcule le prix (le navigateur n’envoie jamais de montant), réserve la place de façon
   atomique (pas de surréservation, même avec des clics simultanés), puis crée une session Mobupay
   (`POST /api/v1/payments/sessions`, montant entier en XPF, clé d’idempotence).
3. Le client paie sur la page sécurisée Mobupay.
4. Mobupay envoie le webhook signé : la signature V2 (horodatage, anti-rejeu) est vérifiée, l’événement
   est enregistré une seule fois, la réservation passe en « Confirmée » et les e-mails partent.
5. Paiement abandonné ou refusé : la place est libérée (webhook, ou tâche planifiée toutes les 30 min).
   Paiement reçu après expiration et plus de place : remboursement automatique.

XPF n’a pas de décimales : 8 700 XPF est envoyé `8700`, jamais multiplié par 100.

## Déploiement (Vercel)

1. Créer une base PostgreSQL (Neon, région UE) et un store Vercel Blob.
2. Importer le dépôt dans Vercel et définir les variables de `.env.example`
   (dont **`NEXT_PUBLIC_SITE_URL` avant le premier build**, `DATABASE_URI`, `BLOB_READ_WRITE_TOKEN`,
   `PAYLOAD_SECRET`, `CRON_SECRET`).
3. Les migrations PostgreSQL (`src/migrations`) s’appliquent automatiquement au démarrage en production.
   Après une modification du modèle de données : `npm run migrate:create nom-du-changement`.
4. Lancer une fois `npm run seed` avec `DATABASE_URI` et `BLOB_READ_WRITE_TOKEN` de production pour
   importer le contenu.
5. La tâche planifiée `vercel.json` (`/api/cron/bookings`) envoie les rappels et libère les paiements
   non finalisés. Vercel envoie automatiquement `Authorization: Bearer $CRON_SECRET`.

## Brevo

- `BREVO_API_KEY` : e-mails de confirmation, rappels, reçus, solde, annulation.
- `BREVO_LIST_ID` et `BREVO_DOI_TEMPLATE_ID` : inscription newsletter avec double confirmation (RGPD).
- Expéditeur `EMAIL_FROM` à valider dans Brevo (SPF/DKIM du domaine).
- Les newsletters se créent et s’envoient dans Brevo (lien dans le tableau de bord).

## Rôles dans le tableau de bord

| Rôle | Accès |
|---|---|
| Éditrice (Eliane) | Réservations, offres, dates, carnets, disponibilités, clients, messages, newsletter, blog, témoignages, médias, textes des pages |
| Administrateur | Tout, plus utilisateurs et journal technique des paiements |

## Adresses Wix conservées

Les anciennes adresses (`/sessions`, `/service-page/…`, `/post/…`, `/event-details/…`, `/pricing-plans/list`)
redirigent de façon permanente vers les nouvelles pages (`src/lib/redirects.ts`).

## À confirmer par Eliane

Signalés par `TODO(Eliane)` dans `scripts/seed-data.ts` :

- horaires de disponibilité réels (valeurs par défaut : lun–ven 8 h–12 h et 14 h–18 h, sam 8 h–12 h) ;
- prix de la Formation Ayurveda Santé (non affiché sur Wix, 19 700 XPF par défaut) ;
- acompte et date du solde pour la Kumbha Mela (30 %, 45 jours avant le départ par défaut) ;
- dates des prochaines formations ;
- textes définitifs des CGV et de la politique de confidentialité ;
- lien de visioconférence des séances en ligne.
