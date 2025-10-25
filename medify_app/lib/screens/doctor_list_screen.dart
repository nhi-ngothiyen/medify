import 'package:flutter/material.dart';
import '../services/api_client.dart';


class DoctorListScreen extends StatefulWidget {
  const DoctorListScreen({super.key});
  @override State<DoctorListScreen> createState() => _S();
}


class _S extends State<DoctorListScreen> {
  final api = ApiClient();
  List<dynamic> items = [];


  Future<void> _load() async {
    items = await api.searchDoctors();
    setState(() {});
  }


  @override void initState() { super.initState(); _load(); }


  @override
  Widget build(BuildContext ctx) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tìm bác sĩ')),
      body: ListView.builder(
        itemCount: items.length,
        itemBuilder: (_, i) {
          final d = items[i];
          return ListTile(
            title: Text(d['full_name'] ?? ''),
            subtitle: Text('${d['specialty']} • ⭐ ${d['avg_rating'] ?? 0.0}'),
            onTap: () => Navigator.pushNamed(context, '/doctor', arguments: d['id']),
          );
        },
      ),
    );
  }
}