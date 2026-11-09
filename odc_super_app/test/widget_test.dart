// Tests de widgets Flutter pour l'application ODC Super App.
// Vérifie le comportement de l'interface en mode mobile et desktop,
// l'adaptation responsive et la gestion des états de chargement/erreur.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:odc_super_app/main.dart';

void main() {
  testWidgets('Mobile : affiche les éléments clés sans icône loupe dans le header', (
    WidgetTester tester,
  ) async {
    // Émulation d'un écran smartphone standard (iPhone 390x844)
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(const OdcCampusApp());

    // Vérifie la présence du logo ODC et des onglets mobiles
    expect(find.text('ODC'), findsOneWidget);
    expect(find.text('Services'), findsOneWidget);
    expect(find.text('Tâches'), findsOneWidget);
    expect(find.text('Profil'), findsOneWidget);

    // L'icône de loupe ne doit apparaître qu'UNE SEULE FOIS (dans la barre de recherche textuelle),
    // confirmant qu'elle a bien été retirée de l'en-tête supérieur droit.
    expect(find.byIcon(Icons.search_rounded), findsOneWidget);

    // Vérifie l'état de chargement initial puis le message d'erreur réseau de secours
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
    await tester.pump(const Duration(seconds: 1));
    expect(
      find.textContaining('Impossible de charger les services'),
      findsOneWidget,
    );
    expect(find.text('Réessayer'), findsOneWidget);
  });

  testWidgets('Desktop : active la Sidebar latérale et la disposition grand écran', (
    WidgetTester tester,
  ) async {
    // Émulation d'un écran desktop ou tablette large (1280x800)
    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(const OdcCampusApp());

    // En mode desktop, la BottomNavigationBar disparait au profit de la Sidebar
    expect(find.byType(BottomNavigationBar), findsNothing);
    expect(find.text('ODC CAMPUS'), findsOneWidget);
    expect(find.text('Tableau de bord'), findsOneWidget);
    expect(find.text('Services Applicatifs'), findsOneWidget);
  });
}

