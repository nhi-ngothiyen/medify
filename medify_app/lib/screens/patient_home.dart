import 'package:flutter/material.dart';
import '../services/api_client.dart';
import '../widgets/top_calendar.dart';
import '../widgets/doctor_card.dart';
import '../components/NavBar.dart';

class PatientHome extends StatefulWidget {
  const PatientHome({super.key});
  @override
  State<PatientHome> createState() => _PatientHomeState();
}

class _PatientHomeState extends State<PatientHome> {
  final api = ApiClient();
  List<dynamic> doctors = [];

  Future<void> _load() async {
    doctors = await api.searchDoctors();
    if (mounted) setState(() {});
  }

  @override
  void initState() {
    super.initState();
    _load();
  }

  int _currentIndex = 0;

  void _onNavTap(int idx) {
    setState(() => _currentIndex = idx);
    switch (idx) {
      case 0:
        // home - already here
        break;
      case 1:
        Navigator.pushNamed(context, '/chat');
        break;
      case 2:
        Navigator.pushNamed(context, '/profile');
        break;
      case 3:
        Navigator.pushNamed(context, '/appointments');
        break;
      case 4:
        Navigator.pushNamed(context, '/favorites');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F6FF),
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 12),
            // top greeting + icons would normally be here
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.0),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text('Hi, WelcomeBack', style: TextStyle(color: Colors.grey)),
              ),
            ),
            const SizedBox(height: 8),
            const TopCalendar(),
            const SizedBox(height: 12),
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                itemCount: doctors.length,
                itemBuilder: (_, i) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: DoctorCard(data: doctors[i]),
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: NavBar(currentIndex: _currentIndex, onTap: _onNavTap),
    );
  }
}
