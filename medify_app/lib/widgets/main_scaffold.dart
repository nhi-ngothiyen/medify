import 'package:flutter/material.dart';
import '../services/api_client.dart';

class MainScaffold extends StatelessWidget {
  final String title;
  final Widget body;
  const MainScaffold({super.key, required this.title, required this.body});

  void _doLogout(BuildContext context) async {
    final api = ApiClient();
    await api.logout();
    if (context.mounted) {
      Navigator.pushNamedAndRemoveUntil(context, '/', (r) => false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => _doLogout(context),
            tooltip: 'Logout',
          )
        ],
      ),
      body: body,
    );
  }
}
