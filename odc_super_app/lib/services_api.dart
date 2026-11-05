// lib/services_api.dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class ServicesApi {
  // L'adresse de ton Config Server (localhost fonctionne sur simulateur iOS)
  final String baseUrl = 'http://localhost:3000/configurations/app.services';

  Future<List<dynamic>> fetchServices() async {
    try {
      final response = await http.get(Uri.parse(baseUrl));
      
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        // On récupère le tableau "services" dans le JSON
        return data['value']['services'];
      } else {
        throw Exception('Erreur serveur: ${response.statusCode}');
      }
    } catch (e) {
      print('Erreur de connexion : $e');
      // Sécurité : Si le serveur est éteint, on renvoie des données de secours
      return [
        { "name": "Tâches", "url": "https://flutter.dev" },
        { "name": "Profil", "url": "https://pub.dev" },
      ];
    }
  }

    // Fonction pour récupérer l'URL de l'avatar de l'utilisateur
  Future<String?> fetchAvatarUrl() async {
    try {
      final response = await http.get(Uri.parse('http://localhost:3000/configurations/app.user_avatar'));
      
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        // On retourne l'URL contenue dans value.url
        return data['value']['url'];
      }
      return null;
    } catch (e) {
      print('Erreur chargement avatar: $e');
      return null;
    }
  }
} 