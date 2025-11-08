import 'package:flutter/material.dart';

class FontTokens {
  FontTokens._();

  static final fontSize = _FontSize();
  static final fontWeight = _FontWeight();
  static final letterSpacing = _LetterSpacing();
  static final lineHeight = _LineHeight();
}

class _FontSize {
  // Display sizes
  final double displayLarge = 57;
  final double displayMedium = 45;
  final double displaySmall = 36;

  // Headline sizes
  final double headlineLarge = 32;
  final double headlineMedium = 28;
  final double headlineSmall = 24;

  // Title sizes
  final double titleLarge = 22;
  final double titleMedium = 16;
  final double titleSmall = 14;

  // Label sizes
  final double labelLarge = 14;
  final double labelMedium = 12;
  final double labelSmall = 11;

  // Body sizes
  final double bodyLarge = 16;
  final double bodyMedium = 14;
  final double bodySmall = 12;
}

class _FontWeight {
  final FontWeight thin = FontWeight.w100;
  final FontWeight extraLight = FontWeight.w200;
  final FontWeight light = FontWeight.w300;
  final FontWeight regular = FontWeight.w400;
  final FontWeight medium = FontWeight.w500;
  final FontWeight semiBold = FontWeight.w600;
  final FontWeight bold = FontWeight.w700;
  final FontWeight extraBold = FontWeight.w800;
  final FontWeight black = FontWeight.w900;
}

class _LetterSpacing {
  final double tighter = -0.05;
  final double tight = -0.025;
  final double normal = 0;
  final double wide = 0.025;
  final double wider = 0.05;
  final double widest = 0.1;
}

class _LineHeight {
  final double none = 1;
  final double tight = 1.25;
  final double snug = 1.375;
  final double normal = 1.5;
  final double relaxed = 1.625;
  final double loose = 2;
}
