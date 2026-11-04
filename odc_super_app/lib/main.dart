import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

import 'webview_page.dart';

void main() {
  // Cette configuration garde les icones de la barre Android visibles sur fond sombre.
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.light);
  runApp(const OdcCampusApp());
}

/// Regroupe toutes les couleurs importantes afin de conserver un style uniforme.
class AppColors {
  static const Color noir = Color(0xFF000000);
  static const Color grisTresFonce = Color(0xFF161616);
  static const Color surface = Color(0xFF1E1E1E);
  static const Color orange = Color(0xFFFF7900);
  static const Color blanc = Color(0xFFFFFFFF);
}

/// Décrit les informations nécessaires pour afficher un service de l'application.
class ServiceModel {
  final String name;
  final IconData icon;
  final String url;

  const ServiceModel({
    required this.name,
    required this.icon,
    required this.url,
  });
}

/// Données factices utilisées par le prototype de la page d'accueil.
const List<ServiceModel> servicesMock = [
  ServiceModel(
    name: 'Tâches',
    icon: Icons.checklist_rounded,
    url: 'https://flutter.dev',
  ),
  ServiceModel(
    name: 'Profil',
    icon: Icons.person_rounded,
    url: 'https://flutter.dev',
  ),
  ServiceModel(
    name: 'Notifications',
    icon: Icons.notifications_rounded,
    url: 'https://flutter.dev',
  ),
  ServiceModel(
    name: 'Présences',
    icon: Icons.how_to_reg_rounded,
    url: 'https://flutter.dev',
  ),
  ServiceModel(
    name: 'Cohortes',
    icon: Icons.groups_rounded,
    url: 'https://flutter.dev',
  ),
  ServiceModel(
    name: 'Certifs',
    icon: Icons.workspace_premium_rounded,
    url: 'https://flutter.dev',
  ),
  ServiceModel(
    name: 'Forum',
    icon: Icons.forum_rounded,
    url: 'https://flutter.dev',
  ),
  ServiceModel(
    name: 'Paramètres',
    icon: Icons.settings_rounded,
    url: 'https://flutter.dev',
  ),
];

class OdcCampusApp extends StatelessWidget {
  const OdcCampusApp({super.key});

  @override
  Widget build(BuildContext context) {
    final baseTheme = ThemeData.dark();

    return MaterialApp(
      title: 'ODC Campus',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.noir,
        colorScheme: baseTheme.colorScheme.copyWith(
          primary: AppColors.orange,
          surface: AppColors.surface,
        ),
        fontFamily: GoogleFonts.montserrat().fontFamily,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final TextEditingController _rechercheController = TextEditingController();
  String _recherche = '';
  int _ongletActif = 0;

  List<ServiceModel> get _servicesFiltres {
    final texteRecherche = _recherche.trim().toLowerCase();

    // Sans texte saisi, toutes les cartes restent visibles.
    if (texteRecherche.isEmpty) {
      return servicesMock;
    }

    // Chaque frappe compare le texte saisi avec le nom du service.
    return servicesMock.where((service) {
      return service.name.toLowerCase().contains(texteRecherche);
    }).toList();
  }

  @override
  void dispose() {
    // Le contrôleur doit être libéré pour éviter une fuite de mémoire.
    _rechercheController.dispose();
    super.dispose();
  }

  void _ouvrirService(ServiceModel service) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => WebViewPage(
          url: service.url,
          title: service.name,
          themeColor: AppColors.orange,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [AppColors.noir, AppColors.grisTresFonce],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: CustomScrollView(
                    slivers: [
                      const SliverToBoxAdapter(child: SizedBox(height: 14)),
                      const SliverToBoxAdapter(child: _EnTete()),
                      const SliverToBoxAdapter(child: SizedBox(height: 18)),
                      const SliverToBoxAdapter(child: _BanniereDevOps()),
                      const SliverToBoxAdapter(child: SizedBox(height: 18)),
                      SliverToBoxAdapter(
                        child: _BarreRecherche(
                          controller: _rechercheController,
                          onChanged: (texte) {
                            setState(() => _recherche = texte);
                          },
                        ),
                      ),
                      const SliverToBoxAdapter(child: SizedBox(height: 22)),
                      SliverToBoxAdapter(
                        child: Text(
                          'Services',
                          style: GoogleFonts.montserrat(
                            color: AppColors.blanc,
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                      const SliverToBoxAdapter(child: SizedBox(height: 12)),
                      if (_servicesFiltres.isEmpty)
                        const SliverFillRemaining(
                          hasScrollBody: false,
                          child: _AucunResultat(),
                        )
                      else
                        SliverGrid(
                          delegate: SliverChildBuilderDelegate((
                            context,
                            index,
                          ) {
                            final service = _servicesFiltres[index];
                            return _ServiceCard(
                              service: service,
                              onTap: () => _ouvrirService(service),
                            );
                          }, childCount: _servicesFiltres.length),
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 4,
                                mainAxisSpacing: 10,
                                crossAxisSpacing: 10,
                                childAspectRatio: 0.8,
                              ),
                        ),
                      const SliverToBoxAdapter(child: SizedBox(height: 20)),
                    ],
                  ),
                ),
              ),
              BottomNavigationBar(
                currentIndex: _ongletActif,
                onTap: (index) => setState(() => _ongletActif = index),
                backgroundColor: AppColors.surface,
                selectedItemColor: AppColors.orange,
                unselectedItemColor: Colors.grey,
                selectedLabelStyle: GoogleFonts.montserrat(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
                unselectedLabelStyle: GoogleFonts.montserrat(fontSize: 12),
                items: const [
                  BottomNavigationBarItem(
                    icon: Icon(Icons.home_rounded),
                    label: 'Accueil',
                  ),
                  BottomNavigationBarItem(
                    icon: Icon(Icons.assignment_rounded),
                    label: 'Tâches',
                  ),
                  BottomNavigationBarItem(
                    icon: Icon(Icons.person_rounded),
                    label: 'Profil',
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _EnTete extends StatelessWidget {
  const _EnTete();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 44,
          height: 44,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: AppColors.orange,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            'ODC',
            style: GoogleFonts.montserrat(
              color: AppColors.blanc,
              fontSize: 13,
              fontWeight: FontWeight.w800,
            ),
          ),
        ),
        const Spacer(),
        const Icon(Icons.search_rounded, color: AppColors.blanc),
        const SizedBox(width: 16),
        const Icon(Icons.notifications_none_rounded, color: AppColors.blanc),
        const SizedBox(width: 16),
        const CircleAvatar(
          radius: 18,
          backgroundColor: AppColors.surface,
          child: Icon(Icons.person_rounded, color: AppColors.blanc, size: 22),
        ),
      ],
    );
  }
}

class _BanniereDevOps extends StatelessWidget {
  const _BanniereDevOps();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF252525), Color(0xFF171717)],
        ),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.orange, width: 0.8),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              'Rejoignez la Promo DevOps',
              maxLines: 2,
              style: GoogleFonts.montserrat(
                color: AppColors.blanc,
                fontSize: 15,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          const SizedBox(width: 10),
          ElevatedButton(
            onPressed: () {},
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.orange,
              foregroundColor: AppColors.blanc,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(7),
              ),
            ),
            child: Text(
              'Cliquez ici',
              style: GoogleFonts.montserrat(
                fontSize: 10,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

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
      style: GoogleFonts.montserrat(color: AppColors.blanc, fontSize: 13),
      decoration: InputDecoration(
        hintText: 'Rechercher un service...',
        hintStyle: GoogleFonts.montserrat(color: Colors.grey, fontSize: 13),
        prefixIcon: const Icon(Icons.search_rounded, color: AppColors.orange),
        filled: true,
        fillColor: AppColors.surface,
        contentPadding: const EdgeInsets.symmetric(vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.orange, width: 1),
        ),
      ),
    );
  }
}

class _ServiceCard extends StatelessWidget {
  final ServiceModel service;
  final VoidCallback onTap;

  const _ServiceCard({required this.service, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.surface,
      borderRadius: BorderRadius.circular(12),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        splashColor: AppColors.orange.withValues(alpha: 0.2),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 8),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: AppColors.orange.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(service.icon, color: AppColors.orange, size: 22),
              ),
              const SizedBox(height: 8),
              Expanded(
                child: Align(
                  alignment: Alignment.topCenter,
                  child: Text(
                    service.name,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.center,
                    style: GoogleFonts.montserrat(
                      color: AppColors.blanc,
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      height: 1.15,
                    ),
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

class _AucunResultat extends StatelessWidget {
  const _AucunResultat();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.search_off_rounded, size: 44, color: Colors.grey),
          const SizedBox(height: 10),
          Text(
            'Aucun service trouvé',
            style: GoogleFonts.montserrat(color: Colors.grey, fontSize: 13),
          ),
        ],
      ),
    );
  }
}
