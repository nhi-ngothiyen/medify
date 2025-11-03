import 'package:flutter/material.dart';
import '../services/api_client.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final emailC = TextEditingController(text: '');
  final passC = TextEditingController(text: '');
  final api = ApiClient();
  bool loading = false;
  String? err;
  bool showPass = false;

  Future<void> _login() async {
    setState(() => loading = true);
    try {
      await api.login(emailC.text, passC.text);
      if (!mounted) return;
      final me = await api.getCurrentUser();
      final role = (me != null && me['role'] != null) ? me['role'] as String : 'patient';
      if (role == 'doctor') {
        Navigator.pushReplacementNamed(context, '/doctor_home');
      } else {
        Navigator.pushReplacementNamed(context, '/patient_home');
      }
    } catch (e) {
      setState(() => err = 'Sai email hoặc mật khẩu');
    } finally {
      setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ← Back button & title
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back_ios, size: 18),
                    onPressed: () => Navigator.pop(context),
                  ),
                  const Spacer(),
                  const Text(
                    'Log In',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                      color: Color(0xFF1A73E8),
                    ),
                  ),
                  const Spacer(flex: 2),
                ],
              ),
              const SizedBox(height: 12),

              // Welcome text
              const Text(
                'Welcome',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 22,
                  color: Color(0xFF1A73E8),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Easy Booking, Better Healing!',
                style: TextStyle(color: Colors.grey[600], fontSize: 13),
              ),
              const SizedBox(height: 32),

              // Email field
              const Text(
                'Email or Mobile Number',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: emailC,
                decoration: InputDecoration(
                  hintText: 'example@example.com',
                  filled: true,
                  fillColor: const Color(0xFFF2F5FF),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Password field
              const Text(
                'Password',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: passC,
                obscureText: !showPass,
                decoration: InputDecoration(
                  hintText: '************',
                  filled: true,
                  fillColor: const Color(0xFFF2F5FF),
                  suffixIcon: IconButton(
                    icon: Icon(
                      showPass ? Icons.visibility_off : Icons.visibility,
                      color: Colors.grey,
                    ),
                    onPressed: () => setState(() => showPass = !showPass),
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),

              const SizedBox(height: 10),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {},
                  style: TextButton.styleFrom(
                    padding: EdgeInsets.zero,
                    minimumSize: const Size(0, 0),
                  ),
                  child: const Text(
                    'Forget Password',
                    style: TextStyle(
                      color: Color(0xFF1A73E8),
                      fontSize: 13,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 10),

              // Error message
              if (err != null)
                Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Text(
                    err!,
                    style: const TextStyle(color: Colors.red),
                  ),
                ),

              // Login button
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: loading ? null : _login,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1A73E8),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(25),
                    ),
                  ),
                  child: Text(
                    loading ? 'Loading...' : 'Log In',
                    style: const TextStyle(fontSize: 16, color: Colors.white),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Social sign-in section
              const Center(
                child: Text(
                  'or sign up with',
                  style: TextStyle(color: Colors.grey, fontSize: 13),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _socialButton(Icons.g_mobiledata),
                  const SizedBox(width: 20),
                  _socialButton(Icons.facebook),
                  const SizedBox(width: 20),
                  _socialButton(Icons.fingerprint),
                ],
              ),
              const SizedBox(height: 24),

              // Sign up link
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text("Don’t have an account? "),
                  GestureDetector(
                    onTap: () {},
                    child: const Text(
                      "Sign Up",
                      style: TextStyle(
                        color: Color(0xFF1A73E8),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _socialButton(IconData icon) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFF2F5FF),
        borderRadius: BorderRadius.circular(30),
      ),
      padding: const EdgeInsets.all(10),
      child: Icon(icon, size: 30, color: const Color(0xFF1A73E8)),
    );
  }
}
