import 'package:flutter/material.dart';

class DoctorCard extends StatelessWidget {
  final Map<String, dynamic> data;
  const DoctorCard({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    final name = data['full_name'] ?? 'Doctor';
    final specialty = data['specialty'] ?? '';
    final rating = (data['avg_rating'] ?? 0).toString();
    final visits = (data['visits'] ?? 0).toString();

    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: () => Navigator.pushNamed(context, '/doctor', arguments: data['id']),
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              CircleAvatar(
                radius: 28,
                backgroundImage: (data['avatar'] != null) ? NetworkImage(data['avatar']) : null,
                child: data['avatar'] == null ? const Icon(Icons.person, size: 28) : null,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(specialty, style: const TextStyle(color: Colors.grey)),
                    const SizedBox(height: 8),
                    Row(children: [Icon(Icons.star, size: 16, color: Colors.amber), const SizedBox(width:6), Text(rating), const SizedBox(width: 12), Text('$visits visits')]),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Column(
                children: [
                  IconButton(onPressed: () {}, icon: const Icon(Icons.question_mark)),
                  IconButton(onPressed: () {}, icon: const Icon(Icons.favorite_border)),
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
