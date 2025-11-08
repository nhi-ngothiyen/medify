import 'package:flutter/material.dart';
import '../services/api_client.dart';

class DoctorHome extends StatefulWidget {
  const DoctorHome({super.key});
  @override
  State<DoctorHome> createState() => _DoctorHomeState();
}

class _DoctorHomeState extends State<DoctorHome> {
  final api = ApiClient();
  List<dynamic> appts = [];

  Future<void> _load() async {
    appts = await api.myAppointments();
    if (mounted) setState(() {});
  }

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Schedule')),
      body: SafeArea(
        child: ListView.separated(
          padding: const EdgeInsets.all(12),
          itemCount: appts.length,
          separatorBuilder: (_, __) => const SizedBox(height: 8),
          itemBuilder: (_, i) {
            final a = appts[i];
            return ListTile(
              tileColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              title: Text(a['patient_name'] ?? 'Unknown'),
              subtitle: Text('${a['start_at'] ?? ''} - ${a['end_at'] ?? ''}'),
            );
          },
        ),
      ),
    );
  }
}
