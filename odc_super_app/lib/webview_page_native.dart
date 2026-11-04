import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

/// Affiche une page web avec l'implémentation native du WebView.
class WebViewPage extends StatefulWidget {
  final String url;
  final String title;
  final Color themeColor;

  const WebViewPage({
    super.key,
    required this.url,
    required this.title,
    required this.themeColor,
  });

  @override
  State<WebViewPage> createState() => _WebViewPageState();
}

class _WebViewPageState extends State<WebViewPage> {
  late final WebViewController _controller;
  bool _chargementTermine = false;

  @override
  void initState() {
    super.initState();

    // Le contrôleur charge l'URL et masque l'indicateur une fois la page chargée.
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(Colors.black)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageFinished: (_) {
            if (mounted) {
              setState(() => _chargementTermine = true);
            }
          },
        ),
      )
      ..loadRequest(Uri.parse(widget.url));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        iconTheme: IconThemeData(color: widget.themeColor),
      ),
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          WebViewWidget(controller: _controller),
          if (!_chargementTermine)
            Center(child: CircularProgressIndicator(color: widget.themeColor)),
        ],
      ),
    );
  }
}
