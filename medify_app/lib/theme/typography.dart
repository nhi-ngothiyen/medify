import 'package:flutter/material.dart';
import 'typography_tokens.dart';

class AppTypography {
  static final fontSize = FontTokens.fontSize;
  static final fontWeight = FontTokens.fontWeight;
  static final letterSpacing = FontTokens.letterSpacing;
  static final lineHeight = FontTokens.lineHeight;

  // ===== Display =====
  static TextStyle get displayLarge => TextStyle(
    fontSize: fontSize.displayLarge,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.tight,
    height: lineHeight.tight,
  );

  static TextStyle get displayMedium => TextStyle(
    fontSize: fontSize.displayMedium,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.normal,
    height: lineHeight.normal,
  );

  static TextStyle get displaySmall => TextStyle(
    fontSize: fontSize.displaySmall,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.normal,
    height: lineHeight.normal,
  );

  // ===== Headline =====
  static TextStyle get headlineLarge => TextStyle(
    fontSize: fontSize.headlineLarge,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.normal,
    height: lineHeight.normal,
  );

  static TextStyle get headlineMedium => TextStyle(
    fontSize: fontSize.headlineMedium,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.normal,
    height: lineHeight.normal,
  );

  static TextStyle get headlineSmall => TextStyle(
    fontSize: fontSize.headlineSmall,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.normal,
    height: lineHeight.normal,
  );

  // ===== Body =====
  static TextStyle get bodyLarge => TextStyle(
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.regular,
    letterSpacing: 0.15,
    height: 1.5,
  );

  static TextStyle get bodyMedium => TextStyle(
    fontSize: fontSize.bodyMedium,
    fontWeight: fontWeight.regular,
    letterSpacing: 0.25,
    height: 1.42,
  );

  static TextStyle get bodySmall => TextStyle(
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.regular,
    letterSpacing: 0.4,
    height: 1.33,
  );

  // ===== Label =====
  static TextStyle get labelLarge => TextStyle(
    fontSize: fontSize.labelLarge,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.1,
    height: 1.42,
  );

  static TextStyle get labelMedium => TextStyle(
    fontSize: fontSize.labelMedium,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.5,
    height: 1.33,
  );

  static TextStyle get labelSmall => TextStyle(
    fontSize: fontSize.labelSmall,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.5,
    height: 1.45,
  );
}
