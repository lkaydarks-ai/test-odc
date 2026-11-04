// ignore_for_file: deprecated_member_use, avoid_web_libraries_in_flutter
import 'dart:html' as html;
import 'dart:ui_web' as ui_web;

import 'package:flutter/material.dart';

/// Affiche une page web dans une iframe sur les plateformes Flutter Web.
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
  late final String _viewType;

  @override
  void initState() {
    super.initState();

    // Chaque iframe reçoit une vue HTML unique pour pouvoir être enregistrée.
    _viewType = 'odc-webview-${identityHashCode(this)}';
    final iframe = html.IFrameElement()
      ..src = widget.url
      ..style.border = 'none'
      ..style.width = '100%'
      ..style.height = '100%';

    ui_web.platformViewRegistry.registerViewFactory(_viewType, (_) => iframe);
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
      body: HtmlElementView(viewType: _viewType),
    );
  }
}
