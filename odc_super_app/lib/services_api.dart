// lib/services_api.dart
import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;

class ServicesApi {
  // Pour un iPhone physique, remplacer cette valeur par l'IP locale du Mac,
  // ou lancer l'app avec --dart-define=API_BASE_URL=http://192.168.x.x:3000.
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:3000',
  );
  static const String servicesPath = '/configurations/app.services';

  // URL complète : GET http://localhost:3000/configurations/app.services.
  Uri get _servicesUri => Uri.parse('$apiBaseUrl$servicesPath');

  Future<List<dynamic>> fetchServices() async {
    final http.Response response;
    try {
      response = await http
          .get(_servicesUri)
          .timeout(const Duration(seconds: 10));
    } on TimeoutException {
      throw Exception(
        'Le serveur de configuration ne répond pas après 10 secondes.',
      );
    } on Exception catch (error) {
      // Les erreurs de réseau sont distinctes d'une réponse HTTP 404/500.
      throw Exception('Impossible de joindre $apiBaseUrl : $error');
    }

    if (response.statusCode != 200) {
      final detail = _extraireMessageErreur(response.body);
      if (response.statusCode == 404) {
        throw Exception(
          'GET $_servicesUri a répondu 404${detail == null ? '.' : ' : $detail'} '
          'Vérifiez que la configuration "app.services" existe dans MongoDB.',
        );
      }
      throw Exception(
        'GET $_servicesUri a répondu avec le code ${response.statusCode}'
        '${detail == null ? '.' : ' : $detail'}',
      );
    }

    final dynamic data;
    try {
      data = json.decode(response.body);
    } on FormatException {
      throw Exception('La réponse du serveur contient un JSON invalide.');
    }

    // Vérifie la structure attendue avant de transmettre les services à l'interface.
    if (data is! Map<String, dynamic> ||
        data['value'] is! Map<String, dynamic> ||
        (data['value'] as Map<String, dynamic>)['services'] is! List) {
      throw Exception(
        'La réponse ne contient pas la liste des services attendue.',
      );
    }

    return (data['value'] as Map<String, dynamic>)['services'] as List<dynamic>;
  }

  // Extrait le détail envoyé par NestJS pour faciliter le diagnostic HTTP.
  String? _extraireMessageErreur(String body) {
    try {
      final decoded = json.decode(body);
      if (decoded is Map<String, dynamic>) {
        final message = decoded['message'];
        if (message is String) return message;
        if (message is List) return message.join(', ');
      }
    } on FormatException {
      // Le serveur peut répondre avec du texte brut plutôt qu'un JSON.
    }
    final texte = body.trim();
    return texte.isEmpty ? null : texte;
  }

  // Récupère l'URL de l'avatar de l'utilisateur.
  // Garanti sans crash : renvoie null si le serveur est éteint, si la route répond 404, 500, etc.
  Future<String?> fetchAvatarUrl() async {
    try {
      final uri = Uri.tryParse('$apiBaseUrl/configurations/app.user_avatar');
      if (uri == null) return null;

      final response = await http
          .get(uri)
          .timeout(const Duration(seconds: 5));

      // Si le code HTTP est différent de 200 (ex: 404 si la config n'existe pas encore, 500, etc.),
      // on renvoie null de façon propre et silencieuse.
      if (response.statusCode != 200) {
        return null;
      }

      final dynamic data = json.decode(response.body);
      // Vérification stricte des types pour éviter tout TypeError en mode Web / Release
      if (data is Map<String, dynamic> &&
          data['value'] is Map<String, dynamic>) {
        final dynamic url = (data['value'] as Map<String, dynamic>)['url'];
        if (url is String && url.trim().isNotEmpty) {
          return url.trim();
        }
      }
      return null;
    } catch (_) {
      // L'avatar est strictement optionnel : toute exception réseau (CORS, 404, timeout, socket)
      // renvoie null pour ne jamais bloquer le rendu de l'interface.
      return null;
    }
  }
}
