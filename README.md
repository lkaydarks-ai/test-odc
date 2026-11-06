# 🎓 ODC Campus Super App — Monorepo

> **Architecture globale, guide de démarrage et documentation technique**  
> Ce dépôt regroupe les trois piliers de l'écosystème numérique **ODC Campus** : le serveur de configuration centralisé, la console d'administration web et l'application mobile multiplateforme.

---

## 📑 Sommaire

1. [Vision & But du Projet](#1-vision--but-du-projet)
2. [Architecture & Flux de Communication](#2-architecture--flux-de-communication)
3. [Structure du Monorepo](#3-structure-du-monorepo)
4. [Guide de Démarrage Rapide](#4-guide-de-démarrage-rapide)
   * [Prérequis](#prérequis)
   * [Brique 1 : Backend NestJS (Config Server)](#étape-1--lancer-le-backend-nestjs)
   * [Brique 2 : Back Office React (Admin Console)](#étape-2--lancer-le-back-office-react)
   * [Brique 3 : Application Mobile Flutter](#étape-3--lancer-lapplication-mobile-flutter)
5. [Fonctionnalités Actuellement Disponibles](#5-fonctionnalités-actuellement-disponibles)
6. [Dépannage & Bonnes Pratiques Réseau](#6-dépannage--bonnes-pratiques-réseau)

---

## 1. Vision & But du Projet

Le projet **ODC Campus Super App** vise à offrir aux apprenants et encadrants du Campus Orange Digital Center un point d'accès unique vers tous leurs outils et services du quotidien (formations, suivi des présences, fablab, profil, événements).

Pour garantir une agilité maximale, le projet repose sur une approche **Server-Driven Configuration** :
* **Aucun redéploiement d'application mobile nécessaire** pour ajouter, modifier ou désactiver un service.
* Les administrateurs configurent les services et les médias depuis le **Back Office**.
* Le **Backend NestJS** stocke et distribue ces configurations.
* L'**Application Flutter** télécharge dynamiquement cette configuration pour construire son interface et ouvrir les services dans un navigateur intégré (**WebView**).

---

## 2. Architecture & Flux de Communication

Les trois composants interagissent de manière découplée et standardisée via une API REST en JSON et du téléversement de fichiers en `multipart/form-data`.

```
                    ┌─────────────────────────────────────────┐
                    │       Back Office Administrateur        │
                    │         (React 19 + Vite - 5173)        │
                    └───────────────────┬─────────────────────┘
                                        │
           1. PATCH /configurations/app.services (CRUD Services)
           2. POST /uploads (Téléversement Trombinoscope)
                                        │
                                        ▼
                    ┌─────────────────────────────────────────┐
                    │          Backend Config Server          │
                    │        (NestJS + MongoDB - 3000)        │
                    └───────────────────┬─────────────────────┘
                                        │
                                        │ Stockage MongoDB
                                        │ + Dossier physique ./uploads
                                        │
           1. GET /configurations/app.services (Liste des services)
           2. GET /configurations/app.user_avatar (Photo profil)
           3. GET /uploads/:filename (Fichiers médias)
                                        │
                                        ▼
                    ┌─────────────────────────────────────────┐
                    │        Super App Mobile Étudiant        │
                    │         (Flutter - iOS/Android)         │
                    └─────────────────────────────────────────┘
```

### Synthèse des rôles réseau :
1. **Back Office -> Backend** :
   * Modifie la configuration des services applicatifs via `PATCH http://localhost:3000/configurations/app.services`.
   * Envoie les photos d'apprenants via `POST http://localhost:3000/uploads`.
2. **Backend -> Persistance** :
   * Enregistre les métadonnées dans MongoDB (collection `configs`).
   * Enregistre les images sur le disque (`config-server/backend/uploads/`).
3. **Flutter -> Backend** :
   * Interroge l'API au démarrage via `GET http://localhost:3000/configurations/app.services`.
   * Construit la grille d'accueil avec les noms, icônes et liens configurés.
   * Récupère la photo d'avatar dynamique via `GET http://localhost:3000/configurations/app.user_avatar`.
   * Ouvre l'URL du service dans une `WebView` native sécurisée lors du clic utilisateur.

---

## 3. Structure du Monorepo

```text
test-odc/
│
├── config-server/           # Backend centralisé & micro-frontends
│   ├── backend/             # API NestJS + Mongoose (Port 3000)
│   └── frontend/            # Interface technique de secours (Material UI)
│
├── odc_backoffice/          # Back Office Métier ODC Campus
│   ├── src/App.jsx          # Dashboard CRUD Services + Trombinoscope
│   ├── src/App.css          # Design System Dark Mode ODC (#FF7900 / #121212)
│   └── package.json         # React 19, Vite, Axios
│
└── odc_super_app/           # Application Mobile Client
    ├── lib/main.dart        # Écran d'accueil, Carrousel, Navigation
    ├── lib/services_api.dart# Client HTTP vers le Config Server
    ├── lib/webview_page.dart# Lecteur WebView in-app
    └── pubspec.yaml         # Dépendances Flutter (carousel_slider, webview_flutter...)
```

---

## 4. Guide de Démarrage Rapide

Pour lancer le projet dans son intégralité, ouvrez **trois fenêtres de terminal distinctes** depuis la racine `test-odc`.

### Prérequis
* **Node.js** (v18.x ou v20.x+) et **npm**
* **MongoDB** démarré en local (`mongodb://127.0.0.1:27017`)
* **Flutter SDK** (v3.19+ ou supérieure) configuré (`flutter doctor` valide)
* Un simulateur mobile (iOS Simulator / Android Emulator) ou Google Chrome

---

### Étape 1 : Lancer le Backend NestJS

Le backend doit impérativement être démarré en premier pour fournir les données au Back Office et à Flutter.

```bash
# Se placer dans le dossier backend
cd config-server/backend

# Installer les dépendances
npm install

# Démarrer le serveur en mode dev avec rechargement à chaud
npm run start:dev
```
* **URL de l'API** : `http://localhost:3000`
* **Vérification** : Ouvrez `http://localhost:3000/configurations` dans votre navigateur pour confirmer que l'API répond.

---

### Étape 2 : Lancer le Back Office React

Dans un second terminal, démarrez la console d'administration.

```bash
# Se placer dans le dossier du back office
cd odc_backoffice

# Installer les dépendances
npm install

# Démarrer l'application avec Vite
npm run dev
```
* **URL du Back Office** : `http://localhost:5173`
* Le statut de connexion au Backend s'affiche en vert *(« Serveur connecté (3000) »)* dans l'en-tête.

---

### Étape 3 : Lancer l'Application Mobile Flutter

Dans un troisième terminal, lancez la Super App sur votre cible de test.

```bash
# Se placer dans le dossier de l'application Flutter
cd odc_super_app

# Récupérer les paquets et plugins
flutter pub get

# Lancer l'application
flutter run
```

> **Astuce de sélection de cible :**
> * Sur simulateur iOS : `flutter run -d iPhone`
> * Sur émulateur Android : `flutter run -d emulator`
> * Sur navigateur Web : `flutter run -d chrome`
> * Pour lister vos cibles disponibles : `flutter devices`

---

## 5. Fonctionnalités Actuellement Disponibles

### 🛠️ 1. Gestion des Services Applicatifs (CRUD Complet)
* **Création (Create)** : Ajout d'un service (nom + URL) avec normalisation automatique du protocole HTTPS.
* **Lecture & Recherche (Read)** : Tableau de bord dynamique avec filtrage en temps réel par mot-clé et compteur de services actifs.
* **Modification (Update)** : Édition instantanée via une fenêtre modale ergonomique pré-remplie (`Échap` pour annuler).
* **Suppression (Delete)** : Dialogue de confirmation de suppression pour éviter toute manipulation involontaire.
* **Synchronisation en direct** : Toute mise à jour est immédiatement disponible pour l'application mobile sans compilation.

### 📸 2. Module Trombinoscope & Gestion des Médias
* **Zone d'upload Drag & Drop** : Dépôt direct de photos (JPG, PNG, WebP) avec prévisualisation locale et contrôle du poids du fichier.
* **Hébergement Backend** : Stockage persistant sur le serveur NestJS avec génération d'URL unique.
* **Bouton « Copier l'URL »** : Copie dans le presse-papier en un clic avec feedback visuel vert pour injecter l'URL dans Flutter.
* **Persistance de session** : Historique des uploads sauvegardé dans le stockage local du navigateur.

### 🎠 3. Carrousel d'Accueil & Actualités
* **Bannière animée** : Défilement automatique des visuels de promotion du campus avec transitions douces.
* **Indicateur de position** : Points de pagination interactifs reflétant la diapositive en cours de visionnage.

### 🌐 4. Lecteur WebView In-App
* **Navigation intégrée** : Au clic sur n'importe quel service depuis Flutter, la page cible s'ouvre dans un navigateur intégré sans sortir de l'application.
* **Barre d'outils dédiée** : Header reprenant le nom du service, bouton de fermeture et indicateur de chargement.
* **Support hybride** : Implémentation multiplateforme prenant en charge le Web (`iframe`) et le Mobile natif (`webview_flutter`).

---

## 6. Dépannage & Bonnes Pratiques Réseau

| Problème rencontré | Cause probable | Solution |
| :--- | :--- | :--- |
| **`Connection refused` sur Flutter Android** | Sur émulateur Android, `localhost` pointe vers l'émulateur lui-même et non sur votre Mac. | Remplacez `http://localhost:3000` par `http://10.0.2.2:3000` dans `lib/services_api.dart`. *(Sur simulateur iOS, `localhost` fonctionne nativement).* |
| **Pastille API rouge dans le Back Office** | Le backend NestJS n'est pas démarré ou le port 3000 est indisponible. | Vérifiez le terminal `config-server/backend` et assurez-vous que MongoDB est bien lancé (`brew services start mongodb-community`). |
| **Images introuvables / 404** | Le dossier `uploads` côté backend est manquant ou vide. | Uploadez une nouvelle image via le Back Office ; le backend génère automatiquement le fichier dans `config-server/backend/uploads/`. |

---

## 👥 Contacts & Contribution

Projet maintenu par l'équipe **Orange Digital Center (ODC) Campus**.  
Pour toute question d'architecture ou suggestion de fonctionnalité, contactez le Chef de Projet Technique de la promotion.

