# Config Server

Prototype full-stack de gestion de configurations. Le dépôt contient une API REST
NestJS/TypeScript reliée à MongoDB et une interface d’administration React/TypeScript
construite avec Vite et Material UI.

## Prérequis

- Node.js 20.19+ (ou 22.12+) et npm
- MongoDB en cours d’exécution sur `mongodb://127.0.0.1:27017`

Par défaut, l’API crée/utilise la base MongoDB `config-server`. La chaîne de connexion
est actuellement définie dans `backend/src/app.module.ts`.

## Démarrage en développement

Ouvrez trois terminaux depuis la racine du dépôt.

### 1. Démarrer MongoDB

Lancez votre service MongoDB local ou un conteneur MongoDB sur le port `27017`.

### 2. Installer et lancer l’API

```bash
cd backend
npm install
npm run start:dev
```

L’API NestJS écoute sur [http://localhost:3000](http://localhost:3000).

### 3. Installer et lancer l’interface

```bash
cd frontend
npm install
npm run dev
```

Vite affiche l’adresse locale à ouvrir, généralement
[http://localhost:5173](http://localhost:5173). L’interface utilise
`http://localhost:3000` comme URL d’API par défaut. Pour pointer vers un autre
serveur, définissez `VITE_API_URL` avant de lancer Vite, par exemple :

```bash
VITE_API_URL=http://localhost:3000 npm run dev
```

## Fonctionnalités

- Lister les configurations, leur statut et leur date de création.
- Créer une configuration avec une clé, un statut et une valeur JSON objet.
- Consulter et modifier le JSON ou le statut dans une boîte de dialogue.
- Supprimer une configuration après confirmation.
- Afficher les erreurs et confirmations dans des notifications Material UI.
- Adapter la liste en tableau sur grand écran et en cartes sur petit écran.

Les valeurs JSON doivent être des objets (pas des tableaux, des chaînes ou `null`).
Les clés acceptent des lettres, des chiffres, des points, des tirets et des
underscores.

## API

| Méthode | Route | Description |
| --- | --- | --- |
| `GET` | `/configurations` | Lister les configurations |
| `GET` | `/configurations/:key` | Lire une configuration par clé |
| `POST` | `/configurations` | Créer une configuration |
| `PATCH` | `/configurations/:key` | Modifier sa valeur et/ou son statut |
| `DELETE` | `/configurations/:key` | Supprimer une configuration |

Exemple de création :

```json
{
  "key": "programs.devops",
  "value": {
    "name": "DevOps"
  },
  "status": "active"
}
```

## Vérification et production

Exécutez les commandes depuis le dossier concerné :

```bash
# frontend
cd frontend
npm run lint
npm run build

# backend (dans un autre terminal)
cd backend
npm run lint
npm run build
npm test
```

Pour servir le build frontend en aperçu, lancez `npm run preview` après
`npm run build`. Pour lancer l’API compilée, utilisez `npm run start:prod`.
