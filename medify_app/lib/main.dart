import 'package:flutter/material.dart';
import 'screens/login_screen.dart';
import 'screens/HomeScreen.dart';
import 'screens/doctor_detail_screen.dart';
import 'screens/appointments_screen.dart';
import 'screens/patient_home.dart';
import 'screens/doctor_home.dart';
import 'screens/favorites_page.dart';
import 'screens/chat_page.dart';
import 'screens/profile_page.dart';
import 'router/app_router.dart';


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
      routes: AppRouter.routes,
    );
  }
}