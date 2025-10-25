import 'package:flutter/material.dart';
import '../services/api_client.dart';


class DoctorDetailScreen extends StatefulWidget {
  const DoctorDetailScreen({super.key});
  @override State<DoctorDetailScreen> createState() => _S();
}


class _S extends State<DoctorDetailScreen> {
  final api = ApiClient();
  Map<String, dynamic>? detail;


  Future<void> _load(int id) async {
    detail = await api.doctorDetail(id);
    setState(() {});
  }


  @override
  Widget build(BuildContext ctx) {
    final id = ModalRoute.of(context)!.settings.arguments as int;
    if (detail == null) _load(id);


    final d = detail;
    return Scaffold(
      appBar: AppBar(title: const Text('Hồ sơ bác sĩ')),
      body: d == null
          ? const Center(child: CircularProgressIndicator())
          : Padding(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(d['user']['full_name'] ?? '', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text('Chuyên khoa: ${d['profile_specialty']}'),
          Text('Kinh nghiệm: ${d['years_exp']} năm'),
          Text('Đánh giá TB: ${d['avg_rating']}'),
          const SizedBox(height: 12),
          const Text('Lịch làm việc:'),
          Expanded(
            child: ListView(
              children: (d['availabilities'] as List<dynamic>).map((a) => ListTile(
                title: Text('Thứ ${((a['weekday'] as int) + 2) % 7}'),
                subtitle: Text('${a['start_time']} - ${a['end_time']}'),
              )).toList(),
            ),
          )
        ]),
      ),
    );
  }
}