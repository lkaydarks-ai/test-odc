# Frontend ODC Campus - Back Office

Interface d'administration React et TypeScript du projet ODC Campus. Elle permet de gérer les configurations et d'ajouter des images au trombinoscope.

## Installation

```bash
npm install
```

## Lancer le frontend

```bash
npm run dev
```

L'application est généralement disponible sur l'adresse affichée par Vite dans le terminal.

## Backend nécessaire

Le Back Office utilise le serveur NestJS disponible sur `http://localhost:3000`.

Avant d'utiliser les fonctions de configuration ou d'upload, démarrez le backend :

```bash
npm run start:dev
```

## Trombinoscope

La section **Trombinoscope** se trouve en bas de la page d'administration.

Pour ajouter une image :

1. Cliquez sur le champ **Choisir un fichier**.
2. Sélectionnez une image sur votre appareil.
3. Cliquez sur **Uploader l’image**.
4. Attendez le message de confirmation.

Le frontend envoie le fichier au backend avec une requête `POST` vers `http://localhost:3000/uploads`. Le fichier est placé dans le champ `file` d’un objet `FormData`.

Après un upload réussi :

- Une confirmation verte apparaît.
- Le serveur renvoie l’URL de l’image.
- L’image est affichée sous le bouton dans la section Trombinoscope.

Si aucun fichier n’est sélectionné ou si le backend ne répond pas, un message rouge explique le problème.

## Vérifications

```bash
npm run build
npm run lint
```
