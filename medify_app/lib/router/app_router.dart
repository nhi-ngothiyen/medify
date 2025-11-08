import 'package:flutter/widgets.dart';

import '../screens/login_screen.dart';
import '../screens/HomeScreen.dart';
import '../screens/doctor_detail_screen.dart';
import '../screens/appointments_screen.dart';
import '../screens/patient_home.dart';
import '../screens/doctor_home.dart';
import '../screens/favorites_page.dart';
import '../screens/chat_page.dart';
import '../screens/profile_page.dart';

class AppRouter {
  static Map<String, WidgetBuilder> routes = {
    '/': (_) => const LoginScreen(),
    // patient-facing home
    '/patient_home': (_) => const PatientHome(),
    // doctor-facing home
    '/doctor_home': (_) => const DoctorHome(),
    '/doctors': (_) => const DoctorListScreen(),
    '/doctor': (_) => const DoctorDetailScreen(),
    '/appointments': (_) => const AppointmentsScreen(),
    '/favorites': (_) => const FavoritesPage(),
    '/chat': (_) => const ChatPage(),
    '/profile': (_) => const ProfilePage(),
  };
}
