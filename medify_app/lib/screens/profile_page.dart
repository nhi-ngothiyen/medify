import 'package:flutter/material.dart';
import '../services/api_client.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});
  @override
  Widget build(BuildContext context) {
    Future<void> _doLogout() async {
      final api = ApiClient();
      await api.logout();
      if (context.mounted) {
        Navigator.pushNamedAndRemoveUntil(context, '/', (r) => false);
      }
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Profile page placeholder'),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: _doLogout,
              icon: const Icon(Icons.logout),
              label: const Text('Logout'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.redAccent,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
