import 'package:flutter/material.dart';

class AppColors {
  const AppColors._();

  // ===== PRIMARY =====
  static const _Primary primary = _Primary();

  // ===== PRIMARY CONTAINER =====
  static const _PrimaryContainer primaryContainer = _PrimaryContainer();

  // ===== SECONDARY =====
  static const _Secondary secondary = _Secondary();

  // ===== TERTIARY =====
  static const _Tertiary tertiary = _Tertiary();

  // ===== ERROR =====
  static const _Error error = _Error();

  // ===== SURFACE =====
  static const _Surface surface = _Surface();

  // ===== BASE / OUTLINE =====
  static const Color outline = Color(0xFF79747E);
  static const Color outlineVariant = Color(0xFFCAC4D0);
}

// ==================== PRIMARY ====================
class _Primary {
  const _Primary();

  Color get main => const Color(0xFF2260FF);
  Color get onMain => const Color(0xFFFFFFFF);

  Color shade(int tone) {
    switch (tone) {
      case 5: return const Color(0xFFF4F7FF);
      case 10: return const Color(0xFFD3DFFF);
      case 15: return const Color(0xFFA7BFFF);
      case 20: return const Color(0xFF7AA0FF);
      case 40: return const Color(0xFF4E80FF);
      case 50: return const Color(0xFF2260FF);
      case 60: return const Color(0xFF1B4DCC);
      case 70: return const Color(0xFF163EA6);
      case 80: return const Color(0xFF113080);
      case 90: return const Color(0xFF0C2259);
      case 95: return const Color(0xFF071333);
      default: return main;
    }
  }
}

// ==================== PRIMARY CONTAINER ====================
class _PrimaryContainer {
  const _PrimaryContainer();

  Color get main => const Color(0xFFCAD6FF);
  Color get onMain => const Color(0xFF0C2259);

  Color shade(int tone) {
    switch (tone) {
      case 5: return const Color(0xFFFCFDFF);
      case 10: return const Color(0xFFF4F7FF);
      case 20: return const Color(0xFFEAEDFF);
      case 30: return const Color(0xFFDFE6FF);
      case 40: return const Color(0xFFD5DEFF);
      case 50: return const Color(0xFFCAD6FF);
      case 60: return const Color(0xFFA2ABCC);
      case 70: return const Color(0xFF838BA6);
      case 80: return const Color(0xFF656B80);
      case 90: return const Color(0xFF474B59);
      case 95: return const Color(0xFF282B33);
      default: return main;
    }
  }
}

// ==================== SECONDARY ====================
class _Secondary {
  const _Secondary();

  Color get main => const Color(0xFF878FB5);
  Color get onMain => const Color(0xFFFFFFFF);

  Color shade(int tone) {
    switch (tone) {
      case 5: return const Color(0xFFF9F9FB);
      case 10: return const Color(0xFFE7E9F0);
      case 20: return const Color(0xFFCFD2E1);
      case 30: return const Color(0xFFAFB4CD);
      case 40: return const Color(0xFF9FA5C4);
      case 50: return const Color(0xFF878FB5);
      case 60: return const Color(0xFF6C7291);
      case 70: return const Color(0xFF585D76);
      case 80: return const Color(0xFF44485B);
      case 90: return const Color(0xFF2F323F);
      case 95: return const Color(0xFF1B1D24);
      default: return main;
    }
  }
}

// ==================== TERTIARY ====================
class _Tertiary {
  const _Tertiary();

  Color get main => const Color(0xFFFFCC32);
  Color get onMain => const Color(0xFF33290A);

  Color shade(int tone) {
    switch (tone) {
      case 5: return const Color(0xFFFFFCF5);
      case 10: return const Color(0xFFFFF5D6);
      case 20: return const Color(0xFFFFEBAD);
      case 30: return const Color(0xFFFFE084);
      case 40: return const Color(0xFFFFD65B);
      case 50: return const Color(0xFFFFCC32);
      case 60: return const Color(0xFFCCA328);
      case 70: return const Color(0xFFA68520);
      case 80: return const Color(0xFF806619);
      case 90: return const Color(0xFF594712);
      case 95: return const Color(0xFF33290A);
      default: return main;
    }
  }
}

// ==================== ERROR ====================
class _Error {
  const _Error();

  Color get main => const Color(0xFFDD0508);
  Color get onMain => const Color(0xFFFFFFFF);

  Color shade(int tone) {
    switch (tone) {
      case 5: return const Color(0xFFFDF2F3);
      case 10: return const Color(0xFFF8CDCE);
      case 20: return const Color(0xFFF19B9C);
      case 30: return const Color(0xFFEB696B);
      case 40: return const Color(0xFFE43739);
      case 50: return const Color(0xFFDD0508);
      case 60: return const Color(0xFFB10406);
      case 70: return const Color(0xFF900305);
      case 80: return const Color(0xFF6F0304);
      case 90: return const Color(0xFF4D0203);
      case 95: return const Color(0xFF2C0102);
      default: return main;
    }
  }
}

// ==================== SURFACE ====================
class _Surface {
  const _Surface();

  Color get main => const Color(0xFF7998F0);
  Color get onMain => const Color(0xFF181E30);

  Color shade(int tone) {
    switch (tone) {
      case 5: return const Color(0xFFF8FAFE);
      case 10: return const Color(0xFFE4EAFC);
      case 20: return const Color(0xFFC9D6F9);
      case 30: return const Color(0xFFAFC1F6);
      case 40: return const Color(0xFF94ADF3);
      case 50: return const Color(0xFF7998F0);
      case 60: return const Color(0xFF617AC0);
      case 70: return const Color(0xFF4F639C);
      case 80: return const Color(0xFF3D4C78);
      case 90: return const Color(0xFF2A3554);
      case 95: return const Color(0xFF181E30);
      default: return main;
    }
  }
}
