# 📋 Document de Synthèse Technique — Review Lead Tech
## Écosystème ODC Campus : Super App, Back Office & Config Server

**Auteur :** Développeur Full Stack Senior & Tech Lead  
**Projet :** ODC Campus Super App (`test-odc`)  
**Date :** Novembre 2026  
**Audience :** Lead Tech & Direction Technique ODC  

---

## 🎯 1. Résumé Exécutif & Vision Globale

L'objectif de cette review technique est de valider le socle architectural et fonctionnel de la **Super App ODC Campus**, conçue pour devenir le guichet unique de tous les apprenants, encadrants et collaborateurs du Campus Orange Digital Center.

Face à la multiplication des outils internes (FabLab, gestion des présences, soumission de projets, trombinoscope, événements), nous avons banni l'approche monolithique classique (redéploiement d'une application mobile à chaque nouveau service) au profit d'une **architecture modulaire et dynamique de type Host & Guest (Server-Driven UI)** :
* **Un Shell Host mobile natif (Flutter)** ultra-léger et fluide.
* **Des micro-frontends Guests (React)** embarqués via des WebViews optimisées.
* **Un Config Server centralisé (NestJS)** capable de propager les mises à jour et les feature flags instantanément, sans recompilation mobile.

---

## 🚀 2. Bilan de l'Existant : Ce qui a été Accomplifié

Le socle technique est aujourd'hui stable, testé et pleinement fonctionnel sur les trois piliers du monorepo :

### A. Back Office Administrateur (`odc_backoffice`)
* **Gestion CRUD complète des Services Applicatifs** :
  * Création avec validation automatique des champs et formatage des URLs (HTTPS).
  * Tableau de bord interactif avec recherche en temps réel et compteur de services.
  * Modification via modale ergonomique et suppression sécurisée avec dialogue de confirmation.
  * Synchronisation temps réel avec MongoDB via `PATCH /configurations/app.services`.
* **Module Trombinoscope & Médias** :
  * Zone de téléversement intuitive en **Drag & Drop (Glisser-Déposer)** avec prévisualisation locale instantanée.
  * Upload `multipart/form-data` vers le backend NestJS avec renommage unique anti-collision.
  * Galerie locale persistante (`localStorage`) et bouton de copie d'URL en un clic dans le presse-papier.
* **Design & Ergonomie** : Respect strict du Design System ODC (Dark Theme `#121212`, surfaces `#1E1E1E`, Orange officiel `#FF7900`) et pastille de santé de l'API en direct.

### B. Super App Multiplateforme (`odc_super_app`)
* **Responsive Design Dynamique (Breakpoint 800px)** :
  * **Sur Mobile (< 800px)** : Expérience "Max It" fluide avec header épuré (logo ODC + cloche de notifications), barre de recherche dédiée, carrousel adaptatif, grille de services en 4 colonnes et BottomNavigationBar.
  * **Sur Desktop / Web (>= 800px)** : Dashboard complet avec Sidebar latérale fixe (250px), profil apprenant avec indicateur "En ligne", bandeau d'accueil étendu et grille à 6 colonnes.
* **Carrousel Adaptatif Multi-écrans (`_BanniereCarrousel`)** :
  * Implémentation basée sur un `LayoutBuilder` et un `AspectRatio` réactif : conserve le ratio natif (~2.05) sur smartphones (iPhone, Android) sans rognage, et s'adapte à un ratio de 2.6 sur écrans larges pour préserver l'espace vertical.
* **Lecteur WebView In-App Hybride (`WebViewPage`)** :
  * Double implémentation propre avec imports conditionnels Dart :
    * Sur Mobile natif (iOS / Android) : Utilisation du contrôleur `webview_flutter` natif avec gestion des spinners de chargement et barre de navigation intégrée.
    * Sur Web (Navigateurs) : Enregistrement d'une vue d'éléments HTML sécurisée (`HtmlElementView` / `IFrameElement`).

### C. Backend Centralisé (`config-server/backend`)
* API REST NestJS 12 robuste avec validation DTO stricte (`class-validator`, `whitelist`, `forbidNonWhitelisted`).
* Persistance MongoDB découplée via Mongoose (schéma `Config` polymorphe avec clé unique indexée).
* Pipeline d'upload de fichiers médias sécurisé sous Multer avec distribution statique des binaires.
* Sécurité CORS paramétrée pour autoriser les applications locales et les environnements de dev.

---

## 🔗 3. Communication de la Super App avec l'Écosystème ODC

La Super App Flutter agit comme un **agrégateur dynamique**. Elle ne possède pas en dur la liste des services :

```
[ App Mobile Flutter ]
        │
        │ 1. GET /configurations/app.services (Au démarrage)
        ▼
[ Config Server NestJS ] ──► [ MongoDB (Configs) ]
        │
        │ 2. Réponse JSON : Liste des services [{ name, url, icon }]
        ▼
[ App Mobile Flutter ] ──► Construit la grille d'accueil dynamiquement
        │
        │ 3. L'utilisateur clique sur le service "FabLab"
        ▼
[ WebView In-App ] ──► Charge l'URL https://fablab.campus-odc.com
```

### Avantages de ce Découplage :
1. **Agilité Métier** : Un nouveau service (ex. "Ateliers IA") peut être déployé en production et rendu accessible à tous les apprenants en 10 secondes depuis le Back Office, sans soumission sur l'App Store ou Google Play Store.
2. **Maintenance Allégée** : Si l'URL d'un microservice change ou si un service entre en maintenance, l'équipe technique modifie la configuration dans le Back Office, et la Super App s'adapte instantanément.
3. **Résilience Réseau** : En cas de coupure temporaire de l'API, la Super App propose un écran d'erreur explicatif avec bouton de rafraîchissement ("Réessayer"), évitant tout crash applicatif.

---

## 🏛️ 4. Architecture Cible : Modèle Host & Guest

Pour accompagner la montée en charge du Campus ODC, l'architecture cible s'articule autour de quatre couches clairement séparées :

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                                COUCHE 1 : HOST                                    │
│                     Super App Flutter (iOS / Android / Web)                       │
│  - Shell applicatif & cycle de vie      - Navigation native & responsive          │
│  - Notifications push locales / FCM     - Stockage sécurisé (Tokens / Cache)      │
│  - Accès matériel (Caméra, Biométrie)   - Pont JavaScript bidirectionnel          │
└────────────────────────────────────────┬──────────────────────────────────────────┘
                                         │
                                         ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                                COUCHE 2 : GUESTS                                  │
│             Micro-Frontends Web Embarqués (React / Next.js / Vite)                │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐  │
│  │    Module FabLab      │  │   Suivi Présences     │  │    Trombinoscope      │  │
│  │   (Réservation lab)   │  │  (Pointage QR Code)   │  │  (Apprenants/Tuteurs) │  │
│  └───────────────────────┘  └───────────────────────┘  └───────────────────────┘  │
└────────────────────────────────────────┬──────────────────────────────────────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
┌───────────────────────────────────────┐ ┌─────────────────────────────────────────┐
│          COUCHE 3 : IDENTITY          │ │        COUCHE 4 : CONFIG SERVER         │
│   (SSO / Keycloak / OAuth2 / OIDC)    │ │         (NestJS 12 + MongoDB)           │
│ - Authentification unique (SSO)       │ │ - Server-Driven Configuration           │
│ - Émission & rotation des tokens JWT  │ │ - Feature Flags & Permissions           │
│ - Gestion des rôles (Admin/Apprenant) │ │ - Stockage & distribution médias        │
└───────────────────────────────────────┘ └─────────────────────────────────────────┘
```

### Rôle et Responsabilité de Chaque Brique :

1. **Flutter comme Portail (Host)** :
   * Fournit le shell principal, l'expérience native rapide (60/120 fps) et la barre de navigation.
   * Gère les fonctions matérielles : appareil photo (pour scanner les QR codes de présence), notifications push et stockage des secrets dans le trousseau sécurisé (`KeyStore` Android / `Keychain` iOS).
   * Injecte le contexte utilisateur dans les Guests via un pont JavaScript (`JavaScriptChannel`).

2. **WebViews pour les Interfaces Métier (Guests)** :
   * Chaque équipe produit ou filière (DevOps, Data, Web) peut développer son service en React ou Next.js de manière totalement autonome.
   * Ces interfaces s'exécutent dans la WebView de l'hôte. Elles consomment les tokens d'authentification transmis par l'hôte pour appeler leurs propres microservices métiers.

3. **Identity Provider (SSO & Sécurité)** :
   * Point central d'authentification (ex. Keycloak ou OAuth2 Orange).
   * L'apprenant se connecte une seule fois au niveau du Host Flutter.
   * Le token JWT obtenu est injecté de manière transparente dans les Guests (via en-tête `Authorization` ou cookies sécurisés), garantissant une expérience sans friction (Single Sign-On).

4. **Config Server (Orchestrateur & Feature Flags)** :
   * Distribue la configuration selon le profil de l'utilisateur (un apprenant DevOps ne verra pas forcément les mêmes tuiles qu'un apprenant en Design).
   * Assure la gestion dynamique des versions d'applications et les avis de maintenance programmée.

---

## 📈 5. Prochaines Étapes après Validation (Roadmap Technique)

Après validation par le Lead Tech de cette première étape, nous recommandons le plan de travail suivant :

### Phase 1 : Authentification & Sécurité Renforcée (Priorité Haute)
* **Intégration OAuth2 / OIDC & JWT** :
  * Intégration de `flutter_appauth` et `flutter_secure_storage` dans la Super App.
  * Intercepteur HTTP dans Flutter pour le rafraîchissement automatique des tokens (Silent Refresh).
  * Transmission sécurisée du token JWT aux WebViews via un canal JavaScript dédié (`window.OdcHost.getToken()`).
* **Sécurisation du Backend NestJS** :
  * Mise en place de Guards `@UseGuards(JwtAuthGuard)` sur les routes sensibles (`POST /configurations`, `PATCH /configurations`, `DELETE /configurations`).
  * Limitation de débit (Rate Limiting via `@nestjs/throttler`) sur l'upload d'images.

### Phase 2 : Communication Événementielle & Asynchrone (RabbitMQ)
* **Intégration d'un bus RabbitMQ** :
  * Découplage des notifications d'événements (ex. nouvelle photo de trombinoscope validée, nouveau service déployé, notification d'absence).
  * Publication d'événements vers les microservices tiers sans dépendance synchrone bloquante.

### Phase 3 : Mode Hors-Ligne & Cache Local (Offline-First)
* **Persistance Locale dans Flutter** :
  * Intégration d'un stockage local rapide (Hive ou SQLite) pour conserver la dernière configuration `app.services` en cache.
  * Si l'appareil est hors réseau ou en zone blanche, la Super App démarre instantanément en utilisant la configuration mise en cache.

### Phase 4 : Industrialisation CI/CD & Déploiement
* **Pipeline GitHub Actions / GitLab CI** :
  * Lint et type-check automatisés (`oxlint`, `nest build`, `flutter analyze`).
  * Exécution automatique de la suite de tests (`npm test`, `flutter test`).
  * Conteneurisation Docker du backend et du back office pour déploiement sur orchestrateur (Kubernetes / Docker Swarm).

---

## ⚖️ 6. Points Soumis à l'Arbitrage du Lead Tech

Afin d'aligner parfaitement nos choix techniques avec la feuille de route globale, voici les 3 arbitrages proposés :

1. **Fournisseur d'Identité Cible** : Devons-nous brancher l'authentification sur un serveur Keycloak interne ODC, sur Firebase Auth, ou sur un annuaire LDAP/OAuth2 existant chez Orange ?
2. **Nettoyage du Monorepo** : Validez-vous la suppression du dossier orphelin `config-server/frontend` (remplacé avec succès par `odc_backoffice`) et du `package.json` résiduel à la racine ?
3. **Stratégie de Cache des Médias** : Souhaitez-vous conserver le stockage local des images sur disque (`./uploads`) pour la phase de test, ou basculer dès maintenant vers un stockage objet S3/MinIO compatible ?
