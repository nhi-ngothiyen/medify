import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';


class ApiClient {
  final Dio _dio = Dio(BaseOptions(baseUrl: 'http://localhost:8000'));
  final storage = const FlutterSecureStorage();


  ApiClient() {
    _dio.interceptors.add(InterceptorsWrapper(onRequest: (o, h) async {
      final token = await storage.read(key: 'token');
      if (token != null) o.headers['Authorization'] = 'Bearer $token';
      return h.next(o);
    }));
  }


  Future<void> login(String email, String password) async {
    final r = await _dio.post('/auth/login', data: {'email': email, 'password': password});
    await storage.write(key: 'token', value: r.data['access_token']);
  }


  Future<List<dynamic>> searchDoctors({String? q, String? specialty, String? gender}) async {
    final r = await _dio.get('/doctors', queryParameters: {
      if (q != null && q.isNotEmpty) 'q': q,
      if (specialty != null && specialty.isNotEmpty) 'specialty': specialty,
      if (gender != null) 'gender': gender,
    });
    return r.data as List<dynamic>;
  }


  Future<Map<String, dynamic>> doctorDetail(int id) async {
    final r = await _dio.get('/doctors/$id');
    return r.data as Map<String, dynamic>;
  }


  Future<List<dynamic>> myAppointments() async {
    final r = await _dio.get('/appointments');
    return r.data as List<dynamic>;
  }
}