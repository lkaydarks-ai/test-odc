# 🎓 ODC Campus Super App — Guide Global du Projet

Bienvenue sur le référentiel principal du projet **ODC Campus Super App**. Ce monorepo fédère les trois applications fondamentales constituant l'écosystème numérique du **Campus Orange Digital Center (ODC)**.

---

## 📑 Sommaire

1. [🎯 But du Projet](#1--but-du-projet)
2. [🏗️ Architecture Globale & Découpage](#2-️-architecture-globale--découpage)
3. [🔄 Circulation des Données entre les 3 Applications](#3--circulation-des-données-entre-les-3-applications)
4. [📡 Référentiel des Routes API (Backend NestJS)](#4--référentiel-des-routes-api-backend-nestjs)
5. [🚀 Guide de Lancement (Commandes Exactes)](#5--guide-de-lancement-commandes-exactes)
6. [📱 Adaptation Responsive & Cibles Multiplateformes](#6--adaptation-responsive--cibles-multiplateformes)
7. [🛠️ Dépannage & Bonnes Pratiques](#7-️-dépannage--bonnes-pratiques)

---

## 1. 🎯 But du Projet

Le projet **ODC Campus Super App** a pour vocation de fournir aux apprenants, encadrants et partenaires du Campus Orange Digital Center un **point d'entrée unique et unifié** vers l'ensemble des plateformes numériques du campus :
* **Services pédagogiques** : Gestion des formations, suivi des présences, FabLab, soumission de projets.
* **Vie du campus** : Événements, actualités promotionnelles, trombinoscope des apprenants et collaborateurs.
* **Services transverses** : Documentation, profil apprenant, outils de collaboration.

### Le Principe Clé : Server-Driven UI (Architecture Pilotée par le Serveur)
Plutôt que d'intégrer en dur la liste des liens et services dans le code mobile (ce qui nécessiterait une recompilation et une redistribution sur les stores à chaque ajout de service), le projet repose sur une **configuration centralisée et dynamique** :
1. Les administrateurs gèrent en direct la liste des services et les médias depuis le **Back Office**.
2. Le **Serveur de Configuration (NestJS)** valide, enregistre et expose ces paramètres en temps réel via une API REST.
3. La **Super App (Flutter)** interroge l'API à l'initialisation, génère dynamiquement l'interface (grille de raccourcis, bannières, avatars) et ouvre chaque service dans une **WebView intégrée** sécurisée.

---

## 2. 🏗️ Architecture Globale & Découpage

Le projet s'organise en trois briques logicielles autonomes mais complémentaires :

```text
test-odc/
├── config-server/           # 🟢 BACKEND : Serveur de configuration & médias
│   ├── backend/             # API NestJS + Mongoose / MongoDB (Port 3000)
│   └── uploads/             # Stockage physique des fichiers images hébergés
│
├── odc_backoffice/          # 🟠 FRONTEND : Console d'administration ODC Campus
│   ├── src/App.jsx          # Dashboard CRUD des services + Trombinoscope Drag & Drop
│   └── src/App.css          # Design System Dark ODC (#FF7900 / #121212)
│
└── odc_super_app/           # 🔵 CLIENT : Super App multiplateforme (Flutter)
    ├── lib/main.dart        # Interface adaptative (Mobile Max It / Desktop Sidebar)
    ├── lib/services_api.dart# Couche d'accès réseau HTTP sécurisée
    └── lib/webview_page.dart# Lecteur WebView in-app (Natif Android/iOS & Web IFrame)
```

### Rôle de Chaque Brique :
* **1. Backend (`config-server/backend`)** : Développé avec **NestJS 12**, **Mongoose** et **Multer**. Il assure la persistance des métadonnées dans MongoDB, gère les contraintes d'unicité, sert les images physiques et expose les endpoints REST aux deux autres applications.
* **2. Back Office (`odc_backoffice`)** : Développé avec **React 19**, **Vite** et **Axios**. Il propose une interface d'administration professionnelle reprenant la charte graphique Orange Digital Center : formulaire CRUD complet pour `app.services`, zone de téléversement Drag & Drop pour le trombinoscope avec aperçu immédiat et copie d'URL en un clic.
* **3. Super App (`odc_super_app`)** : Développée avec **Flutter 3.x**. Elle joue le rôle de portail (Host). Elle s'adapte automatiquement à l'écran (disposition 4 colonnes sur mobile vs Sidebar et grille 6 colonnes sur Desktop/Web) et orchestre l'accès aux microservices via des WebViews intégrées.

---

## 3. 🔄 Circulation des Données entre les 3 Applications

Le schéma ci-dessous détaille la manière dont les données circulent entre les trois tiers applicatifs :

```
                     ┌──────────────────────────────────────────────┐
                     │          Back Office Administrateur          │
                     │          (React 19 + Vite sur :5173)         │
                     └──────────────────────┬───────────────────────┘
                                            │
        ① Téléversement photo               │ ② Mise à jour services
           POST /uploads                    │    PATCH /configurations/app.services
           (multipart/form-data)            │    (JSON : { value: { services: [...] } })
                                            ▼
                     ┌──────────────────────────────────────────────┐
                     │          Backend Config Server (API)         │
                     │           (NestJS 12 sur port 3000)          │
                     └──────────────┬───────────────────────────────┘
                                    │
                                    ├── Stockage Métadonnées -> MongoDB (Collection configs)
                                    └── Stockage Fichiers    -> Disque local (./uploads/)
                                    │
        ③ Lecture configuration     │ ④ Récupération avatar
           GET /configurations/     │    GET /configurations/app.user_avatar
           app.services             │
                                    │ ⑤ Téléchargement des médias
                                    │    GET /uploads/:filename
                                    ▼
                     ┌──────────────────────────────────────────────┐
                     │             ODC Super App (Client)           │
                     │      (Flutter : iOS, Android, Web/Desktop)   │
                     └──────────────────────┬───────────────────────┘
                                            │
                                            │ ⑥ Clic sur un service
                                            ▼
                     ┌──────────────────────────────────────────────┐
                     │        Lecteur In-App WebView (Guest)        │
                     │  (Ouvre l'URL du service sans quitter l'app) │
                     └──────────────────────────────────────────────┘
```

### Déroulement Pas à Pas :
1. **Administration des Services** : L'administrateur crée, modifie ou supprime un service dans `odc_backoffice`. Le frontend émet une requête `PATCH` vers `/configurations/app.services`. Le backend valide la charge utile via son DTO et persiste le tableau d'objets dans MongoDB.
2. **Gestion du Trombinoscope** : L'administrateur dépose une photo dans la zone Drag & Drop. Le fichier est envoyé en `POST /uploads`. Le backend génère un identifiant unique (timestamp + suffixe aléatoire), l'enregistre sur le disque et retourne l'URL publique `http://localhost:3000/uploads/<fichier>`.
3. **Chargement de la Super App** : Au lancement de `odc_super_app`, le service Flutter `ServicesApi` interroge `GET /configurations/app.services` et `GET /configurations/app.user_avatar`.
4. **Génération Réactive de l'Interface** : Flutter parse le JSON reçu, construit dynamiquement la grille de services avec les icônes associées et affiche l'avatar réel de l'apprenant.
5. **Consommation In-App** : Lors d'un clic sur une tuile, la Super App instancie `WebViewPage` pour afficher le microservice distant dans un navigateur embarqué natif sans sortir de l'application.

---

## 4. 📡 Référentiel des Routes API (Backend NestJS)

Le serveur écoute par défaut sur le port `3000` (`http://localhost:3000`).

### Résumé des Endpoints

| Méthode | Route | Description | Format Requis | Réponse Succès |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/configurations` | Crée une configuration | `application/json` | `201 Created` |
| **GET** | `/configurations` | Liste toutes les configurations | Aucun | `200 OK` (Array) |
| **GET** | `/configurations/:key` | Récupère une configuration par sa clé | Aucun | `200 OK` (Objet) |
| **PATCH** | `/configurations/:key` | Met à jour la valeur ou le statut | `application/json` | `200 OK` (Objet) |
| **DELETE** | `/configurations/:key` | Supprime une configuration | Aucun | `200 OK` (Objet) |
| **POST** | `/uploads` | Téléverse une image (trombinoscope/avatar) | `multipart/form-data` | `201 Created` (URL) |
| **GET** | `/uploads/:filename` | Télécharge le fichier image statique | Aucun | `200 OK` (Binaire) |

---

### Détail des Requêtes & Exemples

#### 1. Créer une Configuration
* **Endpoint** : `POST http://localhost:3000/configurations`
* **En-têtes** : `Content-Type: application/json`
* **Corps de la requête (Body)** :
  ```json
  {
    "key": "app.services",
    "value": {
      "services": [
        { "name": "Tâches", "url": "https://odc-tasks.orange.com" },
        { "name": "FabLab", "url": "https://odc-fablab.orange.com" }
      ]
    },
    "status": "active"
  }
  ```
* **Codes retour** : `201 Created`, `400 Bad Request` (données invalides), `409 Conflict` (la clé existe déjà).

#### 2. Récupérer les Services Applicatifs (Route appelée par Flutter)
* **Endpoint** : `GET http://localhost:3000/configurations/app.services`
* **Réponse (200 OK)** :
  ```json
  {
    "_id": "672f...",
    "key": "app.services",
    "value": {
      "services": [
        { "name": "Tâches", "url": "https://flutter.dev" },
        { "name": "Profil", "url": "https://pub.dev" }
      ]
    },
    "status": "active",
    "createdAt": "2026-11-09T10:00:00.000Z",
    "updatedAt": "2026-11-09T12:00:00.000Z"
  }
  ```

#### 3. Mettre à Jour les Services (Route appelée par le Back Office)
* **Endpoint** : `PATCH http://localhost:3000/configurations/app.services`
* **Corps de la requête (Body)** :
  ```json
  {
    "value": {
      "services": [
        { "name": "Tâches", "url": "https://flutter.dev" },
        { "name": "Trombinoscope", "url": "https://odc.campus/trombi" },
        { "name": "Présences", "url": "https://odc.campus/presence" }
      ]
    }
  }
  ```
* **Codes retour** : `200 OK`, `404 Not Found` (clé inexistante).

#### 4. Téléverser une Photo (Trombinoscope / Avatar)
* **Endpoint** : `POST http://localhost:3000/uploads`
* **En-têtes** : `Content-Type: multipart/form-data`
* **Champ attendu** : `file` (binaire du fichier JPG, PNG ou WebP)
* **Réponse (201 Created)** :
  ```json
  {
    "message": "Image uploadée avec succès",
    "filename": "1794228437811-914815874.jpg",
    "url": "http://localhost:3000/uploads/1794228437811-914815874.jpg"
  }
  ```

#### 5. Afficher une Image Hébergée
* **Endpoint** : `GET http://localhost:3000/uploads/:filename`
* **Exemple** : `http://localhost:3000/uploads/1794228437811-914815874.jpg`
* **Réponse** : Flux binaire avec en-têtes MIME de l'image (servi directement au `CircleAvatar` ou à la balise `<img />`).

---

## 5. 🚀 Guide de Lancement (Commandes Exactes)

Pour faire tourner l'ensemble de l'écosystème, ouvrez **trois terminaux distincts** positionnés à la racine de `test-odc`.

### Prérequis Système
* **Node.js** (version 18 ou supérieure recommandée) et **npm**.
* **MongoDB Community** actif en local sur le port par défaut (`27017`).  
  *Sur macOS via Homebrew :* `brew services start mongodb-community`
* **Flutter SDK** (version 3.19+ ou supérieure) configuré (`flutter doctor` opérationnel).

---

### Terminal 1 : Lancer le Backend NestJS (`config-server`)

Le backend doit être démarré en premier pour mettre à disposition l'API REST et le stockage.

```bash
# 1. Se rendre dans le répertoire du backend
cd config-server/backend

# 2. Installer les dépendances du projet
npm install

# 3. Démarrer le serveur NestJS en mode développement (rechargement à chaud)
npm run start:dev
```
* **Adresse de l'API** : `http://localhost:3000`
* **Contrôle rapide** : Ouvrez `http://localhost:3000/configurations` dans votre navigateur. Vous devez recevoir un tableau JSON `[]` ou contenant vos configurations existantes.

---

### Terminal 2 : Lancer le Back Office React (`odc_backoffice`)

Démarrez ensuite la console d'administration web.

```bash
# 1. Se rendre dans le répertoire du back office
cd odc_backoffice

# 2. Installer les dépendances React & Vite
npm install

# 3. Lancer le serveur de développement Vite
npm run dev
```
* **Adresse de la console** : `http://localhost:5173`
* **Indicateur de connexion** : Un badge vert en haut à droite confirme la synchronisation avec l'API *(« Serveur connecté (3000) »)*.

---

### Terminal 3 : Lancer la Super App Flutter (`odc_super_app`)

Lancez l'application mobile client sur le simulateur ou l'appareil de votre choix.

```bash
# 1. Se rendre dans le répertoire de la Super App Flutter
cd odc_super_app

# 2. Télécharger les packages Dart et plugins natifs
flutter pub get

# 3. Lancer l'application
flutter run
```

#### Cibles de Démarrage Pratiques :
* **Navigateur Web (Google Chrome)** : `flutter run -d chrome`
* **Simulateur iPhone (iOS)** : `flutter run -d iPhone`
* **Émulateur Android** : `flutter run -d android`
* **Application de bureau macOS** : `flutter run -d macos`
* **Lister les appareils disponibles** : `flutter devices`

---

## 6. 📱 Adaptation Responsive & Cibles Multiplateformes

La Super App Flutter s'adapte automatiquement à son environnement d'affichage via un seuil responsive dynamique (**Breakpoint à 800px**) :

```
             ┌─────────────────────────────────────────────────────────┐
             │            LayoutBuilder (Breakpoint : 800px)           │
             └────────────────────────────┬────────────────────────────┘
                                          │
                  Largeur < 800px         │         Largeur >= 800px
             ┌────────────────────────────┴────────────────────────────┐
             ▼                                                         ▼
    ┌─────────────────────────────┐           ┌─────────────────────────────────────────┐
    │     Affichage Mobile        │           │        Affichage Desktop / Web          │
    │  - Header compact logo ODC  │           │  - Sidebar latérale fixe (250px)        │
    │  - Carrousel ratio ~2.05    │           │  - Header de bienvenue étendu           │
    │  - Grille à 4 colonnes      │           │  - Carrousel centré (maxWidth 850px)    │
    │  - BottomNavigationBar      │           │  - Grille fluide à 6 colonnes           │
    └─────────────────────────────┘           └─────────────────────────────────────────┘
```

* **Sur Mobile (< 800px)** : Ergonomie pensée pour l'usage tactile au pouce avec disposition compacte à 4 colonnes et barre d'onglets inférieure.
* **Sur Desktop & Tablettes (>= 800px)** : Disposition type Dashboard moderne avec barre de navigation latérale fixe, affichage de l'état « En ligne » de l'apprenant et grille étendue à 6 colonnes.
* **Carrousel Dynamique** : Le widget `_BanniereCarrousel` calcule son ratio d'affichage (`AspectRatio`) automatiquement à partir de la largeur réelle disponible, ce qui garantit que les bannières au format 1456x720 ne sont jamais coupées ni étirées, quel que soit le modèle d'appareil.

---

## 7. 🛠️ Dépannage & Bonnes Pratiques

| Problème / Symptôme | Cause Fréquente | Solution Recommandée |
| :--- | :--- | :--- |
| **`Connection refused` sur émulateur Android** | L'émulateur Android considère `localhost` comme sa propre boucle locale et non celle de votre ordinateur hôte. | Lancez Flutter en surchargeant l'URL :<br>`flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000`<br>*(Sur simulateur iOS et Web, `localhost` fonctionne directement).* |
| **Voyant API rouge dans le Back Office** | Le backend NestJS est éteint ou MongoDB n'est pas actif. | Vérifiez que MongoDB tourne (`brew services list`) puis relancez `npm run start:dev` dans `config-server/backend`. |
| **Erreur 404 lors du chargement des services** | La clé `app.services` n'est pas encore initialisée dans MongoDB. | Ajoutez votre premier service depuis le Back Office (`http://localhost:5173`) : la configuration sera créée immédiatement. |
| **Images 404 dans l'avatar Flutter** | Le dossier `uploads` du backend a été vidé. | Uploadez une nouvelle image dans le Trombinoscope du Back Office, copiez son URL et assignez-la. |

---

## 👥 Équipe & Gouvernance

Projet développé et maintenu dans le cadre du programme **Orange Digital Center (ODC) Campus**.  
Pour toute question d'architecture ou de gouvernance technique, référez-vous au document de synthèse destiné au Lead Tech (`SYNTHESE_LEAD_TECH.md`).
