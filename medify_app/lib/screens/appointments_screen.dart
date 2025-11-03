import 'package:flutter/material.dart';
import '../services/api_client.dart';
import '../widgets/main_scaffold.dart';


class AppointmentsScreen extends StatefulWidget {
  const AppointmentsScreen({super.key});
  @override State<AppointmentsScreen> createState() => _S();
}


class _S extends State<AppointmentsScreen> {
  final api = ApiClient();
  List<dynamic> items = [];
  Future<void> _load() async { items = await api.myAppointments(); setState((){}); }
  @override void initState(){ super.initState(); _load(); }
  @override Widget build(BuildContext ctx){
    return MainScaffold(
      title: 'Cuộc hẹn của tôi',
      body: ListView.builder(
          itemCount: items.length,
          itemBuilder: (_, i){ final a = items[i];
          return ListTile(
            title: Text('Cuộc hẹn #${a['id']}'),
            subtitle: Text('${a['start_at']} - ${a['status']}'),
          );
          }),
    );
  }
}