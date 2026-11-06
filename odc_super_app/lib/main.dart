import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

import 'services_api.dart';
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
      home: const MainNavigation(),
    );
  }
}

class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    // LayoutBuilder pour détecter la largeur disponible à la racine de l'application
    return LayoutBuilder(
      builder: (context, constraints) {
        // BREAKPOINT : 800px
        // - constraints.maxWidth < 800  -> Mobile (Design Max It avec BottomNavigationBar)
        // - constraints.maxWidth >= 800 -> Desktop / Web (Design Dashboard avec Sidebar fixe)
        final bool isDesktop = constraints.maxWidth >= 800;

        final List<Widget> pages = [
          HomePage(isDesktop: isDesktop),
          const TachesPage(),
          const ProfilPage(),
        ];

        // ====================================================================
        // DESIGN GRAND ÉCRAN (DESKTOP / WEB >= 800px) : DASHBOARD AVEC SIDEBAR
        // ====================================================================
        if (isDesktop) {
          return Scaffold(
            backgroundColor: AppColors.noir,
            body: Row(
              children: [
                // 1. Sidebar latérale gauche fixe (largeur 250px)
                _DesktopSidebar(
                  currentIndex: _currentIndex,
                  onDestinationSelected: (index) {
                    setState(() => _currentIndex = index);
                  },
                ),
                // 2. Zone de contenu principal à droite
                Expanded(
                  child: pages[_currentIndex],
                ),
              ],
            ),
            // La BottomNavigationBar est complètement supprimée sur Desktop
          );
        }

        // ====================================================================
        // DESIGN MOBILE INITIAL (< 800px) : DESIGN MAX IT
        // ====================================================================
        return Scaffold(
          body: pages[_currentIndex],
          bottomNavigationBar: BottomNavigationBar(
            currentIndex: _currentIndex,
            onTap: (index) => setState(() => _currentIndex = index),
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
        );
      },
    );
  }
}

/// Sidebar personnalisée pour grand écran (Web / Desktop)
class _DesktopSidebar extends StatefulWidget {
  final int currentIndex;
  final ValueChanged<int> onDestinationSelected;

  const _DesktopSidebar({
    required this.currentIndex,
    required this.onDestinationSelected,
  });

  @override
  State<_DesktopSidebar> createState() => _DesktopSidebarState();
}

class _DesktopSidebarState extends State<_DesktopSidebar> {
  String? _avatarUrl;

  @override
  void initState() {
    super.initState();
    _chargerAvatar();
  }

  Future<void> _chargerAvatar() async {
    final avatar = await ServicesApi().fetchAvatarUrl();
    if (mounted) {
      setState(() => _avatarUrl = avatar);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 250,
      height: double.infinity,
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border(
          right: BorderSide(
            color: Colors.white.withValues(alpha: 0.08),
            width: 1,
          ),
        ),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Logo ODC en haut de la sidebar
              Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: AppColors.orange,
                      borderRadius: BorderRadius.circular(10),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.orange.withValues(alpha: 0.35),
                          blurRadius: 10,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Text(
                      'ODC',
                      style: GoogleFonts.montserrat(
                        color: AppColors.blanc,
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'ODC CAMPUS',
                        style: GoogleFonts.montserrat(
                          color: AppColors.blanc,
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.5,
                        ),
                      ),
                      Text(
                        'Tableau de bord',
                        style: GoogleFonts.montserrat(
                          color: AppColors.orange,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 32),

              Text(
                'MENU PRINCIPAL',
                style: GoogleFonts.montserrat(
                  color: Colors.grey.shade500,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.1,
                ),
              ),
              const SizedBox(height: 12),

              // Liens de navigation : Accueil, Tâches, Profil
              _SidebarNavItem(
                icon: Icons.home_rounded,
                label: 'Accueil',
                isSelected: widget.currentIndex == 0,
                onTap: () => widget.onDestinationSelected(0),
              ),
              const SizedBox(height: 8),
              _SidebarNavItem(
                icon: Icons.assignment_rounded,
                label: 'Tâches',
                isSelected: widget.currentIndex == 1,
                onTap: () => widget.onDestinationSelected(1),
              ),
              const SizedBox(height: 8),
              _SidebarNavItem(
                icon: Icons.person_rounded,
                label: 'Profil',
                isSelected: widget.currentIndex == 2,
                onTap: () => widget.onDestinationSelected(2),
              ),

              const Spacer(),

              // Avatar & profil apprenant en bas de la sidebar
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.grisTresFonce,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.06),
                  ),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 20,
                      backgroundColor: AppColors.surface,
                      backgroundImage: _avatarUrl != null
                          ? NetworkImage(_avatarUrl!)
                          : null,
                      child: _avatarUrl == null
                          ? const Icon(
                              Icons.person_rounded,
                              color: AppColors.blanc,
                              size: 22,
                            )
                          : null,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            'Apprenant ODC',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: GoogleFonts.montserrat(
                              color: AppColors.blanc,
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          Row(
                            children: [
                              Container(
                                width: 7,
                                height: 7,
                                decoration: const BoxDecoration(
                                  color: Color(0xFF10B981),
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 5),
                              Text(
                                'En ligne',
                                style: GoogleFonts.montserrat(
                                  color: Colors.grey.shade400,
                                  fontSize: 11,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Tuile de navigation pour la sidebar desktop
class _SidebarNavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _SidebarNavItem({
    required this.icon,
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(10),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          decoration: BoxDecoration(
            color: isSelected
                ? AppColors.orange.withValues(alpha: 0.15)
                : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isSelected
                  ? AppColors.orange.withValues(alpha: 0.3)
                  : Colors.transparent,
            ),
          ),
          child: Row(
            children: [
              Icon(
                icon,
                color: isSelected ? AppColors.orange : Colors.grey.shade400,
                size: 20,
              ),
              const SizedBox(width: 14),
              Text(
                label,
                style: GoogleFonts.montserrat(
                  color: isSelected ? AppColors.blanc : Colors.grey.shade400,
                  fontSize: 13,
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class TachesPage extends StatelessWidget {
  const TachesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      color: AppColors.noir,
      child: const Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.assignment_rounded, color: AppColors.orange, size: 48),
            SizedBox(height: 16),
            Text(
              'Mes Tâches',
              style: TextStyle(
                color: AppColors.blanc,
                fontSize: 20,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ProfilPage extends StatelessWidget {
  const ProfilPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      color: AppColors.noir,
      child: const Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.person_rounded, color: AppColors.orange, size: 48),
            SizedBox(height: 16),
            Text(
              'Mon Profil',
              style: TextStyle(
                color: AppColors.blanc,
                fontSize: 20,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class HomePage extends StatefulWidget {
  final bool isDesktop;
  const HomePage({super.key, this.isDesktop = false});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final TextEditingController _rechercheController = TextEditingController();
  String _recherche = '';
  late final Future<List<ServiceModel>> _servicesFuture;

  @override
  void initState() {
    super.initState();
    _servicesFuture = _chargerServices();
  }

  Future<List<ServiceModel>> _chargerServices() async {
    final services = await ServicesApi().fetchServices();

    return services.map((service) {
      final data = Map<String, dynamic>.from(service as Map);
      return ServiceModel(
        name: data['name'] as String,
        icon: _iconePourService(data['name'] as String),
        url: data['url'] as String,
      );
    }).toList();
  }

  IconData _iconePourService(String nom) {
    switch (nom.toLowerCase()) {
      case 'tâches':
      case 'taches':
        return Icons.checklist_rounded;
      case 'profil':
        return Icons.person_rounded;
      case 'notifications':
        return Icons.notifications_rounded;
      case 'présences':
      case 'presences':
        return Icons.how_to_reg_rounded;
      case 'cohortes':
        return Icons.groups_rounded;
      case 'certifs':
        return Icons.workspace_premium_rounded;
      case 'forum':
        return Icons.forum_rounded;
      case 'paramètres':
      case 'parametres':
        return Icons.settings_rounded;
      default:
        return Icons.apps_rounded;
    }
  }

  List<ServiceModel> _servicesFiltres(List<ServiceModel> services) {
    final texteRecherche = _recherche.trim().toLowerCase();

    // Sans texte saisi, toutes les cartes restent visibles.
    if (texteRecherche.isEmpty) {
      return services;
    }

    // Chaque frappe compare le texte saisi avec le nom du service.
    return services.where((service) {
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

  /// Construit la GridView des services selon le nombre de colonnes et les espacements souhaités.
  Widget _buildServicesGrid({
    required int crossAxisCount,
    required double childAspectRatio,
    required double spacing,
  }) {
    return FutureBuilder<List<ServiceModel>>(
      future: _servicesFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const SizedBox(
            height: 160,
            child: Center(
              child: CircularProgressIndicator(
                color: AppColors.orange,
              ),
            ),
          );
        }

        final services = _servicesFiltres(snapshot.data ?? const []);
        if (services.isEmpty) {
          return const SizedBox(height: 160, child: _AucunResultat());
        }

        return GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: services.length,
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            mainAxisSpacing: spacing,
            crossAxisSpacing: spacing,
            childAspectRatio: childAspectRatio,
          ),
          itemBuilder: (context, index) {
            final service = services[index];
            return _ServiceCard(
              service: service,
              onTap: () => _ouvrirService(service),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isDesktop = widget.isDesktop;

    return Container(
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
        child: isDesktop
            // ================================================================
            // DESIGN DESKTOP / WEB (>= 800px) : DASHBOARD CENTRÉ AVEC GRILLE 6 COLONNES
            // ================================================================
            ? Center(
                child: ConstrainedBox(
                  // Largeur maximale fixée à 1200px pour éviter tout étirement disgracieux
                  constraints: const BoxConstraints(maxWidth: 1200),
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 36, vertical: 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // En-tête Desktop (sans doublon de logo ni d'avatar qui sont déjà dans la Sidebar)
                        const _EnTete(isDesktop: true),
                        const SizedBox(height: 20),

                        // Bannière DevOps
                        const _BanniereDevOps(),
                        const SizedBox(height: 20),

                        // Barre de recherche
                        _BarreRecherche(
                          controller: _rechercheController,
                          onChanged: (texte) {
                            setState(() => _recherche = texte);
                          },
                        ),
                        const SizedBox(height: 24),

                        // Carrousel avec hauteur fixe (200px) et largeur maîtrisée (ne prend pas toute la largeur)
                        Align(
                          alignment: Alignment.center,
                          child: ConstrainedBox(
                            constraints: const BoxConstraints(maxWidth: 850),
                            child: const _BanniereCarrousel(height: 200),
                          ),
                        ),
                        const SizedBox(height: 28),

                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            'Services Applicatifs',
                            style: GoogleFonts.montserrat(
                              color: AppColors.blanc,
                              fontSize: 20,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Grille des services en 6 COLONNES sur Desktop
                        _buildServicesGrid(
                          crossAxisCount: 6,
                          childAspectRatio: 1.05,
                          spacing: 16,
                        ),
                        const SizedBox(height: 32),
                      ],
                    ),
                  ),
                ),
              )
            // ================================================================
            // DESIGN MOBILE (< 800px) : DESIGN MAX IT INITIAL AVEC GRILLE 4 COLONNES
            // ================================================================
            : SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  children: [
                    const SizedBox(height: 14),
                    const _EnTete(isDesktop: false),
                    const SizedBox(height: 18),
                    const _BanniereDevOps(),
                    const SizedBox(height: 18),
                    _BarreRecherche(
                      controller: _rechercheController,
                      onChanged: (texte) {
                        setState(() => _recherche = texte);
                      },
                    ),
                    const SizedBox(height: 24),

                    // Carrousel mobile pleine largeur (hauteur standard 160px)
                    const _BanniereCarrousel(height: 160),
                    const SizedBox(height: 22),

                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Services',
                        style: GoogleFonts.montserrat(
                          color: AppColors.blanc,
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Grille des services en 4 COLONNES sur Mobile
                    _buildServicesGrid(
                      crossAxisCount: 4,
                      childAspectRatio: 0.8,
                      spacing: 10,
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
      ),
    );
  }
}

/// Affiche les actions du header et charge l'avatar utilisateur depuis le serveur.
class _EnTete extends StatefulWidget {
  final bool isDesktop;
  const _EnTete({this.isDesktop = false});

  @override
  State<_EnTete> createState() => _EnTeteState();
}

class _EnTeteState extends State<_EnTete> {
  String? _avatarUrl;

  @override
  void initState() {
    super.initState();
    _chargerAvatar();
  }

  /// Charge l'adresse de la photo dès l'ouverture de l'écran.
  Future<void> _chargerAvatar() async {
    final avatarUrl = await ServicesApi().fetchAvatarUrl();
    if (!mounted) return;

    setState(() {
      _avatarUrl = avatarUrl;
    });
  }

  @override
  Widget build(BuildContext context) {
    // Version Desktop : Le logo et l'avatar sont déjà dans la Sidebar latérale gauche.
    // On affiche un bandeau de bienvenue avec notifications actives.
    if (widget.isDesktop) {
      return Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Bienvenue sur votre espace ODC Campus',
                style: GoogleFonts.montserrat(
                  color: AppColors.blanc,
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Formations, projets et services disponibles en temps réel',
                style: GoogleFonts.montserrat(
                  color: Colors.grey.shade400,
                  fontSize: 12,
                ),
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
            ),
            child: Row(
              children: [
                const Icon(Icons.notifications_none_rounded, color: AppColors.orange, size: 18),
                const SizedBox(width: 8),
                Text(
                  'Notifications actives',
                  style: GoogleFonts.montserrat(color: AppColors.blanc, fontSize: 12, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ),
        ],
      );
    }

    // Version Mobile : Logo ODC, recherche, cloche et CircleAvatar
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
        CircleAvatar(
          radius: 18,
          backgroundColor: AppColors.surface,
          backgroundImage: _avatarUrl == null
              ? null
              : NetworkImage(_avatarUrl!),
          child: _avatarUrl == null
              ? const Icon(
                  Icons.person_rounded,
                  color: AppColors.blanc,
                  size: 22,
                )
              : null,
        ),
      ],
    );
  }
}

/// Affiche une bannière qui défile automatiquement et indique la page courante.
class _BanniereCarrousel extends StatefulWidget {
  final double height;
  const _BanniereCarrousel({super.key, this.height = 160});

  @override
  State<_BanniereCarrousel> createState() => _BanniereCarrouselState();
}

class _BanniereCarrouselState extends State<_BanniereCarrousel> {
  static const List<String> _images = [
    'assets/images/banner_student.jpeg',
    'assets/images/banner_student_3.jpeg',
    'assets/images/banner_student_2.jpeg',
    'assets/images/banner_student_1.jpeg',
    'assets/images/banner_student_4.jpeg',
  ];

  int _indexCourant = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(15),
          child: CarouselSlider(
            options: CarouselOptions(
              height: widget.height,
              viewportFraction: 1,
              autoPlay: true,
              // Le slider passe automatiquement à l'image suivante toutes les 3 secondes.
              autoPlayInterval: const Duration(seconds: 3),
              onPageChanged: (index, reason) {
                setState(() => _indexCourant = index);
              },
            ),
            items: _images.map((chemin) {
              return SizedBox(
                width: double.infinity,
                child: Image.asset(chemin, fit: BoxFit.cover),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 10),
        // Ces points représentent les images disponibles et mettent la courante en évidence.
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(_images.length, (index) {
            final estSelectionne = index == _indexCourant;
            return AnimatedContainer(
              duration: const Duration(milliseconds: 250),
              width: estSelectionne ? 10 : 7,
              height: estSelectionne ? 10 : 7,
              margin: const EdgeInsets.symmetric(horizontal: 3),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: estSelectionne
                    ? AppColors.orange
                    : AppColors.blanc.withValues(alpha: 0.45),
              ),
            );
          }),
        ),
      ],
    );
  }
}

class _BanniereDevOps extends StatelessWidget {
  const _BanniereDevOps();

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(14),
      child: Stack(
        children: [
          Positioned.fill(
            child: Image.asset(
              'assets/images/banner_odc.png',
              fit: BoxFit.cover,
            ),
          ),
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                  colors: [Colors.transparent, Colors.black87],
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
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
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
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
                  child: FittedBox(
                    fit: BoxFit.scaleDown,
                    alignment: Alignment.topCenter,
                    child: Text(
                      service.name,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      textAlign: TextAlign.center,
                      style: GoogleFonts.montserrat(
                        color: AppColors.blanc,
                        fontSize: 10,
                        fontWeight: FontWeight.w500,
                        height: 1.15,
                      ),
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
