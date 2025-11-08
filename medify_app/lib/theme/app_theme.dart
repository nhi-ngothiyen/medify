import 'package:flutter/material.dart';
import 'colors.dart';
import 'typography.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme(
        brightness: Brightness.light,

        // Primary colors
        primary: AppColors.primary.main,
        onPrimary: AppColors.primary.onMain,
        primaryContainer: AppColors.primaryContainer.main,
        onPrimaryContainer: AppColors.primaryContainer.onMain,

        // Secondary colors
        secondary: AppColors.secondary.main,
        onSecondary: AppColors.secondary.onMain,

        // Tertiary colors
        tertiary: AppColors.tertiary.main,
        onTertiary: AppColors.tertiary.onMain,

        // Error colors
        error: AppColors.error.main,
        onError: AppColors.error.onMain,

        // Surface system (Material 3)
        surface: AppColors.surface.shade(5),
        onSurface: AppColors.surface.onMain,

        surfaceContainerLowest: AppColors.surface.shade(5),
        surfaceContainerLow: AppColors.surface.shade(20),
        surfaceContainer: AppColors.surface.shade(40),
        surfaceContainerHigh: AppColors.surface.shade(60),
        surfaceContainerHighest: AppColors.surface.shade(80),

        // Outline & inverse
        outline: AppColors.outline,
        outlineVariant: AppColors.outlineVariant,
        shadow: Colors.black,
        scrim: Colors.black,
        inverseSurface: AppColors.surface.shade(90),
        onInverseSurface: AppColors.surface.shade(10),
        inversePrimary: AppColors.primary.main,
      ),

      // Typography
      textTheme: TextTheme(
        displayLarge: AppTypography.displayLarge,
        displayMedium: AppTypography.displayMedium,
        displaySmall: AppTypography.displaySmall,
        headlineLarge: AppTypography.headlineLarge,
        headlineMedium: AppTypography.headlineMedium,
        headlineSmall: AppTypography.headlineSmall,
        bodyLarge: AppTypography.bodyLarge,
        bodyMedium: AppTypography.bodyMedium,
        bodySmall: AppTypography.bodySmall,
        labelLarge: AppTypography.labelLarge,
        labelMedium: AppTypography.labelMedium,
        labelSmall: AppTypography.labelSmall,
      ),
    );
  }
}
