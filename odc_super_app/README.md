# odc_super_app

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Learn Flutter](https://docs.flutter.dev/get-started/learn-flutter)
- [Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Flutter learning resources](https://docs.flutter.dev/reference/learning-resources)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.

## Modifier les images du carrousel

Le carrousel de la page d'accueil utilise cinq images JPEG présentes dans
`assets/images/` :

- `banner_student.jpeg`
- `banner_student_1.jpeg`
- `banner_student_2.jpeg`
- `banner_student_3.jpeg`
- `banner_student_4.jpeg`

Pour modifier une image, remplacez le fichier correspondant en conservant son
nom, son dossier et son format `.jpeg`. Vous pouvez aussi ajouter ou retirer
une image dans la liste `_images` de `lib/main.dart`, puis déclarer le nouveau
fichier dans la section `assets` du fichier `pubspec.yaml`.

Après toute modification des fichiers présents dans `assets`, exécutez :

```bash
flutter pub get
flutter run
```
