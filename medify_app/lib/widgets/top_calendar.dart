import 'package:flutter/material.dart';

class TopCalendar extends StatefulWidget {
  const TopCalendar({super.key});
  @override
  State<TopCalendar> createState() => _TopCalendarState();
}

class _TopCalendarState extends State<TopCalendar> {
  int _selected = DateTime.now().day;

  @override
  Widget build(BuildContext context) {
    // Simple horizontal date picker like the mock
    final days = List.generate(7, (i) => DateTime.now().add(Duration(days: i)));
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
      color: Colors.white,
      child: Column(
        children: [
          SizedBox(
            height: 64,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: days.length,
              itemBuilder: (_, i) {
                final d = days[i];
                final selected = d.day == _selected;
                return GestureDetector(
                  onTap: () => setState(() => _selected = d.day),
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 6),
                    width: 56,
                    decoration: BoxDecoration(
                      color: selected ? const Color(0xFF1A73E8) : const Color(0xFFF2F5FF),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(d.day.toString(), style: TextStyle(color: selected ? Colors.white : Colors.black)),
                        const SizedBox(height: 4),
                        Text(['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.weekday % 7], style: TextStyle(color: selected ? Colors.white70 : Colors.grey, fontSize: 12)),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 12),
          // small schedule box
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF2F5FF),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: const [
                Icon(Icons.event_available, color: Color(0xFF1A73E8)),
                SizedBox(width: 8),
                Expanded(child: Text('You have 1 appointment today at 10:00 AM')),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
