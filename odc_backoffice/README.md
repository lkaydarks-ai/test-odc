# Back Office ODC Campus (Admin Console)

Console d'administration web moderne et professionnelle dédiée à la gestion des services applicatifs et des médias du **Campus Orange Digital Center (ODC)**.

Cette application permet aux administrateurs de configurer en temps réel les services affichés dans l'application mobile **Flutter (ODC Super App)** et de gérer les photographies des apprenants et collaborateurs pour le **Trombinoscope**.

---

## 🚀 Fonctionnalités Clés

### 1. Gestion des Services Applicatifs (CRUD Complet)
* **Création (Create)** : Formulaire d'ajout rapide avec validation automatique des noms et URLs (préfixe `https://` automatique).
* **Lecture & Visualisation (Read)** : Tableau interactif avec indicateurs de statut, compteur global de services et liens directs vers les webviews.
* **Recherche & Filtrage en temps réel** : Barre de recherche instantanée par nom ou URL.
* **Modification (Update)** : Fenêtre modale ergonomique pré-remplie avec gestion des raccourcis clavier (`Échap` pour annuler).
* **Suppression Sécurisée (Delete)** : Dialogue de confirmation pour éviter les suppressions accidentelles.
* **Synchronisation Backend NestJS** : Tous les changements sont persistés en temps réel via la route `PATCH http://localhost:3000/configurations/app.services`.

### 2. Gestion du Trombinoscope & Médias
* **Zone de Drag & Drop (Glisser-Déposer)** : Interface intuitive avec retour visuel immédiat lors du survol d'un fichier.
* **Prévisualisation Locale** : Aperçu de l'image, nom du fichier et poids (Mo) avant validation du téléversement.
* **Upload Sécurisé** : Envoi au format `multipart/form-data` vers la route `POST http://localhost:3000/uploads`.
* **Galerie de Médias** : Affichage responsive des images hébergées par le serveur.
* **Bouton « Copier l'URL »** : Copie en 1 clic dans le presse-papier avec feedback vert instantané (« Copié ! ») pour accélérer l'intégration dans Flutter.
* **Persistance Locale** : L'historique des médias uploadés est mémorisé dans le `localStorage` du navigateur.

### 3. Expérience Utilisateur (UI / UX Premium)
* **Design System ODC** : Palette sombre professionnelle (`#121212`, surfaces `#1E1E1E`) et couleur d'accent Orange officiel (`#FF7900`).
* **Indicateur de Santé API** : Badge en temps réel vérifiant la connectivité avec le serveur backend NestJS (port 3000).
* **Système de Notifications Toast** : Notifications flottantes animées avec auto-fermeture (succès, avertissement, erreur, info).
* **Micro-interactions** : Effets de survol, animations douces, états de chargement (spinners) sur tous les boutons d'action.
* **Responsive Design** : Interface adaptée aux ordinateurs de bureau, tablettes et smartphones.

---

## 🛠️ Stack Technique

* **Framework** : [React](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Requêtes HTTP** : [Axios](https://axios-http.com/)
* **Styles** : CSS3 moderne natif (Variables CSS, Flexbox, CSS Grid, animations fluides)
* **Backend Cible** : NestJS (`http://localhost:3000`)
  * Route Services : `GET / PATCH http://localhost:3000/configurations/app.services`
  * Route Uploads : `POST http://localhost:3000/uploads` (`multipart/form-data`)

---

## 📦 Installation et Démarrage

### Prérequis
* Node.js (version 18 ou supérieure recommandée)
* Backend NestJS actif sur `http://localhost:3000`

### 1. Installer les dépendances
```bash
cd odc_backoffice
npm install
```

### 2. Lancer le serveur de développement
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:5173` (ou le port indiqué par Vite dans le terminal).

### 3. Construire pour la production
```bash
npm run build
```

---

## 📱 Intégration avec Flutter (ODC Super App)

1. **Services** : Dès qu'un service est ajouté, modifié ou supprimé dans ce Back Office, l'application mobile Flutter recharge la configuration via `GET /configurations/app.services` et affiche dynamiquement la liste mise à jour.
2. **Photos Trombinoscope** : Uploadez une image dans le Back Office, cliquez sur **« Copier l'URL »**, puis collez directement l'URL obtenue (`http://localhost:3000/uploads/...`) dans vos composants d'affichage Flutter (`Image.network(url)`).
