// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter_test/flutter_test.dart';

import 'package:odc_super_app/main.dart';

void main() {
  testWidgets('Displays the service list', (WidgetTester tester) async {
    await tester.pumpWidget(const OdcCampusApp());

    expect(find.text('Bienvenue sur'), findsOneWidget);
    expect(find.text('Mes services'), findsOneWidget);
    expect(find.text('Tâches'), findsOneWidget);
  });
}
