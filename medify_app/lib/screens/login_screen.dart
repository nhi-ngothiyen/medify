import 'package:flutter/material.dart';
import '../services/api_client.dart';


class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override State<LoginScreen> createState() => _S();
}


class _S extends State<LoginScreen> {
  final emailC = TextEditingController(text: 'patient@medify.vn');
  final passC = TextEditingController(text: '123456');
  final api = ApiClient();
  bool loading = false; String? err;


  Future<void> _login() async {
    setState(() => loading = true);
    try {
      await api.login(emailC.text, passC.text);
      if (!mounted) return;
      Navigator.pushReplacementNamed(context, '/doctors');
    } catch (e) {
      setState(() => err = 'Sai email/mật khẩu');
    } finally {
      setState(() => loading = false);
    }
  }


  @override
  Widget build(BuildContext ctx) {
    return Scaffold(
      appBar: AppBar(title: const Text('Đăng nhập')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(children: [
          TextField(controller: emailC, decoration: const InputDecoration(labelText: 'Email')),
          TextField(controller: passC, decoration: const InputDecoration(labelText: 'Mật khẩu'), obscureText: true),
          if (err != null) Text(err!, style: const TextStyle(color: Colors.red)),
          const SizedBox(height: 12),
          ElevatedButton(onPressed: loading ? null : _login, child: Text(loading ? '...' : 'Đăng nhập')),
        ]),
      ),
    );
  }
}