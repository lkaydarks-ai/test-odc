// ============================================================================
//  ODC Campus — Super App (prototype UI)
//  Fichier : lib/main.dart
// ============================================================================

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.light);
  runApp(const OdcCampusApp());
}

// ----------------------------------------------------------------------------
//  PALETTE DE COULEURS
// ----------------------------------------------------------------------------
class AppColors {
  static const Color noir = Color(0xFF000000);
  static const Color grisTresFonce = Color(0xFF161616);
  static const Color surface = Color(0xFF1E1E1E);
  static const Color orange = Color(0xFFFF7900);
  static const Color orangeLueur = Color(0x26FF7900);
  static const Color orangeClic = Color(0x33FF7900);
  static const Color orangeFond = Color(0x1AFF7900);
  static const Color enLigne = Color(0xFF2ECC71);
  static const Color texteSecondaire = Color(0xFF9E9E9E);
}

// ----------------------------------------------------------------------------
//  MODÈLE DE DONNÉES
// ----------------------------------------------------------------------------
class ServiceModel {
  final String name;
  final IconData icon;
  final String url;
  final Color color;

  const ServiceModel({
    required this.name,
    required this.icon,
    required this.url,
    this.color = AppColors.orange,
  });
}

// ----------------------------------------------------------------------------
//  DONNÉES DE TEST (MOCK) - URLs RÉELLES POUR LA DÉMO
// ----------------------------------------------------------------------------
const List<ServiceModel> servicesMock = [
  ServiceModel(
    name: 'Tâches',
    icon: Icons.checklist_rounded,
    url: 'https://flutter.dev', // Site officiel Flutter
  ),
  ServiceModel(
    name: 'Profil',
    icon: Icons.person_rounded,
    url: 'https://pub.dev', // Site officiel des packages Dart
  ),
  ServiceModel(
    name: 'Notifications',
    icon: Icons.notifications_rounded,
    url: 'https://www.orange.ci', // Site officiel Orange Côte d'Ivoire
  ),
  ServiceModel(
    name: 'Présences',
    icon: Icons.how_to_reg_rounded,
    url: 'https://dart.dev', // Site officiel Dart
  ),
];

// ----------------------------------------------------------------------------
//  APPLICATION RACINE
// ----------------------------------------------------------------------------
class OdcCampusApp extends StatelessWidget {
  const OdcCampusApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ODC Campus',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.noir,
        colorScheme: const ColorScheme.dark(
          primary: AppColors.orange,
          surface: AppColors.surface,
        ),
      ),
      home: const HomePage(),
    );
  }
}

// ----------------------------------------------------------------------------
//  PAGE D'ACCUEIL
// ----------------------------------------------------------------------------
class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final TextEditingController _rechercheController = TextEditingController();
  String _recherche = '';

  List<ServiceModel> get _servicesFiltres {
    final texte = _recherche.trim().toLowerCase();
    if (texte.isEmpty) return servicesMock;
    return servicesMock
        .where((service) => service.name.toLowerCase().contains(texte))
        .toList();
  }

  @override
  void dispose() {
    _rechercheController.dispose();
    super.dispose();
  }

  Future<void> _ouvrirService(ServiceModel service) async {
    final uri = Uri.parse(service.url);
    if (!await launchUrl(uri, webOnlyWindowName: '_blank')) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Impossible d'ouvrir ${service.name}")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final services = _servicesFiltres;

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [AppColors.noir, AppColors.grisTresFonce],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 16),
                const _EnTete(),
                const SizedBox(height: 24),
                _BarreRecherche(
                  controller: _rechercheController,
                  onChanged: (texte) => setState(() => _recherche = texte),
                ),
                const SizedBox(height: 24),
                Text(
                  'Mes services',
                  style: GoogleFonts.montserrat(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppColors.texteSecondaire,
                  ),
                ),
                const SizedBox(height: 12),
                Expanded(
                  child: services.isEmpty
                      ? const _AucunResultat()
                      : GridView.builder(
                          padding: const EdgeInsets.only(bottom: 24, top: 8),
                          itemCount: services.length,
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                crossAxisSpacing: 16,
                                mainAxisSpacing: 16,
                                childAspectRatio: 1,
                              ),
                          itemBuilder: (context, index) {
                            final service = services[index];
                            return _ServiceCard(
                              service: service,
                              onTap: () => _ouvrirService(service),
                            );
                          },
                        ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ----------------------------------------------------------------------------
//  EN-TÊTE
// ----------------------------------------------------------------------------
class _EnTete extends StatelessWidget {
  const _EnTete();

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Bienvenue sur',
              style: GoogleFonts.montserrat(
                fontSize: 13,
                color: AppColors.texteSecondaire,
              ),
            ),
            const SizedBox(height: 2),
            Text.rich(
              TextSpan(
                style: GoogleFonts.montserrat(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.5,
                ),
                children: const [
                  TextSpan(
                    text: 'ODC ',
                    style: TextStyle(color: Colors.white),
                  ),
                  TextSpan(
                    text: 'Campus',
                    style: TextStyle(color: AppColors.orange),
                  ),
                ],
              ),
            ),
          ],
        ),
        const _AvatarUtilisateur(),
      ],
    );
  }
}

// ----------------------------------------------------------------------------
//  AVATAR
// ----------------------------------------------------------------------------
class _AvatarUtilisateur extends StatelessWidget {
  const _AvatarUtilisateur();

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          padding: const EdgeInsets.all(2),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: AppColors.orange, width: 2),
          ),
          child: const CircleAvatar(
            radius: 24,
            backgroundColor: AppColors.surface,
            child: Icon(Icons.person_rounded, color: Colors.white70, size: 28),
          ),
        ),
        Positioned(
          right: 2,
          bottom: 2,
          child: Container(
            width: 14,
            height: 14,
            decoration: BoxDecoration(
              color: AppColors.enLigne,
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.noir, width: 2),
            ),
          ),
        ),
      ],
    );
  }
}

// ----------------------------------------------------------------------------
//  BARRE DE RECHERCHE
// ----------------------------------------------------------------------------
class _BarreRecherche extends StatelessWidget {
  final TextEditingController controller;
  final ValueChanged<String> onChanged;

  const _BarreRecherche({required this.controller, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      onChanged: onChanged,
      cursorColor: AppColors.orange,
      style: GoogleFonts.montserrat(color: Colors.white, fontSize: 14),
      decoration: InputDecoration(
        hintText: 'Rechercher un service...',
        hintStyle: GoogleFonts.montserrat(
          color: AppColors.texteSecondaire,
          fontSize: 14,
        ),
        prefixIcon: const Icon(Icons.search_rounded, color: AppColors.orange),
        filled: true,
        fillColor: AppColors.surface,
        contentPadding: const EdgeInsets.symmetric(vertical: 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(30),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(30),
          borderSide: const BorderSide(color: AppColors.orange, width: 1),
        ),
      ),
    );
  }
}

// ----------------------------------------------------------------------------
//  CARTE D'UN SERVICE
// ----------------------------------------------------------------------------
class _ServiceCard extends StatelessWidget {
  final ServiceModel service;
  final VoidCallback onTap;

  const _ServiceCard({required this.service, required this.onTap});

  @override
  Widget build(BuildContext context) {
    const rayon = BorderRadius.all(Radius.circular(20));

    return Container(
      decoration: const BoxDecoration(
        borderRadius: rayon,
        boxShadow: [
          BoxShadow(
            color: AppColors.orangeLueur,
            blurRadius: 20,
            spreadRadius: 1,
          ),
        ],
      ),
      child: Material(
        color: AppColors.surface,
        borderRadius: rayon,
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          splashColor: AppColors.orangeClic,
          highlightColor: AppColors.orangeFond,
          child: Column(
            children: [
              Expanded(
                child: Center(
                  child: Container(
                    width: 68,
                    height: 68,
                    decoration: const BoxDecoration(
                      color: AppColors.orangeFond,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      service.icon,
                      color: AppColors.orange,
                      size: 36,
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(bottom: 16, left: 8, right: 8),
                child: Text(
                  service.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.montserrat(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ----------------------------------------------------------------------------
//  AUCUN RÉSULTAT
// ----------------------------------------------------------------------------
class _AucunResultat extends StatelessWidget {
  const _AucunResultat();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(
            Icons.search_off_rounded,
            size: 48,
            color: AppColors.texteSecondaire,
          ),
          const SizedBox(height: 12),
          Text(
            'Aucun service trouvé',
            style: GoogleFonts.montserrat(
              color: AppColors.texteSecondaire,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}
