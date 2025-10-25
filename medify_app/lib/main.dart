import 'package:flutter/material.dart';
import 'screens/login_screen.dart';
import 'screens/doctor_list_screen.dart';
import 'screens/doctor_detail_screen.dart';
import 'screens/appointments_screen.dart';


void main() {
  runApp(const MyApp());
}


class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Medify',
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.teal),
      initialRoute: '/',
      routes: {
        '/': (_) => const LoginScreen(),
        '/doctors': (_) => const DoctorListScreen(),
        '/doctor': (_) => const DoctorDetailScreen(),
        '/appointments': (_) => const AppointmentsScreen(),
      },
    );
  }
}